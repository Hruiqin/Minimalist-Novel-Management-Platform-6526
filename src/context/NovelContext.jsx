import React, { createContext, useContext, useReducer, useEffect } from 'react';

const NovelContext = createContext();

const initialState = {
  novels: [
    {
      id: 1,
      name: "shadow-realm",
      title: "Shadow Realm Chronicles",
      author: "Elena Nightwood",
      description: "A dark fantasy epic about a world caught between light and shadow, where ancient powers awaken.",
      chapters: 45,
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop",
      lastUpdated: "2024-01-15",
      tags: ["Fantasy", "Dark", "Adventure"],
      chapterContents: {}
    },
    {
      id: 2,
      name: "digital-dreams",
      title: "Digital Dreams",
      author: "Marcus Chen",
      description: "In a cyberpunk future, hackers navigate virtual worlds while fighting corporate control.",
      chapters: 32,
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop",
      lastUpdated: "2024-01-12",
      tags: ["Sci-Fi", "Cyberpunk", "Thriller"],
      chapterContents: {}
    },
    {
      id: 3,
      name: "whispers-wind",
      title: "Whispers in the Wind",
      author: "Sarah Morrison",
      description: "A romantic tale set in the Scottish Highlands, where love transcends time and mystery.",
      chapters: 28,
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop",
      lastUpdated: "2024-01-10",
      tags: ["Romance", "Historical", "Mystery"],
      chapterContents: {}
    }
  ],
  bookmarks: [],
  readingList: [],
  coins: 150,
  notifications: [
    { id: 1, message: "New chapter available for Shadow Realm Chronicles", time: "2 hours ago", read: false },
    { id: 2, message: "You earned 10 coins for daily reading!", time: "1 day ago", read: false }
  ],
  user: null,
  isAdmin: false
};

function novelReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        isAdmin: action.payload.isAdmin
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAdmin: false
      };
    case 'ADD_NOVEL':
      return {
        ...state,
        novels: [...state.novels, action.payload]
      };
    case 'UPDATE_NOVEL':
      return {
        ...state,
        novels: state.novels.map(novel =>
          novel.id === action.payload.id ? action.payload : novel
        )
      };
    case 'DELETE_NOVEL':
      return {
        ...state,
        novels: state.novels.filter(novel => novel.id !== action.payload)
      };
    case 'ADD_CHAPTER':
      return {
        ...state,
        novels: state.novels.map(novel =>
          novel.id === action.payload.novelId
            ? {
                ...novel,
                chapters: novel.chapters + 1,
                chapterContents: {
                  ...novel.chapterContents,
                  [action.payload.chapterNumber]: action.payload.content
                }
              }
            : novel
        )
      };
    case 'UPDATE_CHAPTER':
      return {
        ...state,
        novels: state.novels.map(novel =>
          novel.id === action.payload.novelId
            ? {
                ...novel,
                chapterContents: {
                  ...novel.chapterContents,
                  [action.payload.chapterNumber]: action.payload.content
                }
              }
            : novel
        )
      };
    case 'DELETE_CHAPTER':
      return {
        ...state,
        novels: state.novels.map(novel =>
          novel.id === action.payload.novelId
            ? {
                ...novel,
                chapters: Math.max(0, novel.chapters - 1),
                chapterContents: Object.keys(novel.chapterContents).reduce((acc, key) => {
                  if (parseInt(key) !== action.payload.chapterNumber) {
                    acc[key] = novel.chapterContents[key];
                  }
                  return acc;
                }, {})
              }
            : novel
        )
      };
    case 'ADD_BOOKMARK':
      return {
        ...state,
        bookmarks: [...state.bookmarks, action.payload]
      };
    case 'REMOVE_BOOKMARK':
      return {
        ...state,
        bookmarks: state.bookmarks.filter(bookmark => 
          !(bookmark.novelId === action.payload.novelId && bookmark.chapterNumber === action.payload.chapterNumber)
        )
      };
    case 'ADD_TO_READING_LIST':
      return {
        ...state,
        readingList: [...state.readingList, action.payload]
      };
    case 'REMOVE_FROM_READING_LIST':
      return {
        ...state,
        readingList: state.readingList.filter(item => item.novelId !== action.payload.novelId)
      };
    case 'SPEND_COINS':
      return {
        ...state,
        coins: Math.max(0, state.coins - action.payload)
      };
    case 'EARN_COINS':
      return {
        ...state,
        coins: state.coins + action.payload
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        )
      };
    case 'LOAD_STATE':
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };
    default:
      return state;
  }
}

export function NovelProvider({ children }) {
  const [state, dispatch] = useReducer(novelReducer, initialState);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('novelAppState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        Object.keys(parsed).forEach(key => {
          dispatch({ type: 'LOAD_STATE', payload: { key, value: parsed[key] } });
        });
      }
    } catch (error) {
      console.error('Failed to load saved state:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('novelAppState', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }, [state]);

  return (
    <NovelContext.Provider value={{ state, dispatch }}>
      {children}
    </NovelContext.Provider>
  );
}

export function useNovel() {
  const context = useContext(NovelContext);
  if (!context) {
    throw new Error('useNovel must be used within a NovelProvider');
  }
  return context;
}