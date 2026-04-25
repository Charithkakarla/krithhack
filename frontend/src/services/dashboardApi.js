import { getRuntimeApiBase } from './runtimeConfig'

const API_BASE = getRuntimeApiBase()
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api/v1'

async function call(path, options = {}) {
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

export function getDashboardSummary() {
  return call('/dashboard/summary')
}

export function runQuickAction(actionId) {
  const mapping = {
    send_daily_attendance: '/actions/send-daily-attendance',
    send_instant_result: '/actions/send-instant-result',
    generate_weekly_report: '/actions/generate-weekly-report',
    generate_monthly_report: '/actions/generate-monthly-report',
    send_fee_reminder: '/actions/send-fee-reminder'
  }

  const path = mapping[actionId]
  if (!path) {
    throw new Error(`Unknown action id: ${actionId}`)
  }

  return call(path, { method: 'POST' })
}
