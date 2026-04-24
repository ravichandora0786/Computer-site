import { combineReducers } from '@reduxjs/toolkit';

import commonReducer from '../pages/admin/common/slice';
import courseReducer from '../pages/admin/course/slice';
import courseContentReducer from '../pages/admin/course/courseContentSlice';
import userReducer from '../pages/admin/user/slice';
import courseCategoryReducer from '../pages/admin/courseCategory/slice';
import galleryReducer from '../pages/admin/gallery/slice';
import termsAndConditionsReducer from '../pages/admin/terms/slice';

// Public Pages
import homeReducer from '../pages/user/home/slice';
import aboutReducer from '../pages/user/about/slice';
import contactReducer from '../pages/user/contact/slice';
import faqReducer from '../pages/user/faq/slice';
import publicTermsReducer from '../pages/user/terms/slice';
import policyReducer from '../pages/user/policy/slice';
import coursesReducer from '../pages/user/courses/slice';

// New Admin Imports
import offlineBatchReducer from '../pages/admin/offlineBatch/slice';
import adminFaqReducer from '../pages/admin/faq/slice';
import adminAboutSectionReducer from '../pages/admin/aboutSection/slice';
import adminPrivacyPolicyReducer from '../pages/admin/privacyPolicy/slice';
import adminCourseRatingReducer from '../pages/admin/courseRating/slice';
import adminPlatformRatingReducer from '../pages/admin/platformRating/slice';

import userAuthReducer from '../pages/user/auth/slice';
import profileReducer from '../pages/user/profile/slice';

const rootReducer = combineReducers({
  userAuth: userAuthReducer,
  profileData: profileReducer,
  common: commonReducer,
  courseData: courseReducer,
  courseContent: courseContentReducer,
  userData: userReducer,
  courseCategory: courseCategoryReducer,
  gallery: galleryReducer,
  termsAndConditions: termsAndConditionsReducer,
  offlineBatch: offlineBatchReducer,
  adminFaq: adminFaqReducer,
  adminAboutSection: adminAboutSectionReducer,
  adminPrivacyPolicy: adminPrivacyPolicyReducer,
  adminCourseRating: adminCourseRatingReducer,
  adminPlatformRating: adminPlatformRatingReducer,
  
  // Public
  home: homeReducer,
  about: aboutReducer,
  contact: contactReducer,
  faq: faqReducer,
  terms: publicTermsReducer,
  policy: policyReducer,
  courses: coursesReducer,
});

export default rootReducer;
