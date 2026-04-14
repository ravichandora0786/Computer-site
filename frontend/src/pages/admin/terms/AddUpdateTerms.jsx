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
import { createTermsAndConditions, updateTermsAndConditions } from "./slice";

const AddUpdateTerms = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = !!id;

  const [initialValues, setInitialValues] = useState({
    heading: "",
    description: "",
    sort_order: 0,
    is_active: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchTermsAndConditionsDetails();
    }
  }, [id]);

  const fetchTermsAndConditionsDetails = async () => {
    setLoading(true);
    try {
      const response = await httpRequest.get(`${endPoints.TermsAndConditionsById}/${id}`);
      const data = response?.data;
      if (data) {
        setInitialValues({
          heading: data.heading || "",
          description: data.description || "",
          sort_order: data.sort_order || 0,
          is_active: !!data.is_active,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch studio clause details");
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    heading: Yup.string().required("Heading is required"),
    description: Yup.string().required("Description is required"),
    is_active: Yup.boolean(),
  });

  const fields = useMemo(() => [
    { name: "heading", label: "Clause Heading", type: "text", placeholder: "Enter clause heading...", fullWidth: true, required: true },
    { name: "description", label: "Legal Description", type: "textarea", placeholder: "Define the terms here...", fullWidth: true, required: true },
    { name: "is_active", label: "Is Active", type: "toggle", fullWidth: false },
  ], []);

  const handleSubmit = (values, { setSubmitting }) => {
    const action = isEditMode ? updateTermsAndConditions : createTermsAndConditions;
    const payload = isEditMode ? { id, ...values } : values;

    dispatch(
      action({
        ...payload,
        onSuccess: () => {
          navigate("/admin/terms");
        },
        onFailure: () => setSubmitting(false),
      })
    );
  };

  if (loading) return <div className="p-10 text-center text-primary font-bold italic animate-pulse">Synchronizing Clause Data...</div>;

  return (
    <div className="p-3 md:p-4 min-h-[calc(100vh-120px)]">
      <div className="bg-white p-3 md:p-4 rounded-[10px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        <div>
          <h5 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight uppercase italic leading-tight underline decoration-primary decoration-4 underline-offset-8">
            {isEditMode ? "Refine Clause" : "New Policy Clause"}
          </h5>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-2">Legal Component Configuration</p>
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
                  onClick={() => navigate("/admin/terms")}
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

export default AddUpdateTerms;
