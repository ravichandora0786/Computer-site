import React from "react";
import GenericModal from "../GenericModal"
import LoadingButton from "../LoadingButton"

const LogoutModal = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
  const modalBody = (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 text-gray-500">
        Are you sure you want to log out? Any unsaved changes may be lost.
      </div>
      <div className="flex gap-4 w-full mt-4">
        <LoadingButton
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </LoadingButton>
        <LoadingButton
          variant="danger"
          onClick={onConfirm}
          isLoading={isLoading}
          className="flex-1"
        >
          Yes, Log Out
        </LoadingButton>
      </div>
    </div>
  );

  return (
    <GenericModal
      showModal={isOpen}
      closeModal={onClose}
      modalTitle="Confirm Logout"
      modalBody={modalBody}
    />
  );
};

export default LogoutModal;
