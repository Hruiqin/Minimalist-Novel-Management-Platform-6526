import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { NovelProvider } from './context/NovelContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import NovelPage from './pages/NovelPage';
import ChapterPage from './pages/ChapterPage';
import BookmarksPage from './pages/BookmarksPage';
import ReadingListPage from './pages/ReadingListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <NovelProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/novel/:novelName" element={<NovelPage />} />
            <Route path="/novel/:novelName/chapter/:chapterNumber" element={<ChapterPage />} />
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoute>
                  <BookmarksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reading-list"
              element={
                <ProtectedRoute>
                  <ReadingListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </NovelProvider>
  );
}

export default App;