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
    <footer className="bg-white dark:bg-[#050505] border-t border-gray-100 dark:border-gray-800 pt-16 pb-8 selection:bg-primary/20 transition-colors">
      <div className="container max-w-full mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl italic leading-none">C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter text-main dark:text-white">COMPUTER SITE</span>
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase italic">Premium LMS</span>
              </div>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
              Empowering learners globally with high-quality content, expert instructors, and a cutting-edge learning studio.
            </p>
            <div className="flex gap-4">
              {[
                { icon: FaFacebook, link: "https://facebook.com/computersite" },
                { icon: FaTwitter, link: "https://twitter.com/computersite" },
                { icon: FaInstagram, link: "https://instagram.com/computersite" },
                { icon: FaLinkedin, link: "https://linkedin.com/company/computersite" }
              ].map((social, i) => (
                <a key={i} href={social.link} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all">
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Map Preview */}
          <div className="lg:col-span-2 h-48 md:h-full min-h-[180px] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm relative">
            {/* UPDATE MAP URL HERE: Change the src below to your specific Google Maps embed link */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.223391318884!2d77.03923!3d28.502931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19d582e38859%3A0x2cf5e48547100ffc!2sCyber%20City!5e0!3m2!1sen!2sin!4v1713955681234!5m2!1sen!2sin" 
              className="w-full h-full border-0 transition-opacity" 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Studio Location"
            ></iframe>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-main underline decoration-primary decoration-2 underline-offset-8">Get In Touch</h4>
            <div className="flex flex-col gap-4">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=123+Studio+Plaza+Creative+District+NY+10001" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-start gap-3 group"
              >
                <div className="h-8 w-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-sm"><MdLocationOn size={18}/></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold leading-tight pt-1 group-hover:text-primary transition-colors">123 Studio Plaza, Creative District, NY 10001</p>
              </a>
              <a 
                href="mailto:hello@computersite.com"
                className="flex items-center gap-3 group"
              >
                <div className="h-8 w-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-sm"><MdEmail size={18}/></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold group-hover:text-primary transition-colors">hello@computersite.com</p>
              </a>
              <a 
                href="tel:+15550007883"
                className="flex items-center gap-3 group"
              >
                <div className="h-8 w-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-sm"><MdPhone size={18}/></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold group-hover:text-primary transition-colors">+1 (555) 000-STUDIO</p>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
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
