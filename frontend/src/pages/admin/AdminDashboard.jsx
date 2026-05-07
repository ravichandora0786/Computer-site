import React from 'react'
import DashboardStats from '../../components/admin/DashboardStats'
import EnrollmentHistory from './enrollment/EnrollmentHistory'

const AdminDashboard = () => {
  return (
    <div className="space-y-10 p-4 md:p-8">
      {/* Welcome Header */}
      <div className="relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.5)]" />
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-none">
          Command Center
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold uppercase italic text-[10px] tracking-[0.3em] mt-2 ml-1">
          EduAdmin Ecosystem Overview
        </p>
      </div>

      {/* Main Stats Panel */}
      <DashboardStats />

      {/* Enrollment History Table */}
      <EnrollmentHistory title="Recent Activity" />
    </div>
  )
}

export default AdminDashboard
