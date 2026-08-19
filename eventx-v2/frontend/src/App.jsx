import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Sidebar, { SIDEBAR_WIDTH } from './components/common/Sidebar';
import TopBar from './components/common/TopBar';

// Pages
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import HomePage          from './pages/HomePage';
import DashboardPage     from './pages/DashboardPage';
import BookingsPage      from './pages/BookingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import EventDetailPage   from './pages/EventDetailPage';

const AppLayout = ({ children, search, onSearch }) => (
  <>
    <Sidebar />
    <div style={{ marginLeft: SIDEBAR_WIDTH, minHeight: '100vh' }}>
      <TopBar search={search} onSearch={onSearch} />
      <div style={{ padding: '0 32px 60px' }}>
        {children}
      </div>
    </div>
  </>
);

const App = () => {
  const [search, setSearch] = useState('');

  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Home — browse events */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout search={search} onSearch={setSearch}>
              <HomePage search={search} />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Event detail page */}
        <Route path="/events/:id" element={
          <ProtectedRoute>
            <AppLayout search={search} onSearch={setSearch}>
              <EventDetailPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Admin dashboard — manage events */}
        <Route path="/dashboard" element={
          <ProtectedRoute adminOnly>
            <AppLayout search={search} onSearch={setSearch}>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Admin — all bookings */}
        <Route path="/admin/bookings" element={
          <ProtectedRoute adminOnly>
            <AppLayout search={search} onSearch={setSearch}>
              <AdminBookingsPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* User — my bookings */}
        <Route path="/bookings" element={
          <ProtectedRoute>
            <AppLayout search={search} onSearch={setSearch}>
              <BookingsPage />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
