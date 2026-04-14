import React from "react";
import { IoCloseSharp } from "react-icons/io5";

export default function GenericModal({
  showModal = false,
  closeModal = () => { },
  modalTitle = "",
  modalBody,
  name = "",
  widthClasses = "",
}) {
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 w-full h-full z-[9999] flex items-center justify-center bg-gray-800/70 backdrop-blur-sm">
          {/* Modal Box */}
          <div className={`relative w-[90%] md:w-[80%] lg:w-[70%] ${widthClasses} max-h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden`}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
              <span className="font-bold text-xl text-gray-900">
                {modalTitle}
              </span>
              <button
                onClick={() => closeModal()}
                type="button"
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-all duration-200"
                aria-label="Close Modal"
              >
                <IoCloseSharp size={24} />
              </button>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-white text-gray-700">
              {modalBody}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
