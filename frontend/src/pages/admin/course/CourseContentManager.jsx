import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";
import 'quill/dist/quill.snow.css';
import { useDispatch, useSelector } from "react-redux";
import {
  MdAdd,
  MdExpandMore,
  MdExpandLess,
  MdDragIndicator,
  MdEdit,
  MdDelete,
  MdPlayCircleOutline,
  MdQuiz,
  MdDescription,
  MdArrowBack,
  MdVisibility,
} from "react-icons/md";
import {
  getModulesByCourse,
  setModules,
  deleteModuleAction,
  deleteLessonAction,
  deletePageAction,
  deleteTestAction,
  deleteQuestionAction,
  getBatchesByCourse,
  deleteBatchAction
} from "./courseContentSlice";

// Modals
import ModuleModal from "./components/ModuleModal";
import LessonModal from "./components/LessonModal";
import LessonPageModal from "./components/LessonPageModal";
import TestModal from "./components/TestModal";
import QuestionModal from "./components/QuestionModal";
import BatchModal from "./components/BatchModal";

import PageTitle from "@/components/ui/PageTitle";
import PrimaryButton from "@/components/ui/button/PrimaryButton";
import clsx from "clsx";
import DeleteConfirmationModal from "@/components/ui/modal/deleteConfirmation";
import { httpRequest } from "@/request";
import endPoints from "@/request/endpoints";

// --- Sub-components (Simplified to use modal handlers) ---

