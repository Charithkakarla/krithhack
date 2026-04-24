import {
  AlertCircle,
  Bell,
  CalendarDays,
  CheckCircle2,
  Filter,
  Mail,
  Menu,
  MessageCircle,
  MoreVertical,
  Search,
  Send,
  Smartphone,
  TriangleAlert
} from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const metrics = [
  {
    icon: Bell,
    title: 'Active Alerts',
    value: '12',
    subtext: 'Needs attention',
    className: 'am-red'
  },
  {
    icon: AlertCircle,
    title: 'Warning Alerts',
    value: '18',
    subtext: 'Monitor closely',
    className: 'am-orange'
  },
  {
    icon: CheckCircle2,
    title: 'Resolved Alerts',
    value: '45',
    subtext: 'This month',
    className: 'am-green'
  },
  {
    icon: Send,
    title: 'Total Sent',
    value: '128',
    subtext: 'This month',
    className: 'am-blue'
  }
]

const tabs = ['Active Alerts', 'All Notifications', 'Sent History', 'Alert Rules']

const alertRows = [
  {
    alert: 'Low Attendance Alert',
    description: 'Attendance is below 75%',
    person: 'Aarav Sharma',
    contact: '+91 98765 43210',
    className: '10-A',
    type: 'Attendance',
    priority: 'High',
    datetime: '24 Apr 2026\n10:30 AM',
    status: 'Active',
    color: 'row-red'
  },
  {
    alert: 'Performance Drop Alert',
    description: 'Marks dropped by 15%',
    person: 'Ananya Sharma',
    contact: '+91 98765 43211',
    className: '10-A',
    type: 'Performance',
    priority: 'Medium',
    datetime: '24 Apr 2026\n09:15 AM',
    status: 'Active',
    color: 'row-orange'
  },
  {
    alert: 'Low Marks Alert',
    description: 'Scored below 40% in Science',
    person: 'Kabir Singh',
    contact: '+91 98765 43212',
    className: '9-B',
    type: 'Marks',
    priority: 'High',
    datetime: '23 Apr 2026\n04:45 PM',
    status: 'Active',
    color: 'row-pink'
  },
  {
    alert: 'Fee Due Reminder',
    description: 'Fee due for April 2026',
    person: 'Parent of Meera Joshi',
    contact: '+91 98765 43213',
    className: '8-A',
    type: 'Fee',
    priority: 'Medium',
    datetime: '23 Apr 2026\n11:00 AM',
    status: 'Active',
    color: 'row-yellow'
  },
  {
    alert: 'Test Reminder',
    description: 'Unit Test on 26 April 2026',
    person: 'Arjun Patel',
    contact: '+91 98765 43214',
    className: '10-B',
    type: 'Reminder',
    priority: 'Low',
    datetime: '22 Apr 2026\n06:30 PM',
    status: 'Scheduled',
    color: 'row-blue'
  }
]

const donutData = [
  { name: 'High', value: 12, color: '#ef4444' },
  { name: 'Medium', value: 18, color: '#f59e0b' },
  { name: 'Low', value: 8, color: '#22c55e' },
  { name: 'Resolved', value: 45, color: '#3b82f6' }
]

const channels = [
  { name: 'WhatsApp', count: 96, share: '75%', icon: MessageCircle, tone: 'ch-green' },
  { name: 'SMS', count: 20, share: '16%', icon: Smartphone, tone: 'ch-blue' },
  { name: 'Email', count: 12, share: '9%', icon: Mail, tone: 'ch-purple' }
]

function Badge({ value, tone }) {
  return <span className={`alert-badge ${tone}`}>{value}</span>
}

function splitDateTime(text) {
  const [date, time] = text.split('\n')
  return { date, time }
}

