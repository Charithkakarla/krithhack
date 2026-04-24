import { useMemo, useState } from 'react'

const holidays = [
  { date: '2026-01-01', name: "New Year's Day", type: 'School Holiday' },
  { date: '2026-01-14', name: 'Makar Sankranti / Pongal', type: 'Gazetted' },
  { date: '2026-01-26', name: 'Republic Day', type: 'National' },
  { date: '2026-02-15', name: 'Maha Shivaratri', type: 'Gazetted' },
  { date: '2026-03-04', name: 'Holi', type: 'Gazetted' },
  { date: '2026-03-20', name: 'Ramzan (Eid-ul-Fitr)', type: 'Gazetted' },
  { date: '2026-04-03', name: 'Good Friday', type: 'Gazetted' },
  { date: '2026-04-10', name: 'Ugadi', type: 'Regional' },
  { date: '2026-04-14', name: 'Dr. Ambedkar Jayanti', type: 'National' },
  { date: '2026-05-01', name: 'Labour Day', type: 'National' },
  { date: '2026-05-23', name: 'Buddha Purnima', type: 'Gazetted' },
  { date: '2026-06-21', name: 'Bakrid (Eid al-Adha)', type: 'Gazetted' },
  { date: '2026-07-17', name: 'Muharram', type: 'Gazetted' },
  { date: '2026-08-15', name: 'Independence Day', type: 'National' },
  { date: '2026-08-27', name: 'Krishna Janmashtami', type: 'Gazetted' },
  { date: '2026-09-05', name: 'Ganesh Chaturthi', type: 'Regional' },
  { date: '2026-09-16', name: 'Milad-un-Nabi', type: 'Gazetted' },
  { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'National' },
  { date: '2026-10-12', name: 'Dussehra (Vijayadashami)', type: 'Gazetted' },
  { date: '2026-10-20', name: 'Maharishi Valmiki Jayanti', type: 'Regional' },
  { date: '2026-10-31', name: 'Diwali', type: 'Gazetted' },
  { date: '2026-11-02', name: 'Govardhan Puja', type: 'Regional' },
  { date: '2026-11-03', name: 'Bhai Dooj', type: 'Regional' },
  { date: '2026-11-15', name: 'Guru Nanak Jayanti', type: 'Gazetted' },
  { date: '2026-12-18', name: 'School Annual Day', type: 'Academic Event Holiday' },
  { date: '2026-12-24', name: 'Winter Break Start', type: 'School Holiday' },
  { date: '2026-12-25', name: 'Christmas', type: 'National' },
  { date: '2026-12-31', name: 'Winter Break End', type: 'School Holiday' }
]

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(isoDate) {
  const date = new Date(isoDate)
  const day = String(date.getDate()).padStart(2, '0')
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

const holidayDays = new Set(
  holidays
    .filter((item) => item.date.startsWith('2026-04'))
    .map((item) => Number(item.date.slice(8, 10)))
)

const calendarCells = [
  '',
  '',
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30
]

export default function HolidaysView() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return holidays.filter((item) => {
      const formattedDate = formatDate(item.date).toLowerCase()
      return (
        item.name.toLowerCase().includes(normalized) ||
        item.type.toLowerCase().includes(normalized) ||
        formattedDate.includes(normalized)
      )
    })
  }, [query])

  const monthSummary = useMemo(() => {
    return holidays.reduce((acc, item) => {
      const month = monthNames[new Date(item.date).getMonth()]
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {})
  }, [])

  return (
    <div className="module-page">
      <header className="module-header panel">
        <div>
          <h2>Holidays</h2>
          <p>Academic year 2025-26 holiday planning and management.</p>
        </div>
      </header>

      <section className="module-two-col holidays-layout">
        <div className="left-stack">
          <article className="panel mini-calendar">
            <h3>April 2026</h3>
            <div className="calendar-grid head">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>
            <div className="calendar-grid body">
              {calendarCells.map((day, index) => (
                <div key={`${day}-${index}`} className="calendar-cell">
                  {day ? (
                    <>
                      {day}
                      {holidayDays.has(day) ? <i className="holiday-dot" /> : null}
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </article>

          <article className="panel holiday-stats">
            <h3>Holiday Statistics</h3>
            <p>Total Holidays: {holidays.length}</p>
          </article>

          <article className="panel academic-calendar">
            <h3>Holiday Academic Calendar 2026</h3>
            <div className="calendar-month-list">
              {monthNames.map((month) => (
                <div key={month} className="month-chip">
                  <span>{month}</span>
                  <strong>{monthSummary[month] || 0}</strong>
                </div>
              ))}
            </div>
          </article>
        </div>

        <article className="panel holiday-list">
          <div className="panel-header compact">
            <h3>Holiday List (2026)</h3>
            <input
              type="search"
              placeholder="Search holiday"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Holiday Name</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.date + item.name + item.type}>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.name}</td>
                  <td>{item.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </div>
  )
}
