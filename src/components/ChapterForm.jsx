import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function ChapterForm({ chapter, novels, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    novelId: '',
    chapterNumber: 1,
    content: ''
  });

  useEffect(() => {
    if (chapter) {
      setFormData(chapter);
    }
  }, [chapter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'novelId' || name === 'chapterNumber' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    
    // Reset form if adding new chapter
    if (!chapter) {
      setFormData({
        novelId: '',
        chapterNumber: 1,
        content: ''
      });
    }
  };

  const selectedNovel = novels.find(n => n.id === formData.novelId);
  const nextChapterNumber = selectedNovel ? selectedNovel.chapters + 1 : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-6"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Novel
          </label>
          <select
            name="novelId"
            value={formData.novelId}
            onChange={handleChange}
            required
            disabled={!!chapter}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black disabled:bg-gray-100"
          >
            <option value="">Select a novel</option>
            {novels.map(novel => (
              <option key={novel.id} value={novel.id}>
                {novel.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chapter Number
          </label>
          <input
            type="number"
            name="chapterNumber"
            value={formData.chapterNumber}
            onChange={handleChange}
            required
            min="1"
            disabled={!!chapter}
            placeholder={chapter ? '' : `Suggested: ${nextChapterNumber}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black disabled:bg-gray-100"
          />
          {!chapter && selectedNovel && (
            <p className="text-sm text-gray-500 mt-1">
              Next chapter for "{selectedNovel.title}" would be: {nextChapterNumber}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chapter Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
            placeholder="Write your chapter content here..."
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
          >
            <i className="fas fa-save mr-2"></i>
            {chapter ? 'Update Chapter' : 'Add Chapter'}
          </button>
          {chapter && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
}

export default ChapterForm;