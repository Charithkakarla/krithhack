const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const periods = [
  {
    time: '08:30 - 09:15',
    values: [
      { subject: 'Mathematics', teacher: 'Mr. Rahul', tone: 'math' },
      { subject: 'Science', teacher: 'Ms. Neha', tone: 'science' },
      { subject: 'English', teacher: 'Mrs. Priya', tone: 'english' },
      { subject: 'Mathematics', teacher: 'Mr. Rahul', tone: 'math' },
      { subject: 'Social', teacher: 'Mr. Arvind', tone: 'social' },
      { subject: 'Computer', teacher: 'Ms. Kavya', tone: 'computer' }
    ]
  },
  {
    time: '09:20 - 10:05',
    values: [
      { subject: 'Science', teacher: 'Ms. Neha', tone: 'science' },
      { subject: 'Mathematics', teacher: 'Mr. Rahul', tone: 'math' },
      { subject: 'Computer', teacher: 'Ms. Kavya', tone: 'computer' },
      { subject: 'English', teacher: 'Mrs. Priya', tone: 'english' },
      { subject: 'Mathematics', teacher: 'Mr. Rahul', tone: 'math' },
      { subject: 'Science', teacher: 'Ms. Neha', tone: 'science' }
    ]
  },
  { time: '10:05 - 10:20', break: 'Break' },
  {
    time: '10:20 - 11:05',
    values: [
      { subject: 'English', teacher: 'Mrs. Priya', tone: 'english' },
      { subject: 'Social', teacher: 'Mr. Arvind', tone: 'social' },
      { subject: 'Mathematics', teacher: 'Mr. Rahul', tone: 'math' },
      { subject: 'Science', teacher: 'Ms. Neha', tone: 'science' },
      { subject: 'Computer', teacher: 'Ms. Kavya', tone: 'computer' },
      { subject: 'Social', teacher: 'Mr. Arvind', tone: 'social' }
    ]
  },
  {
    time: '11:10 - 11:55',
    values: [
      { subject: 'Social', teacher: 'Mr. Arvind', tone: 'social' },
      { subject: 'Computer', teacher: 'Ms. Kavya', tone: 'computer' },
      { subject: 'Science', teacher: 'Ms. Neha', tone: 'science' },
      { subject: 'Mathematics', teacher: 'Mr. Rahul', tone: 'math' },
      { subject: 'English', teacher: 'Mrs. Priya', tone: 'english' },
      { subject: 'Mathematics', teacher: 'Mr. Rahul', tone: 'math' }
    ]
  },
  { time: '11:55 - 12:35', break: 'Lunch Break' },
  {
    time: '12:35 - 01:20',
    values: [
      { subject: 'Computer', teacher: 'Ms. Kavya', tone: 'computer' },
      { subject: 'English', teacher: 'Mrs. Priya', tone: 'english' },
      { subject: 'Social', teacher: 'Mr. Arvind', tone: 'social' },
      { subject: 'Science', teacher: 'Ms. Neha', tone: 'science' },
      { subject: 'Mathematics', teacher: 'Mr. Rahul', tone: 'math' },
      { subject: 'English', teacher: 'Mrs. Priya', tone: 'english' }
    ]
  },
  {
    time: '01:25 - 02:10',
    values: [
      { subject: 'Science', teacher: 'Ms. Neha', tone: 'science' },
      { subject: 'Social', teacher: 'Mr. Arvind', tone: 'social' },
      { subject: 'English', teacher: 'Mrs. Priya', tone: 'english' },
      { subject: 'Computer', teacher: 'Ms. Kavya', tone: 'computer' },
      { subject: 'Science', teacher: 'Ms. Neha', tone: 'science' },
      { subject: 'Library', teacher: 'Ms. Kavya', tone: 'library' }
    ]
  }
]

const legendItems = [
  ['math', 'Blue: Math'],
  ['science', 'Green: Science'],
  ['english', 'Purple: English'],
  ['social', 'Orange: Social'],
  ['computer', 'Cyan: Computer'],
  ['library', 'Pink: Library']
]

export default function TimetableView() {
  return (
    <div className="module-page">
      <header className="module-header panel">
        <div>
          <h2>Timetable</h2>
          <p>Weekly class plan with subject and teacher assignment.</p>
        </div>
      </header>

      <section className="panel generator-bar">
        <div className="filter-compact">
          <label>Class</label>
          <select defaultValue="10-A">
            <option>10-A</option>
            <option>9-B</option>
            <option>8-A</option>
          </select>
        </div>
        <div className="filter-compact">
          <label>Section</label>
          <select defaultValue="A">
            <option>A</option>
            <option>B</option>
          </select>
        </div>
        <div className="filter-compact">
          <label>View</label>
          <select defaultValue="Weekly">
            <option>Weekly</option>
            <option>Daily</option>
          </select>
        </div>
      </section>

      <section className="panel timetable-card">
        <table className="timetable-grid">
          <thead>
            <tr>
              <th>Time</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period) =>
              period.break ? (
                <tr key={period.time}>
                  <td>{period.time}</td>
                  <td colSpan={6} className="break-cell">
                    {period.break}
                  </td>
                </tr>
              ) : (
                <tr key={period.time}>
                  <td>{period.time}</td>
                  {period.values.map((entry, index) => (
                    <td key={`${period.time}-${index}`}>
                      <div className={`tt-cell ${entry.tone}`}>
                        <strong>{entry.subject}</strong>
                        <span>{entry.teacher}</span>
                      </div>
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </section>

      <section className="panel legend-row">
        {legendItems.map(([tone, text]) => (
          <span key={text} className="legend-item">
            <i className={`legend-dot ${tone}`} /> {text}
          </span>
        ))}
      </section>
    </div>
  )
}
