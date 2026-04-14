import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import GenericModal from "@/components/ui/GenericModal";
import LoadingButton from "@/components/ui/LoadingButton";
import RenderFields from "@/components/ui/renderFields";
import { createModuleAction, updateModuleAction } from "../courseContentSlice";

const ModuleModal = ({ isOpen, onClose, onSuccess, editingItem, courseId, initialOrder = 0 }) => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Module title is required"),
    description: Yup.string().optional(),
  });

  const initialValues = {
    title: editingItem?.title || "",
    description: editingItem?.description || "",
    module_order: editingItem?.module_order || initialOrder,
  };

  const fields = [
    { name: "title", label: "Module Title", type: "text", placeholder: "e.g. Introduction to Finance", fullWidth: true, required: true },
    { name: "description", label: "Description", type: "textarea", placeholder: "What will students learn?", fullWidth: true },
  ];

  const handleSubmit = (values, { setSubmitting }) => {
    const action = editingItem?.id ? updateModuleAction : createModuleAction;
    const payload = editingItem?.id 
      ? { id: editingItem.id, ...values } 
      : { course_id: courseId, ...values };

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
      modalTitle={editingItem ? "Edit Module" : "Add Module"}
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
                  name={editingItem ? "Update Module" : "Create Module"} 
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

export default ModuleModal;
