import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEdit, MdDelete, MdVisibility, MdLayers } from "react-icons/md";
import { toast } from "react-toastify";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses, updateCourseStatus, deleteCourse } from "./slice";
import { selectCourseList, selectPagination } from "./selector";
import DeleteConfirmationModal from "../../../components/ui/modal/deleteConfirmation";
import ActionIcon from "../../../components/ui/ActionIcon";
import DataTable from "../../../components/ui/DataTable";
import DynamicPreview from "../../../components/ui/DynamicPreview";
import PageTitle from "../../../components/ui/PageTitle";
import PrimaryButton from "../../../components/ui/button/PrimaryButton";
import SelectDropDown from "../../../components/ui/selectDropDown";
import { COURSE_STATUS_OPTIONS } from "../../../constants/dropdown";

export default function CourseList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const courseList = useSelector(selectCourseList);
  const pagination = useSelector(selectPagination);

  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = (page = 1, limit = 10) => {
    setIsLoading(true);
    dispatch(
      getAllCourses({
        page,
        limit,
        onSuccess: () => setIsLoading(false),
        onFailure: () => setIsLoading(false),
      })
    );
  };

  const handleCourseStatus = (id, status) => {
    dispatch(
      updateCourseStatus({
        id,
        status,
        onSuccess: (res) => {
          toast.success(res?.message || "Status updated successfully");
          fetchCourses(pagination.currentPage, pagination.limit);
        },
      })
    );
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setIsLoading(true);
    dispatch(
      deleteCourse({
        id: deleteId,
        onSuccess: (res) => {
          toast.success(res?.message || "Course deleted successfully");
          setShowDeleteModal(false);
          setIsLoading(false);
          fetchCourses(pagination.currentPage, pagination.limit);
        },
        onFailure: (err) => {
          setIsLoading(false);
          toast.error(err?.message || "Something went wrong");
        }
      })
    );
  };

  const columns = useMemo(() => [
    {
      header: "Media",
      id: "media_preview",
      cell: ({ row }) => {
        const mediaList = row.original?.media || [];
        const firstMedia = [...mediaList].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))[0];

        return (
          <DynamicPreview
            src={firstMedia?.url}
            type={firstMedia?.media_type || 'image'}
          />
        );
      },
    },
    {
      header: "Title",
      accessorKey: "title",
      cell: ({ row }) => (
        <Link
          to={`/admin/courses/edit/${row.original.id}`}
          className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      header: "Category",
      accessorKey: "category.title",
      cell: ({ row }) => (
        <span className="px-2 py-1 rounded-md text-xs font-bold bg-gray-50 border border-gray-100 text-gray-600">
          {row.original?.category?.title || "N/A"}
        </span>
      ),
    },
    {
      header: "Teacher",
      accessorKey: "author_details.user_name",
      cell: ({ row }) => row.original?.author_details?.user_name || "N/A",
    },
    {
      header: "Start Date",
      accessorKey: "publish_date",
    },
    {
      header: "Access",
      accessorKey: "access_type",
      cell: ({ row }) => (
        <span className={clsx(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          row.original.access_type === 'Paid' 
            ? "bg-amber-50 text-amber-700 border-amber-200" 
            : "bg-emerald-50 text-emerald-700 border-emerald-200"
        )}>
          {row.original.access_type || "Free"}
        </span>
      ),
    },
    {
      header: "Mode",
      accessorKey: "course_mode",
      cell: ({ row }) => (
        <span className={clsx(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
          row.original.course_mode === 'Online' 
            ? "bg-blue-50 text-blue-700 border-blue-200" 
            : "bg-purple-50 text-purple-700 border-purple-200"
        )}>
          {row.original.course_mode || "Online"}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <div className="w-32">
            <SelectDropDown
              value={row.original.status}
              onChange={(e) => handleCourseStatus(row.original.id, e.target.value)}
              options={COURSE_STATUS_OPTIONS}
            />
          </div>
        </div>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center items-center gap-1.5">
          <ActionIcon 
            icon={MdVisibility} 
            onClick={() => navigate(`/admin/courses/view/${row.original.id}`)} 
            variant="secondary"
            title="View Course"
          />
          <ActionIcon 
            icon={MdEdit} 
            onClick={() => navigate(`/admin/courses/edit/${row.original.id}`)} 
            variant="primary"
            title="Edit Course"
          />
          <ActionIcon 
            icon={MdDelete} 
            onClick={() => handleDeleteClick(row.original.id)} 
            variant="danger"
            title="Delete Course"
          />
          <ActionIcon 
            icon={MdLayers} 
            onClick={() => navigate(`/admin/courses/content/${row.original.id}`)} 
            variant="success"
            title="Manage Content"
          />
        </div>
      ),
    },
  ], [pagination]);

  return (
    <div className="p-3 md:p-4 min-h-[calc(100vh-120px)]">
      <div className="flex flex-row sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 md:p-6 rounded-[10px] border border-gray-100 shadow-sm mb-6">
        <PageTitle
          title="Course Studio"
          subtitle="Global Curriculum Sync"
        />
        <PrimaryButton
          name="New Course"
          link="/admin/courses/add"
        />
      </div>

      <DataTable
        columns={columns}
        data={courseList}
        isLoading={isLoading}
        isServerSide={true}
        totalItems={pagination.totalItems}
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
        pageSize={pagination.limit}
        onPageChange={(page) => fetchCourses(page, pagination.limit)}
        onPageSizeChange={(limit) => fetchCourses(1, limit)}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        isLoading={isLoading}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action will permanently remove it and all its associated materials."
      />
    </div>
  );
}
