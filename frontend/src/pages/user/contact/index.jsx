import React from "react";
import { MdEmail, MdPhone, MdLocationOn, MdSend } from "react-icons/md";

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Info Column */}
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="text-4xl font-black text-main tracking-tight mb-4 italic underline decoration-primary decoration-4 underline-offset-8">Let's Connect</h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              Have questions about a course or looking to join our team of instructors? Our support team is here to help you navigate your journey.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
               <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary shrink-0"><MdLocationOn size={24}/></div>
               <div>
                  <h4 className="font-bold text-main uppercase text-xs tracking-widest mb-1">Our Studio</h4>
                  <p className="text-gray-500 text-sm font-medium">123 Studio Plaza, Creative District, NY 10001</p>
               </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
               <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary shrink-0"><MdEmail size={24}/></div>
               <div>
                  <h4 className="font-bold text-main uppercase text-xs tracking-widest mb-1">Drop a Line</h4>
                  <p className="text-gray-500 text-sm font-medium">hello@computersite.com</p>
               </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
               <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary shrink-0"><MdPhone size={24}/></div>
               <div>
                  <h4 className="font-bold text-main uppercase text-xs tracking-widest mb-1">Call Support</h4>
                  <p className="text-gray-500 text-sm font-medium">+1 (555) 000-STUDIO</p>
               </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="p-8 md:p-12 rounded-[40px] bg-white border border-gray-100 shadow-2xl relative">
          <div className="absolute top-0 right-10 -translate-y-1/2 h-16 w-16 bg-primary rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center text-white rotate-12">
            <MdSend size={32} />
          </div>
          <h3 className="text-2xl font-black text-main tracking-tight mb-8">Send Us a Message</h3>
          <form className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary px-1">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary px-1">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary px-1">Subject</label>
              <input type="text" placeholder="Inquiry about Graphic Design course" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary px-1">Your Message</label>
              <textarea placeholder="Tell us how we can help..." rows={4} className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm" />
            </div>
            <button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all active:scale-95 mt-4">
              Send Message Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
