import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  MdDashboard, MdStars, MdAssignment, MdLibraryBooks, 
  MdDescription, MdAssessment, MdVerified, MdSettings,
  MdHelpOutline, MdCardGiftcard, MdPerson, MdLogout,
  MdEdit
} from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../pages/user/auth/slice";
import { selectUser } from "../../pages/admin/common/selector";
import clsx from "clsx";

const UserSidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, dashboardStats } = useSelector(state => state.userAuth);
  
  const lastCourse = dashboardStats?.enrolledCourses?.[0];

  const handleContinue = () => {
    if (lastCourse?.courseId) {
      navigate(`/course-detail/${lastCourse.courseId}`);
    } else {
      navigate("/user/dashboard");
    }
  };
  
  const menuItems = [
    { name: "Dashboard", path: "/user/dashboard", icon: MdDashboard, badge: null },
    { name: "Courses", path: "/user/courses", icon: MdLibraryBooks, badge: null },
    { name: "My Courses", path: "/user/my-courses", icon: MdLibraryBooks, badge: null },
    { name: "Learner Report", path: "/user/report", icon: MdAssessment, badge: null },
    { name: "Claim Your Certificates", path: "/user/certificates", icon: MdVerified, badge: null },
  ];

  const profileCompletion = dashboardStats?.profileCompletion || 0;

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-colors">
      {/* Profile Section */}
      <Link 
        to="/user/profile"
        className="p-6 flex flex-col items-center border-b border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50 group"
      >
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-2 border-gray-100 dark:border-gray-800 p-1 group-hover:border-primary transition-colors">
            <img 
              src={user?.profile_img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover shadow-sm"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 p-1 rounded-full shadow-md border border-gray-50 dark:border-gray-700 text-gray-400 group-hover:text-primary transition-colors">
             <MdEdit className="w-4 h-4" />
          </div>
        </div>
        <h3 className="mt-3 font-semibold text-gray-800 dark:text-white text-center group-hover:text-primary transition-colors">{user?.user_name || "Guest Student"}</h3>
        <p className="text-xs text-orange-500 font-medium mt-1">
          {profileCompletion === 100 ? "Profile Complete" : "Finish Your Profile"}
        </p>
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-orange-400 rounded-full transition-all duration-1000"
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
      </Link>

      <div className="px-3 py-4 flex flex-col gap-1">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Primary Menu</p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                "flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-primary/5 dark:bg-primary/10 text-primary font-semibold shadow-sm border-l-4 border-primary" 
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={clsx("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-gray-400 group-hover:text-primary")} />
                <span className="text-[13px]">{item.name}</span>
              </div>
              {item.badge && (
                <span className={clsx("text-[9px] px-1.5 py-0.5 rounded text-white font-bold uppercase", item.badgeColor)}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Logout Item */}
        <button
          onClick={() => dispatch(userLogout())}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 group mt-1"
        >
          <MdLogout className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
          <span className="text-[13px]">Logout</span>
        </button>
      </div>

      <div className="mt-auto px-3 py-6 border-t border-gray-100 dark:border-gray-800">
         <button 
           onClick={handleContinue}
           className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition shadow-md shadow-primary/10"
         >
            <MdDashboard />
            Continue Learning
         </button>
      </div>
    </div>
  );
};

export default UserSidebar;
