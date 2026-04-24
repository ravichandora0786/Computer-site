import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { 
  MdPerson, MdEmail, MdPhone, MdCloudUpload, MdSave 
} from "react-icons/md";
import { httpRequest, endPoints } from "../../../request";
import { updateProfileTrigger } from "./slice";
import { selectProfileLoading } from "./selector";
import RenderFields from "../../../components/ui/renderFields";
import ImageUploadModal from "../../../components/ui/ImageUploadModal";
import { toast } from "react-toastify";
import clsx from "clsx";

const ProfileSettings = () => {
  const { user } = useSelector((state) => state.userAuth);
  const loading = useSelector(selectProfileLoading);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const dispatch = useDispatch();

  const apiBase = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:5000";

  const validationSchema = Yup.object().shape({
    user_name: Yup.string().required("Full name is required"),
    father_name: Yup.string().required("Father's name is required"),
    mother_name: Yup.string().required("Mother's name is required"),
    aadhar_card_number: Yup.string()
      .matches(/^\d{12}$/, "Aadhar must be exactly 12 digits")
      .required("Aadhar number is required"),
    postal_code: Yup.string()
      .matches(/^\d{6}$/, "Postal code must be exactly 6 digits")
      .required("Postal code is required"),
    gender: Yup.string().required("Gender is required"),
    date_of_birth: Yup.string().required("Date of birth is required"),
    address: Yup.string().required("Address is required"),
    distAndCity: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
    nationality: Yup.string().required("Nationality is required"),
  });

  const fields = useMemo(() => [
    { name: "user_name", label: "Full Name", placeholder: "Enter full name", required: true },
    { name: "father_name", label: "Father's Name", placeholder: "Enter father's name", required: true },
    { name: "mother_name", label: "Mother's Name", placeholder: "Enter mother's name", required: true },
    { 
      name: "aadhar_card_number", 
      label: "Aadhar Card Number", 
      placeholder: "12 digit aadhar number", 
      required: true,
      maxLength: 12,
      onInput: (e) => e.target.value = e.target.value.replace(/\D/g, '')
    },
    { 
      name: "gender", 
      label: "Gender", 
      type: "select", 
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" },
      ],
      required: true 
    },
    { name: "date_of_birth", label: "Date of Birth", type: "date", required: true },
    { name: "address", label: "Full Address", fullWidth: true, required: true },
    { name: "distAndCity", label: "City / District", required: true },
    { 
      name: "postal_code", 
      label: "Postal Code", 
      placeholder: "6 digit postal code", 
      required: true,
      maxLength: 6,
      onInput: (e) => e.target.value = e.target.value.replace(/\D/g, '')
    },
    { name: "country", label: "Country", required: true },
    { name: "nationality", label: "Nationality", required: true },
    { name: "designation", label: "Current Designation", fullWidth: true },
  ], []);

  const handleImageSuccess = (newUrl, setFieldValue, currentValues) => {
    setFieldValue("profile_img", newUrl);
    dispatch(updateProfileTrigger({
      ...currentValues,
      profile_img: newUrl
    }));
  };

  return (
    <div className="max-w-auto mx-auto space-y-10 pb-20 px-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-main dark:text-white uppercase italic">Profile Settings</h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest">Manage your personal information and credentials.</p>
        </div>
      </header>

      <Formik
        initialValues={{
          user_name: user?.user_name || "",
          father_name: user?.father_name || "",
          mother_name: user?.mother_name || "",
          nationality: user?.nationality || "",
          aadhar_card_number: user?.aadhar_card_number || "",
          gender: user?.gender || "",
          date_of_birth: user?.date_of_birth || "",
          address: user?.address || "",
          distAndCity: user?.distAndCity || "",
          postal_code: user?.postal_code || "",
          country: user?.country || "",
          designation: user?.designation || "",
          profile_img: user?.profile_img || ""
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) => {
          dispatch(updateProfileTrigger(values));
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Form className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              {/* Left Panel: Profile Info */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-24 bg-primary/5 dark:bg-primary/10" />
                  
                  <div className="relative mt-4">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-50 relative group">
                      <img 
                        src={values.profile_img ? (values.profile_img.startsWith('http') ? values.profile_img : `${apiBase}${values.profile_img}`) : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div 
                      onClick={() => setIsModalOpen(true)}
                      className="absolute bottom-1 right-1 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform border-4 border-white dark:border-gray-800"
                    >
                      <MdCloudUpload size={20} />
                    </div>
                  </div>

                  <h2 className="mt-4 text-xl font-black text-main dark:text-white uppercase italic">{user?.user_name}</h2>
                  
                  <div className="w-full mt-10 space-y-4">
                    <div className="p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl border border-gray-100/50 dark:border-gray-700/50 text-left">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                      <p className="text-sm font-bold text-main dark:text-white truncate italic">{user?.email}</p>
                    </div>
                    <div className="p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl border border-gray-100/50 dark:border-gray-700/50 text-left">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Mobile Number</p>
                      <p className="text-sm font-bold text-main dark:text-white italic">{user?.phone || "Not Set"}</p>
                    </div>
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100/50 dark:border-amber-700/30 text-amber-700 dark:text-amber-400">
                      <p className="text-[10px] font-bold leading-tight uppercase italic">
                        Locked Fields: Name, Email & Phone can only be modified via admin.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel: Form Fields */}
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-gray-800 p-10 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm space-y-10">
                  <div className="flex items-center gap-3 border-b border-gray-50 dark:border-gray-700 pb-6">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl dark:bg-primary/20"><MdPerson size={24} /></div>
                    <h3 className="text-lg font-black text-main dark:text-white uppercase italic">Personal & Academic Details</h3>
                  </div>

                  <RenderFields 
                    fields={fields}
                    setFieldValue={setFieldValue}
                    values={values}
                    errors={errors}
                    touched={touched}
                  />

                  <div className="pt-10 border-t border-gray-50 dark:border-gray-700 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="px-12 py-4 bg-primary text-white rounded-2xl font-black uppercase italic tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? "Processing..." : <><MdSave size={20} /> Update Profile</>}
                    </button>
                  </div>
                </div>
              </div>
            </Form>

            {/* Common Image Upload Modal */}
            <ImageUploadModal 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              currentImage={values.profile_img}
              title="Update Profile Picture"
              subtitle="Upload your official avatar"
              onSuccess={(url) => handleImageSuccess(url, setFieldValue, values)}
            />
          </>
        )}
      </Formik>
    </div>
  );
};

export default ProfileSettings;
