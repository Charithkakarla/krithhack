from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt


def generate_attendance_graph(student_id: int) -> str:
    out = Path("tmp")
    out.mkdir(exist_ok=True)
    path = out / f"weekly_attendance_{student_id}.png"

    x = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    y = [80, 75, 90, 85, 82]

    plt.figure(figsize=(7, 4))
    plt.plot(x, y, marker="o")
    plt.title("Weekly Attendance")
    plt.xlabel("Day")
    plt.ylabel("Attendance %")
    plt.ylim(0, 100)
    plt.tight_layout()
    plt.savefig(path, dpi=160)
    plt.close()
    return str(path)


def generate_subject_graph(student_id: int) -> str:
    out = Path("tmp")
    out.mkdir(exist_ok=True)
    path = out / f"subject_marks_{student_id}.png"

    subjects = ["Math", "Science", "English", "Social"]
    marks = [78, 74, 82, 70]

    plt.figure(figsize=(7, 4))
    plt.bar(subjects, marks)
    plt.title("Subject-wise Marks")
    plt.xlabel("Subject")
    plt.ylabel("Marks %")
    plt.ylim(0, 100)
    plt.tight_layout()
    plt.savefig(path, dpi=160)
    plt.close()
    return str(path)
