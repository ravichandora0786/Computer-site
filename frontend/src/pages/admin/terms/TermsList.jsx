import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdEdit, MdDelete } from "react-icons/md";
import DataTable from "../../../components/ui/DataTable";
import PageTitle from "../../../components/ui/PageTitle";
import PrimaryButton from "../../../components/ui/button/PrimaryButton";
import ToggleButton from "../../../components/ui/ToggleButton";
import ConfirmationModal from "../../../components/ui/modal/ConfirmationModal";
import DeleteConfirmationModal from "../../../components/ui/modal/deleteConfirmation";
import ActionIcon from "../../../components/ui/ActionIcon";
import { getTermsAndConditions, deleteTermsAndConditions, updateTermsAndConditions } from "./slice";
import { selectTermsAndConditionsList, selectIsLoading, selectPagination } from "./selector";
import endPoints from "../../../request/endpoints";

export default function TermsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const termsAndConditionsList = useSelector(selectTermsAndConditionsList);
  const isLoading = useSelector(selectIsLoading);
  const pagination = useSelector(selectPagination);

  const [confirmModal, setConfirmModal] = useState({ open: false, id: null, active: false });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchTermsAndConditions();
  }, []);

  const fetchTermsAndConditions = (page = 1, limit = 10) => {
    dispatch(getTermsAndConditions({ page, limit }));
  };

  const handleStatusToggle = (id, active) => {
    setConfirmModal({ open: true, id, active });
  };

  const confirmStatusChange = () => {
    dispatch(updateTermsAndConditions({
      id: confirmModal.id,
      is_active: confirmModal.active,
      onSuccess: () => {
        fetchTermsAndConditions(pagination.currentPage, pagination.limit);
        setConfirmModal({ ...confirmModal, open: false });
      }
    }));
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteTermsAndConditions({
      id: deleteId,
      onSuccess: () => {
        setShowDeleteModal(false);
        fetchTermsAndConditions(pagination.currentPage, pagination.limit);
      },
    }));
  };

  const columns = useMemo(() => [
    {
      header: "Heading",
      accessorKey: "heading",
      cell: ({ getValue }) => (
        <span className="font-semibold text-gray-900 dark:text-white text-sm">
          {getValue()}
        </span>
      ),
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => <span className="text-gray-500 text-sm line-clamp-1 max-w-xs">{row.original.description || "—"}</span>,
    },
    {
      header: "Status",
      accessorKey: "is_active",
      cell: ({ row }) => (
        <ToggleButton
          checked={!!row.original.is_active}
          onChange={(checked) => handleStatusToggle(row.original.id, checked)}
        />
      ),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-1.5">
          <ActionIcon 
            icon={MdEdit} 
            onClick={() => navigate(`/admin/terms/edit/${row.original.id}`)} 
            variant="primary"
            title="Edit Terms"
          />
          <ActionIcon 
            icon={MdDelete} 
            onClick={() => handleDeleteClick(row.original.id)} 
            variant="danger"
            title="Delete Terms"
          />
        </div>
      ),
    },
  ], [pagination]);

  return (
    <div className="p-3 md:p-4 min-h-[calc(100vh-120px)]">
      <div className="flex flex-row md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 md:p-6 rounded-[10px] border border-gray-100 shadow-sm mb-6">
        <PageTitle
          title="Terms & Policy"
          subtitle="Legal Framework Studio"
        />
        <PrimaryButton
          name="New Terms"
          link="/admin/terms-conditions/add"
        />
      </div>

      <DataTable
        columns={columns}
        data={termsAndConditionsList}
        isLoading={isLoading}
        isReorderable={true}
        reorderApiUrl={endPoints.ReorderTermsAndConditions}
        isServerSide={true}
        totalItems={pagination.totalItems}
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
        pageSize={pagination.limit}
        onPageChange={(page) => fetchTermsAndConditions(page, pagination.limit)}
        onPageSizeChange={(limit) => fetchTermsAndConditions(1, limit)}
        onReorderSuccess={() => fetchTermsAndConditions(pagination.currentPage, pagination.limit)}
      />

      <ConfirmationModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ ...confirmModal, open: false })}
        onConfirm={confirmStatusChange}
        isLoading={isLoading}
        title="Change Terms Status"
        message={`Are you sure you want to ${confirmModal.active ? 'activate' : 'deactivate'} this Terms?`}
        confirmLabel={confirmModal.active ? 'Activate' : 'Deactivate'}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Terms"
        message="Are you sure you want to delete this Terms? This action cannot be undone."
      />
    </div>
  );
}
