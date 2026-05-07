import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import GenericModal from "@/components/ui/GenericModal";
import LoadingButton from "@/components/ui/LoadingButton";
import RenderFields from "@/components/ui/renderFields";
import { BATCH_STATUS_OPTIONS, WEEKDAY_OPTIONS } from "@/constants/dropdown";
import { createBatchAction, updateBatchAction } from "../courseContentSlice";

const BatchModal = ({ isOpen, onClose, onSuccess, editingItem, courseId, courseStartDate, courseEndDate }) => {
  const dispatch = useDispatch();

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : "";
  };

  const validationSchema = Yup.object().shape({
    batch_name: Yup.string().required("Batch name is required"),
    start_date: Yup.date().required("Required"),
    end_date: Yup.date().optional(),
    location: Yup.string().optional(),
    seat_limit: Yup.number().min(0).optional(),
    start_time: Yup.string().optional(),
    end_time: Yup.string().optional(),
    class_days: Yup.array().min(1, "Select at least one day").required("Required"),
    status: Yup.string().required("Required"),
  });

  const initialValues = useMemo(() => ({
    batch_name: editingItem?.batch_name || "",
    start_date: editingItem?.start_date ? formatDate(editingItem.start_date) : formatDate(courseStartDate),
    end_date: editingItem?.end_date ? formatDate(editingItem.end_date) : formatDate(courseEndDate),
    location: editingItem?.location || "",
    seat_limit: editingItem?.seat_limit || "",
    start_time: editingItem?.start_time || "",
    end_time: editingItem?.end_time || "",
    class_days: editingItem?.class_days ? editingItem.class_days.split(",").map(d => d.trim()) : [],
    status: editingItem?.status || "draft"
  }), [editingItem, courseStartDate, courseEndDate]);

  const fields = [
    { name: "batch_name", label: "Batch Name", type: "text", placeholder: "e.g. Batch 1", fullWidth: true, required: true },
    { name: "start_date", label: "Start Date", type: "date", required: true },
    { name: "end_date", label: "End Date", type: "date" },
    { name: "location", label: "Location", type: "text", placeholder: "" },
    { name: "seat_limit", label: "Seat Limit", type: "number", placeholder: "" },
    { name: "start_time", label: "Start Time", type: "time" },
    { name: "end_time", label: "End Time", type: "time" },
    {
      name: "class_days",
      label: "Class Days Schedule",
      type: "multiselect",
      options: WEEKDAY_OPTIONS,
      placeholder: "Select Days",
      fullWidth: true,
      required: true,
      allowSelectAll: true,
      isClearable: true,
    },
    { name: "status", label: "Status", type: "select", options: BATCH_STATUS_OPTIONS, fullWidth: true, required: true },
  ];

  const handleSubmit = (values, { setSubmitting }) => {
    const action = editingItem?.id ? updateBatchAction : createBatchAction;

    // Convert array back to comma-separated string for backend
    const formattedValues = {
      ...values,
      class_days: Array.isArray(values.class_days) ? values.class_days.join(", ") : values.class_days
    };

    const payload = editingItem?.id
      ? { id: editingItem.id, ...formattedValues }
      : { course_id: courseId, ...formattedValues };

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
      modalTitle={editingItem ? "Edit Batch" : "Create New Batch"}
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
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
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
                  {editingItem ? "Update" : "Create"}
                </LoadingButton>
              </div>
            </Form>
          )}
        </Formik>
      }
    />
  );
};

export default BatchModal;
