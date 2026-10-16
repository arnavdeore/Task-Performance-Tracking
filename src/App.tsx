import { HashRouter, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import TopNav from './components/TopNav'
import Dashboard from './pages/Dashboard'
import Performance from './pages/Performance'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Tasks from './pages/Tasks'

export default function App() {
  return (
    <HashRouter>
      <AppShell header={<TopNav />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppShell>
    </HashRouter>
  )
}
