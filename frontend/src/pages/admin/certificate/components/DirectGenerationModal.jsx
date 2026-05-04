import React, { useEffect } from 'react'
import { MdVerified, MdSend } from 'react-icons/md'
import { Formik, Form, useFormikContext } from 'formik'
import * as Yup from 'yup'
import RenderFields from '@/components/ui/renderFields'
import GenericModal from '@/components/ui/GenericModal'

const validationSchema = Yup.object().shape({
  userId: Yup.string().required('Student is required'),
  courseId: Yup.string().required('Course is required'),
  custom_name: Yup.string().required('Name on certificate is required')
})

// Internal component to handle auto-fill logic
const AutoFillHandler = ({ users }) => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (values.userId && Array.isArray(users)) {
      const selectedUser = users.find(u => u.id === values.userId);
      if (selectedUser) {
        let name = selectedUser.user_name;
        if (selectedUser.father_name) {
          name += ` S/O ${selectedUser.father_name}`;
        }
        setFieldValue('custom_name', name.toUpperCase());
      }
    }
  }, [values.userId, users, setFieldValue]);

  return null;
}

const DirectGenerationModal = ({ isOpen, onClose, users = [], courses = [], onGenerate, isGenerating }) => {
  
  const userOptions = Array.isArray(users) ? users.map(u => ({ label: `${u.user_name} (${u.email})`, value: u.id })) : []
  // Filter only Offline courses
  const offlineCourses = Array.isArray(courses) ? courses.filter(c => c.course_mode === 'Offline') : []
  const courseOptions = offlineCourses.map(c => ({ label: c.title, value: c.id }))

  const modalBody = (
    <Formik
      initialValues={{ userId: '', courseId: '', custom_name: '' }}
      validationSchema={validationSchema}
      onSubmit={(values) => onGenerate(values)}
    >
      {({ setFieldValue, values, errors, touched }) => (
        <Form className="space-y-6">
          <AutoFillHandler users={users} />
          <RenderFields
            fields={[
              {
                name: 'userId',
                label: 'Select Student',
                type: 'select',
                options: userOptions,
                placeholder: 'Choose Student...',
                fullWidth: true,
                required: true
              },
              {
                name: 'courseId',
                label: 'Select Offline Course',
                type: 'select',
                options: courseOptions,
                placeholder: 'Choose Offline Course...',
                fullWidth: true,
                required: true
              },
              {
                name: 'custom_name',
                label: 'Name on Certificate',
                type: 'text',
                placeholder: 'Enter full name for printing...',
                fullWidth: true,
                required: true
              }
            ]}
            setFieldValue={setFieldValue}
            values={values}
            errors={errors}
            touched={touched}
          />

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-4 bg-primary text-white rounded-2xl font-black italic uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Generate & Save <MdSend /></>
            )}
          </button>
        </Form>
      )}
    </Formik>
  )

  return (
    <GenericModal
      showModal={isOpen}
      closeModal={onClose}
      modalTitle={
        <div className="flex items-center gap-2 italic uppercase tracking-tighter">
          <MdVerified className="text-primary" /> Direct Generation
        </div>
      }
      modalBody={modalBody}
      widthClasses="md:max-w-md"
    />
  )
}

export default DirectGenerationModal
