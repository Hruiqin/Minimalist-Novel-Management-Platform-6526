import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNovel } from '../context/NovelContext';

function NovelCard({ novel }) {
  const { state, dispatch } = useNovel();
  
  const isInReadingList = state.readingList.some(item => item.novelId === novel.id);

  const toggleReadingList = (e) => {
    e.preventDefault();
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <Link to={`/novel/${novel.name}`}>
        <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
          <img 
            src={novel.image} 
            alt={novel.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/novel/${novel.name}`}>
            <h3 className="font-semibold text-lg hover:text-gray-600 transition-colors">
              {novel.title}
            </h3>
          </Link>
          <button
            onClick={toggleReadingList}
            className={`p-1 rounded transition-colors ${
              isInReadingList 
                ? 'text-black hover:text-gray-600' 
                : 'text-gray-400 hover:text-black'
            }`}
          >
            <i className={`fas fa-list ${isInReadingList ? 'text-black' : ''}`}></i>
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-2">by {novel.author}</p>
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{novel.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{novel.chapters} chapters</span>
          <span>{novel.lastUpdated}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
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
    </motion.div>
  );
}

export default NovelCard;