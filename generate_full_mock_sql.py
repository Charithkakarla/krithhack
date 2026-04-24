import random
import json
from datetime import datetime, timedelta

students_raw = """
AKUTHOTA VAIBHAVI REDDY 23071A6601
AMREEN BEGUM 23071A6602
AMUDALAPALLI MANI SHANKAR 23071A6603
ANNAVARAM LEELA MEGHANA 23071A6604
APPANA MANASA 23071A6605
ASHANNAGARI ARUSH REDDY 23071A6606
BANOOR AKSHATHA KATHYAYANI 23071A6607
BODDULA SRIJA 23071A6608
CHADALA SHRI KRUSHNA VARDHAN 23071A6609
CHERAKA VAISHNAVI 23071A6610
CHOWDAVARAPU BHARATH 23071A6611
DABBETA PRANAYA 23071A6612
DEVULAPELLI RANADHEER 23071A6613
DHANAVATH ANJALI 23071A6614
DUVVAPU SAI HARSHAVARDHAN 23071A6615
E PRAVALIKA 23071A6616
ELAKA SAI DHEERAJ REDDY 23071A6617
ELURI NIKITHA 23071A6618
GANGISHETTI DEVAAMSH 23071A6619
GAURISH MATTOO 23071A6620
GODALA VARSHANTH REDDY 23071A6621
GOJURI AAKRUTHI 23071A6622
GOLLA AJAY YADAV 23071A6623
GUDIMALLA SUHITHA 23071A6624
GUDURU VENKATA SAI BRAHMA TEJAS 23071A6625
HAMSINI AAVULA 23071A6626
JATAVATH VAISHNAVI 23071A6627
KAKARLA CHARITH 23071A6628
KANDUKURI GAYATHRI 23071A6629
KANTAMANENI SAI SHREYA 23071A6630
KASHYAP VATTIKONDA 23071A6631
KATKURI HARINATH REDDY 23071A6632
KATTA NEEHAR 23071A6633
KELAVATH ESHWAR 23071A6634
KOLLURU PUNEETH SAI GOUTAM 23071A6635
KUMBAM SATHWIK 23071A6636
LAKSHMI SATHWIK VENGALA 23071A6637
LINGUTLA SRI VARSHINI 23071A6638
MADDI AKSHAY 23071A6639
NAREDDY VARUN REDDY 23071A6640
NIMMALA HASINI REDDY 23071A6641
PALAKURTHI SREEMANTH 23071A6642
PANKAJ DHANDA 23071A6643
PASUMARTHI SAI SRINIVASA KAUSHIK 23071A6644
PENUMATHSA AKSHAYA 23071A6645
POTHARAJU SRINIVAS 23071A6646
POTLAPALLY PARTHU 23071A6647
RAJAMMAGARI HASAN BABU 23071A6648
RAMAVATH SURESH 23071A6649
RAMINI SRIVALLI 23071A6650
RAPHEL PAMEDIPAGA 23071A6651
RATHNAPURAM HRUSHIKESH 23071A6652
SADDI VAMSHIDHAR REDDY 23071A6653
SHAGA SWAMI AGNIVESH 23071A6654
SHAIK SHAHEEM TAJ 23071A6655
SIRA HAINDAVI 23071A6656
SOMA NANDINI 23071A6657
SUSHANTH KARTIKEYA NAKKA 23071A6658
TALUPULA DURGA SAI PRANAV 23071A6659
THATI SREEJA 23071A6660
THOUTI SAI KIRAN 23071A6661
VARSHITHA BEERAM 23071A6662
VEJELLA MONVITA SAI 23071A6663
YADAVALLY DEVAKI REDDY 23071A6664
YAMSANI SAMHITA 23071A6665
YELGURI SHIVA KUMAR 23071A6666
AKANKSHA BHOSLE 24075A6601
B.ANJALI 24075A6602
D.SANDEEP 24075A6603
DANIYA RUB 24075A6604
M.HRUSHIKESH 24075A6605
PRANATHI RATHOD 24075A6606
P.SHIVANI 24075A6607
"""

