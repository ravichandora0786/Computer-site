import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { MdSupportAgent, MdClose, MdSend, MdEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import clsx from "clsx";

const FloatingActions = () => {
  const { user } = useSelector((state) => state.userAuth);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: user?.user_name || "", 
    email: user?.email || "", 
    message: "" 
  });
  const [sending, setSending] = useState(false);

  // Auto-update form data when user login state changes
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const whatsappNumber = "+1555000STUDIO"; // Replace with real number
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent! Our support team will get back to you.");
      setSending(false);
      setIsSupportOpen(false);
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <div className="fixed bottom-24 right-8 z-[100] flex flex-col gap-4">
      {/* Support Modal Overlay */}
      <AnimatePresence>
        {isSupportOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[320px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="bg-primary p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MdSupportAgent size={24} />
                <span className="font-bold text-sm">Support Center</span>
              </div>
              <button onClick={() => setIsSupportOpen(false)}><MdClose size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase italic">Your Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  disabled={!!user}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Sachin Kataria"
                  className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/20 dark:text-white disabled:opacity-60"
                />
              </div>
              {!user && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase italic">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="hello@example.com"
                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/20 dark:text-white"
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase italic">How can we help?</label>
                <textarea 
                  required
                  rows="3"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="I have a question about..."
                  className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/20 dark:text-white resize-none"
                />
              </div>
              <button 
                type="submit" 
                disabled={sending || !formData.name || !formData.email || !formData.message}
                className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
              >
                {sending ? "Sending..." : <><MdSend /> Send Message</>}
              </button>
              <p className="text-[8px] text-center text-gray-400 uppercase font-medium">Or email us directly at hello@computersite.com</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Support Icon */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsSupportOpen(!isSupportOpen)}
        className={clsx(
          "h-14 w-14 rounded-full flex items-center justify-center shadow-xl transition-colors ring-4 ring-white dark:ring-[#050505]",
          isSupportOpen ? "bg-gray-800 text-white" : "bg-white dark:bg-gray-800 text-primary border border-gray-100 dark:border-gray-700"
        )}
      >
        <MdSupportAgent size={28} />
      </motion.button>

      {/* WhatsApp Icon */}
      <motion.a
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="h-14 w-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-green-500/20 ring-4 ring-white dark:ring-[#050505]"
      >
        <FaWhatsapp size={28} />
      </motion.a>
    </div>
  );
};

export default FloatingActions;
