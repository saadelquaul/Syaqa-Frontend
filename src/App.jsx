import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardMoniteur from '@/pages/MonitorDashboard';
import MonitorDashboardLayout from './components/pages/Monitor/layout';

import LogoutPage from '@/pages/Logout';


import CategoriesPage from './components/pages/Monitor/categories/Categories';
import CreateCategoryPage from './components/pages/Monitor/categories/Create';
import EditCategoryPage from './components/pages/Monitor/categories/Edit';
import CategoryDetailsPage from './components/pages/Monitor/categories/Details';

import CoursesPage from './components/pages/Monitor/courses/Courses';
import CreateCoursePage from './components/pages/Monitor/courses/Create';
import EditCoursePage from './components/pages/Monitor/courses/Edit';
import CourseDetailsPage from './components/pages/Monitor/courses/Details';
function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<LogoutPage />} />
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
        } />
        <Route path="/monitor/categories/create" element={
          <MonitorDashboardLayout>
            <CreateCategoryPage />
          </MonitorDashboardLayout>
        } />
        <Route path="/monitor/categories/:id/edit" element={
          <MonitorDashboardLayout>
            <EditCategoryPage />
          </MonitorDashboardLayout>
        } />
        <Route path="/monitor/categories/:id" element={
          <MonitorDashboardLayout>
            <CategoryDetailsPage />
          </MonitorDashboardLayout>
        } />

        <Route path="/monitor/courses" element={
          <MonitorDashboardLayout>
            <CoursesPage />
          </MonitorDashboardLayout>
        } />
        <Route path="/monitor/courses/create" element={
          <MonitorDashboardLayout>
            <CreateCoursePage />
          </MonitorDashboardLayout>
        } />
        <Route path="/monitor/courses/:id/edit" element={
          <MonitorDashboardLayout>
            <EditCoursePage />
          </MonitorDashboardLayout>
        } />
        <Route path="/monitor/courses/:id" element={
          <MonitorDashboardLayout>
            <CourseDetailsPage />
          </MonitorDashboardLayout>
        } />
      </Routes>
    </Router>
  )
}

export default App