def generate():
    sql = []
    
    # TRUNCATE everything
    sql.append('TRUNCATE TABLE "user", classroom, class_session, students, attendance, assignment, assignment_submission, tests, test_attempt RESTART IDENTITY CASCADE;')
    sql.append("")
    
    # -1. CLASSROOM
    sql.append("-- CLASSROOM")
    sql.append("INSERT INTO classroom (name, section, school_id) VALUES ('Class X', 'A', 1);")
    sql.append("")
    
    # -0.5. CLASS SESSION
    sql.append("-- CLASS SESSIONS")
    sql.append("INSERT INTO class_session (classroom_id, subject, date, start_time) VALUES")
    sessions = []
    for i in range(1, 11):
        sessions.append(f"(1, 'Math', '2026-04-{i:02d}', '09:00:00')")
    sql.append(",\n".join(sessions) + ";\n")
    
    # 0. USERS (Foreign key target for attendance, tests, etc)
    sql.append("-- USERS (Base table for foreign keys)")
    sql.append('INSERT INTO "user" (name, phone, role) VALUES')
    
    lines = [line.strip() for line in students_raw.strip().split('\n') if line.strip()]
    
    user_values = []
    for line in lines:
        parts = line.split()
        name = " ".join(parts[:-1]).replace("'", "''")
        phone = "917799663979" if "CHARITH" in name else f"919{random.randint(100000000, 999999999)}"
        user_values.append(f"('{name}', '{phone}', 'student')")
        
    sql.append(",\n".join(user_values) + ";\n")
    
    # 1. STUDENTS (Your custom AI table)
    sql.append("-- STUDENTS")
    sql.append("INSERT INTO students (name, roll_no, parent_phone, attendance_percentage, math_grade, science_grade) VALUES")
    
    student_values = []
    for line in lines:
        parts = line.split()
        roll_no = parts[-1]
        name = " ".join(parts[:-1]).replace("'", "''")
        phone = "917799663979" if "CHARITH" in name else f"919{random.randint(100000000, 999999999)}"
        att = random.randint(65, 99)
        math = random.randint(50, 98)
        sci = random.randint(50, 98)
        student_values.append(f"('{name}', '{roll_no}', '{phone}', {att}, {math}, {sci})")
    
    sql.append(",\n".join(student_values) + ";\n")
    
    # 2. ATTENDANCE
    sql.append("-- ATTENDANCE")
    sql.append("INSERT INTO attendance (student_id, session_id, status) VALUES")
    att_values = []
    for sid in range(1, 74):
        for session_id in range(1, 11): # 10 sessions per student
            status = random.choices(["present", "absent", "late"], weights=[80, 10, 10])[0]
            att_values.append(f"({sid}, {session_id}, '{status}')")
    
    # Split into batches of 1000 to avoid huge queries
    for i in range(0, len(att_values), 1000):
        if i > 0:
            sql.append("INSERT INTO attendance (student_id, session_id, status) VALUES")
        sql.append(",\n".join(att_values[i:i+1000]) + ";\n")

    # 3. ASSIGNMENT SUBMISSION
    sql.append("-- ASSIGNMENT SUBMISSIONS")
    sql.append("INSERT INTO assignment_submission (student_id, subject, title, score, max_score) VALUES")
    sub_values = []
    subjects = ["Mathematics", "Science", "English"]
    for sid in range(1, 74):
        for sub in subjects:
            for assignment_num in [1, 2]:
                score = random.randint(70, 100)
                sub_values.append(f"({sid}, '{sub}', 'Assignment {assignment_num}', {score}, 100)")
    for i in range(0, len(sub_values), 1000):
        if i > 0:
            sql.append("INSERT INTO assignment_submission (student_id, subject, title, score, max_score) VALUES")
        sql.append(",\n".join(sub_values[i:i+1000]) + ";\n")

    # 4. TESTS
    sql.append("-- TESTS")
    sql.append("INSERT INTO tests (student_id, title, questions, answers, score, max_score, submitted) VALUES")
    test_values = []
    for sid in range(1, 74):
        score = random.randint(35, 50)
        # using '[]' as dummy json data for questions and answers
        test_values.append(f"({sid}, 'Midterm Exam', '[]', '[]', {score}, 50, true)")
    sql.append(",\n".join(test_values) + ";\n")
    
    # 5. TEST ATTEMPT
    sql.append("-- TEST ATTEMPTS")
    sql.append("INSERT INTO test_attempt (test_id, student_id, selected_answers, score, total, percentage, duration_seconds) VALUES")
    attempt_values = []
    for sid in range(1, 74):
        test_id = sid # since we inserted 1 test per student sequentially
        score = random.randint(35, 50)
        perc = (score / 50) * 100
        attempt_values.append(f"({test_id}, {sid}, '[]', {score}, 50, {perc}, 1800)")
    sql.append(",\n".join(attempt_values) + ";\n")
    
    with open("insert_mock_data_full.sql", "w") as f:
        f.write("\n".join(sql))
        
    print("Generated insert_mock_data_full.sql successfully!")

if __name__ == "__main__":
    generate()
