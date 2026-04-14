import React from 'react'
import { MdTrendingUp, MdPeople, MdSchool, MdAttachMoney } from 'react-icons/md'

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
  <div className="flex items-center p-6 bg-white rounded-2xl border border-gray-100 transition-all hover:shadow-md">
    <div className={`p-4 rounded-xl ${colorClass} bg-opacity-10 mr-5`}>
      <Icon className={`text-3xl ${colorClass.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-xs font-semibold text-green-500 mt-1 flex items-center">
        <MdTrendingUp className="mr-1" /> {trend}
      </p>
    </div>
  </div>
)

const RecentCourses = () => {
  const courses = [
    { id: 1, title: 'Mastering React 19', category: 'Development', students: 1250, status: 'Active' },
    { id: 2, title: 'Tailwind CSS v4 Advanced', category: 'Design', students: 840, status: 'Active' },
    { id: 3, title: 'Node.js Backend Mastery', category: 'Development', students: 2100, status: 'Active' },
    { id: 4, title: 'Data Structures with JS', category: 'Education', students: 560, status: 'Draft' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mt-8">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Recent Courses</h3>
        <button className="text-sm font-semibold text-primary hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Course Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Students</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{course.title}</td>
                <td className="px-6 py-4 text-gray-600">{course.category}</td>
                <td className="px-6 py-4 text-gray-600">{course.students.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${course.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                    {course.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-primary p-2">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const AdminDashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back, Admin!</h1>
        <p className="text-gray-500">Here's what's happening with your courses today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Courses" value="24" icon={MdSchool} trend="+4.5%" colorClass="bg-blue-500" />
        <StatCard title="Active Students" value="12,450" icon={MdPeople} trend="+12.2%" colorClass="bg-purple-500" />
        <StatCard title="Total Revenue" value="$42,850" icon={MdAttachMoney} trend="+8.1%" colorClass="bg-green-500" />
        <StatCard title="Overall Rating" value="4.8/5" icon={MdTrendingUp} trend="+0.3%" colorClass="bg-orange-500" />
      </div>

      <RecentCourses />
    </div>
  )
}

export default AdminDashboard
