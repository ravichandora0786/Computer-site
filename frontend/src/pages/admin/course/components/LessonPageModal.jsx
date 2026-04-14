import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import GenericModal from "@/components/ui/GenericModal";
import LoadingButton from "@/components/ui/LoadingButton";
import RenderFields from "@/components/ui/renderFields";
import { PAGE_STATUS_OPTIONS } from "@/constants/dropdown";
import { createPageAction, updatePageAction } from "../courseContentSlice";

const LessonPageModal = ({ isOpen, onClose, onSuccess, editingItem, lessonId }) => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Page title is required"),
    html_content: Yup.string().required("Content is required"),
    status: Yup.string().required("Status is required"),
    page_order: Yup.number().min(1, "Order must be at least 1"),
  });

  const initialValues = {
    title: editingItem?.title || "",
    html_content: editingItem?.html_content || "",
    page_order: editingItem?.page_order || 1,
    status: editingItem?.status || 'published'
  };

  const fields = [
    { name: "title", label: "Page Title", type: "text", placeholder: "e.g. Introduction to Derivatives", fullWidth: true, required: true },
    { name: "html_content", label: "Page Content", type: "editor", placeholder: "Start building your lesson page...", fullWidth: true, required: true },
    { name: "status", label: "Status", type: "select", options: PAGE_STATUS_OPTIONS, required: true },
    { name: "page_order", label: "Order", type: "number" },
  ];

  const handleSubmit = (values, { setSubmitting }) => {
    sessionStorage.setItem('studio_save_success', 'true');
    const action = editingItem?.id ? updatePageAction : createPageAction;
    const payload = editingItem?.id 
      ? { id: editingItem.id, ...values } 
      : { lesson_id: lessonId, ...values };

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
      widthClasses="max-w-4xl"
      modalTitle={editingItem?.id ? "Edit Lesson Page" : "Add Lesson Page"}
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
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
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
                  name={editingItem?.id ? "Update Page" : "Add Page"} 
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

export default LessonPageModal;
