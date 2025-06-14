import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNovel } from '../context/NovelContext';

function BookmarksPage() {
  const { state, dispatch } = useNovel();

  const removeBookmark = (novelId, chapterNumber) => {
    dispatch({ 
      type: 'REMOVE_BOOKMARK', 
      payload: { novelId, chapterNumber } 
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Bookmarks</h1>
        <p className="text-gray-600">Your saved reading positions</p>
      </motion.div>

      {/* Bookmarks List */}
      {state.bookmarks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <i className="fas fa-bookmark text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookmarks yet</h3>
          <p className="text-gray-500 mb-6">Start reading and bookmark your favorite chapters</p>
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <i className="fas fa-book"></i>
            <span>Browse Novels</span>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {state.bookmarks.map((bookmark, index) => (
            <motion.div
              key={`${bookmark.novelId}-${bookmark.chapterNumber}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">
                    {bookmark.novelTitle}
                  </h3>
                  <p className="text-gray-600 mb-2">{bookmark.chapterTitle}</p>
                  <p className="text-sm text-gray-500">
                    Bookmarked on {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Link
                    to={`/novel/${bookmark.novelName}/chapter/${bookmark.chapterNumber}`}
                    className="inline-flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <i className="fas fa-book-open"></i>
                    <span>Continue Reading</span>
                  </Link>
                  
                  <button
                    onClick={() => removeBookmark(bookmark.novelId, bookmark.chapterNumber)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default BookmarksPage;