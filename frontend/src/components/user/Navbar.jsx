import React from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

const Navbar = ({ isScrolled, isMobile = false, onItemClick }) => {
  const location = useLocation();

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Courses", path: "/courses" },
    { title: "About", path: "/about" },
    { title: "Contacts", path: "/contact" },
    { title: "Terms & Conditions", path: "/terms" },
    { title: "Policy", path: "/policy" },
    { title: "FAQ", path: "/faq" },
  ];

  const desktopClasses = clsx(
    "flex items-center gap-8",
    isScrolled ? "text-gray-600" : "text-main/80"
  );

  const mobileClasses = "flex flex-col gap-2";

  return (
    <nav className={isMobile ? mobileClasses : desktopClasses}>
      {navLinks.map((link) => {
        const isActive = location.pathname === link.path;
        return (
          <Link
            key={link.path}
            to={link.path}
            onClick={onItemClick}
            className={clsx(
              "relative text-[11px] font-black uppercase tracking-widest transition-all hover:text-primary",
              isActive ? "text-primary" : "text-inherit",
              isMobile ? "py-3 px-4 rounded-xl hover:bg-gray-50 bg-gray-50/10" : "px-1"
            )}
          >
            {link.title}
            {!isMobile && isActive && (
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary rounded-full scale-x-100" />
            )}
            {!isMobile && !isActive && (
              <span className="absolute -bottom-1 left-0 right-1 h-[2px] bg-primary rounded-full scale-x-0 transition-transform origin-left group-hover:scale-x-100" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
