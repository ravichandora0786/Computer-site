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
import { createPolicy, updatePolicy } from "./slice";

const AddUpdatePolicy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = !!id;

  const [initialValues, setInitialValues] = useState({
    title: "",
    version: "1.0.0",
    content_html: "",
    is_active: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchPolicyDetails();
    }
  }, [id]);

  const fetchPolicyDetails = async () => {
    setLoading(true);
    try {
      const response = await httpRequest.get(`${endPoints.PrivacyPoliciesById}/${id}`);
      const data = response?.data;
      if (data) {
        setInitialValues({
          title: data.title || "",
          version: data.version || "1.0.0",
          content_html: data.content_html || "",
          is_active: !!data.is_active,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch policy details");
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Policy title is required"),
    version: Yup.string().required("Version is required"),
    content_html: Yup.string().required("Legal content is required"),
  });

  const fields = useMemo(() => [
    { name: "title", label: "Policy Title", type: "text", placeholder: "e.g. Terms of Service, Privacy Policy", fullWidth: true, required: true },
    { name: "version", label: "Version Number", type: "text", placeholder: "v1.0.0" },
    ...(isEditMode ? [{ name: "is_active", label: "Status (Only one active per title recommended)", type: "toggle" }] : []),
    { name: "content_html", label: "Legal Framework Content", type: "editor", placeholder: "Type the legal content here...", fullWidth: true, required: true },
  ], [isEditMode]);

  const handleSubmit = (values, { setSubmitting }) => {
    const action = isEditMode ? updatePolicy : createPolicy;
    const payload = isEditMode ? { id, ...values } : values;

    dispatch(
      action({
        ...payload,
        onSuccess: () => {
          navigate("/admin/privacy-policies");
        },
        onFailure: () => setSubmitting(false),
      })
    );
  };

  if (loading) return <div className="p-10 text-center text-primary font-bold">Loading policy data...</div>;

  return (
    <div className="p-3 md:p-4 min-h-[calc(100vh-120px)]">
      <div className="bg-white p-3 md:p-4 rounded-[10px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        <div>
          <h5 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight uppercase italic leading-tight">
            {isEditMode ? "Update Policy" : "New Legal Policy"}
          </h5>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">Configure your legal documentation below.</p>
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
                  onClick={() => navigate("/admin/privacy-policies")}
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
                  {isEditMode ? "Update Policy" : "Create Policy"}
                </LoadingButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddUpdatePolicy;
