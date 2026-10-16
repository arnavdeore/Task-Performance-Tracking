import { HashRouter, Outlet, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import BottomNav from './components/BottomNav'
import TopNav from './components/TopNav'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Performance from './pages/Performance'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Tasks from './pages/Tasks'

/** The page shell with the top nav, shared by every signed-in page. */
function ShellLayout() {
  return (
    <AppShell header={<TopNav />} bottomNav={<BottomNav />}>
      <Outlet />
    </AppShell>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* The sign-in screen has no top nav. */}
        <Route path="/login" element={<Login />} />
        <Route element={<ShellLayout />}>
          <Route path="/" element={<Dashboard />} />
          {/* /tasks/new is the same page with the Add task pop-up open, so the phone's Back button closes it. */}
          <Route path="/tasks/*" element={<Tasks />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
