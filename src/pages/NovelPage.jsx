import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNovel } from '../context/NovelContext';

function NovelPage() {
  const { novelName } = useParams();
  const { state, dispatch } = useNovel();
  
  const novel = state.novels.find(n => n.name === novelName);
  
  if (!novel) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-600">Novel not found</h1>
        <Link to="/" className="text-black hover:underline mt-4 inline-block">
          Return to home
        </Link>
      </div>
    );
  }

  const isInReadingList = state.readingList.some(item => item.novelId === novel.id);

  const toggleReadingList = () => {
    if (isInReadingList) {
      dispatch({ type: 'REMOVE_FROM_READING_LIST', payload: { novelId: novel.id } });
    } else {
      dispatch({ 
        type: 'ADD_TO_READING_LIST', 
        payload: { 
          novelId: novel.id, 
          novelName: novel.name,
          title: novel.title,
          author: novel.author,
          addedAt: new Date().toISOString()
        } 
      });
    }
  };

  // Generate chapter list
  const chapters = Array.from({ length: novel.chapters }, (_, i) => ({
    number: i + 1,
    title: `Chapter ${i + 1}`,
    isLocked: i >= 5 && state.coins < 10 // First 5 chapters free, others cost 10 coins
  }));

  const unlockChapter = (chapterNumber) => {
    if (state.coins >= 10) {
      dispatch({ type: 'SPEND_COINS', payload: 10 });
      // In a real app, you'd unlock the chapter here
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back to novels</span>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Novel Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="aspect-[3/4] bg-gray-100">
              <img 
                src={novel.image} 
                alt={novel.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-2">{novel.title}</h1>
              <p className="text-gray-600 mb-4">by {novel.author}</p>
              
              <button
                onClick={toggleReadingList}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors mb-4 ${
                  isInReadingList
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                <i className={`fas fa-list mr-2`}></i>
                {isInReadingList ? 'Remove from Reading List' : 'Add to Reading List'}
              </button>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Chapters:</span>
                  <span className="font-medium">{novel.chapters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{novel.lastUpdated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Ongoing</span>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {novel.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{novel.description}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chapter List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Chapters</h2>
              <p className="text-gray-600 text-sm mt-1">
                First 5 chapters are free. Unlock more with coins.
              </p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {chapters.map(chapter => (
                <motion.div
                  key={chapter.number}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * chapter.number }}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {chapter.isLocked ? (
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 text-gray-500">
                            <i className="fas fa-lock text-sm"></i>
                            <span className="font-medium">{chapter.title}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            <i className="fas fa-coins"></i>
                            <span>10</span>
                          </div>
                        </div>
                      ) : (
                        <Link
                          to={`/novel/${novelName}/chapter/${chapter.number}`}
                          className="flex items-center space-x-3 hover:text-gray-600 transition-colors"
                        >
                          <span className="font-medium">{chapter.title}</span>
                          {chapter.number <= 5 && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Free
                            </span>
                          )}
                        </Link>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {chapter.isLocked ? (
                        <button
                          onClick={() => unlockChapter(chapter.number)}
                          disabled={state.coins < 10}
                          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                            state.coins >= 10
                              ? 'bg-black text-white hover:bg-gray-800'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Unlock
                        </button>
                      ) : (
                        <Link
                          to={`/novel/${novelName}/chapter/${chapter.number}`}
                          className="text-black hover:text-gray-600 transition-colors"
                        >
                          <i className="fas fa-arrow-right"></i>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default NovelPage;