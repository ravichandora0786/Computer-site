import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import RenderFields from "../../../components/ui/renderFields";
import LoadingButton from "../../../components/ui/LoadingButton";
import { httpRequest } from "@/request";
import endPoints from "../../../request/endpoints";
import { createBatch, updateBatch } from "./slice";
import { getAllCourses } from "../course/slice";
import { selectCourseList } from "../course/selector";

const AddUpdateOfflineBatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = !!id;
  const courses = useSelector(selectCourseList);

  const [initialValues, setInitialValues] = useState({
    course_id: "",
    batch_name: "",
    start_date: "",
    end_date: "",
    class_days: "",
    start_time: "",
    end_time: "",
    location: "Studio Head Office",
    seat_limit: 20,
    status: "upcoming",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllCourses());
    if (isEditMode) {
      fetchBatchDetails();
    }
  }, [id, dispatch]);

  const fetchBatchDetails = async () => {
    setLoading(true);
    try {
      const response = await httpRequest.get(`${endPoints.OfflineBatchesById}/${id}`);
      const data = response?.data;
      if (data) {
        setInitialValues({
          course_id: data.course_id || "",
          batch_name: data.batch_name || "",
          start_date: data.start_date || "",
          end_date: data.end_date || "",
          class_days: data.class_days || "",
          start_time: data.start_time || "",
          end_time: data.end_time || "",
          location: data.location || "Studio Head Office",
          seat_limit: data.seat_limit || 20,
          status: data.status || "upcoming",
        });
      }
    } catch (error) {
      toast.error("Failed to fetch batch details");
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    course_id: Yup.string().required("Selecting a course is required"),
    batch_name: Yup.string().required("Batch name is required"),
    start_date: Yup.date().required("Start date is required"),
  });

  const courseOptions = useMemo(() => 
    courses.map(c => ({ label: c.title, value: c.id })),
    [courses]
  );

  const fields = useMemo(() => [
    { 
      name: "course_id", 
      label: "Link to Course", 
      type: "select", 
      options: courseOptions,
      fullWidth: true,
      required: true 
    },
    { name: "batch_name", label: "Batch Identifier", type: "text", placeholder: "e.g. Summer 2024 Morning" },
    { name: "location", label: "Physical Location", type: "text", placeholder: "Studio Floor..." },
    { name: "start_date", label: "Start Date", type: "date" },
    { name: "end_date", label: "End Date (Expected)", type: "date" },
    { name: "start_time", label: "Session Start", type: "time" },
    { name: "end_time", label: "Session End", type: "time" },
    { name: "class_days", label: "Recurring Days", type: "text", placeholder: "Mon, Wed, Fri" },
    { name: "seat_limit", label: "Max Capacity", type: "number" },
    { 
      name: "status", 
      label: "Batch Status", 
      type: "select", 
      options: [
        { label: "Upcoming", value: "upcoming" },
        { label: "Ongoing", value: "ongoing" },
        { label: "Completed", value: "completed" },
      ]
    },
  ], [courseOptions]);

  const handleSubmit = (values, { setSubmitting }) => {
    const action = isEditMode ? updateBatch : createBatch;
    const payload = isEditMode ? { id, ...values } : values;

    dispatch(
      action({
        ...payload,
        onSuccess: () => {
          navigate("/admin/batches");
        },
        onFailure: () => setSubmitting(false),
      })
    );
  };

  if (loading) return <div className="p-10 text-center text-primary font-bold">Loading batch data...</div>;

  return (
    <div className="p-3 md:p-4 min-h-[calc(100vh-120px)]">
      <div className="bg-white p-3 md:p-4 rounded-[10px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        <div>
          <h5 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight uppercase italic leading-tight">
            {isEditMode ? "Update Training Batch" : "Initialize New Batch"}
          </h5>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">Coordinate your physical sessions below.</p>
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
                  onClick={() => navigate("/admin/batches")}
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
                  {isEditMode ? "Synchronize Batch" : "Launch Batch"}
                </LoadingButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddUpdateOfflineBatch;
