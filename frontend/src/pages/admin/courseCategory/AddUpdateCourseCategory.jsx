import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import RenderFields from "../../../components/ui/renderFields";
import LoadingButton from "../../../components/ui/LoadingButton";
import { httpRequest } from "@/request";
import { endPoints } from "../../../request";
import { createCategory, updateCategory } from "./slice";

const AddUpdateCourseCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = !!id;

  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    is_active: true,
    sort_order: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchCategoryDetails();
    }
  }, [id]);

  const fetchCategoryDetails = async () => {
    setLoading(true);
    try {
      const response = await httpRequest.get(`${endPoints.CourseCategoryById}/${id}`);
      const data = response?.data;
      if (data) {
        setInitialValues({
          title: data.title || "",
          description: data.description || "",
          is_active: !!data.is_active,
          sort_order: data.sort_order || 0,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch category details");
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    is_active: Yup.boolean(),
  });

  const fields = useMemo(() => [
    { name: "title", label: "Category Title", type: "text", placeholder: "Enter category title", fullWidth: true, required: true },
    { name: "description", label: "Description", type: "textarea", placeholder: "Enter category description", fullWidth: true, required: true },
    {
      name: "is_active",
      label: "Is Active",
      type: "toggle",
    },
  ], []);

  const handleSubmit = (values, { setSubmitting }) => {
    const action = isEditMode ? updateCategory : createCategory;
    const payload = isEditMode ? { id, ...values } : values;

    dispatch(
      action({
        ...payload,
        onSuccess: () => {
          navigate("/admin/course-categories");
        },
        onFailure: () => setSubmitting(false),
      })
    );
  };

  if (loading) return <div className="p-10 text-center text-primary font-bold">Loading category data...</div>;

  return (
    <div className="p-3 md:p-4 min-h-[calc(100vh-120px)]">
      <div className="bg-white p-3 md:p-4 rounded-[10px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        <div>
          <h5 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight uppercase italic leading-tight">{isEditMode ? "Update Category" : "Add New Category"}</h5>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">Configure the course category below.</p>
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
                fields={fields}
                setFieldValue={setFieldValue}
                values={values}
                errors={errors}
                touched={touched}
              />

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
                <LoadingButton
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/admin/course-categories")}
                  disabled={isSubmitting}
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
    </div>
  );
};

export default AddUpdateCourseCategory;
