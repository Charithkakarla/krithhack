const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  return response.json()
}

export function getStudentAttendance(studentId) {
  return fetchJson(`/student/${studentId}/attendance`)
}

export function getStudentMarks(studentId) {
  return fetchJson(`/student/${studentId}/marks`)
}

export function getStudentReport(studentId) {
  return fetchJson(`/student/${studentId}/report`)
}
