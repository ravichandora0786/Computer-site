import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import RenderFields from "../../../components/ui/renderFields";
import LoadingButton from "../../../components/ui/LoadingButton";
import { httpRequest } from "@/request";
import endPoints from "../../../request/endpoints";
import { createAboutSection, updateAboutSection } from "./slice";


const AddUpdateAboutSection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = !!id;

  const [initialValues, setInitialValues] = useState({
    is_hero_section: false,
    title: "",
    subtitle: "",
    content: "",
    sort_order: 0,
    is_active: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchSectionDetails();
    }
  }, [id]);

  const fetchSectionDetails = async () => {
    setLoading(true);
    try {
      const response = await httpRequest.get(`${endPoints.AboutSectionsById}/${id}`);
      const data = response?.data;
      if (data) {
        setInitialValues({
          is_hero_section: !!data.is_hero_section,
          title: data.title || "",
          subtitle: data.subtitle || "",
          content: data.content || "",
          sort_order: data.sort_order || 0,
          is_active: !!data.is_active,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch section details");
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content Description is required"),
  });

  const getFields = (values) => {
    const isHero = values.is_hero_section;
    
    const allFields = [
      { 
        name: "is_hero_section", 
        label: "Is Hero Section?", 
        type: "checkbox", 
        required: false 
      },
      { name: "title", label: "Section Title", type: "text", placeholder: "Enter title", required: true },
      { 
        name: "subtitle", 
        label: "Subtitle / Tagline", 
        type: "text", 
        placeholder: "Enter subtitle", 
        fullWidth: true,
        hidden: !isHero 
      },
      { 
        name: "content", 
        label: "Content Description", 
        type: "textarea", 
        placeholder: "Describe this section...", 
        fullWidth: true, 
        required: true,
      },
      { 
        name: "sort_order", 
        label: "Display Order", 
        type: "number", 
        placeholder: "0",
        hidden: isHero 
      },
      { name: "is_active", label: "Status", type: "toggle" },
    ];

    return allFields.filter(field => !field.hidden);
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const action = isEditMode ? updateAboutSection : createAboutSection;
    
    const finalValues = {
      ...values,
      sort_order: values.is_hero_section ? 0 : values.sort_order,
      subtitle: values.is_hero_section ? values.subtitle : ""
    };

    const payload = isEditMode ? { id, ...finalValues } : finalValues;

    dispatch(
      action({
        ...payload,
        onSuccess: () => {
          navigate("/admin/about-sections");
        },
        onFailure: () => setSubmitting(false),
      })
    );
  };

  if (loading) return <div className="p-10 text-center text-primary font-bold">Loading section data...</div>;

  return (
    <div className="p-3 md:p-4 min-h-[calc(100vh-120px)]">
      <div className="bg-white p-3 md:p-4 rounded-[10px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        <div>
          <h5 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight uppercase italic leading-tight">
            {isEditMode ? "Update Section" : "New Story Section"}
          </h5>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">Design your platform narrative below.</p>
        </div>
      </div>

      <div className="rounded-[10px] border border-gray-100 bg-white p-4 md:p-6 shadow-sm">
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, errors, touched, isSubmitting }) => (
            <Form className="flex flex-col gap-6">
              <RenderFields
                fields={getFields(values)}
                setFieldValue={setFieldValue}
                values={values}
                errors={errors}
                touched={touched}
              />

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
                <LoadingButton
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/admin/about-sections")}
                  disabled={isSubmitting}
                >
                  Cancel
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  className="!w-auto px-10"
                >
                  {isEditMode ? "Update Section" : "Publish Section"}
                </LoadingButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddUpdateAboutSection;
