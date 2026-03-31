import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import RequestsList from './pages/RequestsList'
import RequestForm from './pages/RequestForm'
import MasterData from './pages/MasterData'
import Reporting from './pages/Reporting'
import SmtpSettings from './pages/SmtpSettings'
import AdminUsers from './pages/AdminUsers'
import { AppProviders } from './stores/main'

const App = () => (
  <AppProviders>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/requests" element={<RequestsList />} />
            <Route path="/requests/:id" element={<RequestForm />} />
            <Route path="/master-data" element={<MasterData />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/settings/smtp" element={<SmtpSettings />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AppProviders>
)

export default App
