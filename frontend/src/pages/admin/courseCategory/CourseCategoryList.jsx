import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineModeEdit, MdDelete } from "react-icons/md";
import DataTable from "../../../components/ui/DataTable";
import PageTitle from "../../../components/ui/PageTitle";
import PrimaryButton from "../../../components/ui/button/PrimaryButton";
import DeleteConfirmationModal from "../../../components/ui/modal/deleteConfirmation";
import ToggleButton from "../../../components/ui/ToggleButton";
import ConfirmationModal from "../../../components/ui/modal/ConfirmationModal";
import ActionIcon from "../../../components/ui/ActionIcon";
import { getAllCategories, deleteCategory, updateCategory } from "./slice";
import { selectCategoryList, selectIsLoading, selectPagination } from "./selector";
import { endPoints } from "../../../request";

export default function CourseCategoryList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categoryList = useSelector(selectCategoryList);
  const isLoading = useSelector(selectIsLoading);
  const pagination = useSelector(selectPagination);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null, active: false });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = (page = 1, limit = 10) => {
    dispatch(getAllCategories({ page, limit }));
  };

  const handleStatusToggle = (id, active) => {
    setConfirmModal({ open: true, id, active });
  };

  const confirmStatusChange = () => {
    dispatch(updateCategory({
      id: confirmModal.id,
      is_active: confirmModal.active,
      onSuccess: () => {
        fetchCategories(pagination.currentPage, pagination.limit);
        setConfirmModal({ ...confirmModal, open: false });
      }
    }));
  };

  const handleDelete = () => {
    dispatch(
      deleteCategory({
        id: deleteId,
        onSuccess: () => {
          setShowDeleteModal(false);
          fetchCategories(pagination.currentPage, pagination.limit);
        },
      })
    );
  };

  const columns = useMemo(() => [
    {
      header: "Title",
      accessorKey: "title",
      cell: ({ getValue, row }) => (
        <span className="font-semibold text-gray-900 dark:text-white text-sm">
          {getValue() || row.original.title}
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
          onChange={(checked) => handleStatusToggle(row.original.id || row.original._id, checked)}
        />
      ),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-1.5">
          <ActionIcon 
            icon={MdOutlineModeEdit} 
            onClick={() => navigate(`/admin/course-categories/edit/${row.original.id || row.original._id}`)} 
            variant="primary"
            title="Edit Category"
          />
          <ActionIcon 
            icon={MdDelete} 
            onClick={() => {
              setDeleteId(row.original.id || row.original._id);
              setShowDeleteModal(true);
            }} 
            variant="danger"
            title="Delete Category"
          />
        </div>
      ),
    },
  ], [pagination]);

  return (
    <div className="p-3 md:p-4 min-h-[calc(100vh-120px)]">
      <div className="flex flex-row md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 md:p-6 rounded-[10px] border border-gray-100 shadow-sm mb-6">
        <PageTitle
          title="Course Categories"
          subtitle="Taxonomy Management Center"
        />
        <PrimaryButton
          name="New Category"
          link="/admin/course-categories/add"
        />
      </div>

      <DataTable
        columns={columns}
        data={categoryList}
        isLoading={isLoading}
        isReorderable={true}
        reorderApiUrl={endPoints.ReorderCourseCategory}
        isServerSide={true}
        totalItems={pagination.totalItems}
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
        pageSize={pagination.limit}
        onPageChange={(page) => fetchCategories(page, pagination.limit)}
        onPageSizeChange={(limit) => fetchCategories(1, limit)}
        onReorderSuccess={() => fetchCategories(pagination.currentPage, pagination.limit)}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={isLoading}
        title="Delete Category"
        message="Are you sure you want to delete this category? This will permanently remove it from the studio."
      />

      <ConfirmationModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ ...confirmModal, open: false })}
        onConfirm={confirmStatusChange}
        isLoading={isLoading}
        title="Change Category Status"
        message={`Are you sure you want to ${confirmModal.active ? "activate" : "deactivate"} this category?`}
        confirmLabel={confirmModal.active ? "Activate" : "Deactivate"}
        variant="primary"
      />
    </div>
  );
}
