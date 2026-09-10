import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { adminService } from "../../services/admin";
import type { UserListItem, PaginationInfo } from "../../types/admin";
import toast from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner";
import AlertModal from "../AlertModal";

const UserAvatar: React.FC<{ user: UserListItem }> = ({ user }) => {
  const [imgError, setImgError] = useState(false);

  const getInitials = () => {
    if (user.fullname) {
      const names = user.fullname.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return names[0].substring(0, 2).toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  if (user.profilePicture && !imgError) {
    return (
      <img
        src={user.profilePicture}
        alt={user.username}
        className="w-10 h-10 rounded-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold tracking-wider">
      {getInitials()}
    </div>
  );
};

const UserManagementTable: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers({
        page: pagination.page,
        limit: pagination.limit,
        search,
        role: roleFilter,
        status: statusFilter,
      });

      if (response.success && response.data) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      } else {
        toast.error(response.message || "Failed to fetch users");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [
    pagination.page,
    pagination.limit,
    search,
    roleFilter,
    statusFilter,
    subscriptionFilter,
  ]);

  const handleDelete = async (user: UserListItem) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    try {
      setIsDeleting(true);
      const response = await adminService.deleteUser(deletingUser._id);
      if (response.success) {
        toast.success("User deleted successfully");
        setShowDeleteModal(false);
        setDeletingUser(null);
        fetchUsers();
      } else {
        toast.error(response.message || "Failed to delete user");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusToggle = async (user: UserListItem) => {
    try {
      const newStatus = user.status === 1 ? 0 : 1;
      const response = await adminService.updateUser(user._id, {
        status: newStatus,
      });

      if (response.success) {
        toast.success(
          `User ${newStatus === 1 ? "activated" : "deactivated"} successfully`
        );
        fetchUsers();
      } else {
        toast.error(response.message || "Failed to update user status");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update user status");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-[#1A1A1A] rounded-xl p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-white text-2xl font-bold mb-4">User Management</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0D0D0D] text-white pl-10 pr-4 py-2 rounded-lg border border-[#242424] focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#0D0D0D] text-white px-4 py-2 rounded-lg border border-[#242424] focus:outline-none focus:border-red-600"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0D0D0D] text-white px-4 py-2 rounded-lg border border-[#242424] focus:outline-none focus:border-red-600"
          >
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>

          {/* Subscription Filter */}
          <select
            value={subscriptionFilter}
            onChange={(e) => setSubscriptionFilter(e.target.value)}
            className="bg-[#0D0D0D] text-white px-4 py-2 rounded-lg border border-[#242424] focus:outline-none focus:border-red-600"
          >
            <option value="">All Plans</option>
            <option value="Free">Free</option>
            <option value="Go">Go</option>
            <option value="Go Student">Go Student</option>
            <option value="Pro">Pro</option>
            <option value="Business">Business</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#242424]">
              <th className="text-left text-gray-400 font-medium py-3 px-4">
                User
              </th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">
                Email
              </th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">
                Role
              </th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">
                Plan
              </th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">
                Status
              </th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">
                Login Type
              </th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">
                Joined
              </th>
              <th className="text-right text-gray-400 font-medium py-3 px-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-8">
                  <div className="flex justify-center">
                    <LoadingSpinner />
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  onClick={() => navigate(`/admin-dashboard/users/${user._id}`)}
                  className="border-b border-[#242424] hover:bg-[#151515] transition-colors cursor-pointer"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} />
                      <div>
                        <div className="text-white font-medium">
                          {user.username}
                        </div>
                        {user.fullname && (
                          <div className="text-gray-400 text-sm">
                            {user.fullname}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-white">{user.email}</div>
                    {user.isEmailVerified ? (
                      <div className="text-green-400 text-xs flex items-center gap-1 mt-1">
                        <FaCheck className="text-xs" /> Verified
                      </div>
                    ) : (
                      <div className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                        <FaTimes className="text-xs" /> Not verified
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-red-600/20 text-red-400"
                          : "bg-blue-600/20 text-blue-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-purple-600/20 text-purple-400 capitalize">
                      {user.subscription || "free"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusToggle(user);
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.status === 1
                          ? "bg-green-600/20 text-green-400"
                          : "bg-gray-600/20 text-gray-400"
                      }`}
                    >
                      {user.status === 1 ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{user.loginType}</td>
                  <td className="py-4 px-4 text-gray-300">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(user);
                        }}
                        className="p-2 hover:bg-red-600/20 rounded transition-colors"
                        title="Delete user"
                        aria-label="Delete user"
                      >
                        <FaTrash className="text-red-400 text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-gray-400 text-sm">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} users
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Rows per page:</span>
              <select
                value={pagination.limit}
                onChange={(e) =>
                  setPagination((prev) => ({
                    ...prev,
                    limit: Number(e.target.value),
                    page: 1,
                  }))
                }
                className="bg-[#0D0D0D] text-white px-2 py-1 rounded border border-[#242424] focus:outline-none focus:border-red-600"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="px-3 py-1 bg-[#0D0D0D] text-white rounded-lg border border-[#242424] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#151515] transition-colors text-sm"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    // Logic to show a window of pages around current page
                    let pageNum = i + 1;
                    if (pagination.pages > 5) {
                      if (pagination.page > 3) {
                        pageNum = pagination.page - 2 + i;
                      }
                      if (pageNum > pagination.pages) {
                        pageNum = pagination.pages - 4 + i;
                      }
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() =>
                          setPagination((prev) => ({ ...prev, page: pageNum }))
                        }
                        className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm transition-colors ${
                          pagination.page === pageNum
                            ? "bg-red-600 border-red-600 text-white"
                            : "bg-[#0D0D0D] border-[#242424] text-gray-400 hover:bg-[#151515] hover:text-white"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 bg-[#0D0D0D] text-white rounded-lg border border-[#242424] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#151515] transition-colors text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete User Modal */}
      <AlertModal
        isOpen={showDeleteModal}
        type="danger"
        action="delete"
        title="Delete User"
        message={
          deletingUser ? (
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">
                {deletingUser.fullname || deletingUser.username}
              </span>{" "}
              (<span className="text-white/70">{deletingUser.email}</span>)?
              This action cannot be undone and will permanently remove all user
              data.
            </>
          ) : (
            ""
          )
        }
        confirmText="Delete User"
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingUser(null);
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </div>
  );
};

export default UserManagementTable;
