import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import GenericModal from "@/components/ui/GenericModal";
import LoadingButton from "@/components/ui/LoadingButton";
import RenderFields from "@/components/ui/renderFields";
import { QUESTION_TYPE_OPTIONS } from "@/constants/dropdown";
import { Reorder } from "framer-motion";
import { MdDragIndicator, MdDelete } from "react-icons/md";
import { createQuestionAction, updateQuestionAction } from "../courseContentSlice";

const QuestionModal = ({ isOpen, onClose, onSuccess, editingItem, testId }) => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    question: Yup.string().required("Question text is required"),
    question_type: Yup.string().required("Required"),
    marks: Yup.number().min(1).required("Required"),
    options: Yup.array().of(
      Yup.object().shape({
        option_text: Yup.string().required("Required"),
        is_correct: Yup.boolean()
      })
    ).min(2, "At least 2 options required")
  });

  const initialValues = {
    question: editingItem?.question || "",
    question_type: editingItem?.question_type || "single_choice",
    marks: editingItem?.marks || 1,
    randomize_options: editingItem?.randomize_options || false,
    options: editingItem?.options?.map(opt => ({ ...opt })) || [
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false }
    ]
  };

  const fields = [
    { name: "question", label: "Question Text", type: "textarea", placeholder: "Enter your question here...", fullWidth: true, required: true },
    { name: "randomize_options", label: "Randomize options for students", type: "toggle", fullWidth: true },
    { name: "question_type", label: "Type", type: "select", options: QUESTION_TYPE_OPTIONS, required: true },
    { name: "marks", label: "Marks", type: "number", required: true },
  ];

  const handleSubmit = (values, { setSubmitting }) => {
    const action = editingItem?.id ? updateQuestionAction : createQuestionAction;
    const payload = editingItem?.id 
      ? { id: editingItem.id, ...values } 
      : { test_id: testId, ...values };

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
      modalTitle={editingItem?.id ? "Edit Question" : "Add Question"}
      modalBody={
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ setFieldValue, values, errors, touched, isSubmitting }) => (
            <Form className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <RenderFields
                fields={fields}
                setFieldValue={setFieldValue}
                values={values}
                errors={errors}
                touched={touched}
              />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-widest px-1">Options</label>
                  <button
                    type="button"
                    onClick={() => setFieldValue("options", [...values.options, { option_text: "", is_correct: false }])}
                    className="text-primary text-[10px] font-bold hover:underline"
                  >
                    + ADD OPTION
                  </button>
                </div>

                <Reorder.Group
                  axis="y"
                  values={values.options}
                  onReorder={(newOptions) => setFieldValue("options", newOptions)}
                  className="space-y-3"
                >
                  {values.options.map((opt, idx) => (
                    <Reorder.Item
                      key={idx}
                      value={opt}
                      className="flex items-center gap-3 bg-white p-1 rounded-lg border border-transparent hover:border-border-line/50 transition-all"
                    >
                      <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-primary pt-1">
                        <MdDragIndicator size={20} />
                      </div>
                      <input
                        type="checkbox"
                        checked={opt.is_correct}
                        onChange={(e) => {
                          const newOptions = [...values.options];
                          if (values.question_type === 'single_choice') {
                            newOptions.forEach((o, i) => o.is_correct = (i === idx));
                          } else {
                            newOptions[idx].is_correct = e.target.checked;
                          }
                          setFieldValue("options", newOptions);
                        }}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className="flex-1 flex flex-col">
                        <input
                          type="text"
                          value={opt.option_text}
                          onChange={(e) => {
                            const newOptions = [...values.options];
                            newOptions[idx].option_text = e.target.value;
                            setFieldValue("options", newOptions);
                          }}
                          placeholder={`Option ${idx + 1}`}
                          className="w-full p-2 rounded-lg border border-border-line outline-none text-sm focus:border-primary/50 transition-all"
                          required
                        />
                      </div>
                      {values.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setFieldValue("options", values.options.filter((_, i) => i !== idx))}
                          className="text-red-300 hover:text-red-500 transition-colors"
                        >
                          <MdDelete size={18} />
                        </button>
                      )}
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
                {errors.options && touched.options && (
                  <div className="text-[10px] font-bold text-red-500 uppercase px-1">{typeof errors.options === 'string' ? errors.options : "All options must have text"}</div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 sticky bottom-0 bg-white">
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
                  name={editingItem ? "Synchronize Question" : "Append to Pool"} 
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

export default QuestionModal;
