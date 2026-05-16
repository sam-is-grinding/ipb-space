import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import PublicExplore from './features/facilities/pages/PublicExplore';
import FacilityCatalog from './features/facilities/pages/FacilityCatalog';
import PublicCalendar from './features/calendar/pages/PublicCalendar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="bottom-right" />
        <Routes>
          <Route path="/" element={<PublicExplore />} />
          <Route path="/beranda" element={<Navigate to="/" replace />} />
          <Route path="/eksplorasi" element={<FacilityCatalog />} />
          <Route path="/kalender" element={<PublicCalendar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dashboards - Placeholders */}
          <Route 
            path="/civitas/beranda" 
            element={
              <ProtectedRoute roleRequired="civitas">
                <div className="p-10 text-center text-2xl font-bold">Civitas Beranda (Mobile view)</div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/facility-admin/dashboard" 
            element={
              <ProtectedRoute roleRequired="facility_manager">
                <div className="p-10 text-center text-2xl font-bold">Facility Admin Dashboard (Desktop view)</div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/super-admin/dashboard" 
            element={
              <ProtectedRoute roleRequired="admin">
                <div className="p-10 text-center text-2xl font-bold">Super Admin Dashboard (Desktop view)</div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;