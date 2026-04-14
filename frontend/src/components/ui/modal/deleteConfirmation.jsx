import React from "react";
import GenericModal from "../GenericModal"
import LoadingButton from "../LoadingButton"

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading = false,
  title = "Delete Confirmation",
  message = "Are you sure you want to delete this item? This action cannot be undone."
}) => {
  const modalBody = (
    <div className="flex flex-col gap-6">
      <p className="text-gray-600 text-lg leading-relaxed">
        {message}
      </p>
      <div className="flex justify-end gap-3 pt-2">
        <LoadingButton
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
          className="!w-auto px-6"
        >
          Cancel
        </LoadingButton>
        <LoadingButton
          variant="danger"
          onClick={onConfirm}
          isLoading={isLoading}
          className="!w-auto px-6"
        >
          Delete
        </LoadingButton>
      </div>
    </div>
  );

  return (
    <GenericModal
      showModal={isOpen}
      closeModal={onClose}
      modalTitle={title}
      modalBody={modalBody}
    />
  );
};

export default DeleteConfirmationModal;
