import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  MdDashboard, MdStars, MdAssignment, MdLibraryBooks, 
  MdDescription, MdAssessment, MdVerified, MdSettings,
  MdHelpOutline, MdCardGiftcard, MdPerson, MdLogout
} from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../pages/user/auth/slice";
import { selectUser } from "../../pages/admin/common/selector";
import clsx from "clsx";

const UserSidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(state => state.userAuth.user);
  
  const menuItems = [
    { name: "Dashboard", path: "/user/dashboard", icon: MdDashboard, badge: null },
    { name: "Your Achievements", path: "/user/achievements", icon: MdStars, badge: "New", badgeColor: "bg-blue-500" },
    { name: "Career Ready Plan", path: "/user/career-plan", icon: MdAssignment, badge: "New", badgeColor: "bg-blue-500" },
    { name: "Create Résumé/CV", path: "/user/resume", icon: MdDescription, badge: "New", badgeColor: "bg-blue-500" },
    { name: "Learner Report", path: "/user/report", icon: MdAssessment, badge: null },
    { name: "Claim Your Certificates", path: "/user/certificates", icon: MdVerified, badge: null },
    { name: "Upgrade To Premium", path: "/user/upgrade", icon: MdStars, badge: null, color: "text-amber-500" },
    { name: "Buy A Gift Card", path: "/user/gift", icon: MdCardGiftcard, badge: null },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
      {/* Profile Section */}
      <div className="p-6 flex flex-col items-center border-bottom border-gray-100">
        <div className="relative group cursor-pointer">
          <div className="w-20 h-20 rounded-full border-2 border-gray-100 p-1">
            <img 
              src={user?.profile_img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover shadow-sm"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md border border-gray-50">
             <MdSettings className="text-gray-400 w-4 h-4" />
          </div>
        </div>
        <h3 className="mt-3 font-semibold text-gray-800 text-center">{user?.user_name || "Guest Student"}</h3>
        <p className="text-xs text-orange-500 font-medium mt-1">Finish Your Profile</p>
        <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
          <div className="w-1/3 h-full bg-orange-400 rounded-full"></div>
        </div>
      </div>

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
                  ? "bg-primary/5 text-primary font-semibold shadow-sm border-l-4 border-primary" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-primary"
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
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200 group mt-1"
        >
          <MdLogout className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
          <span className="text-[13px]">Logout</span>
        </button>
      </div>

      <div className="mt-auto px-3 py-6 border-t border-gray-100">
         <button className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition shadow-md shadow-primary/10">
            <MdDashboard />
            Continue Learning
         </button>
      </div>
    </div>
  );
};

export default UserSidebar;
