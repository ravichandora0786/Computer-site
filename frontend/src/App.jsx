import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'
import FullScreenLoader from './components/ui/FullScreenLoader'
import { selectScreenLoader } from './pages/admin/common/selector'

// Layouts and Pages
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import OfflineBatchList from "./pages/admin/offlineBatch/OfflineBatchList";
import AddUpdateOfflineBatch from "./pages/admin/offlineBatch/AddUpdateOfflineBatch";

// New Admin Imports
import FAQList from "./pages/admin/faq/FAQList";
import AddUpdateFAQ from "./pages/admin/faq/AddUpdateFAQ";
import AboutSectionList from "./pages/admin/aboutSection/AboutSectionList";
import AddUpdateAboutSection from "./pages/admin/aboutSection/AddUpdateAboutSection";
import PolicyList from "./pages/admin/privacyPolicy/PolicyList";
import AddUpdatePolicy from "./pages/admin/privacyPolicy/AddUpdatePolicy";
import CourseRatingList from "./pages/admin/courseRating/CourseRatingList";
import PlatformRatingList from "./pages/admin/platformRating/PlatformRatingList";
import CourseList from './pages/admin/course/CourseList'
import AddUpdateCourse from './pages/admin/course/AddUpdateCourse'
import ViewCourse from './pages/admin/course/ViewCourse'
import CourseContentManager from './pages/admin/course/CourseContentManager'
import GalleryList from './pages/admin/gallery/GalleryList'
import UserList from './pages/admin/user/UserList'
import CourseCategoryList from './pages/admin/courseCategory/CourseCategoryList'
import AddUpdateCourseCategory from './pages/admin/courseCategory/AddUpdateCourseCategory'
import AdminLogin from './pages/admin/auth/Login'
import TermsList from './pages/admin/terms/TermsList'
import AddUpdateTerms from './pages/admin/terms/AddUpdateTerms'
import PrivateRoute from './routes/PrivateRoute'

// Public Layout and Pages
import UserLayout from './components/user/UserLayout'
import HomePage from './pages/user/home'
import AboutPage from './pages/user/about'
import ContactPage from './pages/user/contact'
import FAQPage from './pages/user/faq'
import PublicTermsPage from './pages/user/terms'
import PolicyPage from './pages/user/policy'
import CoursesPage from './pages/user/courses'
import CourseDetail from './pages/user/courses/CourseDetail'

function App() {
  const isFullScreenLoading = useSelector(selectScreenLoader)

  return (
    <>
      <FullScreenLoader show={isFullScreenLoading} />
      <Routes>
        {/* Isolated Auth Routes for Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Routes with Layout */}
        <Route path="/admin/*" element={
          <PrivateRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="courses" element={<CourseList />} />
                <Route path="courses/add" element={<AddUpdateCourse />} />
                <Route path="courses/view/:id" element={<ViewCourse />} />
                <Route path="courses/edit/:id" element={<AddUpdateCourse />} />
                <Route path="courses/content/:id" element={<CourseContentManager />} />
                <Route path="course-categories" element={<CourseCategoryList />} />
                <Route path="course-categories/add" element={<AddUpdateCourseCategory />} />
                <Route path="course-categories/edit/:id" element={<AddUpdateCourseCategory />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/gallery" element={<GalleryList />} />
                <Route path="/terms" element={<TermsList />} />
                <Route path="/terms/add" element={<AddUpdateTerms />} />
                <Route path="/terms/edit/:id" element={<AddUpdateTerms />} />

                <Route path="batches" element={<OfflineBatchList />} />
                <Route path="batches/add" element={<AddUpdateOfflineBatch />} />
                <Route path="batches/edit/:id" element={<AddUpdateOfflineBatch />} />

                {/* Support & Legal */}
                <Route path="faqs" element={<FAQList />} />
                <Route path="faqs/add" element={<AddUpdateFAQ />} />
                <Route path="faqs/edit/:id" element={<AddUpdateFAQ />} />

                <Route path="about-sections" element={<AboutSectionList />} />
                <Route path="about-sections/add" element={<AddUpdateAboutSection />} />
                <Route path="about-sections/edit/:id" element={<AddUpdateAboutSection />} />

                <Route path="privacy-policies" element={<PolicyList />} />
                <Route path="privacy-policies/add" element={<AddUpdatePolicy />} />
                <Route path="privacy-policies/edit/:id" element={<AddUpdatePolicy />} />

                <Route path="course-ratings" element={<CourseRatingList />} />
                <Route path="platform-ratings" element={<PlatformRatingList />} />
              </Routes>
            </AdminLayout>
          </PrivateRoute>
        } />

        {/* User Routes wrapped in UserLayout (Catch-all for all other paths) */}
        <Route path="/*" element={
          <UserLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/course-detail/:id" element={<CourseDetail />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/terms" element={<PublicTermsPage />} />
              <Route path="/policy" element={<PolicyPage />} />
            </Routes>
          </UserLayout>
        } />
      </Routes>
      <ToastContainer position="bottom-right" />
    </>
  )
}

export default App
