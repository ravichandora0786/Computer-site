import React from "react";
import GenericModal from "../GenericModal";
import LoadingButton from "../LoadingButton";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary", // primary, red, etc.
  showConfirmButton = true
}) => {
  return (
    <GenericModal
      showModal={isOpen}
      closeModal={onClose}
      modalTitle={title}
      modalBody={
        <div className="flex flex-col gap-6">
          <p className="text-gray-600 font-medium leading-relaxed">{message}</p>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
            <LoadingButton
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="!w-auto px-6"
            >
              {cancelLabel}
            </LoadingButton>
            {showConfirmButton && (
              <LoadingButton
                variant={variant === "red" ? "danger" : "primary"}
                isLoading={isLoading}
                onClick={onConfirm}
                className="!w-auto px-6"
              >
                {confirmLabel}
              </LoadingButton>
            )}
          </div>
        </div>
      }
    />
  );
};

export default ConfirmationModal;
