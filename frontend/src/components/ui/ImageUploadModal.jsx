import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdCloudUpload } from "react-icons/md";
import { toast } from "react-toastify";
import { httpRequest, endPoints } from "../../request";
import clsx from "clsx";

const ImageUploadModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  currentImage, 
  title = "Update Image", 
  subtitle = "Choose a professional photo",
  maxSizeKB = 200 
}) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const apiBase = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:5000";

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > maxSizeKB * 1024) {
      toast.error(`File is too large! Maximum size allowed is ${maxSizeKB}KB.`);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    const uploadData = new FormData();
    uploadData.append("file", selectedFile);

    try {
      setUploading(true);
      const response = await httpRequest.post(endPoints.FileUpload, uploadData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const newImageUrl = response.data.url;
      toast.success("Image uploaded successfully!");
      if (onSuccess) onSuccess(newImageUrl);
      handleClose();
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (uploading) return;
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="text-center">
              <h3 className="text-2xl font-black text-main dark:text-white uppercase italic mb-2">{title}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">{subtitle}</p>

              <div className="relative group mx-auto w-48 h-48 mb-10">
                <div className="w-full h-full rounded-full border-4 border-primary/20 p-2">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 dark:bg-gray-700 relative">
                    <img 
                      src={previewUrl || (currentImage ? (currentImage.startsWith('http') ? currentImage : `${apiBase}${currentImage}`) : "https://cdn-icons-png.flaticon.com/512/149/149071.png")} 
                      alt="Preview" 
                      className={clsx("w-full h-full object-cover transition-opacity", uploading && "opacity-40")}
                    />
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block w-full py-4 px-6 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-2xl cursor-pointer hover:border-primary transition-colors text-gray-400 hover:text-primary group">
                  <div className="flex items-center justify-center gap-3">
                    <MdCloudUpload size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{selectedFile ? selectedFile.name : `Choose New File (Max ${maxSizeKB}KB)`}</span>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileSelect} accept="image/*" />
                </label>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={handleClose}
                    disabled={uploading}
                    className="flex-1 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all italic"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={handleSave}
                    disabled={!selectedFile || uploading}
                    className="flex-1 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 italic"
                  >
                    {uploading ? "Updating..." : "Save Now"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImageUploadModal;
