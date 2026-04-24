import {
  Bell,
  BookOpenCheck,
  Calendar,
  CalendarDays,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  Users
} from 'lucide-react'
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

const kpis = [
  { title: 'Total Students', value: '512', subtext: '+12 this month', className: 'kpi-blue' },
  { title: 'Average Attendance', value: '82.4%', subtext: '+4.6% from last week', className: 'kpi-green' },
  { title: 'Average Marks', value: '78.6%', subtext: '+3.2% from last week', className: 'kpi-purple' },
  { title: 'Active Alerts', value: '8', subtext: 'Students need attention', className: 'kpi-orange' },
  { title: 'Fees Collection', value: '65.3%', subtext: 'This month', className: 'kpi-rupee' }
]

const attendanceData = [
  { day: '18 Apr', attendance: 72 },
  { day: '19 Apr', attendance: 76 },
  { day: '20 Apr', attendance: 74 },
  { day: '21 Apr', attendance: 83 },
  { day: '22 Apr', attendance: 79 },
  { day: '23 Apr', attendance: 86 },
  { day: '24 Apr', attendance: 82 }
]

const marksData = [
  { day: '18 Apr', marks: 75 },
  { day: '19 Apr', marks: 70 },
  { day: '20 Apr', marks: 80 },
  { day: '21 Apr', marks: 76 },
  { day: '22 Apr', marks: 84 },
  { day: '23 Apr', marks: 78 },
  { day: '24 Apr', marks: 82 }
]

const topStudents = [
  { rank: 1, name: 'Ananya Rao', className: '10-A', marks: 93, initial: 'AR' },
  { rank: 2, name: 'Rahul Mehta', className: '9-B', marks: 89, initial: 'RM' },
  { rank: 3, name: 'Sneha Kapoor', className: '10-A', marks: 88, initial: 'SK' },
  { rank: 4, name: 'Nikhil Sharma', className: '9-A', marks: 86, initial: 'NS' }
]

const attentionStudents = [
  { name: 'Ritik Kumar', className: '9-A', reason: 'Low Attendance', level: 52, tone: 'danger' },
  { name: 'Ayaan Verma', className: '8-B', reason: 'Low Marks', level: 59, tone: 'warning' },
  { name: 'Priya Das', className: '10-B', reason: 'Frequent Late Entry', level: 61, tone: 'warning' }
]

const classwiseAttendance = [
  { className: '6-A', value: 88, color: '#3b82f6' },
  { className: '7-A', value: 78, color: '#22c55e' },
  { className: '8-A', value: 90, color: '#a855f7' },
  { className: '9-A', value: 82, color: '#f97316' },
  { className: '10-A', value: 86, color: '#06b6d4' },
  { className: '10-B', value: 80, color: '#ec4899' }
]

const quickActions = [
  { label: 'Send Daily Attendance', icon: Calendar, className: 'qa-blue' },
  { label: 'Send Instant Result', icon: FileText, className: 'qa-green' },
  { label: 'Generate Weekly Report', icon: FileSpreadsheet, className: 'qa-purple' },
  { label: 'Generate Monthly Report', icon: FileSpreadsheet, className: 'qa-orange' }
]

const activities = [
  { text: 'Daily attendance sent to 45 parents', time: '10:30 AM', className: 'activity-green' },
  { text: 'Weekly report generated for Class 10A', time: '09:15 AM', className: 'activity-purple' },
  { text: 'Low attendance alert for 3 students', time: 'Yesterday', className: 'activity-orange' },
  { text: 'Instant result sent to 12 parents', time: 'Yesterday', className: 'activity-cyan' }
]

const events = [
  { title: 'Unit Test', date: '26 April 2026', icon: BookOpenCheck },
  { title: 'Parent Teacher Meeting', date: '30 April 2026', icon: Users },
  { title: 'Summer Break Starts', date: '15 May 2026', icon: CalendarDays }
]

function PanelHeader({ title, rightText }) {
  return (
    <div className="panel-header">
      <h3>{title}</h3>
      {rightText ? (
        <button className="ghost-select" type="button">
          {rightText}
          <ChevronDown size={14} />
        </button>
      ) : null}
    </div>
  )
}

