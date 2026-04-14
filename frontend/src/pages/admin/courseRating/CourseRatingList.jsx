import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseRatings, deleteCourseRating } from "./slice";
import { selectCourseRatingList, selectCourseRatingLoading } from "./selector";
import DataTable from "@/components/ui/DataTable";
import PageTitle from "@/components/ui/PageTitle";
import ActionIcon from "@/components/ui/ActionIcon";
import DeleteConfirmationModal from "../../../components/ui/modal/deleteConfirmation";
import { MdDelete, MdStar } from "react-icons/md";

const CourseRatingList = () => {
  const dispatch = useDispatch();
  const ratings = useSelector(selectCourseRatingList);
  const isLoading = useSelector(selectCourseRatingLoading);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchCourseRatings());
  }, [dispatch]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteCourseRating(deleteId));
    setShowDeleteModal(false);
  };

  const columns = useMemo(() => [
    { header: "Course", accessorKey: "course.title", cell: ({ getValue }) => <span className="font-bold text-main">{getValue()}</span> },
    { header: "User", accessorKey: "user.user_name" },
    { 
      header: "Rating", 
      accessorKey: "rating",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1 text-yellow-500 font-black italic">
          {getValue()} <MdStar />
        </div>
      )
    },
    { header: "Comment", accessorKey: "comment", cell: ({ getValue }) => <p className="max-w-xs truncate text-gray-500 font-medium">{getValue() || "-"}</p> },
    { header: "Date", accessorKey: "createdAt", cell: ({ getValue }) => new Date(getValue()).toLocaleDateString() },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ActionIcon 
            icon={MdDelete} 
            onClick={() => handleDeleteClick(row.original.id)} 
            variant="danger"
            title="Delete Rating"
          />
        </div>
      )
    }
  ], []);

  return (
    <div className="p-4 rounded-3xl bg-white shadow-sm border border-gray-100 min-h-[calc(100vh-120px)]">
      <div className="mb-6">
        <PageTitle title="Course Ratings" subtitle="Moderate course feedback" />
      </div>
      <DataTable columns={columns} data={ratings} isLoading={isLoading} />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        isLoading={isLoading}
        title="Delete Course Rating"
        message="Are you sure you want to delete this course rating? This action will permanently remove the feedback."
      />
    </div>
  );
};

export default CourseRatingList;
