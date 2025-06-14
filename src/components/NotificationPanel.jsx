import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNovel } from '../context/NovelContext';

function NotificationPanel({ isOpen, onClose }) {
  const { state, dispatch } = useNovel();

  const markAsRead = (id) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const markAllAsRead = () => {
    state.notifications.forEach(notif => {
      if (!notif.read) {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notif.id });
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-20 z-50"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-16 w-80 max-w-sm bg-white border-l border-gray-200 h-full z-50 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                >
                  Mark all read
                </button>
              </div>

              <div className="space-y-3">
                {state.notifications.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No notifications</p>
                ) : (
                  state.notifications.map(notification => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        notification.read 
                          ? 'bg-gray-50 border-gray-200 text-gray-600' 
                          : 'bg-white border-gray-300 text-black'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <p className="text-sm font-medium mb-1">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default NotificationPanel;