import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchFaqs, deleteFaq, updateFaq } from "./slice";
import { selectFaqList, selectFaqLoading } from "./selector";
import DataTable from "@/components/ui/DataTable";
import PrimaryButton from "@/components/ui/button/PrimaryButton";
import PageTitle from "@/components/ui/PageTitle";
import { MdEdit, MdDelete } from "react-icons/md";
import ToggleButton from "@/components/ui/ToggleButton";
import endPoints from "../../../request/endpoints";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import DeleteConfirmationModal from "@/components/ui/modal/deleteConfirmation";
import ActionIcon from "@/components/ui/ActionIcon";

const FAQList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const faqs = useSelector(selectFaqList);
  const isLoading = useSelector(selectFaqLoading);
  
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null, active: false });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch]);

  const handleStatusToggle = (id, active) => {
    setConfirmModal({ open: true, id, active });
  };

  const confirmStatusChange = () => {
    dispatch(updateFaq({
      id: confirmModal.id,
      is_active: confirmModal.active,
      onSuccess: () => {
        dispatch(fetchFaqs());
        setConfirmModal({ open: false, id: null, active: false });
      }
    }));
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteFaq({
      id: deleteId,
      onSuccess: () => {
        setShowDeleteModal(false);
        dispatch(fetchFaqs());
      }
    }));
  };

  const columns = useMemo(() => [
    { header: "Question", accessorKey: "question" },
    { header: "Category", accessorKey: "category" },
    { header: "Order", accessorKey: "sort_order" },
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
        <div className="flex gap-1.5">
          <ActionIcon 
            icon={MdEdit} 
            onClick={() => navigate(`edit/${row.original.id}`, { state: row.original })} 
            variant="primary"
            title="Edit FAQ"
          />
          <ActionIcon 
            icon={MdDelete} 
            onClick={() => handleDeleteClick(row.original.id)} 
            variant="danger"
            title="Delete FAQ"
          />
        </div>
      )
    }
  ], []);

  return (
    <div className="p-4 rounded-3xl bg-white shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <PageTitle title="Platform FAQs" subtitle="Manage help center content" />
        <PrimaryButton name="Add FAQ" onClick={() => navigate("add")} />
      </div>
      <DataTable 
        columns={columns} 
        data={faqs} 
        isLoading={isLoading} 
        isReorderable={true}
        reorderApiUrl={endPoints.ReorderFAQ}
        onReorderSuccess={() => dispatch(fetchFaqs())}
      />

      <ConfirmationModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, id: null, active: false })}
        onConfirm={confirmStatusChange}
        title="Change FAQ Status"
        message={`Are you sure you want to ${confirmModal.active ? 'activate' : 'deactivate'} this FAQ?`}
        confirmLabel={confirmModal.active ? 'Activate' : 'Deactivate'}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ? This action cannot be undone."
      />
    </div>
  );
};

export default FAQList;
