import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardMoniteur from '@/pages/MonitorDashboard';
import MonitorDashboardLayout from './components/pages/Monitor/layout';
import CategoriesPage from './components/pages/Monitor/categories/Categories';
import CreateCategoryPage from './components/pages/Monitor/categories/Create';


function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardCondidat />
            </ProtectedRoute>
          } /> */}
          <Route path="/monitor/home" element={
            <MonitorDashboardLayout>
              <DashboardMoniteur />
            </MonitorDashboardLayout>
          } />
          <Route path="/monitor/categories" element={
            <MonitorDashboardLayout>
            <CategoriesPage />
          </MonitorDashboardLayout>
          }/>
          <Route path="/monitor/categories/create" element={
            <MonitorDashboardLayout>
            <CreateCategoryPage />
          </MonitorDashboardLayout>
          }/>
        </Routes>
      </Router>
  )
}

export default App