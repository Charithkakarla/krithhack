import streamlit as st
import requests

st.title("School Assistant Test UI")
base = st.text_input("API Base URL", "http://localhost:8000/api/v1")
student_id = st.number_input("Student ID", min_value=1, step=1)

if st.button("Get Attendance"):
    response = requests.get(f"{base}/attendance/{int(student_id)}", timeout=20)
    st.json(response.json())

if st.button("Generate Weekly Report"):
    response = requests.get(f"{base}/generate-report/{int(student_id)}", timeout=40)
    st.json(response.json())
