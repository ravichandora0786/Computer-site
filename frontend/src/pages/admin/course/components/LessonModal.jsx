import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import GenericModal from "@/components/ui/GenericModal";
import LoadingButton from "@/components/ui/LoadingButton";
import RenderFields from "@/components/ui/renderFields";
import { createLessonAction, updateLessonAction } from "../courseContentSlice";

const LessonModal = ({ isOpen, onClose, onSuccess, editingItem, moduleId }) => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Lesson title is required"),
    short_description: Yup.string().optional(),
    duration_min: Yup.number().typeError("Must be a number").min(0, "Cannot be negative"),
  });

  const initialValues = {
    title: editingItem?.title || "",
    short_description: editingItem?.short_description || "",
    lesson_order: editingItem?.lesson_order || 0,
    duration_min: editingItem?.duration_min || 0,
    is_preview: editingItem?.is_preview || false
  };

  const fields = [
    { name: "title", label: "Lesson Title", type: "text", placeholder: "e.g. Master the Portfolio", fullWidth: true, required: true },
    { name: "short_description", label: "Short Description", type: "textarea", placeholder: "Brief summary...", fullWidth: true },
    { name: "duration_min", label: "Duration (Mins)", type: "number", placeholder: "Length in minutes", required: true },
  ];

  const handleSubmit = (values, { setSubmitting }) => {
    const action = editingItem?.id ? updateLessonAction : createLessonAction;
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
      modalTitle={editingItem?.id ? "Edit Lesson Header" : "Add New Lesson"}
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
                  name={editingItem ? "Update Lesson" : "Create Lesson"} 
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

export default LessonModal;
