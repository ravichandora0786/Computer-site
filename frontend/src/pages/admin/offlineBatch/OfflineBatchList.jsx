import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchBatches, deleteBatch, updateBatch } from "./slice";
import { selectOfflineBatchList, selectOfflineBatchLoading } from "./selector";
import DataTable from "@/components/ui/DataTable";
import PrimaryButton from "@/components/ui/button/PrimaryButton";
import PageTitle from "@/components/ui/PageTitle";
import { MdEdit, MdDelete, MdLocationOn, MdPeople } from "react-icons/md";
import ToggleButton from "@/components/ui/ToggleButton";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import DeleteConfirmationModal from "@/components/ui/modal/deleteConfirmation";
import ActionIcon from "@/components/ui/ActionIcon";

const OfflineBatchList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const batches = useSelector(selectOfflineBatchList);
  const isLoading = useSelector(selectOfflineBatchLoading);

  const [confirmModal, setConfirmModal] = useState({ open: false, id: null, active: false });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchBatches());
  }, [dispatch]);

  const handleStatusToggle = (id, active) => {
    setConfirmModal({ open: true, id, active });
  };

  const confirmStatusChange = () => {
    dispatch(updateBatch({
      id: confirmModal.id,
      is_active: confirmModal.active,
      onSuccess: () => {
        dispatch(fetchBatches());
        setConfirmModal({ open: false, id: null, active: false });
      }
    }));
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteBatch({
      id: deleteId,
      onSuccess: () => {
        setShowDeleteModal(false);
        dispatch(fetchBatches());
      }
    }));
  };

  const columns = useMemo(() => [
    { header: "Batch Name", accessorKey: "batch_name", cell: ({ getValue }) => <span className="font-bold text-gray-900">{getValue()}</span> },
    { 
      header: "Location", 
      accessorKey: "location", 
      cell: ({ getValue }) => (
        <span className="flex items-center gap-1 text-gray-500 font-medium italic"><MdLocationOn /> {getValue()}</span>
      )
    },
    { 
      header: "Capacity", 
      accessorKey: "total_seats", 
      cell: ({ row }) => (
        <span className="flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-lg text-xs uppercase italic"><MdPeople /> {row.original.available_seats}/{row.original.total_seats}</span>
      )
    },
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
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1.5 justify-end">
          <ActionIcon 
            icon={MdEdit} 
            onClick={() => navigate(`/admin/batches/edit/${row.original.id}`, { state: row.original })} 
            variant="primary"
            title="Edit Batch"
          />
          <ActionIcon 
            icon={MdDelete} 
            onClick={() => handleDeleteClick(row.original.id)} 
            variant="danger"
            title="Delete Batch"
          />
        </div>
      )
    }
  ], []);

  return (
    <div className="p-4 rounded-3xl bg-white shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <PageTitle title="Offline Batches" subtitle="Center-based course inventory" />
        <PrimaryButton name="Create Batch" link="/admin/batches/add" />
      </div>
      <DataTable columns={columns} data={batches} isLoading={isLoading} />

      <ConfirmationModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, id: null, active: false })}
        onConfirm={confirmStatusChange}
        title="Change Batch Status"
        message={`Are you sure you want to ${confirmModal.active ? 'activate' : 'deactivate'} this batch?`}
        confirmLabel={confirmModal.active ? 'Activate' : 'Deactivate'}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Batch"
        message="Are you sure you want to delete this offline batch? This will permanently remove the record."
      />
    </div>
  );
};

export default OfflineBatchList;
