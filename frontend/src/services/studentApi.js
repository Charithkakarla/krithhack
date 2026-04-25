import { getRuntimeApiBase } from './runtimeConfig'

const API_BASE = getRuntimeApiBase()
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api/v1'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${API_PREFIX}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  return response.json()
}

export function getStudentAttendance(studentId) {
  return fetchJson(`/attendance/${studentId}`)
}

export function getStudentMarks(studentId) {
  return fetchJson(`/marks/${studentId}`)
}

function mapSupabaseStudents(rows) {
  const students = rows.map((row) => ({
    id: String(row.id),
    name: row.name || `Student ${row.id}`,
    rollNo: row.roll_no || '',
    phone: row.parent_phone || '',
    className: row.class_name || '10-A',
    attendancePercentage: row.attendance_percentage,
    mathGrade: row.math_grade,
    scienceGrade: row.science_grade
  }))

  return {
    classOptions: [{ id: '10', label: '10-A' }],
    studentsByClass: { 10: students },
    source: 'supabase'
  }
}

async function getStudentsFromSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase frontend environment values are missing')
  }

  const cleanUrl = SUPABASE_URL.replace(/\/$/, '')
  const base = cleanUrl.endsWith('/rest/v1') ? cleanUrl : `${cleanUrl}/rest/v1`
  const response = await fetch(`${base}/students?select=id,name,roll_no,parent_phone,attendance_percentage,math_grade,science_grade&order=name.asc`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  })
  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`)
  }
  return mapSupabaseStudents(await response.json())
}

export async function getStudents() {
  try {
    return await fetchJson('/students')
  } catch {
    return getStudentsFromSupabase()
  }
}

export function getStudentReport(studentId, reportType = 'weekly_report') {
  return fetchJson(`/generate-report/${studentId}?report_type=${encodeURIComponent(reportType)}`)
}

export function sendStudentReport(studentId, reportType = 'weekly_report') {
  return fetchJson('/actions/send-report', {
    method: 'POST',
    body: JSON.stringify({
      student_id: String(studentId),
      report_type: reportType
    })
  })
}

export function sendStudentReports(studentIds, reportType = 'weekly_report') {
  return fetchJson('/actions/send-report', {
    method: 'POST',
    body: JSON.stringify({
      student_ids: studentIds.map((id) => String(id)),
      report_type: reportType
    })
  })
}

export function sendStudentAlert(payload) {
  return fetchJson('/actions/send-alert', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function getStudentTest(testId) {
  return fetchJson(`/test-data/${encodeURIComponent(testId)}`)
}

export function submitStudentTest(testId, selectedAnswers) {
  return fetchJson('/submit-test', {
    method: 'POST',
    body: JSON.stringify({
      test_id: testId,
      selected_answers: selectedAnswers
    })
  })
}

export async function downloadStudentReport(studentId, reportType = 'weekly_report') {
  const response = await fetch(`${API_BASE}${API_PREFIX}/reports/${encodeURIComponent(reportType)}/${encodeURIComponent(studentId)}.pdf`)
  if (!response.ok) {
    throw new Error(`Report download failed: ${response.status}`)
  }
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${reportType}_student_${studentId}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export function startStudentTest(userId, studentName, subject) {
  return fetchJson('/start-test', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      student_name: studentName,
      subject
    })
  })
}
