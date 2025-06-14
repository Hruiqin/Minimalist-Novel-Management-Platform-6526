import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNovel } from '../context/NovelContext';

function ReadingListPage() {
  const { state, dispatch } = useNovel();

  const removeFromReadingList = (novelId) => {
    dispatch({ 
      type: 'REMOVE_FROM_READING_LIST', 
      payload: { novelId } 
    });
  };

  // Get full novel details for reading list items
  const readingListWithDetails = state.readingList.map(item => {
    const novel = state.novels.find(n => n.id === item.novelId);
    return { ...item, ...novel };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Reading List</h1>
        <p className="text-gray-600">Novels you want to read</p>
      </motion.div>

      {/* Reading List */}
      {readingListWithDetails.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <i className="fas fa-list text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Your reading list is empty</h3>
          <p className="text-gray-500 mb-6">Add novels to your reading list to keep track of what you want to read</p>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {readingListWithDetails.map((item, index) => (
            <motion.div
              key={item.novelId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <Link to={`/novel/${item.novelName}`}>
                <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/novel/${item.novelName}`}>
                    <h3 className="font-semibold text-lg hover:text-gray-600 transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <button
                    onClick={() => removeFromReadingList(item.novelId)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">by {item.author}</p>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{item.chapters} chapters</span>
                  <span>{item.lastUpdated}</span>
                </div>

                <p className="text-xs text-gray-500 mb-4">
                  Added on {new Date(item.addedAt).toLocaleDateString()}
                </p>
                
                <Link
                  to={`/novel/${item.novelName}`}
                  className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-center block"
                >
                  Start Reading
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default ReadingListPage;