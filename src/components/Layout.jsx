import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNovel } from '../context/NovelContext';
import NotificationPanel from './NotificationPanel';

function Layout({ children }) {
  const location = useLocation();
  const { state, dispatch } = useNovel();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadNotifications = state.notifications.filter(n => !n.read).length;

  const navItems = [
    { path: '/', label: 'Home', icon: 'fas fa-home' },
    { path: '/bookmarks', label: 'Bookmarks', icon: 'fas fa-bookmark' },
    { path: '/reading-list', label: 'Reading List', icon: 'fas fa-list' }
  ];

  if (state.isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin', icon: 'fas fa-cog' });
  }

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    setShowMobileMenu(false);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <i className="fas fa-book text-2xl"></i>
              <span className="text-xl font-bold">NovelHub</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Coins */}
              {state.user && (
                <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
                  <i className="fas fa-coins text-yellow-500"></i>
                  <span className="font-medium">{state.coins}</span>
                </div>
              )}

              {/* User Info */}
              {state.user ? (
                <>
                  {/* Notifications */}
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <i className="fas fa-bell text-lg"></i>
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>

                  {/* User Menu */}
                  <div className="hidden md:flex items-center space-x-3">
                    <span className="text-gray-600">Welcome, {state.user.username}</span>
                    <button
                      onClick={handleLogout}
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      <i className="fas fa-sign-out-alt"></i>
                    </button>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <i className={`fas ${showMobileMenu ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white"
            >
              <nav className="px-4 py-4 space-y-2">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                ))}
                
                {state.user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-gray-600 hover:text-black hover:bg-gray-100 w-full"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-gray-600 hover:text-black hover:bg-gray-100"
                    >
                      <i className="fas fa-sign-in-alt"></i>
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md transition-colors bg-black text-white"
                    >
                      <i className="fas fa-user-plus"></i>
                      <span>Register</span>
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}

export default Layout;