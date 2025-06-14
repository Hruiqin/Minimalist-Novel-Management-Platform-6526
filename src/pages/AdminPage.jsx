import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNovel } from '../context/NovelContext';
import NovelForm from '../components/NovelForm';
import ChapterForm from '../components/ChapterForm';

function AdminPage() {
  const { state, dispatch } = useNovel();
  const [activeTab, setActiveTab] = useState('novels');
  const [editingNovel, setEditingNovel] = useState(null);
  const [editingChapter, setEditingChapter] = useState(null);

  const handleDeleteNovel = (novelId) => {
    if (window.confirm('Are you sure you want to delete this novel?')) {
      dispatch({ type: 'DELETE_NOVEL', payload: novelId });
    }
  };

  const tabs = [
    { id: 'novels', label: 'Manage Novels', icon: 'fas fa-book' },
    { id: 'chapters', label: 'Manage Chapters', icon: 'fas fa-file-text' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage novels and chapters</p>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className={`${tab.icon} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Novels Tab */}
      {activeTab === 'novels' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Novel Form */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {editingNovel ? 'Edit Novel' : 'Add New Novel'}
            </h3>
            <NovelForm
              novel={editingNovel}
              onSave={(novel) => {
                if (editingNovel) {
                  dispatch({ type: 'UPDATE_NOVEL', payload: novel });
                } else {
                  dispatch({ type: 'ADD_NOVEL', payload: { ...novel, id: Date.now() } });
                }
                setEditingNovel(null);
              }}
              onCancel={() => setEditingNovel(null)}
            />
          </div>

          {/* Novels List */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Existing Novels</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {state.novels.map(novel => (
                <div
                  key={novel.id}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">{novel.title}</h4>
                      <p className="text-gray-600 text-sm">by {novel.author}</p>
                      <p className="text-gray-500 text-xs mt-1">{novel.chapters} chapters</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingNovel(novel)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteNovel(novel.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chapters Tab */}
      {activeTab === 'chapters' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chapter Form */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {editingChapter ? 'Edit Chapter' : 'Add New Chapter'}
            </h3>
            <ChapterForm
              chapter={editingChapter}
              novels={state.novels}
              onSave={(chapter) => {
                if (editingChapter) {
                  dispatch({ type: 'UPDATE_CHAPTER', payload: chapter });
                } else {
                  dispatch({ type: 'ADD_CHAPTER', payload: chapter });
                }
                setEditingChapter(null);
              }}
              onCancel={() => setEditingChapter(null)}
            />
          </div>

          {/* Chapters List */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Existing Chapters</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {state.novels.map(novel => (
                <div key={novel.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{novel.title}</h4>
                  <div className="space-y-2">
                    {Array.from({ length: novel.chapters }, (_, i) => i + 1).map(chapterNum => (
                      <div key={chapterNum} className="flex justify-between items-center text-sm">
                        <span>Chapter {chapterNum}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingChapter({
                              novelId: novel.id,
                              chapterNumber: chapterNum,
                              content: novel.chapterContents?.[chapterNum] || ''
                            })}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this chapter?')) {
                                dispatch({
                                  type: 'DELETE_CHAPTER',
                                  payload: { novelId: novel.id, chapterNumber: chapterNum }
                                });
                              }
                            }}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;