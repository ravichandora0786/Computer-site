import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdDelete, MdFilterList, MdPhotoLibrary, MdVideocam,
  MdLink, MdClose, MdCloudUpload, MdPlayCircle,
  MdChevronLeft, MdChevronRight, MdFirstPage, MdLastPage
} from "react-icons/md";
import { toast } from "react-toastify";
import { httpRequest, endPoints } from "../../../request";
import DynamicPreview from "../../../components/ui/DynamicPreview";
import DeleteConfirmationModal from "../../../components/ui/modal/deleteConfirmation";
import SelectDropDown from "../../../components/ui/selectDropDown";
import {
  GALLERY_TYPE_OPTIONS,
  GALLERY_CATEGORY_OPTIONS,
  GALLERY_PAGINATION_LIMIT_OPTIONS
} from "../../../constants/dropdown";
import clsx from "clsx";

// Redux Actions & Selectors
import { getGalleryItems, createGalleryItem, deleteGalleryItem } from "./slice";
import { selectGalleryList, selectIsLoading, selectPagination } from "./selector";
import LoadingButton from "../../../components/ui/LoadingButton";
import PageTitle from "../../../components/ui/PageTitle";
import PrimaryButton from "../../../components/ui/button/PrimaryButton";

const CATEGORIES = ["building", "students", "classroom", "events", "faculty", "other"];
const TYPES = ["image", "video", "youtube"];