export default function DashboardView() {
  return (
    <>
      <header className="top-header panel">
        <div>
          <h2>Welcome back, Admin 👋</h2>
          <p>Here&apos;s what&apos;s happening in your school today.</p>
        </div>
        <div className="header-actions">
          <span className="date-pill">
            <Calendar size={16} />
            24 April 2026, Thursday
          </span>
          <button className="icon-button" type="button" aria-label="Notifications">
            <Bell size={17} />
            <span className="dot-badge" />
          </button>
          <div className="avatar">AD</div>
        </div>
      </header>

      <div className="filter-row panel">
        <label htmlFor="view-selector">View</label>
        <div className="select-wrap">
          <select id="view-selector" defaultValue="All Students">
            <option>All Students</option>
            <option>Primary Section</option>
            <option>Middle Section</option>
            <option>High School</option>
          </select>
          <ChevronDown size={16} />
        </div>
      </div>

      <section className="kpi-grid">
        {kpis.map((kpi) => (
          <article key={kpi.title} className={`kpi-card ${kpi.className}`}>
            <h4>{kpi.title}</h4>
            <p className="kpi-value">{kpi.value}</p>
            <span>{kpi.subtext}</span>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <div className="left-stack">
          <article className="panel chart-card">
            <PanelHeader title="Attendance Overview (Last 7 Days)" rightText="Last 7 Days" />
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e9eef8" strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[65, 95]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="attendance" stroke="none" fill="url(#attendanceFill)" />
                  <Line type="monotone" dataKey="attendance" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="panel table-card">
            <PanelHeader title="Top Performing Students" />
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Average Marks</th>
                </tr>
              </thead>
              <tbody>
                {topStudents.map((student) => (
                  <tr key={student.name}>
                    <td>#{student.rank}</td>
                    <td>
                      <div className="student-cell">
                        <span className="mini-avatar">{student.initial}</span>
                        {student.name}
                      </div>
                    </td>
                    <td>{student.className}</td>
                    <td>
                      <div className="marks-cell">
                        <span>{student.marks}%</span>
                        <div className="tiny-bar-track">
                          <div className="tiny-bar-fill" style={{ width: `${student.marks}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article className="panel table-card">
            <PanelHeader title="Students Needing Attention" />
            <div className="attention-list">
              {attentionStudents.map((student) => (
                <div key={student.name} className="attention-item">
                  <div className="attention-meta">
                    <strong>
                      {student.name} ({student.className})
                    </strong>
                    <span>{student.reason}</span>
                  </div>
                  <div className="attention-progress">
                    <div className="progress-track">
                      <div className={`progress-fill ${student.tone}`} style={{ width: `${student.level}%` }} />
                    </div>
                    <span>{student.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="middle-stack">
          <article className="panel chart-card">
            <PanelHeader title="Marks Overview (Last 7 Days)" />
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marksData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#edf3e7" strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[65, 90]} />
                  <Tooltip />
                  <Line type="linear" dataKey="marks" stroke="#16a34a" strokeWidth={3} dot={{ fill: '#16a34a', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="panel classwise-card">
            <PanelHeader title="Classwise Attendance" />
            <div className="chart-wrap tall">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classwiseAttendance} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="className" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {classwiseAttendance.map((entry) => (
                      <Cell key={entry.className} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="classwise-labels">
              {classwiseAttendance.map((item) => (
                <span key={item.className} style={{ color: item.color }}>
                  {item.className}: {item.value}%
                </span>
              ))}
            </div>
          </article>

          <article className="panel events-card">
            <PanelHeader title="Upcoming Events" />
            <ul>
              {events.map(({ title, date, icon: Icon }) => (
                <li key={title}>
                  <div className="event-icon">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4>{title}</h4>
                    <p>{date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <aside className="right-stack">
          <article className="panel quick-actions-card">
            <PanelHeader title="Quick Actions" />
            <div className="quick-grid">
              {quickActions.map(({ label, icon: Icon, className }) => (
                <button key={label} className={`quick-btn ${className}`} type="button">
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </article>

          <article className="panel activities-card">
            <PanelHeader title="Recent Activities" />
            <div className="activities-list">
              {activities.map((activity) => (
                <div key={activity.text} className="activity-item">
                  <span className={`activity-dot ${activity.className}`} />
                  <div>
                    <p>{activity.text}</p>
                    <small>{activity.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>
    </>
  )
}
