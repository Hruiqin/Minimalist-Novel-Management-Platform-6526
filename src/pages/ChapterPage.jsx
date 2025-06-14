import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNovel } from '../context/NovelContext';

function ChapterPage() {
  const { novelName, chapterNumber } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useNovel();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const novel = state.novels.find(n => n.name === novelName);
  const currentChapter = parseInt(chapterNumber);

  useEffect(() => {
    const bookmark = state.bookmarks.find(
      b => b.novelId === novel?.id && b.chapterNumber === currentChapter
    );
    setIsBookmarked(!!bookmark);
  }, [state.bookmarks, novel?.id, currentChapter]);

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

  const toggleBookmark = () => {
    if (isBookmarked) {
      dispatch({ 
        type: 'REMOVE_BOOKMARK', 
        payload: { novelId: novel.id, chapterNumber: currentChapter } 
      });
    } else {
      dispatch({ 
        type: 'ADD_BOOKMARK', 
        payload: { 
          novelId: novel.id,
          novelName: novel.name,
          chapterNumber: currentChapter,
          chapterTitle: `Chapter ${currentChapter}`,
          novelTitle: novel.title,
          bookmarkedAt: new Date().toISOString()
        } 
      });
    }
    setIsBookmarked(!isBookmarked);
  };

  const nextChapter = currentChapter + 1;
  const prevChapter = currentChapter - 1;

  // Sample chapter content
  const chapterContent = `
    This is the beginning of Chapter ${currentChapter} of "${novel.title}".
    
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

    Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

    This concludes Chapter ${currentChapter}. The story continues in the next chapter...
  `;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200"
      >
        <Link 
          to={`/novel/${novelName}`}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back to {novel.title}</span>
        </Link>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked 
                ? 'bg-black text-white hover:bg-gray-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className={`fas fa-bookmark`}></i>
          </button>
        </div>
      </motion.div>

      {/* Chapter Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Chapter {currentChapter}
        </h1>
        <p className="text-gray-600">{novel.title} by {novel.author}</p>
      </motion.div>

      {/* Chapter Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="prose prose-lg max-w-none mb-12"
      >
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          {chapterContent.split('\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="mb-4 leading-relaxed text-gray-800">
                {paragraph.trim()}
              </p>
            )
          ))}
        </div>
      </motion.div>

      {/* Chapter Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between items-center border-t border-gray-200 pt-8"
      >
        <div>
          {prevChapter >= 1 && (
            <Link
              to={`/novel/${novelName}/chapter/${prevChapter}`}
              className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-lg transition-colors"
            >
              <i className="fas fa-chevron-left"></i>
              <span>Previous Chapter</span>
            </Link>
          )}
        </div>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Chapter {currentChapter} of {novel.chapters}
          </p>
        </div>

        <div>
          {nextChapter <= novel.chapters && (
            <Link
              to={`/novel/${novelName}/chapter/${nextChapter}`}
              className="inline-flex items-center space-x-2 bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-lg transition-colors"
            >
              <span>Next Chapter</span>
              <i className="fas fa-chevron-right"></i>
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ChapterPage;