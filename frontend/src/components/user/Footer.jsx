import React from "react";
import { Link } from "react-router-dom";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { title: "Home", path: "/" },
      { title: "About Us", path: "/about" },
      { title: "Courses", path: "/courses" },
      { title: "Instructors", path: "/teachers" },
    ],
    support: [
      { title: "Contact Us", path: "/contact" },
      { title: "Help Center (FAQ)", path: "/faq" },
      { title: "Support Ticket", path: "/support" },
    ],
    legal: [
      { title: "Terms of Service", path: "/terms" },
      { title: "Privacy Policy", path: "/policy" },
      { title: "Cookie Policy", path: "/cookies" },
    ]
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8 selection:bg-primary/20">
      <div className="container max-w-full mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl italic leading-none">C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter text-main">COMPUTER SITE</span>
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase italic">Premium LMS</span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Empowering learners globally with high-quality content, expert instructors, and a cutting-edge learning studio inspired by the world's best institutions.
            </p>
            <div className="flex gap-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="h-10 w-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Links */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div>
              <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-main mb-6 underline decoration-primary decoration-2 underline-offset-8">Platform</h4>
              <ul className="flex flex-col gap-4">
                {footerLinks.platform.map(l => (
                  <li key={l.path}><Link to={l.path} className="text-gray-500 hover:text-primary text-sm font-bold transition-colors">{l.title}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-main mb-6 underline decoration-primary decoration-2 underline-offset-8">Support</h4>
              <ul className="flex flex-col gap-4">
                {footerLinks.support.map(l => (
                  <li key={l.path}><Link to={l.path} className="text-gray-500 hover:text-primary text-sm font-bold transition-colors">{l.title}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-main underline decoration-primary decoration-2 underline-offset-8">Get In Touch</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-primary shrink-0"><MdLocationOn size={18}/></div>
                <p className="text-sm text-gray-500 font-bold leading-tight pt-1">123 Studio Plaza, Creative District, NY 10001</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-primary shrink-0"><MdEmail size={18}/></div>
                <p className="text-sm text-gray-500 font-bold">hello@computersite.com</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-primary shrink-0"><MdPhone size={18}/></div>
                <p className="text-sm text-gray-500 font-bold">+1 (555) 000-STUDIO</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            &copy; {currentYear} Computer Site LMS. Inspired by Excellence.
          <div className="flex gap-6">
            {footerLinks.legal.map(l => (
              <Link key={l.path} to={l.path} className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 hover:text-primary transition-colors">{l.title}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
