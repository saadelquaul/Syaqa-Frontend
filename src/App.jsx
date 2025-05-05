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


          <Route path="/admin/home" element={
            <AdminDashboardLayout>
              <AdminDashboard />
            </AdminDashboardLayout>
          } />
          <Route path="/admin/users" element={
            <AdminDashboardLayout>
              <AdminUsersPage />
            </AdminDashboardLayout>
          } />
          <Route path="/admin/pending-users" element={
            <AdminDashboardLayout>
              <PendingUsersPage />
            </AdminDashboardLayout>
          } />
          <Route path="/admin/courses" element={
            <AdminDashboardLayout>
              <AdminCoursesPage />
            </AdminDashboardLayout>
          } />
          <Route path="/admin/courses/:id" element={
            <AdminDashboardLayout>
              <AdminCourseDetailsPage />
            </AdminDashboardLayout>
          } />

          <Route path="/monitor/quiz/questions" element={
            <MonitorDashboardLayout>
              <QuizQuestionsPage />
            </MonitorDashboardLayout>
          } />
          <Route path="/monitor/quiz/questions/create" element={
            <MonitorDashboardLayout>
              <CreateQuizQuestionPage />
            </MonitorDashboardLayout>
          } />
          <Route path="/monitor/quiz/questions/:id/edit" element={
            <MonitorDashboardLayout>
              <EditQuizQuestionPage />
            </MonitorDashboardLayout>
          } />

          <Route path="/candidate/home" element={
            <CandidateDashboardLayout>
              <CandidateDashboard />
            </CandidateDashboardLayout>
          } />

          {/* Candidate courses routes */}
          <Route path="/candidate/courses" element={
            <CandidateDashboardLayout>
              <CandidateCoursesPage />
            </CandidateDashboardLayout>
          } />
          <Route path="/candidate/courses/:id" element={
            <CandidateDashboardLayout>
              <CourseViewPage />
            </CandidateDashboardLayout>
          } />
          <Route path="/candidate/courses/:id/:lessonId" element={
            <CandidateDashboardLayout>
              <CourseViewPage />
            </CandidateDashboardLayout>
          } />

          {/* Quiz routes */}
          <Route path="/candidate/quiz" element={
            <CandidateDashboardLayout>
              <QuizDashboardPage />
            </CandidateDashboardLayout>
          } />
          <Route path="/candidate/quiz/take" element={
            <CandidateDashboardLayout>
              <TakeQuizPage />
            </CandidateDashboardLayout>
          } />
        <Route path="/account" element={
  
            <AccountPage />
          
        } />
        </Routes>
      </Router>
    </>
  )
}

export default App