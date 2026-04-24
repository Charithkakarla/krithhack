const summary = [
  { title: 'Total Fee Due', value: '₹24,85,000', tone: 'kpi-orange' },
  { title: 'Collected', value: '₹16,75,000', tone: 'kpi-green' },
  { title: 'Collection %', value: '67.41%', tone: 'kpi-blue' }
]

const feeRows = [
  { name: 'Aarav Sharma', total: '₹85,000', paid: '₹60,000', due: '₹25,000', status: 'Partial', action: 'Pay Now' },
  { name: 'Ananya Rao', total: '₹85,000', paid: '₹85,000', due: '₹0', status: 'Paid', action: 'View Receipt' },
  { name: 'Rahul Mehta', total: '₹82,000', paid: '₹38,000', due: '₹44,000', status: 'Pending', action: 'Pay Now' }
]

const structure = [
  { className: '6-A', amount: '₹72,000' },
  { className: '7-A', amount: '₹74,000' },
  { className: '8-A', amount: '₹78,000' },
  { className: '9-A', amount: '₹81,000' },
  { className: '10-A', amount: '₹85,000' }
]

export default function FeesView() {
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
          <button type="button" className="generate-btn">
            Send Automated Reminders
          </button>
        </article>
      </section>
    </div>
  )
}
