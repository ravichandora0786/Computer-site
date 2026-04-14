import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlatformRatings, deletePlatformRating } from "./slice";
import { selectPlatformRatingList, selectPlatformRatingLoading } from "./selector";
import DataTable from "@/components/ui/DataTable";
import PageTitle from "@/components/ui/PageTitle";
import ActionIcon from "@/components/ui/ActionIcon";
import DeleteConfirmationModal from "../../../components/ui/modal/deleteConfirmation";
import { MdDelete, MdStar, MdPerson, MdPublic } from "react-icons/md";

const PlatformRatingList = () => {
  const dispatch = useDispatch();
  const ratings = useSelector(selectPlatformRatingList);
  const isLoading = useSelector(selectPlatformRatingLoading);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchPlatformRatings());
  }, [dispatch]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deletePlatformRating(deleteId));
    setShowDeleteModal(false);
  };

  const columns = useMemo(() => [
    { 
       header: "Source", 
       accessorKey: "user_id", 
       cell: ({ row }) => (
         <div className="flex items-center gap-2">
           {row.original.user ? (
             <span className="flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-lg text-xs uppercase italic"><MdPerson /> User</span>
           ) : (
             <span className="flex items-center gap-1 text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded-lg text-xs uppercase italic"><MdPublic /> Guest</span>
           )}
         </div>
       )
    },
    { header: "Name/IP", accessorKey: "id", cell: ({ row }) => <span className="font-bold text-main">{row.original.user?.user_name || row.original.ip_address || "Anonymous"}</span> },
    { 
      header: "Rating", 
      accessorKey: "rating",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1 text-yellow-500 font-black italic text-lg">
          {getValue()} <MdStar />
        </div>
      )
    },
    { header: "Review", accessorKey: "comment", cell: ({ getValue }) => <p className="max-w-md truncate text-gray-500 font-medium italic">{getValue() || "No comment"}</p> },
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
        <PageTitle title="Platform Evaluations" subtitle="Global feedback monitoring" />
      </div>
      <DataTable columns={columns} data={ratings} isLoading={isLoading} />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        isLoading={isLoading}
        title="Delete Rating"
        message="Are you sure you want to delete this platform rating? This action cannot be undone."
      />
    </div>
  );
};

export default PlatformRatingList;
