import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import AdminRoomsPage from './pages/admin/AdminRoomsPage';
import AdminSeatsPage from './pages/admin/AdminSeatsPage';
import AdminSchedulesPage from './pages/admin/AdminSchedulesPage';
import AdminMoviesPage from './pages/admin/AdminMoviesPage';
import AdminTheatersPage from './pages/admin/AdminTheatersPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import ShowtimesPage from './pages/ShowtimesPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import PaymentPage from './pages/PaymentPage';
import { AuthProvider } from './context/AuthContext';
import { HomeGuard, AdminGuard } from './components/guards/RoleBasedGuard';
import { Toaster } from 'react-hot-toast';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<HomeGuard />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/showtimes" element={<ShowtimesPage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
        </Route>

        <Route element={<AdminGuard />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/rooms" element={<AdminRoomsPage />} />
          <Route path="/admin/seats" element={<AdminSeatsPage />} />
          <Route path="/admin/schedules" element={<AdminSchedulesPage />} />
          <Route path="/admin/movies" element={<AdminMoviesPage />} />
          <Route path="/admin/theaters" element={<AdminTheatersPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/history" element={<TransactionHistoryPage />} />
        <Route path="/seats" element={<SeatSelectionPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;