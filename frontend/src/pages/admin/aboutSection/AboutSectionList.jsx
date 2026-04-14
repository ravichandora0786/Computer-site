import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAboutSections, deleteAboutSection, updateAboutSection } from "./slice";
import { selectAboutSectionList, selectAboutSectionLoading } from "./selector";
import DataTable from "@/components/ui/DataTable";
import PrimaryButton from "@/components/ui/button/PrimaryButton";
import PageTitle from "@/components/ui/PageTitle";
import { MdEdit, MdDelete } from "react-icons/md";
import ToggleButton from "@/components/ui/ToggleButton";
import endPoints from "../../../request/endpoints";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import DeleteConfirmationModal from "@/components/ui/modal/deleteConfirmation";
import ActionIcon from "@/components/ui/ActionIcon";

const AboutSectionList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sections = useSelector(selectAboutSectionList);
  const isLoading = useSelector(selectAboutSectionLoading);

  const [confirmModal, setConfirmModal] = useState({ open: false, id: null, active: false });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchAboutSections());
  }, [dispatch]);

  const handleStatusToggle = (id, active) => {
    setConfirmModal({ open: true, id, active });
  };

  const confirmStatusChange = () => {
    dispatch(updateAboutSection({
      id: confirmModal.id,
      is_active: confirmModal.active,
      onSuccess: () => {
        dispatch(fetchAboutSections());
        setConfirmModal({ open: false, id: null, active: false });
      }
    }));
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteAboutSection({
      id: deleteId,
      onSuccess: () => {
        setShowDeleteModal(false);
        dispatch(fetchAboutSections());
      }
    }));
  };

  const columns = useMemo(() => [
    { 
      header: "Title", 
      accessorKey: "title",
      cell: ({ getValue }) => <span className="font-semibold text-gray-900">{getValue()}</span>
    },
    { 
      header: "Category", 
      accessorKey: "is_hero_section",
      cell: ({ getValue }) => (
        getValue() ? (
          <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 border border-amber-100 text-amber-600">
            Hero Section
          </span>
        ) : (
          <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-50 border border-gray-100 text-gray-400">
            General
          </span>
        )
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
            onClick={() => navigate(`edit/${row.original.id}`, { state: row.original })} 
            variant="primary"
            title="Edit Section"
          />
          <ActionIcon 
            icon={MdDelete} 
            onClick={() => handleDeleteClick(row.original.id)} 
            variant="danger"
            title="Delete Section"
          />
        </div>
      )
    }
  ], []);

  return (
    <div className="p-4 rounded-3xl bg-white shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <PageTitle title="About Sections" subtitle="Corporate storytelling assets" />
        <PrimaryButton name="Add Section" onClick={() => navigate("add")} />
      </div>
      <DataTable 
        columns={columns} 
        data={sections} 
        isLoading={isLoading} 
        isReorderable={true}
        reorderApiUrl={endPoints.ReorderAboutSection}
        onReorderSuccess={() => dispatch(fetchAboutSections())}
      />

      <ConfirmationModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, id: null, active: false })}
        onConfirm={confirmStatusChange}
        title="Change Section Status"
        message={`Are you sure you want to ${confirmModal.active ? 'activate' : 'deactivate'} this section?`}
        confirmLabel={confirmModal.active ? 'Activate' : 'Deactivate'}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete About Section"
        message="Are you sure you want to delete this section? This action cannot be undone."
      />
    </div>
  );
};

export default AboutSectionList;
