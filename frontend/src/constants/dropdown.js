/**
 * Dropdown Options Constants
 */

// Generic Status (can be used for Modules/Lessons if needed later)
export const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'hidden', label: 'Hidden' }
];

// Specific Status for Batches
export const BATCH_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'hidden', label: 'Hidden' }
];

// Specific Status for Courses
export const COURSE_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'coming soon', label: 'Coming Soon' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' }
];

// Specific Status for Lesson Pages
export const PAGE_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'hidden', label: 'Hidden' }
];

// Media Type Options for AddUpdateCourse Studio Media
export const COURSE_MEDIA_TYPE_OPTIONS = [
  { value: 'image', label: 'Still Asset (Img)' },
  { value: 'video', label: 'Motion Concept (Vid)' },
  { value: 'youtube', label: 'External Link (YT)' }
];

export const COURSE_ACCESS_OPTIONS = [
  { value: 'Free', label: 'Free' },
  { value: 'Paid', label: 'Paid' }
];

export const COURSE_LEVEL_OPTIONS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' }
];

export const COURSE_TYPE_OPTIONS = [
  { value: 'Course', label: 'Course' },
  { value: 'Digital Asset', label: 'Digital Asset' }
];

// Question Type Options for Tests
export const QUESTION_TYPE_OPTIONS = [
  { value: 'single_choice', label: 'Single Choice' },
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'true_false', label: 'True / False' }
];

// Gallery Specific Options
export const GALLERY_CATEGORY_OPTIONS = [
  { value: 'building', label: 'Building' },
  { value: 'students', label: 'Students' },
  { value: 'classroom', label: 'Classroom' },
  { value: 'events', label: 'Events' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'other', label: 'Other' }
];

export const GALLERY_TYPE_OPTIONS = [
  { value: 'image', label: 'Still Asset (Img)' },
  { value: 'video', label: 'Motion Concept (Vid)' },
  { value: 'youtube', label: 'External Link (YT)' }
];

// User Management Options
export const USER_TYPE_FILTER_OPTIONS = [
  { value: '', label: 'All Users' },
  { value: 'student', label: 'Student' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'admin', label: 'Admin' }
];

// Table Pagination Options
export const PAGINATION_LIMIT_OPTIONS = [
  { value: 10, label: '10' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 100, label: '100' }
];

export const GALLERY_PAGINATION_LIMIT_OPTIONS = [
  { value: 12, label: '12' },
  { value: 24, label: '24' },
  { value: 48, label: '48' },
  { value: 96, label: '96' }
];
