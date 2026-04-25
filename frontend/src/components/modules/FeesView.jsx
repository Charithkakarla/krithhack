import { useMemo, useState } from 'react'
import { useFilters } from '../../context/FilterContext'
import { runQuickAction } from '../../services/dashboardApi'

const formatRupees = (value) => `Rs ${value.toLocaleString('en-IN')}`

const structure = [
  { className: '6-A', amount: 'Rs 72,000' },
  { className: '7-A', amount: 'Rs 74,000' },
  { className: '8-A', amount: 'Rs 78,000' },
  { className: '9-A', amount: 'Rs 81,000' },
  { className: '10-A', amount: 'Rs 85,000' }
]

export default function FeesView() {
  const { classStudents } = useFilters()
  const [reminderStatus, setReminderStatus] = useState('')
  const [isSendingReminder, setIsSendingReminder] = useState(false)

  const feeRows = useMemo(() => {
    return classStudents.slice(0, 8).map((student, index) => {
      const totalFee = 85000
      const paid = index % 4 === 0 ? totalFee : index % 3 === 0 ? 38000 : index % 2 === 0 ? 60000 : 85000
      const due = totalFee - paid
      return {
        name: student.name,
        total: formatRupees(totalFee),
        paid: formatRupees(paid),
        due: formatRupees(due),
        status: due === 0 ? 'Paid' : 'Partial',
        action: due === 0 ? 'View Receipt' : 'Pay Now'
      }
    })
  }, [classStudents])

  const summary = useMemo(() => {
    const total = feeRows.reduce((sum, row) => sum + Number(row.total.replace(/\D/g, '')), 0)
    const paid = feeRows.reduce((sum, row) => sum + Number(row.paid.replace(/\D/g, '')), 0)
    const due = total - paid
    return [
      { title: 'Total Fee Due', value: formatRupees(due), tone: 'kpi-orange' },
      { title: 'Collected', value: formatRupees(paid), tone: 'kpi-green' },
      { title: 'Collection %', value: `${total ? ((paid / total) * 100).toFixed(1) : '0.0'}%`, tone: 'kpi-blue' }
    ]
  }, [feeRows])

  async function handleSendReminders() {
    setIsSendingReminder(true)
    setReminderStatus('')
    try {
      const result = await runQuickAction('send_fee_reminder')
      const sentCount = (result.results || []).filter((item) => item.sent).length
      setReminderStatus('Fee reminder sent successfully.')
    } catch {
      setReminderStatus('Fee reminder failed. Please check backend logs and Evolution API.')
    } finally {
      setIsSendingReminder(false)
    }
  }

  return (
    <div className="module-page">
      <header className="module-header panel">
        <div>
          <h2>Fees Management</h2>
          <p>Track collection, dues, and fee operations.</p>
        </div>
      </header>

      <section className="module-card-grid three">
        {summary.map((card) => (
          <article key={card.title} className={`kpi-card ${card.tone}`}>
            <h4>{card.title}</h4>
            <p className="kpi-value">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-header compact">
          <h3>Fee Overview</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Total Fee</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {feeRows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.total}</td>
                <td>{row.paid}</td>
                <td>{row.due}</td>
                <td>
                  <span className="grade-chip">{row.status}</span>
                </td>
                <td>
                  <button type="button" className="link-btn">
                    {row.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="module-two-col">
        <article className="panel">
          <div className="panel-header compact">
            <h3>Fee Structure by Class</h3>
          </div>
          <ul className="simple-list">
            {structure.map((row) => (
              <li key={row.className}>
                <span>{row.className}</span>
                <strong>{row.amount}</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel reminder-card">
          <h3>Pending Fee Reminder</h3>
          <p>Send automated reminders to parents with pending fee dues.</p>
          <button type="button" className="generate-btn" onClick={handleSendReminders} disabled={isSendingReminder}>
            {isSendingReminder ? 'Sending...' : 'Send Automated Reminders'}
          </button>
        </article>
      </section>
      {reminderStatus ? <div className="toast-notification">{reminderStatus}</div> : null}
    </div>
  )
}