const GalleryList = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectGalleryList);
  const loading = useSelector(selectIsLoading);
  const pagination = useSelector(selectPagination);

  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Form State
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "image",
    category: "building",
    link: "",
    description: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGalleryItems(1, pagination.limit);
  }, [filterType, filterCategory]);

  // Handle preview clean-up
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const fetchGalleryItems = (page = 1, limit = 10) => {
    dispatch(getGalleryItems({ page, limit, filterType, filterCategory }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Generate High-Fidelity Preview
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFormatChange = (type) => {
    setFormData({ ...formData, type });
    // Reset selection and preview on format change
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let assetLink = formData.link;

    try {
      if (formData.type !== 'youtube') {
        if (!selectedFile) {
          toast.error(`Please select a ${formData.type} to upload`);
          setIsSubmitting(false);
          return;
        }

        const uploadData = new FormData();
        uploadData.append("file", selectedFile);

        const uploadRes = await httpRequest.post(`${endPoints.FileUpload}?folder=gallery`, uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        assetLink = uploadRes?.data?.url;
      }

      dispatch(createGalleryItem({
        ...formData,
        link: assetLink,
        onSuccess: () => {
          toast.success("Media asset appended to studio");
          setShowAddModal(false);
          resetForm();
          fetchGalleryItems(pagination.currentPage, pagination.limit);
          setIsSubmitting(false);
        },
        onFailure: () => setIsSubmitting(false)
      }));

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to commit asset");
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", type: "image", category: "building", link: "", description: "" });
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteAsset = () => {
    setIsSubmitting(true);
    dispatch(deleteGalleryItem({
      id: deleteId,
      onSuccess: () => {
        toast.success("Asset purged from studio");
        setShowDeleteModal(false);
        fetchGalleryItems(pagination.currentPage, pagination.limit);
        setIsSubmitting(false);
      },
      onFailure: () => setIsSubmitting(false)
    }));
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const startIdx = (pagination.currentPage - 1) * pagination.limit + 1;
  const endIdx = Math.min(pagination.currentPage * pagination.limit, pagination.totalItems);

  return (
    <div className="p-3 md:p-4 min-h-[calc(100vh-120px)] space-y-4 md:space-y-5">
      <div className="bg-white p-3 md:p-4 rounded-[10px] border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">

        <PageTitle
          title="Studio Gallery"
          subtitle="Media Curation Hub"
        />

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-100 w-full sm:w-auto">
            <div className="flex gap-2 flex-1 sm:flex-initial items-center">
              <div className="w-32">
                <SelectDropDown
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  options={[{ value: 'all', label: 'All Formats' }, ...GALLERY_TYPE_OPTIONS]}
                  placeholder="Formats"
                />
              </div>
              <div className="w-40">
                <SelectDropDown
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  options={[{ value: 'all', label: 'All Categories' }, ...GALLERY_CATEGORY_OPTIONS]}
                  placeholder="Categories"
                />
              </div>
              {(filterType !== "all" || filterCategory !== "all") && (
                <button
                  onClick={() => { setFilterType("all"); setFilterCategory("all"); }}
                  className="h-8 w-8 text-rose-500 hover:bg-rose-50 rounded-[6px] transition-all flex items-center justify-center border border-rose-100"
                  title="Clear Filters"
                >
                  <MdClose size={16} />
                </button>
              )}
            </div>
          </div>

          <PrimaryButton
            name="Append Media"
            onClick={() => setShowAddModal(true)}
          />
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-[10px] animate-pulse border-2 border-white shadow-inner" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => openViewModal(item)}
                  className="group relative aspect-square rounded-[8px] overflow-hidden bg-white border-[2px] md:border-[3px] border-white shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all cursor-pointer"
                >
                  <DynamicPreview
                    src={item.link}
                    type={item.type}
                    className="!w-full !h-full border-none transition-transform group-hover:scale-110 duration-700"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-md rounded-sm border border-white/50 text-[8px] font-bold uppercase tracking-tight shadow-sm">
                    {item.type === 'youtube' ? 'Digital Link' : 'Studio Asset'}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(item.id);
                      setShowDeleteModal(true);
                    }}
                    className="absolute top-2 right-2 h-8 w-8 rounded-[10px] bg-white text-rose-500 shadow-xl opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all flex items-center justify-center hover:bg-rose-500 hover:text-white z-10"
                    title="Purge Asset"
                  >
                    <MdDelete size={16} />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end pointer-events-none">
                    <span className="text-primary text-xs font-bold uppercase tracking-wide mb-1 italic">
                      {item.category}
                    </span>
                    <h4 className="text-white text-base font-bold truncate tracking-tight">{item.title}</h4>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination Section - Simplified Style */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2 py-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{startIdx}</span> to <span className="font-semibold text-gray-900 dark:text-white">{endIdx}</span> of <span className="font-semibold text-gray-900 dark:text-white">{pagination.totalItems}</span> entries
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Show</span>
                <div className="w-20">
                  <SelectDropDown
                    value={pagination.limit}
                    onChange={(e) => fetchGalleryItems(1, Number(e.target.value))}
                    options={GALLERY_PAGINATION_LIMIT_OPTIONS}
                  />
                </div>
                <span>entries</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  disabled={pagination.currentPage === 1}
                  onClick={() => fetchGalleryItems(1, pagination.limit)}
                  className="rounded-[8px] border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:hover:bg-gray-800 transition-all font-bold"
                >
                  <MdFirstPage size={20} />
                </button>
                <button
                  disabled={pagination.currentPage === 1}
                  onClick={() => fetchGalleryItems(pagination.currentPage - 1, pagination.limit)}
                  className="rounded-[8px] border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:hover:bg-gray-800 transition-all"
                >
                  <MdChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-1 px-2 mx-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Page
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {pagination.currentPage}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    of {pagination.totalPages}
                  </span>
                </div>

                <button
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => fetchGalleryItems(pagination.currentPage + 1, pagination.limit)}
                  className="rounded-[8px] border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:hover:bg-gray-800 transition-all"
                >
                  <MdChevronRight size={20} />
                </button>
                <button
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => fetchGalleryItems(pagination.totalPages, pagination.limit)}
                  className="rounded-[8px] border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:hover:bg-gray-800 transition-all"
                >
                  <MdLastPage size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-32 text-center space-y-6 bg-white rounded-[10px] border border-dashed border-gray-200">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-[10px] bg-gray-50 text-gray-400 mb-4 shadow-inner">
            <MdPhotoLibrary size={48} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">Empty Studio Tier</h3>
          <p className="text-muted text-sm font-medium uppercase tracking-wide max-w-xs mx-auto leading-relaxed">
            No assets matched your current filters. Adjust your curation or append new media.
          </p>
        </div>
      )}

      {/* Media Viewer Modal */}
      <AnimatePresence>
        {showViewModal && selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowViewModal(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl aspect-video rounded-[10px] border-[8px] border-white/10 overflow-hidden bg-black shadow-2xl z-10"
            >
              <DynamicPreview
                src={selectedItem.link}
                type={selectedItem.type}
                showPlayer={true}
                className="!w-full !h-full border-none"
              />
              <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
                <div>
                  <span className="text-primary text-xs font-bold uppercase tracking-wide italic mb-1 block">
                    {selectedItem.category} // Studio Piece
                  </span>
                  <h2 className="text-white text-xl md:text-3xl font-black tracking-tight uppercase leading-tight italic">
                    {selectedItem.title}
                  </h2>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="h-12 w-12 bg-white/10 hover:bg-rose-500 text-white rounded-[10px] backdrop-blur-md transition-all flex items-center justify-center shadow-xl group"
                >
                  <MdClose size={24} className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>
              <div className="absolute bottom-6 left-6 px-4 py-2 bg-primary text-white rounded-[10px] text-[9px] font-black uppercase tracking-widest shadow-xl shadow-primary/30">
                {selectedItem.type} Format
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAsset}
        isLoading={isSubmitting}
        title="Purge Studio Asset"
        message="This will atomicaly remove the media from your gallery. This action is irreversible."
      />

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[10px] p-6 md:p-10 w-full max-w-2xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6 md:mb-8 relative z-50">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight uppercase italic leading-tight">Append Asset</h2>
                <p className="text-xs font-bold uppercase tracking-wide text-primary mt-1">Global Media Sync</p>
              </div>
              <button
                type="button"
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="h-10 w-10 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center text-muted hover:bg-rose-500 hover:text-white transition-all focus:outline-none shadow-sm"
              >
                <MdClose size={24} />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10">
              <div className="space-y-4 md:space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-muted px-1">Studio Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter descriptive title"
                    className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-gray-100 border-none px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-muted px-1">Concept Category</label>
                  <SelectDropDown
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    options={GALLERY_CATEGORY_OPTIONS}
                    placeholder="Select Category"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-muted px-1">Media Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TYPES.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleFormatChange(type)}
                        className={clsx(
                          "h-12 md:h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all border outline-none",
                          formData.type === type ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white text-muted border-gray-100 hover:border-primary/20"
                        )}
                      >
                        {type === 'image' && <MdPhotoLibrary size={16} />}
                        {type === 'video' && <MdVideocam size={16} />}
                        {type === 'youtube' && <MdLink size={16} />}
                        <span className="text-[10px] font-bold uppercase">{type === 'image' ? 'Still' : type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {formData.type === 'youtube' ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted px-1">YouTube Video Link</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Paste YouTube Video Link here..."
                      className="w-full rounded-[10px] bg-gray-50/50 border border-gray-200 p-5 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none placeholder:font-normal"
                      value={formData.link}
                      onChange={e => setFormData({ ...formData, link: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted px-1">Upload {formData.type} File</label>
                    <div
                      className={clsx(
                        "relative w-full aspect-square md:aspect-auto md:h-40 rounded-[10px] border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all overflow-hidden p-2 group",
                        previewUrl ? "border-primary/30 bg-gray-50" : "bg-gray-50/50 border-gray-200 hover:bg-white hover:border-primary/30"
                      )}
                      onClick={() => !previewUrl && fileInputRef.current.click()}
                    >
                      <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept={formData.type === 'image' ? "image/*" : "video/*"}
                      />
                      {previewUrl ? (
                        <div className="relative w-full h-full rounded-2xl overflow-hidden group/preview bg-gray-50 border border-gray-100/50">
                          {formData.type === 'image' ? (
                            <img src={previewUrl} className="w-full h-full object-contain p-2" alt="Preview" />
                          ) : (
                            <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-white gap-2">
                              <MdPlayCircle size={40} className="text-primary animate-pulse" />
                              <span className="text-xs font-bold uppercase tracking-wide">Motion Preview Ready</span>
                            </div>
                          )}
                          <div className="absolute top-3 right-3 opacity-0 group-hover/preview:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFile(null);
                                URL.revokeObjectURL(previewUrl);
                                setPreviewUrl(null);
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }}
                              className="h-8 w-8 bg-black/60 hover:bg-rose-500 text-white rounded-xl backdrop-blur-md transition-all flex items-center justify-center shadow-lg"
                              title="Remove Selection"
                            >
                              <MdClose size={18} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <MdCloudUpload size={24} />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-bold uppercase tracking-wide text-muted">Click to Select {formData.type}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wide text-muted px-1">Brief Description</label>
                  <input
                    type="text"
                    placeholder="Context for this asset (optional)"
                    className="w-full h-14 rounded-2xl bg-gray-100 border-none px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <LoadingButton
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    className="!w-auto"
                  >
                    Save
                  </LoadingButton>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GalleryList;
