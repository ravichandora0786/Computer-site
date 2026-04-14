import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPolicies, updatePolicy, deletePolicy } from "./slice";
import { selectPolicyList, selectPolicyLoading } from "./selector";
import DataTable from "@/components/ui/DataTable";
import PrimaryButton from "@/components/ui/button/PrimaryButton";
import PageTitle from "@/components/ui/PageTitle";
import { MdEdit, MdDelete } from "react-icons/md";
import ToggleButton from "@/components/ui/ToggleButton";
import endPoints from "../../../request/endpoints";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import DeleteConfirmationModal from "@/components/ui/modal/deleteConfirmation";
import ActionIcon from "@/components/ui/ActionIcon";

const PolicyList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const policies = useSelector(selectPolicyList);
  const isLoading = useSelector(selectPolicyLoading);

  const [confirmModal, setConfirmModal] = useState({ open: false, id: null, active: false, type: 'status', title: '', message: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchPolicies());
  }, [dispatch]);

  const handleStatusToggle = (id, active) => {
    setConfirmModal({ open: true, id, active, type: 'status' });
  };

  const confirmAction = () => {
    if (confirmModal.type === 'status') {
      dispatch(updatePolicy({
        id: confirmModal.id,
        is_active: confirmModal.active,
        onSuccess: () => {
          dispatch(fetchPolicies());
          setConfirmModal({ ...confirmModal, open: false });
        }
      }));
    }
  };

  const handleDeleteClick = (policy) => {
    if (policy.is_active) {
      setConfirmModal({ 
        open: true, 
        type: 'error',
        title: "Action Blocked",
        message: "This policy is currently active and cannot be deleted. Please deactivate it first by making another policy version active."
      });
    } else {
      setDeleteId(policy.id);
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    dispatch(deletePolicy({
      id: deleteId,
      onSuccess: () => {
        setShowDeleteModal(false);
        dispatch(fetchPolicies());
      }
    }));
  };

  const columns = useMemo(() => [
    { header: "Title", accessorKey: "title" },
    { header: "Version", accessorKey: "version" },
    { 
      header: "Status", 
      accessorKey: "is_active",
      cell: ({ row }) => (
        <ToggleButton
          checked={!!row.original.is_active}
          onChange={(checked) => handleStatusToggle(row.original.id, checked)}
        />
      )
    },
    { header: "Last Updated", accessorKey: "updatedAt", cell: ({ getValue }) => new Date(getValue()).toLocaleDateString() },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1.5 justify-end">
          <ActionIcon 
            icon={MdEdit} 
            onClick={() => navigate(`edit/${row.original.id}`, { state: row.original })} 
            variant="primary"
            title="Edit Policy"
          />
          <ActionIcon 
            icon={MdDelete} 
            onClick={() => handleDeleteClick(row.original)} 
            variant="danger"
            title="Delete Policy"
          />
        </div>
      )
    }
  ], []);

  return (
    <div className="p-4 rounded-3xl bg-white shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <PageTitle title="Privacy Policies" subtitle="Manage legal frameworks" />
        <PrimaryButton name="New Version" link="/admin/privacy-policies/add" />
      </div>
      <DataTable 
        columns={columns} 
        data={policies} 
        isLoading={isLoading} 
      />

      {/* Confirmation Modal for Toggles and Errors */}
      <ConfirmationModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ ...confirmModal, open: false })}
        onConfirm={confirmAction}
        title={confirmModal.title || (confirmModal.type === 'status' ? "Change Policy Status" : "Action Blocked")}
        message={confirmModal.message || `Are you sure you want to ${confirmModal.active ? 'activate' : 'deactivate'} this policy?`}
        confirmLabel={confirmModal.active ? 'Activate' : 'Deactivate'}
        variant={confirmModal.type === 'error' ? "red" : "primary"}
        showConfirmButton={confirmModal.type !== 'error'}
        cancelLabel={confirmModal.type === 'error' ? "OK" : "Cancel"}
      />

      {/* Standard Delete Modal for Deletions */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Policy"
        message="Are you sure you want to permanently delete this policy version? This action cannot be undone."
      />
    </div>
  );
};

export default PolicyList;
