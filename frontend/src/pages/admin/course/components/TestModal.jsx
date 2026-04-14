import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import GenericModal from "@/components/ui/GenericModal";
import LoadingButton from "@/components/ui/LoadingButton";
import RenderFields from "@/components/ui/renderFields";
import { createTestAction, updateTestAction } from "../courseContentSlice";

const TestModal = ({ isOpen, onClose, onSuccess, editingItem, moduleId }) => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Test title is required"),
    description: Yup.string().optional(),
    passing_percentage: Yup.number().min(0).max(100).required("Required"),
    duration_min: Yup.number().min(1).required("Required"),
    max_attempts: Yup.number().min(1).required("Required"),
    total_marks: Yup.number().min(0).required("Required"),
  });

  const initialValues = {
    title: editingItem?.title || "Module Assessment",
    description: editingItem?.description || "",
    passing_percentage: editingItem?.passing_percentage || 40,
    duration_min: editingItem?.duration_min || 30,
    max_attempts: editingItem?.max_attempts || 3,
    total_marks: editingItem?.total_marks || 0
  };

  const fields = [
    { name: "title", label: "Test Title", type: "text", placeholder: "e.g. Module 1 Final Quiz", fullWidth: true, required: true },
    { name: "description", label: "Description", type: "textarea", placeholder: "About the test...", fullWidth: true },
    { name: "passing_percentage", label: "Passing %", type: "number", required: true },
    { name: "duration_min", label: "Duration (Min)", type: "number", required: true },
    { name: "total_marks", label: "Total Marks", type: "number", required: true },
    { name: "max_attempts", label: "Max Attempts", type: "number", required: true },
  ];

  const handleSubmit = (values, { setSubmitting }) => {
    const action = editingItem?.id ? updateTestAction : createTestAction;
    const payload = editingItem?.id 
      ? { id: editingItem.id, ...values } 
      : { module_id: moduleId, ...values };

    dispatch(action({ 
      ...payload, 
      onSuccess: () => {
        onSuccess();
        onClose();
        setSubmitting(false);
      } 
    }));
  };

  return (
    <GenericModal
      showModal={isOpen}
      closeModal={onClose}
      modalTitle={editingItem?.id ? "Edit Test" : "Set Module Test"}
      modalBody={
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ setFieldValue, values, errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <RenderFields
                fields={fields}
                setFieldValue={setFieldValue}
                values={values}
                errors={errors}
                touched={touched}
              />
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <LoadingButton 
                  type="button" 
                  variant="secondary"
                  onClick={onClose} 
                  className="!w-auto px-6"
                  disabled={isSubmitting}
                >
                  Cancel
                </LoadingButton>
                <LoadingButton 
                  name={editingItem ? "Finalize Assessment" : "Initialize Assessment"} 
                  type="submit" 
                  isLoading={isSubmitting}
                  className="!w-auto px-6"
                />
              </div>
            </Form>
          )}
        </Formik>
      }
    />
  );
};

export default TestModal;
