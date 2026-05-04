import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import GenericModal from "@/components/ui/GenericModal";
import LoadingButton from "@/components/ui/LoadingButton";
import RenderFields from "@/components/ui/renderFields";
import { PAGE_STATUS_OPTIONS } from "@/constants/dropdown";
import { createPageAction, updatePageAction } from "../courseContentSlice";

const LessonPageModal = ({ isOpen, onClose, onSuccess, editingItem, lessonId, initialOrder }) => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Page title is required"),
    html_content: Yup.string().required("Content is required"),
    status: Yup.string().required("Status is required"),
    page_order: Yup.number().min(1, "Order must be at least 1"),
    required_time: Yup.number().min(0, "Time must be positive"),
  });

  // Convert DB decimal minutes to MM.SS format for UI
  const convertToMMSS = (decimalMins) => {
    if (!decimalMins) return 0;
    const mins = Math.floor(decimalMins);
    const secs = Math.round((decimalMins - mins) * 60);
    return parseFloat(`${mins}.${secs.toString().padStart(2, '0')}`);
  };

  // Convert MM.SS format from UI to DB decimal minutes
  const convertToDecimal = (mmss) => {
    if (!mmss) return 0;
    const mins = Math.floor(mmss);
    const secs = Math.round((mmss - mins) * 100);
    return mins + (secs / 60);
  };

  const initialValues = {
    title: editingItem?.title || "",
    html_content: editingItem?.html_content || "",
    page_order: editingItem?.page_order !== undefined ? editingItem.page_order : (initialOrder || 1),
    required_time: convertToMMSS(editingItem?.required_time),
    status: editingItem?.status || 'published'
  };

  const fields = [
    { name: "title", label: "Page Title", type: "text", placeholder: "e.g. Introduction to Derivatives", fullWidth: true, required: true },
    { name: "html_content", label: "Page Content", type: "editor", placeholder: "Start building your lesson page...", fullWidth: true, required: true },
    { name: "status", label: "Status", type: "select", options: PAGE_STATUS_OPTIONS, required: true },
    { name: "required_time", label: "Estimated Time (Minutes)", type: "number", placeholder: "e.g. 0.5", step: "0.1" },
    { name: "page_order", label: "Order", type: "number" },
  ];

  const handleSubmit = (values, { setSubmitting }) => {
    sessionStorage.setItem('studio_save_success', 'true');
    const action = editingItem?.id ? updatePageAction : createPageAction;
    const finalValues = {
      ...values,
      required_time: convertToDecimal(values.required_time)
    };
    
    const payload = editingItem?.id
      ? { id: editingItem.id, ...finalValues }
      : { lesson_id: lessonId, ...finalValues };

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
                  type="submit"
                  isLoading={isSubmitting}
                  className="!w-auto px-6"
                >
                  {editingItem?.id ? "Update" : "Create"}
                </LoadingButton>
              </div>
            </Form>
          )}
        </Formik>
      }
    />
  );
};

export default LessonPageModal;
