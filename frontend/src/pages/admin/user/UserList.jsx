import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../../components/ui/DataTable";
import clsx from "clsx";
import DynamicPreview from "../../../components/ui/DynamicPreview";
import { getAllUsers, updateUserStatus, deleteUser } from "./slice";
import { selectUserList } from "./selector";
import DeleteConfirmationModal from "../../../components/ui/modal/deleteConfirmation";
import ActionIcon from "../../../components/ui/ActionIcon";
import SelectDropDown from "../../../components/ui/selectDropDown";
import { USER_TYPE_FILTER_OPTIONS } from "../../../constants/dropdown";

export default function UserList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userList = useSelector(selectUserList);

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [userType, dispatch]);

  useEffect(() => {
    setUsers(userList || []);
  }, [userList]);

  const fetchUsers = () => {
    setIsLoading(true);
    dispatch(
      getAllUsers({
        data: {
          user_type: userType || undefined
        },
        onSuccess: () => setIsLoading(false),
        onFailure: () => setIsLoading(false),
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
      deleteUser({
        id: deleteId,
        onSuccess: (res) => {
          toast.success(res?.message || "User deleted successfully");
          setShowDeleteModal(false);
          setIsLoading(false);
          fetchUsers();
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
      header: "Avatar",
      id: "user_avatar",
      cell: ({ row }) => (
        <DynamicPreview
          src={row.original.profile_img}
          isProfile
          size="sm"
        />
      ),
    },
    {
      header: "Name",
      accessorKey: "user_name",
      cell: ({ row }) => <span className="font-semibold text-gray-900">{row.original.user_name}</span>,
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Type",
      accessorKey: "role.type",
      cell: ({ row }) => (
        <span className={clsx(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
          row.original.role?.type === 'admin' ? 'bg-purple-100 text-purple-700' :
            row.original.role?.type === 'teacher' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
        )}>
          {row.original.role?.type || "N/A"}
        </span>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center items-center gap-1.5">
          <ActionIcon 
            icon={MdEdit} 
            onClick={() => navigate(`/admin/users/edit/${row.original.id}`)} 
            variant="primary"
            title="Edit User"
          />
          <ActionIcon 
            icon={MdDelete} 
            onClick={() => handleDeleteClick(row.original.id)} 
            variant="danger"
            title="Delete User"
          />
        </div>
      ),
    },
  ], []);

  return (
    <div className="p-3 md:p-4 min-h-[calc(100vh-120px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-3 md:p-4 rounded-[10px] border border-gray-100 shadow-sm mb-5">
        <div>
          <h5 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight uppercase italic leading-tight">User Directory</h5>
          <p className="text-xs font-bold uppercase tracking-wide text-primary mt-1">Community Governance Hub</p>
        </div>
        <div className="w-full sm:w-56">
          <SelectDropDown
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            options={USER_TYPE_FILTER_OPTIONS}
            placeholder="Search Roles"
            isSearchable={true}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        isLoading={isLoading}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone and will revoke all access."
      />
    </div>
  );
}
