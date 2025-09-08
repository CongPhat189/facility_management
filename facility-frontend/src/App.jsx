import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import StudentRegister from './pages/StudentRegister';
import LecturerRequest from './pages/LecturerRequest';
import { AuthProvider, useAuth } from './context/AuthProvider';
import Dashboard from './pages/Dashboard';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BorrowClassroom from './pages/BorrowClassroom';
import BorrowEquipment from './pages/BorrowEquipment';
import BookSportField from './pages/BookSportField';
import InvoicePage from './pages/InvoicePage';
import MomoReturnPage from './pages/MomoReturnPage';
import AdminDashboard from './pages/AdminDashboard';



function App() {
  function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return user ? children : <Navigate to="/login" replace />;
  }
  function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return user && user.role === 'admin' ? children : <Navigate to="/admin/login" replace />;
  }
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/register-student" element={<StudentRegister />} />
            <Route path="/request-lecturer" element={<LecturerRequest />} />
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/classroom-booking" element={<PrivateRoute><BorrowClassroom /></PrivateRoute>} />
            <Route path="/equipment-booking" element={<PrivateRoute><BorrowEquipment /></PrivateRoute>} />
            <Route path="/sportfield-booking" element={<PrivateRoute><BookSportField /></PrivateRoute>} />
            <Route path="/invoice/:bookingId" element={<PrivateRoute><InvoicePage /></PrivateRoute>} />
            <Route path="/momo-return" element={<MomoReturnPage />} />
            <Route path="/admin/dashboard/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />





          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