export default function AlertsView() {
  return (
    <div className="module-page alerts-page">
      <section className="alerts-topbar panel">
        <button type="button" className="icon-outline" aria-label="Menu">
          <Menu size={17} />
        </button>

        <div className="alerts-search">
          <Search size={16} />
          <input type="search" placeholder="Search students, parents, alerts..." />
        </div>

        <div className="alerts-top-actions">
          <span className="date-pill">
            <CalendarDays size={16} />
            24 April 2026, Thursday
          </span>
          <button className="icon-button" type="button" aria-label="Notifications">
            <Bell size={17} />
            <span className="dot-badge" />
          </button>
          <div className="admin-chip">
            <div className="avatar tiny">AD</div>
            <div>
              <strong>Admin</strong>
              <small>Super Admin</small>
            </div>
          </div>
        </div>
      </section>

      <section className="alerts-title-row">
        <h2>Alerts & Notifications</h2>
        <p>Dashboard &gt; Alerts & Notifications</p>
      </section>

      <section className="alert-metrics">
        {metrics.map(({ icon: Icon, title, value, subtext, className }) => (
          <article key={title} className="panel alert-metric-card">
            <div className={`metric-icon ${className}`}>
              <Icon size={20} />
            </div>
            <div>
              <h3>{value}</h3>
              <h4>{title}</h4>
              <p>{subtext}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="alerts-main-grid">
        <article className="panel alerts-table-card">
          <div className="alerts-tabs">
            {tabs.map((tab, index) => (
              <button key={tab} type="button" className={index === 0 ? 'active' : ''}>
                {tab}
              </button>
            ))}
          </div>

          <div className="alerts-filter-row">
            <div className="left-filters">
              <select defaultValue="All Types">
                <option>All Types</option>
                <option>Attendance</option>
                <option>Performance</option>
                <option>Marks</option>
                <option>Fee</option>
              </select>
              <select defaultValue="All Classes">
                <option>All Classes</option>
                <option>10-A</option>
                <option>10-B</option>
                <option>9-B</option>
              </select>
              <select defaultValue="All Priority">
                <option>All Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="right-filters">
              <div className="alerts-search small">
                <Search size={14} />
                <input type="search" placeholder="Search alerts..." />
              </div>
              <button type="button" className="filter-btn">
                <Filter size={14} />
                Filter
              </button>
            </div>
          </div>

          <div className="alerts-table-wrap">
            <table className="alerts-table">
              <thead>
                <tr>
                  <th />
                  <th>Alert</th>
                  <th>Student / Parent</th>
                  <th>Class</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {alertRows.map((row) => {
                  const dateTime = splitDateTime(row.datetime)
                  return (
                    <tr key={row.alert + row.person}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>
                        <div className="alert-cell">
                          <span className={`alert-dot ${row.color}`}>
                            <TriangleAlert size={12} />
                          </span>
                          <div>
                            <strong>{row.alert}</strong>
                            <small>{row.description}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="person-cell">
                          <span className="mini-avatar">{row.person.slice(0, 2).toUpperCase()}</span>
                          <div>
                            <strong>{row.person}</strong>
                            <small>{row.contact}</small>
                          </div>
                        </div>
                      </td>
                      <td>{row.className}</td>
                      <td>
                        <Badge value={row.type} tone="soft" />
                      </td>
                      <td>
                        <Badge
                          value={row.priority}
                          tone={
                            row.priority === 'High' ? 'high' : row.priority === 'Medium' ? 'medium' : 'low'
                          }
                        />
                      </td>
                      <td>
                        <div className="date-time-cell">
                          <strong>{dateTime.date}</strong>
                          <small>{dateTime.time}</small>
                        </div>
                      </td>
                      <td>
                        <Badge value={row.status} tone={row.status === 'Active' ? 'high' : 'low'} />
                      </td>
                      <td>
                        <div className="table-actions">
                          <button type="button" aria-label="WhatsApp">
                            <MessageCircle size={14} />
                          </button>
                          <button type="button" aria-label="Message">
                            <Mail size={14} />
                          </button>
                          <button type="button" aria-label="More">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="alerts-table-footer">
            <p>Showing 1 to 5 of 12 alerts</p>
            <div className="pager">
              <button type="button">&lt;</button>
              <button type="button" className="active">
                1
              </button>
              <button type="button">2</button>
              <button type="button">3</button>
              <button type="button">&gt;</button>
            </div>
          </div>

          <div className="alerts-info-strip">
            <div>
              <h4>About Alerts & Notifications</h4>
              <p>
                Alerts help you stay on top of important student activities. You can customize alert rules and send
                instant notifications to parents via their preferred channels.
              </p>
            </div>
            <button type="button">View Alert Rules</button>
          </div>
        </article>

        <aside className="alerts-right-stack">
          <article className="panel quick-actions-panel">
            <h3>Quick Actions</h3>
            <button type="button" className="qa-action qa-blue">
              <Send size={15} /> Send Alert to Selected
            </button>
            <button type="button" className="qa-action qa-green">
              <CheckCircle2 size={15} /> Create New Alert
            </button>
            <button type="button" className="qa-action qa-purple">
              <AlertCircle size={15} /> Manage Alert Rules
            </button>
          </article>

          <article className="panel alert-summary-panel">
            <h3>Alert Summary</h3>
            <div className="summary-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={42} outerRadius={62}>
                    {donutData.map((slice) => (
                      <Cell key={slice.name} fill={slice.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="summary-total">
                <strong>83</strong>
                <span>Total</span>
              </div>
            </div>
            <ul>
              {donutData.map((item) => (
                <li key={item.name}>
                  <i style={{ background: item.color }} />
                  <span>
                    {item.name} ({item.value})
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel notification-channels">
            <h3>Notification Channels</h3>
            {channels.map(({ name, count, share, icon: Icon, tone }) => (
              <div key={name} className="channel-row">
                <div className="channel-name">
                  <span className={`channel-icon ${tone}`}>
                    <Icon size={13} />
                  </span>
                  <span>{name}</span>
                </div>
                <strong>{count}</strong>
                <small>{share}</small>
              </div>
            ))}
          </article>
        </aside>
      </section>
    </div>
  )
}
