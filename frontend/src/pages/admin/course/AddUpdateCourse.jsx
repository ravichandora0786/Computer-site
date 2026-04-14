import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, FieldArray } from "formik";
import { MdAdd, MdDelete, MdCloudUpload, MdLink, MdPlayCircle } from "react-icons/md";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import RenderFields from "../../../components/ui/renderFields";
import LoadingButton from "../../../components/ui/LoadingButton";
import SelectDropDown from "../../../components/ui/selectDropDown";
import { COURSE_MEDIA_TYPE_OPTIONS } from "../../../constants/dropdown";
import { httpRequest } from "@/request";
import { endPoints } from "../../../request";
import { createCourse, updateCourse } from "./slice";

const AddUpdateCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = !!id;
  const [activeTab, setActiveTab] = useState("general");
  const [previewItem, setPreviewItem] = useState(null);

  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    status: "draft",
    publish_date: "",
    course_category_id: "",
    author: "",
    media: [],
    course_level: "beginner",
    expire_date: "",
    course_mode: "Online",
    access_type: "Free",
    duration_month: 0,
    monthly_amount: 0,
    yearly_amount: 0,
    fixed_amount: 0,
    discount_amount: 0,
    discount_percentage: 0,
    overview: "",
  });

  const [categories, setCategories] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMetadata();
    if (isEditMode) {
      fetchCourseDetails();
    } else {
      // Reset to blank canvas for new studio concept
      setInitialValues({
        title: "",
        description: "",
        status: "draft",
        publish_date: "",
        course_category_id: "",
        author: "",
        media: [],
        course_level: "beginner",
        expire_date: "",
        course_mode: "Online",
        access_type: "Free",
        duration_month: 0,
        monthly_amount: 0,
        yearly_amount: 0,
        fixed_amount: 0,
        discount_amount: 0,
        discount_percentage: 0,
        overview: "",
      });
      setActiveTab("general");
    }
  }, [id]);

  const fetchMetadata = async () => {
    try {
      const [catRes, teachRes] = await Promise.all([
        httpRequest.get(endPoints.CourseCategoryOptions),
        httpRequest.get(endPoints.UserOptions),
      ]);
      setCategories(catRes?.data || []);
      setTeachers(teachRes?.data || []);
    } catch (error) {
      console.error("Failed to fetch metadata", error);
    }
  };

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const response = await httpRequest.get(`${endPoints.CourseById}/${id}`);
      const data = response?.data;
      if (data) {
        setInitialValues({
          title: data.title || "",
          description: data.description || "",
          status: data.status || "draft",
          publish_date: data.publish_date || "",
          course_category_id: data.course_category_id || data.category?.id || data.category?._id || "",
          author: data.author || data.author_details?.id || data.author_details?._id || "",
          media: (data.media || []).sort((a, b) => (a.order_index || 0) - (b.order_index || 0)),
          course_level: data.course_level || "beginner",
          expire_date: data.expire_date || "",
          course_mode: data.course_mode || "Online",
          access_type: data.access_type || "Free",
          duration_month: data.duration_month || 0,
          monthly_amount: data.monthly_amount || 0,
          yearly_amount: data.yearly_amount || 0,
          fixed_amount: data.fixed_amount || 0,
          discount_amount: data.discount_amount || 0,
          discount_percentage: data.discount_percentage || 0,
          overview: data.overview || "",
        });
      }
    } catch (error) {
      toast.error("Failed to fetch course details");
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    course_category_id: Yup.string().required("Category is required"),
    author: Yup.string().required("Author is required"),
    course_level: Yup.string().required("Level is required"),
    publish_date: Yup.string().required("Publish date is required"),
    duration_month: Yup.number().min(0, "Duration must be positive"),
    access_type: Yup.string().required("Access type is required"),
    course_mode: Yup.string().required("Course mode is required"),
    monthly_amount: Yup.number().min(0, "Amount must be positive"),
    yearly_amount: Yup.number().min(0, "Amount must be positive"),
    fixed_amount: Yup.number().min(0, "Amount must be positive"),
    discount_amount: Yup.number().min(0, "Discount must be positive"),
    discount_percentage: Yup.number().min(0).max(100, "Invalid percentage"),
  });

  const fields = useMemo(() => [
    { name: "title", label: "Course Title", type: "text", placeholder: "Enter course title", fullWidth: true, required: true },
    { name: "description", label: "Description", type: "textarea", placeholder: "Enter course description", fullWidth: true },
    { name: "overview", label: "Course Overview", type: "textarea", placeholder: "Detailed course overview...", fullWidth: true },
    {
      name: "course_category_id",
      label: "Category",
      type: "select",
      options: categories,
      placeholder: "Select Category",
      required: true
    },
    {
      name: "author",
      label: "Teacher / Author",
      type: "select",
      options: teachers,
      placeholder: "Choose lead teacher",
      required: true
    },
    {
      name: "course_level",
      label: "Concept Level",
      type: "select",
      options: [
        { label: "Beginner", value: "beginner" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Advanced", value: "advanced" },
      ],
      placeholder: "Select level",
      required: true
    },
    { name: "publish_date", label: "Launch Date", type: "date", required: true },
    { name: "expire_date", label: "Archiving Date", type: "date" },
    {
      name: "status",
      label: "Lifecycle Status",
      type: "select",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Active", value: "active" },
        { label: "Coming Soon", value: "coming soon" },
        { label: "Inactive", value: "inactive" },
        { label: "Archived", value: "archived" },
      ]
    },
    {
      name: "access_type",
      label: "Commercial Model",
      type: "select",
      options: [
        { label: "Free Access", value: "Free" },
        { label: "Paid Access", value: "Paid" },
      ],
      required: true
    },
    {
      name: "course_mode",
      label: "Delivery Mode",
      type: "select",
      options: [
        { label: "Online", value: "Online" },
        { label: "Offline", value: "Offline" },
      ],
      required: true
    },
    { name: "duration_month", label: "Course Duration (Months)", type: "number", placeholder: "0" },
    { name: "monthly_amount", label: "Monthly Subs ($)", type: "number", placeholder: "0.00" },
    { name: "yearly_amount", label: "Yearly Subs ($)", type: "number", placeholder: "0.00" },
    { name: "fixed_amount", label: "One-time Purchase ($)", type: "number", placeholder: "0.00" },
    { name: "discount_amount", label: "Discount Amount ($)", type: "number", placeholder: "0.00" },
    { name: "discount_percentage", label: "Studio Discount (%)", type: "number", placeholder: "0.00", fullWidth: true },
  ], [categories, teachers]);

  const getMediaUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("blob:") || url.startsWith("http")) return url;

    // 1. Establish Backend Anchor
    const apiOrigin = import.meta.env.VITE_API_ORIGIN || "http://localhost:5000";

    // 2. Normalize the asset path (Handle cases where database has just filename or full path)
    const normalizedPath = url.startsWith("/")
      ? url
      : (url.includes("media/") ? `/${url}` : `/media/course/${url}`);

    // 3. Construct High-Fidelity URL (Ensure only one slash between origin and path)
    const cleanOrigin = apiOrigin.endsWith("/") ? apiOrigin.slice(0, -1) : apiOrigin;
    const finalUrl = `${cleanOrigin}${normalizedPath}`;

    return finalUrl;
  };

  const generalFields = useMemo(() => fields.slice(0, 9), [fields]);
  
  const getPricingFields = (accessType) => {
    const pFields = fields.slice(9);
    if (accessType === 'Free') {
      // Show Access Type, Course Mode, and Duration for Free courses
      return [pFields[0], pFields[1], pFields[2]];
    }
    return pFields;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    let uploadedPaths = []; // Track paths for potential physical cleanup
    try {
      // Phase 1: Save/Update Core Course (Establish Anchor)
      toast.info(`Establishing course record...`);
      // Strip media from courseData for Phase 1 to prevent blob leakage
      const { media: draftMedia, ...courseMetadata } = values;
      const res = isEditMode
        ? await httpRequest.post(`${endPoints.UpdateCourse}`, { ...courseMetadata, id })
        : await httpRequest.post(`${endPoints.CreateCourse}`, courseMetadata);

      const courseId = isEditMode ? id : (res?.data?.id || res?.data?._id);

      // Store ID for potential rollback in current session
      if (!isEditMode && courseId) {
        window.newCourseIdForRollback = courseId;
      }

      if (!courseId) throw new Error("Could not retrieve course ID");

      // Phase 2: Deploy Draft Media to Cloud
      toast.info("Deploying concept assets to cloud...");
      const finalMedia = await Promise.all(
        values.media.map(async (item, index) => {
          // Case 1: New file selected (has File object) OR it's a blob link that needs anchoring
          if ((item.file && item.file instanceof File) || (item.url && item.url.startsWith("blob:"))) {
            const formData = new FormData();
            // If item.file is missing but it's a blob (shouldn't happen with current UI), 
            // we'd need the file, but typically item.file is set on change.
            if (item.file) {
              formData.append("file", item.file);
              const uploadRes = await httpRequest.post("/file?folder=course", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
              if (uploadRes?.data?.url) {
                uploadedPaths.push(uploadRes.data.url);
                return {
                  media_type: item.media_type,
                  url: uploadRes.data.url,
                  order_index: index
                };
              }
            }
          }

          // Case 2: Preserve existing assets (Server paths or YouTube links)
          // Strip localhost if it somehow leaked in earlier (failsafe)
          const cleanUrl = item.url?.replace(/http:\/\/localhost:\d+\/blob:[^"]+/, "");

          if (cleanUrl?.startsWith("blob:")) {
            console.warn("Unanchored blob detected at index", index);
            return null; // Don't save un-uploaded blobs
          }

          return {
            id: item.id,
            media_type: item.media_type,
            url: item.url,
            order_index: index
          };
        })
      );

      // Filter out any nulls
      const validMedia = finalMedia.filter(m => m !== null);

      // Final Lockdown: Prevent any blob from proceeding to Step 3
      const leakedBlobs = validMedia.filter(m => m.url?.startsWith("blob:"));
      if (leakedBlobs.length > 0) {
        throw new Error("Some assets failed to anchor to the cloud. Please re-select them.");
      }

      // Phase 3: Final Studio Handover (Link Media to Course)
      toast.info("Synchronizing studio media...");
      await httpRequest.post(`${endPoints.SyncCourseMedia}/${courseId}`, {
        media: validMedia
      });

      // Successful Handover - Clear Rollback Guard
      window.newCourseIdForRollback = null;

      toast.success(`Course ${isEditMode ? "updated" : "created"} successfully`);
      navigate("/admin/courses");
    } catch (error) {
      console.error("Submission pipeline failed", error);

      // Phase 4: High-Integrity Manual Rollback
      // If we are creating a NEW course and we already got an ID, 
      // but something failed later (e.g., media sync), we purge the orphan.
      if (!isEditMode) {
        // 1. Purge the Course Record (Database)
        if (window.newCourseIdForRollback) {
          console.warn("Rolling back orphaned course record due to pipeline failure...");
          try {
            await httpRequest.delete(`${endPoints.DeleteCourse}/${window.newCourseIdForRollback}`);
          } catch (rollbackError) {
            console.error("Rollback cleanup failed", rollbackError);
          }
          window.newCourseIdForRollback = null;
        }

        // 2. Purge the Physical Files (Storage)
        if (uploadedPaths.length > 0) {
          console.warn("Purging orphaned physical files from server...");
          try {
            await httpRequest.post("/file/cleanup", { files: uploadedPaths });
          } catch (cleanupError) {
            console.error("Physical file cleanup failed", cleanupError);
          }
        }
      }

      toast.error(error?.response?.data?.message || error?.message || "Failed to finalize studio project");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-primary font-bold">Loading course data...</div>;

  return (
    <div className="p-3 md:p-4 min-h-[calc(100vh-120px)]">
      <div className="bg-white p-3 md:p-4 rounded-[10px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        <div>
          <h5 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight uppercase italic leading-tight">{isEditMode ? "Update Course" : "Add New Course"}</h5>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1 italic">Fill in the details below to {isEditMode ? "modify" : "create"} the studio project.</p>
        </div>
      </div>

      <div className="bg-gray-50 flex gap-1 rounded-[10px] border border-gray-100 p-1.5 mb-5 max-w-2xl mx-auto shadow-sm">
        {["general", "pricing", "media"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-[8px] text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab
              ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
              : "text-muted hover:bg-gray-200"
              }`}
          >
            {tab === "general" ? "Concept Info" : tab === "pricing" ? "Pricing & Timeline" : "Media Assets"}
          </button>
        ))}
      </div>

      <div className="rounded-[10px] border border-gray-100 bg-white p-4 md:p-6 shadow-sm min-h-[600px]">
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, errors, touched, isSubmitting }) => (
            <Form className="flex flex-col gap-8">
              {activeTab === "general" && (
                <RenderFields
                  fields={generalFields}
                  setFieldValue={setFieldValue}
                  values={values}
                  errors={errors}
                  touched={touched}
                />
              )}

              {activeTab === "pricing" && (
                <RenderFields
                  fields={getPricingFields(values.access_type)}
                  setFieldValue={setFieldValue}
                  values={values}
                  errors={errors}
                  touched={touched}
                />
              )}

              {/* Media Manager Section */}
              {activeTab === "media" && (
                <div className="pt-2 animate-fadeIn">
                  <div className="flex items-center justify-between mb-8 px-2">
                    <div>
                      <h3 className="text-xl font-bold text-main tracking-tight uppercase italic underline decoration-primary decoration-4 underline-offset-8">Studio Media Assets</h3>
                      <p className="text-sm text-muted font-semibold uppercase tracking-wide mt-3">High-fidelity project concepts and video logs.</p>
                    </div>
                  </div>

                  <FieldArray name="media">
                    {({ push, remove }) => (
                      <div className="flex flex-col gap-5">
                        {values.media.map((item, index) => (
                          <div key={index} className="p-5 bg-gray-50 border border-gray-100 shadow-sm rounded-[10px] flex flex-col md:flex-row gap-5 items-start md:items-center transform transition-all hover:scale-[1.01]">
                            <div
                              className="w-full md:w-40 h-24 bg-gray-200 rounded-[20px] overflow-hidden flex items-center justify-center relative shadow-inner border border-gray-100 group cursor-pointer"
                              onClick={() => setPreviewItem(item)}
                            >
                              {item.media_type === 'image' && item.url ? (
                                <img src={getMediaUrl(item.url)} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                              ) : item.media_type === 'video' && item.url ? (
                                <div className="relative w-full h-full">
                                  <video src={getMediaUrl(item.url)} muted className="w-full h-full object-cover" onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-100 group-hover:bg-black/40 transition-all">
                                    <MdPlayCircle size={32} className="text-white drop-shadow-xl" />
                                  </div>
                                </div>
                              ) : item.media_type === 'youtube' ? (
                                <div className="flex flex-col items-center gap-1">
                                  <MdPlayCircle size={32} className="text-primary group-hover:animate-pulse" />
                                  <span className="text-[10px] font-bold uppercase text-primary">Concept</span>
                                </div>
                              ) : (
                                <MdCloudUpload size={28} className="text-gray-400 animate-bounce" />
                              )}
                              {item.url && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-xs font-bold text-white uppercase italic">Screen Asset</span>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                              <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-primary">Medium</label>
                                <SelectDropDown
                                  value={item.media_type}
                                  onChange={(e) => {
                                    setFieldValue(`media.${index}.media_type`, e.target.value);
                                    setFieldValue(`media.${index}.url`, ""); // Auto-clear on type change
                                  }}
                                  options={COURSE_MEDIA_TYPE_OPTIONS}
                                />
                              </div>

                              <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 px-1">
                                  {item.media_type === 'youtube' ? 'Digital URL' : 'Cloud Location'}
                                </label>
                                {item.media_type === 'youtube' ? (
                                  <input
                                    type="text"
                                    className="w-full rounded-[10px] border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10"
                                    placeholder="https://studio.digital/v=..."
                                    value={item.url}
                                    onChange={(e) => setFieldValue(`media.${index}.url`, e.target.value)}
                                  />
                                ) : (
                                  <div className="flex gap-2 items-center">
                                    <input
                                      type="file"
                                      id={`media-file-${index}`}
                                      className="hidden"
                                      onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                          // 1. Instant Visual Draft (Zero Latency)
                                          const localBlob = URL.createObjectURL(file);
                                          setFieldValue(`media.${index}.url`, localBlob);
                                          setFieldValue(`media.${index}.file`, file); // Keep raw file for later upload
                                          toast.info("Draft asset attached to concept");
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor={`media-file-${index}`}
                                      className="flex-1 bg-gray-50/30 border border-dashed border-gray-300 rounded-[10px] px-5 py-3 text-sm font-bold text-center cursor-pointer hover:bg-white hover:border-primary/50 transition-all truncate uppercase tracking-tight"
                                    >
                                      {item.url ? item.url.split('/').pop() : 'Click to Sync Local Asset'}
                                    </label>
                                  </div>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
                            >
                              <MdDelete size={20} />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => push({ media_type: 'image', url: '', order_index: values.media.length })}
                          className="group relative flex items-center justify-center gap-3 w-full py-6 mt-2 border-2 border-dashed border-gray-200 rounded-[10px] text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 group-hover:bg-primary group-hover:text-white transition-all">
                            <MdAdd size={24} />
                          </div>
                          <span className="font-bold uppercase tracking-wide text-sm">Append Concept Asset</span>
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              )}

              <div className="flex justify-end gap-5 border-t border-gray-100 pt-8">
                <LoadingButton
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/admin/courses")}
                  disabled={isSubmitting}
                  className="!w-auto px-10"
                >
                  Cancel
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  className="!w-auto"
                >
                  {isEditMode ? "Update" : "Save"}
                </LoadingButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {/* Studio Media Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10 animate-fadeIn">
          <button
            onClick={() => setPreviewItem(null)}
            className="absolute top-5 right-5 text-white hover:text-primary transition-colors bg-white/10 p-3 rounded-full"
          >
            <MdAdd className="rotate-45" size={32} />
          </button>

          <div className="w-full max-w-5xl aspect-video bg-black rounded-[10px] overflow-hidden shadow-2xl flex items-center justify-center border border-white/10">
            {previewItem.media_type === 'image' ? (
              <img src={getMediaUrl(previewItem.url)} alt="Screen Preview" className="w-full h-full object-contain" />
            ) : previewItem.media_type === 'video' ? (
              <video src={getMediaUrl(previewItem.url)} controls autoPlay className="w-full h-full h-auto" />
            ) : previewItem.media_type === 'youtube' ? (
              <iframe
                src={previewItem.url.replace("watch?v=", "embed/")}
                className="w-full h-full"
                allowFullScreen
                title="Studio Screening"
              />
            ) : (
              <div className="text-white font-black italic uppercase tracking-widest text-2xl">Initializing Asset...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUpdateCourse;
