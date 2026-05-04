import React, { useState, useEffect } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { Link, useLocation } from 'react-router-dom'
import {
  MdDashboard,
  MdSchool,
  MdPeople,
  MdCategory,
  MdSettings,
  MdLogout,
  MdMenu,
  MdClose,
  MdList,
  MdAddCircleOutline,
  MdCollections,
  MdGavel,
  MdHelpOutline,
  MdInfoOutline,
  MdPolicy,
  MdStarOutline,
  MdReviews,
  MdVerified
} from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { logoutApp } from '../../pages/admin/common/slice'
import LogoutModal from '../ui/modal/logout'

const AdminSidebar = ({ collapsed, toggleCollapsed, toggled, onBackdropClick }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true)
  }

  const handleConfirmLogout = () => {
    dispatch(logoutApp())
    setIsLogoutModalOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex h-full min-h-screen border-r border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={onBackdropClick}
        breakPoint="md"
        backgroundColor="var(--bg-sidebar)"
        transitionDuration={400}
        width="260px"
        rootStyles={{
          color: 'var(--text-sidebar)',
          height: '100%'
        }}
      >
        {/* Brand/Logo Area */}
        <div className="flex items-center justify-between p-6 mb-2">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-primary/30 transition-all">
                E
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">EduAdmin</h2>
            </div>
          )}
          <button
            onClick={toggleCollapsed}
            className="p-1.5 rounded-lg bg-white/5 text-white hover:bg-primary/20 hover:text-primary transition-all duration-300"
          >
            {collapsed ? <MdMenu size={20} /> : <MdClose size={20} />}
          </button>
        </div>

        <Menu
          menuItemStyles={{
            button: ({ level, active, disabled }) => {
              return {
                color: active ? '#ffffff' : 'var(--text-sidebar)',
                backgroundColor: active ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                borderRadius: '0.75rem',
                margin: '0 1rem',
                paddingLeft: level === 0 ? '1rem' : '1.5rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                },
                [`&.active`]: {
                  color: 'var(--color-primary)',
                  fontWeight: '600',
                  backgroundColor: 'rgba(63, 210, 199, 0.1)',
                },
              };
            },
            label: ({ level }) => ({
              fontWeight: level === 0 ? '500' : '400',
              fontSize: '0.9rem',
              marginLeft: '0.5rem',
            }),
            icon: {
              fontSize: '1.25rem',
              minWidth: '35px',
            },
            subMenuContent: {
              backgroundColor: 'transparent',
              marginLeft: '0.5rem',
            },
          }}
        >
          <MenuItem
            icon={<MdDashboard />}
            component={<Link to="/admin" />}
            active={isActive('/admin')}
          >
            Dashboard
          </MenuItem>

          <SubMenu
            icon={<MdSchool />}
            label="Courses"
            defaultOpen={location.pathname.includes('/admin/course')}
          >
            <MenuItem
              icon={<MdList />}
              component={<Link to="/admin/courses" />}
              active={isActive('/admin/courses')}
            >
              All Courses
            </MenuItem>
            <MenuItem
              icon={<MdAddCircleOutline />}
              component={<Link to="/admin/courses/add" />}
              active={isActive('/admin/courses/add')}
            >
              Add New
            </MenuItem>
            <MenuItem
              icon={<MdCategory />}
              component={<Link to="/admin/course-categories" />}
              active={isActive('/admin/course-categories')}
            >
              Categories
            </MenuItem>
          </SubMenu>

          <MenuItem
            icon={<MdCollections />}
            component={<Link to="/admin/gallery" />}
            active={isActive('/admin/gallery')}
          >
            Gallery
          </MenuItem>

          <MenuItem
            icon={<MdPeople />}
            component={<Link to="/admin/users" />}
            active={isActive('/admin/users')}
          >
            Users
          </MenuItem>

          <MenuItem
            icon={<MdVerified />}
            component={<Link to="/admin/certificates" />}
            active={isActive('/admin/certificates')}
          >
            Certificates
          </MenuItem>

          <MenuItem
            icon={<MdGavel />}
            component={<Link to="/admin/terms" />}
            active={isActive('/admin/terms')}
          >
            Terms & Policy
          </MenuItem>

          <SubMenu
            icon={<MdReviews />}
            label="Reviews"
            defaultOpen={location.pathname.includes('/rating')}
          >
            <MenuItem
              icon={<MdStarOutline />}
              component={<Link to="/admin/platform-ratings" />}
              active={isActive('/admin/platform-ratings')}
            >
              Platform
            </MenuItem>
            <MenuItem
              icon={<MdReviews />}
              component={<Link to="/admin/course-ratings" />}
              active={isActive('/admin/course-ratings')}
            >
              Courses
            </MenuItem>
          </SubMenu>

          <SubMenu
            icon={<MdSettings />}
            label="Governance"
            defaultOpen={location.pathname.includes('/admin/faq') || location.pathname.includes('/admin/about') || location.pathname.includes('/admin/privacy')}
          >
            <MenuItem
              icon={<MdHelpOutline />}
              component={<Link to="/admin/faqs" />}
              active={isActive('/admin/faqs')}
            >
              FAQs
            </MenuItem>
            <MenuItem
              icon={<MdInfoOutline />}
              component={<Link to="/admin/about-sections" />}
              active={isActive('/admin/about-sections')}
            >
              About Sections
            </MenuItem>
            <MenuItem
              icon={<MdPolicy />}
              component={<Link to="/admin/privacy-policies" />}
              active={isActive('/admin/privacy-policies')}
            >
              Privacy Policies
            </MenuItem>
          </SubMenu>

          <MenuItem
            icon={<MdSettings />}
            component={<Link to="/admin/settings" />}
            active={isActive('/admin/settings')}
          >
            Settings
          </MenuItem>

          {/* Logout Section */}
          <div className="mt-10 border-t border-white/5 pt-6 mx-4">
            <MenuItem
              icon={<MdLogout />}
              onClick={handleLogoutClick}
              rootStyles={{
                marginTop: '1rem',
                '&:hover': {
                  color: '#ef4444',
                }
              }}
              className="rounded-xl transition-all duration-300"
            >
              Logout
            </MenuItem>
          </div>
        </Menu>
      </Sidebar>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  )
}

export default AdminSidebar
