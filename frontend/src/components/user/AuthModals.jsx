import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { MdClose, MdEmail, MdLock, MdPerson, MdPhone, MdWc, MdCalendarToday } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  closeLoginModal,
  closeSignupModal,
  openLoginModal,
  openSignupModal,
  userLoginRequest,
  userRegisterRequest,
} from "../../pages/user/auth/slice";
import LoadingButton from "../ui/LoadingButton";

import { useNavigate } from "react-router-dom";

const AuthModals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoginModalOpen, isSignupModalOpen, loading, error } = useSelector((state) => state.userAuth);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ user_name: "", email: "", password: "" });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(userLoginRequest({ 
      data: loginForm,
      onSuccess: () => navigate("/user/dashboard")
    }));
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    dispatch(userRegisterRequest({ 
      data: signupForm,
      onSuccess: () => navigate("/user/dashboard")
    }));
  };

  const switchToSignup = () => {
    dispatch(openSignupModal());
  };

  const switchToLogin = () => {
    dispatch(openLoginModal());
  };

  return (
    <>
      {/* Login Modal */}
      <Transition appear show={isLoginModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <Dialog.Title as="h3" className="text-3xl font-black text-main uppercase italic tracking-tight">
                        Welcome Back
                      </Dialog.Title>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Sign in to your learning hub</p>
                    </div>
                    <button
                      onClick={() => dispatch(closeLoginModal())}
                      className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                      <MdClose size={20} />
                    </button>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold italic">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div>
                      <div className="relative">
                        <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          placeholder="Email Address"
                          required
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="password"
                          placeholder="Password"
                          required
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button type="button" className="text-xs font-bold text-primary hover:text-main italic transition-colors">
                        Forgot Password?
                      </button>
                    </div>

                    <LoadingButton
                      type="submit"
                      loading={loading}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-lg hover:-translate-y-0.5 transition-all italic"
                    >
                      Sign In
                    </LoadingButton>

                    <div className="text-center mt-6">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Don't have an account?{" "}
                        <button type="button" onClick={switchToSignup} className="text-primary hover:text-main italic ml-1">
                          Sign Up
                        </button>
                      </p>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Signup Modal */}
      <Transition appear show={isSignupModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <Dialog.Title as="h3" className="text-3xl font-black text-main uppercase italic tracking-tight">
                        Start Learning
                      </Dialog.Title>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Join the community today</p>
                    </div>
                    <button
                      onClick={() => dispatch(closeSignupModal())}
                      className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                      <MdClose size={20} />
                    </button>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold italic">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSignupSubmit} className="space-y-5">
                    <div>
                      <div className="relative">
                        <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="Full Name"
                          required
                          value={signupForm.user_name}
                          onChange={(e) => setSignupForm({ ...signupForm, user_name: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          placeholder="Email Address"
                          required
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="password"
                          placeholder="Password"
                          required
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="relative">
                        <MdPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={signupForm.phone}
                          onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <MdWc className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select
                          value={signupForm.gender}
                          onChange={(e) => setSignupForm({ ...signupForm, gender: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium appearance-none text-gray-500"
                        >
                          <option value="">Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="relative">
                        <MdCalendarToday className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="Date of Birth"
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => (!e.target.value ? (e.target.type = "text") : null)}
                          value={signupForm.date_of_birth}
                          onChange={(e) => setSignupForm({ ...signupForm, date_of_birth: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium text-gray-500"
                        />
                      </div>
                    </div>

                    <LoadingButton
                      type="submit"
                      loading={loading}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-lg hover:-translate-y-0.5 transition-all italic mt-2"
                    >
                      Create Account
                    </LoadingButton>

                    <div className="text-center mt-6">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Already have an account?{" "}
                        <button type="button" onClick={switchToLogin} className="text-primary hover:text-main italic ml-1">
                          Sign In
                        </button>
                      </p>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AuthModals;
