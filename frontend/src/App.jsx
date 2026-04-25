import { useEffect, useMemo, useState } from 'react'
import {
  BellRing,
  BookOpenCheck,
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  FileSpreadsheet,
  FileText,
  IndianRupee,
  LayoutGrid,
  Palette,
  School,
  Settings2,
  Target,
  UserCog,
  Users
} from 'lucide-react'
import AttendanceView from './components/modules/AttendanceView'
import AlertsView from './components/modules/AlertsView'
import DashboardView from './components/modules/DashboardView'
import FeesView from './components/modules/FeesView'
import HolidaysView from './components/modules/HolidaysView'
import MarksResultsView from './components/modules/MarksResultsView'
import ReportsView from './components/modules/ReportsView'
import TestAttemptView from './components/modules/TestAttemptView'
import StudentsView from './components/modules/StudentsView'
import TestsKioskView from './components/modules/TestsKioskView'
import TimetableView from './components/modules/TimetableView'
import GoalTrackerView from './components/modules/GoalTrackerView'
import { FilterProvider } from './context/FilterContext'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { key: 'attendance', label: 'Attendance', icon: Users },
  { key: 'marks', label: 'Marks & Results', icon: FileText },
  { key: 'reports', label: 'Reports', icon: FileSpreadsheet },
  { key: 'tests', label: 'Tests (Kiosk)', icon: BookOpenCheck },
  { key: 'students', label: 'Students', icon: School },
  { key: 'parents', label: 'Parents', icon: UserCog },
  { key: 'timetable', label: 'Timetable', icon: CalendarDays },
  { key: 'holidays', label: 'Holidays', icon: Palette },
  { key: 'fees', label: 'Fees', icon: IndianRupee },
  { key: 'alerts', label: 'Alerts & Notifications', icon: BellRing },
  { key: 'goals', label: 'Goal Tracker', icon: Target },
  { key: 'settings', label: 'Settings', icon: Settings2 }
]

function PlaceholderView({ title }) {
  return (
    <section className="module-page">
      <header className="module-header panel">
        <div>
          <h2>{title}</h2>
          <p>This section can be expanded with workflows and data integrations.</p>
        </div>
      </header>
      <article className="panel empty-panel">
        <h3>{title} module is ready for backend integration.</h3>
        <p>Use the same card, chart, and table patterns used across the other implemented modules.</p>
      </article>
    </section>
  )
}

export default function App() {
  const [activeModule, setActiveModule] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [locationHash, setLocationHash] = useState(window.location.hash)

  useEffect(() => {
    const handleHashChange = () => setLocationHash(window.location.hash)
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (locationHash.startsWith('#/test/')) {
    return <TestAttemptView />
  }

  const activeView = useMemo(() => {
    switch (activeModule) {
      case 'attendance':
        return <AttendanceView />
      case 'marks':
        return <MarksResultsView />
      case 'reports':
        return <ReportsView />
      case 'tests':
        return <TestsKioskView />
      case 'parents':
        return <StudentsView onNavigate={setActiveModule} initialMode="parents" />
      case 'students':
        return <StudentsView onNavigate={setActiveModule} initialMode="students" />
      case 'timetable':
        return <TimetableView />
      case 'holidays':
        return <HolidaysView />
      case 'fees':
        return <FeesView />
      case 'alerts':
        return <AlertsView />
      case 'goals':
        return <GoalTrackerView />
      case 'settings':
        return <PlaceholderView title="Settings" />
      default:
        return <DashboardView />
    }
  }, [activeModule])

  return (
    <FilterProvider>
      <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <aside className="sidebar">
        <div className="brand-block">
          <div className="logo-placeholder" aria-hidden="true">
            V
          </div>
          <div className="brand-copy">
            <h1>VNR Smart School</h1>
            <p>Excellence in Education</p>
          </div>
          <button
            className="sidebar-toggle"
            type="button"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setSidebarCollapsed((value) => !value)}
          >
            {sidebarCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        </div>

        <nav className="nav-list" aria-label="Main Navigation">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activeModule === key ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveModule(key)}
            >
              <Icon size={18} />
              <span className="nav-label">{label}</span>
            </button>
          ))}
        </nav>
        </aside>

        <main className="main-content">{activeView}</main>
      </div>
    </FilterProvider>
  )
}
