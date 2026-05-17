import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Layouts
import MainLayout from '../../shared/components/layout/MainLayout';
import AdminLayout from '../../shared/components/layout/AdminLayout';

// Pages
import PublicExplore from '../../features/facilities/pages/PublicExplore';
import FacilityCatalog from '../../features/facilities/pages/FacilityCatalog';
import FacilityDetail from '../../features/facilities/pages/FacilityDetail';
import PublicCalendar from '../../features/calendar/pages/PublicCalendar';
import Login from '../../features/auth/pages/Login';
import Register from '../../features/auth/pages/Register';
import CivitasDashboard from '../../features/dashboard/pages/CivitasDashboard';
import CivitasProfile from '../../features/dashboard/pages/CivitasProfile';
import BookingForm from '../../features/bookings/pages/BookingForm';
import BookingHistory from '../../features/bookings/pages/BookingHistory';
import BookingDetail from '../../features/bookings/pages/BookingDetail';
import DigitalTicket from '../../features/tickets/pages/DigitalTicket';

import ProtectedRoute from './ProtectedRoute';

/**
 * Helper component that dynamically wraps public pages with the correct
 * layout depending on the user's authentication and role status.
 */
const DynamicLayoutWrapper = () => {
  const { user } = useAuth();
  
  // Guest gets MainLayout (which acts as PublicLayout for guests)
  if (!user) {
    return (
      <MainLayout>
        <Outlet />
      </MainLayout>
    );
  }

  // Civitas gets MainLayout (which acts as CivitasLayout for civitas)
  if (user.role === 'civitas') {
    return (
      <MainLayout>
        <Outlet />
      </MainLayout>
    );
  }

  // Admins get AdminLayout
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

// --- PLACEHOLDER COMPONENTS ---
const FacilityStatus = () => <div className="p-10 text-center">Dashboard Admin Fasilitas</div>;
const AdminValidationList = () => <div className="p-10 text-center">Daftar Validasi</div>;
const AdminValidationDetail = () => <div className="p-10 text-center">Detail Validasi</div>;
const AdminMasterData = () => <div className="p-10 text-center">Master Data</div>;
const AdminManagement = () => <div className="p-10 text-center">Manajemen Pengguna</div>;
const SystemAuditLog = () => <div className="p-10 text-center">Audit Log Sistem</div>;
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-surface">
    <h1 className="text-6xl font-black text-primary drop-shadow-md mb-2">404</h1>
    <p className="text-gray-500 font-medium">Halaman tidak ditemukan.</p>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. GATED AUTH ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 2. DYNAMIC SHARED ROUTES */}
      <Route element={<DynamicLayoutWrapper />}>
        <Route path="/" element={<PublicExplore />} />
        <Route path="/facilities/explore" element={<FacilityCatalog />} />
        <Route path="/facilities/explore/:facilityId" element={<FacilityDetail />} />
        <Route path="/calendar" element={<PublicCalendar />} />
      </Route>

      {/* 3. CIVITAS ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['Civitas']} />}>
        <Route element={<MainLayout><Outlet /></MainLayout>}>
          <Route path="/civitas/dashboard" element={<CivitasDashboard />} />
          <Route path="/civitas/beranda" element={<Navigate to="/civitas/dashboard" replace />} />
          <Route path="/civitas/history" element={<BookingHistory />} />
          <Route path="/civitas/riwayat" element={<Navigate to="/civitas/history" replace />} />
          <Route path="/civitas/booking/:facilityId" element={<BookingForm />} />
          <Route path="/civitas/booking-detail/:bookingId" element={<BookingDetail />} />
          <Route path="/civitas/ticket/:bookingId" element={<DigitalTicket />} />
          <Route path="/civitas/profile" element={<CivitasProfile />} />
        </Route>
      </Route>

      {/* 4. FACILITY ADMIN ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['FacilityAdmin', 'SuperAdmin']} />}>
        <Route element={<AdminLayout><Outlet /></AdminLayout>}>
          <Route path="/admin/facility/dashboard" element={<FacilityStatus />} />
          <Route path="/admin/facility/validations" element={<AdminValidationList />} />
          <Route path="/admin/facility/validations/:bookingId" element={<AdminValidationDetail />} />
        </Route>
      </Route>

      {/* 5. SUPER ADMIN ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['SuperAdmin']} />}>
        <Route element={<AdminLayout><Outlet /></AdminLayout>}>
          <Route path="/admin/super/master-data" element={<AdminMasterData />} />
          <Route path="/admin/super/users" element={<AdminManagement />} />
          <Route path="/admin/super/audit" element={<SystemAuditLog />} />
        </Route>
      </Route>

      {/* 6. CATCH ALL */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
