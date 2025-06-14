import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { NovelProvider } from './context/NovelContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import NovelPage from './pages/NovelPage';
import ChapterPage from './pages/ChapterPage';
import BookmarksPage from './pages/BookmarksPage';
import ReadingListPage from './pages/ReadingListPage';
import './App.css';

function App() {
  return (
    <NovelProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/novel/:novelName" element={<NovelPage />} />
            <Route path="/novel/:novelName/chapter/:chapterNumber" element={<ChapterPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/reading-list" element={<ReadingListPage />} />
          </Routes>
        </Layout>
      </Router>
    </NovelProvider>
  );
}

export default App;