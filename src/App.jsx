import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardMoniteur from '@/pages/MonitorDashboard';
import MonitorDashboardLayout from './components/pages/Monitor/layout';
import { Toaster } from 'react-hot-toast';
import QuizQuestionsPage from './components/pages/Monitor/quiz/Questions';
import CreateQuizQuestionPage from './components/pages/Monitor/quiz/CreateQuestion';
import EditQuizQuestionPage from './components/pages/Monitor/quiz/EditQuestion';

import LogoutPage from '@/pages/Logout';


import CategoriesPage from './components/pages/Monitor/categories/Categories';
import CreateCategoryPage from './components/pages/Monitor/categories/Create';
import EditCategoryPage from './components/pages/Monitor/categories/Edit';
import CategoryDetailsPage from './components/pages/Monitor/categories/Details';

import CoursesPage from './components/pages/Monitor/courses/Courses';
import CreateCoursePage from './components/pages/Monitor/courses/Create';
import EditCoursePage from './components/pages/Monitor/courses/Edit';
import CourseDetailsPage from './components/pages/Monitor/courses/Details';

import AdminCoursesPage from './components/pages/Admin/courses/Courses';
import AdminUsersPage from '@/components/pages/Admin/users/Users';
import PendingUsersPage from '@/components/pages/Admin/users/PendingUsers';
import AdminCourseDetailsPage from '@/components/pages/Admin/courses/Details';
import AdminDashboardLayout from '@/components/pages/Admin/layout';
import AdminDashboard from '@/pages/AdminDashboard';

import CandidateDashboardLayout from './components/pages/candidate/layout';
import CandidateCoursesPage from './components/pages/Candidate/courses/CoursesList';
import CourseViewPage from './components/pages/Candidate/courses/CourseView';
import QuizDashboardPage from './components/pages/Candidate/quiz/QuizDashboard';
import TakeQuizPage from './components/pages/Candidate/quiz/TakeQuiz';
import CandidateDashboard from './pages/CandidateDashboard';
import AccountPage from './pages/Account';
function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#333',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            duration: 3000,
            style: {
              background: '#f0fdf4',
              borderLeft: '4px solid #10b981',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },

          error: {
            duration: 4000,
            style: {
              background: '#fef2f2',
              borderLeft: '4px solid #ef4444',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },

          loading: {
            style: {
              background: '#f3f4f6',
              borderLeft: '4px solid #6b7280',
            },
          },
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />


          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/monitor/home" element={
            <ProtectedRoute allowedRole="monitor">
            <MonitorDashboardLayout>
              <DashboardMoniteur />
            </MonitorDashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/monitor/categories" element={
            <ProtectedRoute allowedRole="monitor">
            <MonitorDashboardLayout>
              <CategoriesPage />
            </MonitorDashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/monitor/categories/create" element={
            <ProtectedRoute allowedRole="monitor">
            <MonitorDashboardLayout>
              <CreateCategoryPage />
            </MonitorDashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/monitor/categories/:id/edit" element={
            <ProtectedRoute allowedRole="monitor">
            <MonitorDashboardLayout>
              <EditCategoryPage />
            </MonitorDashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/monitor/categories/:id" element={
            <ProtectedRoute allowedRole="monitor">
            <MonitorDashboardLayout>
              <CategoryDetailsPage />
            </MonitorDashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/monitor/courses" element={
            <ProtectedRoute allowedRole="monitor">
            <MonitorDashboardLayout>
              <CoursesPage />
            </MonitorDashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/monitor/courses/create" element={
            <ProtectedRoute allowedRole="monitor">
            <MonitorDashboardLayout>
              <CreateCoursePage />
            </MonitorDashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/monitor/courses/:id/edit" element={
            <ProtectedRoute allowedRole="monitor">
            <MonitorDashboardLayout>
              <EditCoursePage />
            </MonitorDashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/monitor/courses/:id" element={
            <ProtectedRoute allowedRole="monitor">
            <MonitorDashboardLayout>
              <CourseDetailsPage />
            </MonitorDashboardLayout>
            </ProtectedRoute>
          } />


          <Route path="/admin/home" element={
            <ProtectedRoute allowedRole="admin">
            <AdminDashboardLayout>
              <AdminDashboard />
            </AdminDashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute allowedRole="admin">
            <AdminDashboardLayout>
              <AdminUsersPage />
            </AdminDashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/pending-users" element={
            <ProtectedRoute allowedRole="admin">
            <AdminDashboardLayout>
              <PendingUsersPage />
            </AdminDashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/courses" element={
            <ProtectedRoute allowedRole="admin">
            <AdminDashboardLayout>
              <AdminCoursesPage />
            </AdminDashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/courses/:id" element={
            <ProtectedRoute allowedRole="admin">
            <AdminDashboardLayout>
              <AdminCourseDetailsPage />
            </AdminDashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/monitor/quiz/questions" element={
            <ProtectedRoute allowedRole="monitor">
            <MonitorDashboardLayout>
              <QuizQuestionsPage />
            </MonitorDashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/monitor/quiz/questions/create" element={
            <ProtectedRoute allowedRole="monitor">
            <MonitorDashboardLayout>
              <CreateQuizQuestionPage />
            </MonitorDashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/monitor/quiz/questions/:id/edit" element={
            <ProtectedRoute allowedRole="monitor">
            <MonitorDashboardLayout>
              <EditQuizQuestionPage />
            </MonitorDashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/candidate/home" element={
            <ProtectedRoute allowedRole="candidate">
            <CandidateDashboardLayout>
              <CandidateDashboard />
            </CandidateDashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/candidate/courses" element={
            <ProtectedRoute allowedRole="candidate">
            <CandidateDashboardLayout>
              <CandidateCoursesPage />
            </CandidateDashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/candidate/courses/:id" element={
            <ProtectedRoute allowedRole="candidate">
            <CandidateDashboardLayout>
              <CourseViewPage />
            </CandidateDashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/candidate/courses/:id/:lessonId" element={
            <ProtectedRoute allowedRole="candidate">
            <CandidateDashboardLayout>
              <CourseViewPage />
            </CandidateDashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/candidate/quiz" element={
            <ProtectedRoute allowedRole="candidate">
            <CandidateDashboardLayout>
              <QuizDashboardPage />
            </CandidateDashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/candidate/quiz/take" element={
            <ProtectedRoute allowedRole="candidate">
            <CandidateDashboardLayout>
              <TakeQuizPage />
            </CandidateDashboardLayout>
            </ProtectedRoute>
          } />
        <Route path="/account" element={
          <ProtectedRoute allowedRole="*">
            <AccountPage />
          </ProtectedRoute>
          
        } />
        </Routes>
      </Router>
    </>
  )
}

export default App