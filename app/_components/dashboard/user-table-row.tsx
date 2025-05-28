"use client";

import { useState } from "react";
import UserRoleForm from "./user-role-form";
import UserEditForm from "./user-edit-form";
import UserDeleteForm from "./user-delete-form";
import Modal from "./modal";
import { formatDate } from "@/app/lib/utils";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function UserTableRow({ user }: { user: any }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <tr className="hover:bg-gray-700/30 transition-colors">
      <td className="whitespace-nowrap px-6 py-4 text-sm text-white font-medium">
        {user.name || "N/A"}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
        {user.email || "N/A"}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <RoleBadge role={user.role || "USER"} />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
        {formatDate(user.createdAt)}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <UserRoleForm user={user} />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="rounded-md bg-blue-500/20 p-2 text-blue-400 hover:bg-blue-500/30 transition-colors"
            title="Edit user"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="rounded-md bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30 transition-colors"
            title="Delete user"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit User"
        >
          <UserEditForm user={user} onClose={() => setIsEditModalOpen(false)} />
        </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete User"
        >
          <UserDeleteForm user={user} onClose={() => setIsDeleteModalOpen(false)} />
        </Modal>
      </td>
    </tr>
  );
}

function RoleBadge({ role }: { role: string }) {
  let badgeClasses = "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";

  switch (role) {
    case "ADMIN":
      badgeClasses += " bg-red-500/20 text-red-400 border border-red-500/30";
      break;
    case "TRAINER":
      badgeClasses += " bg-green-500/20 text-green-400 border border-green-500/30";
      break;
    default: // USER
      badgeClasses += " bg-blue-500/20 text-blue-400 border border-blue-500/30";
      break;
  }

  return <span className={badgeClasses}>{role}</span>;
}
