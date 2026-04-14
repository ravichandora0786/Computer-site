import React, { useState, useEffect } from 'react'
import AdminSidebar from './Sidebar'
import { MdNotifications, MdSearch, MdPerson, MdLightMode, MdDarkMode, MdMenu } from 'react-icons/md'

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [toggled, setToggled] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Apply dark class to body for theme variables to switch
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark bg-gray-900' : 'bg-[#f8fafc]'}`}>
      {/* Sidebar - Integrated with Mobile Toggled State */}
      <AdminSidebar
        collapsed={collapsed}
        toggleCollapsed={() => setCollapsed(!collapsed)}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Top Header - High Fidelity Responsive Nav */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 px-4 md:px-8 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setToggled(true)}
              className="md:hidden p-2 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
            >
              <MdMenu size={24} />
            </button>

            <div className="relative group hidden sm:block">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="h-10 w-48 lg:w-64 rounded-xl bg-gray-100 dark:bg-gray-700 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-gray-200 transition-all border-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
            </button>

            <button className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
              <MdNotifications size={22} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-gray-800"></span>
            </button>

            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

            <button className="flex items-center space-x-2 rounded-xl p-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold shadow-sm">
                A
              </div>
              <div className="hidden sm:flex flex-col items-start px-1">
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight">Admin User</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">Super Admin</span>
              </div>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content - High Fidelity Full-Width Wrapper */}
        <main className="p-1 sm:p-1 md:p-2 flex-1">
          <div className="max-w-none mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