const PageItem = ({ page, lessonId, onEdit, onDelete, onDragEnd }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const controls = useDragControls();

  return (
    <div className="border border-border-line rounded-xl overflow-hidden bg-gray-50/10">
      <Reorder.Item
        value={page}
        dragListener={false}
        dragControls={controls}
        onDragEnd={onDragEnd}
        whileDrag={{ scale: 1.02, zIndex: 60 }}
        className="flex items-center gap-3 p-3 bg-white"
      >
        <div className="cursor-grab text-gray-300" onPointerDown={(e) => controls.start(e)}>
          <MdDragIndicator size={20} />
        </div>
        <div className="flex-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2">
            <h5 className="text-sm font-bold text-main">{page.title}</h5>
            <span className={`text-[8px] font-bold px-1.5 py-0.5 border rounded uppercase tracking-wider ${page.status === 'published'
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
              {page.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <button onClick={() => onEdit(lessonId, page)} className="p-1.5 rounded-lg hover:bg-gray-100 text-muted hover:text-primary"><MdEdit size={14} /></button>
            <button onClick={() => onDelete('page', page.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-muted hover:text-red-500"><MdDelete size={14} /></button>
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 rounded-lg hover:bg-gray-100 text-muted">
              {isExpanded ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
            </button>
          </div>
        </div>
      </Reorder.Item>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100 bg-gray-50/20"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-bold text-muted uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded">Visual Preview</span>
                <button onClick={() => onEdit(lessonId, page)} className="text-[10px] font-bold text-primary hover:underline">EDIT CONTENT</button>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl max-h-[400px] overflow-y-auto shadow-sm">
                <div className="ql-container ql-snow" style={{ border: 'none' }}>
                  <div
                    className="ql-editor !p-6"
                    style={{ whiteSpace: 'pre-wrap' }}
                    dangerouslySetInnerHTML={{ __html: page.html_content || "<p class='italic text-muted'>No content to display...</p>" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LessonItem = ({ lesson, moduleId, onEdit, onDelete, onAddPage, onEditPage, onReorderPages, onSyncPages, onDragEnd }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const controls = useDragControls();
  return (
    <div className="premium-card overflow-hidden">
      <Reorder.Item
        value={lesson}
        dragListener={false}
        dragControls={controls}
        onDragEnd={() => onDragEnd && onDragEnd()}
        whileDrag={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", zIndex: 50 }}
        className="flex items-center gap-3 p-4 bg-white group/lesson relative select-none"
      >
        <div
          className="cursor-grab text-gray-300 hover:text-primary pt-1"
          onPointerDown={(e) => controls.start(e)}
        >
          <MdDragIndicator size={20} />
        </div>
        <div className="flex-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-main">{lesson.title}</h4>
            <div className="flex gap-1">
              <span className="text-[8px] font-bold bg-gray-50 text-muted px-1.5 border border-gray-100 rounded-full uppercase">{lesson.duration_min || 0} MINS</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[10px] text-muted line-clamp-1">{lesson.short_description || "No description provided"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-[10px] font-bold text-muted uppercase tracking-tighter">{lesson.pages?.length || 0} Pages</div>
          <div className="flex gap-1 opacity-30 group-hover/lesson:opacity-100 transition-opacity">
            <button onClick={() => onEdit(moduleId, lesson)} className="p-2 rounded-lg hover:bg-gray-100 transition-all text-muted hover:text-main"><MdEdit size={16} /></button>
            <button onClick={() => onDelete('lesson', lesson.id)} className="p-2 rounded-lg hover:bg-gray-100 transition-all text-muted hover:text-rose-500"><MdDelete size={16} /></button>
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-muted">{isExpanded ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}</button>
          </div>
        </div>
      </Reorder.Item>

      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-100">
            <div className="p-4 bg-gray-50/30 space-y-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Lesson Pages</span>
                <button onClick={() => onAddPage(lesson.id)} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"><MdAdd /> ADD PAGE</button>
              </div>
              <Reorder.Group axis="y" values={lesson.pages || []} onReorder={(newP) => onReorderPages(lesson.id, newP)} className="space-y-3">
                {lesson.pages?.map(page => (
                  <PageItem
                    key={page.id}
                    page={page}
                    lessonId={lesson.id}
                    onEdit={onEditPage}
                    onDelete={onDelete}
                    onDragEnd={() => onSyncPages(lesson.pages)}
                  />
                ))}
              </Reorder.Group>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const QuestionItem = ({ q, qIdx, testId, onEdit, onDelete, onDragEnd }) => {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={q}
      dragListener={false}
      dragControls={controls}
      onDragEnd={() => onDragEnd && onDragEnd()}
      whileDrag={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", zIndex: 60 }}
      className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 bg-gray-50/50 text-xs group/q bg-white relative select-none"
    >
      <div
        className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-primary"
        onPointerDown={(e) => controls.start(e)}
      >
        <MdDragIndicator size={16} />
      </div>
      <span className="text-muted font-bold">Q{qIdx + 1}.</span>
      <span className="flex-1 text-main font-medium truncate">{q.question}</span>
      <div className="flex gap-2 opacity-30 group-hover/q:opacity-100 transition-opacity">
        <button onClick={() => onEdit(testId, q)} className="text-muted hover:text-primary"><MdEdit size={14} /></button>
        <button onClick={() => onDelete('question', q.id)} className="text-muted hover:text-red-500"><MdDelete size={14} /></button>
      </div>
    </Reorder.Item>
  );
};

const ModuleItem = ({
  module,
  index,
  isExpanded,
  onToggle,
  onEditModule,
  onDelete,
  onAddLesson,
  onEditLesson,
  onAddPage,
  onEditPage,
  onReorderPages,
  onSyncPages,
  onAddTest,
  onEditTest,
  onAddQuestion,
  onEditQuestion,
  onReorderLessons,
  onSyncLessons,
  onReorderQuestions,
  onSyncQuestions,
  onDragEnd
}) => {
  const controls = useDragControls();
  const [isLessonsExpanded, setIsLessonsExpanded] = useState(false);
  const [isEvaluationExpanded, setIsEvaluationExpanded] = useState(false);

  return (
    <Reorder.Item
      value={module}
      dragListener={false}
      dragControls={controls}
      onDragEnd={() => onDragEnd && onDragEnd()}
      whileDrag={{ scale: 1.01, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", zIndex: 40 }}
      className="premium-card group relative select-none"
    >
      <div
        className={clsx(
          "flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50/50 transition-colors",
          isExpanded && "border-b border-border-line bg-gray-50/30"
        )}
        onClick={() => onToggle(module.id)}
      >
        <div
          className="text-muted cursor-grab active:cursor-grabbing opacity-30 group-hover:opacity-100 transition-opacity"
          onPointerDown={(e) => controls.start(e)}
        >
          <MdDragIndicator size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary uppercase tracking-tighter">Module {index + 1}</span>
            <h3 className="font-bold text-lg text-main">{module.title}</h3>
          </div>
          <p className="text-xs text-muted mt-1">{module.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600 shadow-sm" title="Lessons">
              {module.lessons?.length || 0}L
            </div>
            {module.test && (
              <div className="w-8 h-8 rounded-full bg-emerald-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-600 shadow-sm" title="Test Available">
                T
              </div>
            )}
          </div>
          <div className="flex gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); onEditModule(module); }} className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-border-line shadow-sm transition-all text-muted hover:text-primary"><MdEdit size={18} /></button>
            <button onClick={(e) => { e.stopPropagation(); onDelete('module', module.id); }} className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-border-line shadow-sm transition-all text-muted hover:text-red-500"><MdDelete size={18} /></button>
          </div>
          <div className="text-muted">{isExpanded ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}</div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white">
            <div className="p-4 space-y-3">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors group/label" onClick={() => setIsLessonsExpanded(!isLessonsExpanded)}>
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Lessons</span>
                    <MdExpandMore size={16} className={clsx("transition-transform", !isLessonsExpanded && "-rotate-90")} />
                  </div>
                  <button onClick={() => onAddLesson(module.id)} className="text-primary hover:underline text-xs font-bold flex items-center gap-1"><MdAdd /> Add Lesson</button>
                </div>
                {isLessonsExpanded && (
                  <Reorder.Group axis="y" values={module.lessons || []} onReorder={(newLessons) => onReorderLessons(module.id, newLessons)} className="space-y-2 mt-2">
                    {module.lessons?.map((lesson) => (
                      <LessonItem
                        key={lesson.id}
                        lesson={lesson}
                        moduleId={module.id}
                        onEdit={onEditLesson}
                        onDelete={onDelete}
                        onAddPage={onAddPage}
                        onEditPage={onEditPage}
                        onReorderPages={onReorderPages}
                        onSyncPages={onSyncPages}
                        onDragEnd={() => onSyncLessons(module.lessons)}
                      />
                    ))}
                  </Reorder.Group>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-dashed border-border-line">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-emerald-600 transition-colors group/label" onClick={() => setIsEvaluationExpanded(!isEvaluationExpanded)}>
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Evaluation</span>
                    <MdExpandMore size={16} className={clsx("transition-transform", !isEvaluationExpanded && "-rotate-90")} />
                  </div>
                  {!module.test && <button onClick={() => onAddTest(module.id)} className="text-emerald-600 hover:underline text-xs font-bold flex items-center gap-1"><MdAdd /> Add Module Test</button>}
                </div>
                {isEvaluationExpanded && (
                  <div className="mt-2">
                    {module.test ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-100 bg-emerald-50/30">
                          <div className="text-emerald-500"><MdQuiz size={22} /></div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-emerald-900">{module.test.title}</h4>
                            <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-tighter">
                              {module.test.questions?.length || 0} Questions • {module.test.passing_percentage}% Passing
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => onEditTest(module.id, module.test)} className="p-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50"><MdEdit size={14} /></button>
                            <button onClick={() => onDelete('test', module.test.id)} className="p-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50"><MdDelete size={14} /></button>
                            <button onClick={() => onAddQuestion(module.test.id)} className="px-3 py-1 rounded-lg bg-emerald-600 text-[10px] font-bold text-white hover:bg-emerald-700">ADD QUESTION</button>
                          </div>
                        </div>
                        <Reorder.Group axis="y" values={module.test.questions || []} onReorder={(newQs) => onReorderQuestions(module.test.id, newQs)} className="px-4 space-y-2">
                          {module.test.questions?.map((q, qIdx) => (
                            <QuestionItem key={q.id} q={q} qIdx={qIdx} testId={module.test.id} onEdit={onEditQuestion} onDelete={onDelete} onDragEnd={() => onSyncQuestions(module.test.questions)} />
                          ))}
                        </Reorder.Group>
                      </div>
                    ) : <p className="text-xs text-muted text-center italic py-4">No evaluation assigned</p>}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
};

// --- Main Manager Component ---

const CourseContentManager = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const modules = useSelector(state => state.courseContent.modules);
  const batches = useSelector(state => state.courseContent.batches);
  const courseList = useSelector(state => state.courseData.courseList);
  const currentCourse = courseList.find(c => c.id === courseId) || { title: "Course Content" };

  const [expandedModules, setExpandedModules] = useState([]);
  const [activeTab, setActiveTab] = useState("curriculum");
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Modal States
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [contextIds, setContextIds] = useState({ moduleId: null, lessonId: null, testId: null });

  useEffect(() => { fetchData(); }, [courseId]);

  const fetchData = () => {
    dispatch(getModulesByCourse({ id: courseId }));
    dispatch(getBatchesByCourse({ id: courseId }));
  };

  const syncModulesOrder = (list) => httpRequest.patch(endPoints.ReorderModules, { moduleIds: list.map(m => m.id) });
  const syncLessonsOrder = (list) => httpRequest.patch(endPoints.ReorderLessons, { lessonIds: list.map(l => l.id) });
  const syncPagesOrder = (list) => httpRequest.patch(`${endPoints.lesson_pages}/reorder`, { pageIds: list.map(p => p.id) });
  const syncQuestionsOrder = (list) => httpRequest.patch(endPoints.ReorderQuestions, { questionIds: list.map(q => q.id) });

  const handleReorderModules = (newList) => dispatch(setModules(newList));
  const handleReorderLessons = (modId, newList) => dispatch(setModules(modules.map(m => m.id === modId ? { ...m, lessons: newList } : m)));
  const handleReorderPages = (lesId, newList) => dispatch(setModules(modules.map(m => ({ ...m, lessons: m.lessons?.map(l => l.id === lesId ? { ...l, pages: newList } : l) }))));
  const handleReorderQuestions = (tId, newList) => dispatch(setModules(modules.map(m => m.test?.id === tId ? { ...m, test: { ...m.test, questions: newList } } : m)));

  const toggleModule = (id) => setExpandedModules(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleOpenModuleModal = (item = null) => { setEditingItem(item); setIsModuleModalOpen(true); };
  const handleOpenLessonModal = (modId, item = null) => { setContextIds({ ...contextIds, moduleId: modId }); setEditingItem(item); setIsLessonModalOpen(true); };
  const handleOpenPageModal = (lesId, item = null) => { setContextIds({ ...contextIds, lessonId: lesId }); setEditingItem(item); setIsPageModalOpen(true); };
  const handleOpenTestModal = (modId, item = null) => { setContextIds({ ...contextIds, moduleId: modId }); setEditingItem(item); setIsTestModalOpen(true); };
  const handleOpenQuestionModal = (tId, item = null) => { setContextIds({ ...contextIds, testId: tId }); setEditingItem(item); setIsQuestionModalOpen(true); };
  const handleOpenBatchModal = (item = null) => { setEditingItem(item); setIsBatchModalOpen(true); };

  const openDeleteModal = (type, id) => { setItemToDelete({ type, id }); setIsDeleteModalOpen(true); };
  const handleConfirmDelete = () => {
    const actions = { module: deleteModuleAction, lesson: deleteLessonAction, page: deletePageAction, test: deleteTestAction, question: deleteQuestionAction, batch: deleteBatchAction };
    dispatch(actions[itemToDelete.type]({ id: itemToDelete.id, onSuccess: () => { fetchData(); setIsDeleteModalOpen(false); } }));
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-page">
      <div className="flex flex-col bg-card rounded-xl border border-border-line shadow-sm mb-8 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/admin/courses")} className="p-2 rounded-lg hover:bg-gray-100 text-muted"><MdArrowBack size={24} /></button>
            <PageTitle title="Content Studio" subtitle={`Managing: ${currentCourse.title}`} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => activeTab === "curriculum" ? handleOpenModuleModal() : handleOpenBatchModal()} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-line bg-white hover:bg-gray-50 transition-all font-semibold text-sm">
              <MdAdd size={20} /> New {activeTab === "curriculum" ? "Module" : "Batch"}
            </button>
            <PrimaryButton name="Publish Changes" />
          </div>
        </div>
        <div className="flex border-t border-border-line bg-gray-50/50">
          {["curriculum", "batches"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={clsx("px-8 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2", activeTab === tab ? "border-primary text-primary bg-white" : "border-transparent text-muted")}>
              {tab === "curriculum" ? "Online Curriculum" : "Offline Batches"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "curriculum" ? (
        <div className="space-y-4">
          <Reorder.Group axis="y" values={modules} onReorder={handleReorderModules} className="space-y-4">
            {modules.map((module, index) => (
              <ModuleItem key={module.id} module={module} index={index} isExpanded={expandedModules.includes(module.id)} onToggle={toggleModule} onEditModule={handleOpenModuleModal} onDelete={openDeleteModal} onAddLesson={handleOpenLessonModal} onEditLesson={handleOpenLessonModal} onAddPage={handleOpenPageModal} onEditPage={handleOpenPageModal} onReorderPages={handleReorderPages} onSyncPages={syncPagesOrder} onAddTest={handleOpenTestModal} onEditTest={handleOpenTestModal} onAddQuestion={handleOpenQuestionModal} onEditQuestion={handleOpenQuestionModal} onReorderLessons={handleReorderLessons} onSyncLessons={syncLessonsOrder} onReorderQuestions={handleReorderQuestions} onSyncQuestions={syncQuestionsOrder} onDragEnd={() => syncModulesOrder(modules)} />
            ))}
          </Reorder.Group>
          <button onClick={() => handleOpenModuleModal()} className="w-full py-8 border-2 border-dashed border-border-line rounded-xl flex flex-col items-center justify-center text-muted hover:text-primary transition-all">
            <MdAdd size={28} className="mb-2" />
            <p className="font-bold uppercase tracking-widest text-[10px]">Add New Module</p>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map(batch => (
            <div key={batch.id} className="premium-card p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 flex gap-2 opacity-30 group-hover:opacity-100">
                <button onClick={() => handleOpenBatchModal(batch)} className="p-1.5 rounded-lg bg-white border text-muted hover:text-primary transition-all"><MdEdit size={14} /></button>
                <button onClick={() => openDeleteModal('batch', batch.id)} className="p-1.5 rounded-lg bg-white border text-muted hover:text-red-500 transition-all"><MdDelete size={14} /></button>
              </div>
              <h3 className="text-xl font-bold text-main mb-2 tracking-tight">{batch.batch_name}</h3>
              <div className="space-y-2 text-xs text-muted mb-6">
                <div className="flex justify-between"><span>Start Date:</span> <span className="font-bold text-main">{batch.start_date?.split('T')[0]}</span></div>
                <div className="flex justify-between"><span>Location:</span> <span className="font-bold text-main">{batch.location || "On-site"}</span></div>
              </div>
              <button className="w-full py-2 rounded-lg border border-border-line text-[10px] font-bold uppercase transition-all">View Applications</button>
            </div>
          ))}
          <button onClick={() => handleOpenBatchModal()} className="border-2 border-dashed border-border-line rounded-xl flex flex-col items-center justify-center p-8 text-muted hover:text-primary transition-all min-h-[200px]">
            <MdAdd size={32} className="mb-2" />
            <p className="font-bold uppercase tracking-widest text-[10px]">Create New Batch</p>
          </button>
        </div>
      )}

      <ModuleModal isOpen={isModuleModalOpen} onClose={() => setIsModuleModalOpen(false)} onSuccess={fetchData} editingItem={editingItem} courseId={courseId} initialOrder={modules.length} />
      <LessonModal isOpen={isLessonModalOpen} onClose={() => setIsLessonModalOpen(false)} onSuccess={fetchData} editingItem={editingItem} moduleId={contextIds.moduleId} />
      <LessonPageModal isOpen={isPageModalOpen} onClose={() => setIsPageModalOpen(false)} onSuccess={fetchData} editingItem={editingItem} lessonId={contextIds.lessonId} />
      <TestModal isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)} onSuccess={fetchData} editingItem={editingItem} moduleId={contextIds.moduleId} />
      <QuestionModal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} onSuccess={fetchData} editingItem={editingItem} testId={contextIds.testId} />
      <BatchModal isOpen={isBatchModalOpen} onClose={() => setIsBatchModalOpen(false)} onSuccess={fetchData} editingItem={editingItem} courseId={courseId} />

      <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} title={`Delete ${itemToDelete?.type?.charAt(0).toUpperCase() + itemToDelete?.type?.slice(1) || 'Item'}`} message={`Are you sure you want to delete this ${itemToDelete?.type}?`} />
      
      <style>{`
        .ql-editor img, .ql-editor video, .ql-editor iframe { display: inline-block !important; vertical-align: middle !important; margin: 5px !important; border-radius: 8px; }
        .ql-editor { white-space: pre-wrap !important; }
      `}</style>
    </div>
  );
};

export default CourseContentManager;
