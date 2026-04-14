import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import RenderFields from "../../../components/ui/renderFields";
import LoadingButton from "../../../components/ui/LoadingButton";
import { httpRequest } from "@/request";
import endPoints from "../../../request/endpoints";
import { createFaq, updateFaq } from "./slice";

const AddUpdateFAQ = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = !!id;

  const [initialValues, setInitialValues] = useState({
    question: "",
    answer: "",
    category: "",
    sort_order: 0,
    is_active: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchFaqDetails();
    }
  }, [id]);

  const fetchFaqDetails = async () => {
    setLoading(true);
    try {
      const response = await httpRequest.get(`${endPoints.FAQsById}/${id}`);
      const data = response?.data;
      if (data) {
        setInitialValues({
          question: data.question || "",
          answer: data.answer || "",
          category: data.category || "",
          sort_order: data.sort_order || 0,
          is_active: !!data.is_active,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch FAQ details");
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    question: Yup.string().required("Question is required"),
    answer: Yup.string().required("Answer is required"),
    category: Yup.string().required("Category is required"),
  });

  const fields = useMemo(() => [
    { name: "question", label: "FAQ Question", type: "text", placeholder: "Enter question", fullWidth: true, required: true },
    { name: "answer", label: "detailed Answer", type: "textarea", placeholder: "Enter answer", fullWidth: true, required: true },
    { name: "category", label: "Category", type: "text", placeholder: "e.g. Courses, Account, Payment" },
    { name: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
    { name: "is_active", label: "Status", type: "toggle" },
  ], []);

  const handleSubmit = (values, { setSubmitting }) => {
    const action = isEditMode ? updateFaq : createFaq;
    const payload = isEditMode ? { id, ...values } : values;

    dispatch(
      action({
        ...payload,
        onSuccess: () => {
          navigate("/admin/faqs");
        },
        onFailure: () => setSubmitting(false),
      })
    );
  };

  if (loading) return <div className="p-10 text-center text-primary font-bold">Loading FAQ data...</div>;

  return (
    <div className="p-3 md:p-4 min-h-[calc(100vh-120px)]">
      <div className="bg-white p-3 md:p-4 rounded-[10px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        <div>
          <h5 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight uppercase italic leading-tight">
            {isEditMode ? "Update FAQ" : "Add New FAQ"}
          </h5>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">Configure the help center question below.</p>
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
                  onClick={() => navigate("/admin/faqs")}
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
                  {isEditMode ? "Update FAQ" : "Save FAQ"}
                </LoadingButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddUpdateFAQ;
