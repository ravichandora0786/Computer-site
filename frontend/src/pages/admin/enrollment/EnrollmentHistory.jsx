import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  MdSearch, MdTrendingUp
} from "react-icons/md";
import { httpRequest } from "@/request";
import endPoints from "@/request/endpoints";
import DataTable from "@/components/ui/DataTable";
import { formatDate } from "@/utils/commonFunctions";

const EnrollmentHistory = ({ title = "Recent Enrollments" }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchEnrollments();
    fetchCourses();
  }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await httpRequest.get(endPoints.UserCourseList);
      setEnrollments(response.data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await httpRequest.get(endPoints.CourseList);
      setCourses(response.data?.items || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const filteredEnrollments = useMemo(() => {
    return (enrollments || []).filter(item => {
      const matchesSearch = 
        item.user?.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.course?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCourse = filterCourse === "all" || item.courseId === filterCourse;
      
      return matchesSearch && matchesCourse;
    });
  }, [enrollments, searchTerm, filterCourse]);

  const columns = useMemo(() => [
    {
      header: "Student Details",
      accessorKey: "user.user_name",
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 font-black italic text-xs">
            {row.original.user?.user_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-black text-gray-800 dark:text-white uppercase italic">{row.original.user?.user_name}</p>
            <p className="text-[9px] text-gray-500 font-medium">{row.original.user?.email}</p>
          </div>
        </div>
      )
    },
    {
      header: "Course",
      accessorKey: "course.title",
      cell: ({ row }) => (
        <p className="text-xs font-black text-primary uppercase italic">{row.original.course?.title}</p>
      )
    },
    {
      header: "Progress",
      accessorKey: "progress",
      cell: ({ row }) => (
        <div className="w-full max-w-[100px]">
          <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${row.original.progress}%` }}
              className={`h-full rounded-full ${row.original.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
            />
          </div>
          <span className="text-[9px] font-black text-gray-400 italic mt-1 block">{row.original.progress}%</span>
        </div>
      )
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <p className="text-[10px] font-black text-gray-500 uppercase italic">
          {formatDate(row.original.createdAt)}
        </p>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase italic tracking-widest ${
          row.original.status === 'active' ? 'bg-emerald-50 text-emerald-500' :
          'bg-gray-50 text-gray-400'
        }`}>
          {row.original.status}
        </span>
      )
    }
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-gray-800 dark:text-white uppercase italic tracking-tight flex items-center gap-3">
             <div className="w-2 h-8 bg-primary rounded-full" />
             {title}
          </h2>
          <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                  <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                      type="text" 
                      placeholder="Search student or course..."
                      className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold uppercase italic focus:ring-2 focus:ring-primary/20 transition-all w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <select 
                  className="pl-4 pr-10 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-[10px] font-black uppercase italic appearance-none"
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
              >
                  <option value="all">All Courses</option>
                  {(courses || []).map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
              </select>
          </div>
      </div>

      <DataTable 
        columns={columns}
        data={filteredEnrollments}
        isLoading={loading}
      />
    </div>
  );
};

export default EnrollmentHistory;
