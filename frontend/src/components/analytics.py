from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

try:
    from dotenv import load_dotenv
except ImportError:  
    load_dotenv = None

try:
    import mysql.connector
    from mysql.connector import Error
except ImportError:  
    mysql = None
    Error = Exception

ROOT = Path(__file__).resolve().parent
ENV_PATH = ROOT / "backend" / ".env"

DEFAULT_QUERIES = {
    "total_patients": "SELECT COUNT(*) AS count FROM patients",
    "critical_patients": "SELECT COUNT(*) AS count FROM patients WHERE LOWER(status) = 'critical' OR LOWER(medical_condition) LIKE '%critical%'",
    "gender_counts": "SELECT COALESCE(NULLIF(TRIM(LOWER(gender)), ''), 'unknown') AS gender, COUNT(*) AS count FROM patients GROUP BY gender ORDER BY count DESC",
    "status_counts": "SELECT COALESCE(NULLIF(TRIM(LOWER(status)), ''), 'unknown') AS status, COUNT(*) AS count FROM patients GROUP BY status ORDER BY count DESC",
    "top_conditions": "SELECT COALESCE(NULLIF(TRIM(medical_condition), ''), 'Unknown') AS condition_name, COUNT(*) AS count FROM patients GROUP BY medical_condition ORDER BY count DESC LIMIT 10",
    "appointments_by_doctor": "SELECT d.doctor_name AS label, COUNT(*) AS count FROM appointments a JOIN doctors d ON d.doctor_id = a.doctor_id GROUP BY d.doctor_name ORDER BY count DESC",
    "appointment_count": "SELECT COUNT(*) AS count FROM appointments",
    "bill_summary": "SELECT COUNT(*) AS total_bills, SUM(amount) AS total_amount, SUM(CASE WHEN LOWER(status) = 'paid' THEN 1 ELSE 0 END) AS paid_count, SUM(CASE WHEN LOWER(status) = 'unpaid' THEN 1 ELSE 0 END) AS unpaid_count FROM bills",
}


def fatal(message: str, *, code: int = 1) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    sys.exit(code)


def load_environment() -> None:
    if ENV_PATH.exists():
        if load_dotenv is not None:
            load_dotenv(dotenv_path=ENV_PATH)
        else:
            print("WARNING: python-dotenv not installed; using system environment variables only.")
    else:
        print(f"WARNING: {ENV_PATH} not found; using system environment variables if available.")


def get_db_config() -> dict[str, str]:
    load_environment()

    config = {
        "host": os.getenv("DB_HOST", "localhost"),
        "user": os.getenv("DB_USER", "root"),
        "password": os.getenv("DB_PASSWORD", ""),
        "database": os.getenv("DB_DATABASE", "hospital_management_system"),
    }

    missing = [key for key, value in config.items() if value == "" and key != "password"]
    if missing:
        fatal("Missing required database environment variables: " + ", ".join(missing))

    return config


def connect_db(config: dict[str, str]):
    if mysql is None:
        fatal("MySQL driver is missing. Install it with: pip install mysql-connector-python")

    try:
        connection = mysql.connector.connect(
            host=config["host"],
            user=config["user"],
            password=config["password"],
            database=config["database"],
        )
    except Error as exc:
        fatal(f"Unable to connect to database: {exc}")

    if not connection.is_connected():
        fatal("Unable to establish a MySQL connection.")

    return connection


def fetch_all(cursor, query: str, params: tuple | None = None) -> list[dict[str, object]]:
    cursor.execute(query, params or ())
    return [dict(row) for row in cursor.fetchall()]


def fetch_one(cursor, query: str, params: tuple | None = None) -> dict[str, object] | None:
    cursor.execute(query, params or ())
    row = cursor.fetchone()
    return dict(row) if row else None


def build_summary(cursor) -> dict[str, object]:
    summary: dict[str, object] = {}

    total_patients = fetch_one(cursor, DEFAULT_QUERIES["total_patients"])
    critical_patients = fetch_one(cursor, DEFAULT_QUERIES["critical_patients"])
    gender_counts = fetch_all(cursor, DEFAULT_QUERIES["gender_counts"])
    status_counts = fetch_all(cursor, DEFAULT_QUERIES["status_counts"])
    top_conditions = fetch_all(cursor, DEFAULT_QUERIES["top_conditions"])
    appointment_count = fetch_one(cursor, DEFAULT_QUERIES["appointment_count"])
    appointments_by_doctor = fetch_all(cursor, DEFAULT_QUERIES["appointments_by_doctor"])
    bill_summary = fetch_one(cursor, DEFAULT_QUERIES["bill_summary"])

    summary["total_patients"] = total_patients["count"] if total_patients else 0
    summary["critical_patients"] = critical_patients["count"] if critical_patients else 0
    summary["gender_distribution"] = gender_counts
    summary["status_distribution"] = status_counts
    summary["top_conditions"] = top_conditions
    summary["total_appointments"] = appointment_count["count"] if appointment_count else 0
    summary["appointments_by_doctor"] = appointments_by_doctor
    summary["bill_summary"] = bill_summary or {}

    if summary["total_patients"]:
        percentages = []
        for entry in gender_counts:
            count = int(entry.get("count", 0))
            percentages.append(
                {
                    "gender": entry.get("gender"),
                    "count": count,
                    "percentage": round(count / summary["total_patients"] * 100, 1),
                }
            )
        summary["gender_distribution"] = percentages

    return summary


def print_summary(summary: dict[str, object]) -> None:
    print("Hospital Analytics Summary")
    print("==========================")
    print(f"Total patients: {summary['total_patients']}")
    print(f"Critical patients: {summary['critical_patients']}")
    print(f"Total appointments: {summary['total_appointments']}")

    print("\nGender distribution:")
    for row in summary["gender_distribution"]:
        print(f"  - {row['gender'].title()}: {row['count']} ({row['percentage']}%)")

    print("\nPatient status distribution:")
    for row in summary["status_distribution"]:
        print(f"  - {row['status'].title()}: {row['count']}")

    print("\nTop patient conditions:")
    for row in summary["top_conditions"]:
        print(f"  - {row['condition_name']}: {row['count']}")

    print("\nAppointments by doctor:")
    for row in summary["appointments_by_doctor"]:
        print(f"  - {row['label']}: {row['count']}")

    bill_summary = summary.get("bill_summary", {})
    print("\nBill summary:")
    print(f"  - total bills: {bill_summary.get('total_bills', 0)}")
    print(f"  - total billed amount: {bill_summary.get('total_amount', 0)}")
    print(f"  - paid bills: {bill_summary.get('paid_count', 0)}")
    print(f"  - unpaid bills: {bill_summary.get('unpaid_count', 0)}")


def save_output(summary: dict[str, object], output_file: Path) -> None:
    output_file.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(f"Analytics saved to {output_file}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run analytics against the hospital management system database."
    )
    parser.add_argument(
        "--output",
        help="Write JSON analytics output to a file.",
        type=Path,
        default=None,
    )
    parser.add_argument(
        "--json",
        help="Print JSON analytics output instead of human summary.",
        action="store_true",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    config = get_db_config()
    connection = connect_db(config)
    cursor = connection.cursor(dictionary=True)

    try:
        summary = build_summary(cursor)
    finally:
        cursor.close()
        connection.close()

    if args.json:
        output = json.dumps(summary, indent=2)
        print(output)
    else:
        print_summary(summary)

    if args.output:
        save_output(summary, args.output)


if __name__ == "__main__":
    main()
