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
    <tr className="hover:bg-gray-50">
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        {user.name || "N/A"}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        {user.email || "N/A"}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <RoleBadge role={user.role || "USER"} />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        {formatDate(user.createdAt)}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <UserRoleForm user={user} />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="rounded-md bg-blue-50 p-1 text-blue-700 hover:bg-blue-100"
            title="Edit user"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="rounded-md bg-red-50 p-1 text-red-700 hover:bg-red-100"
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
  let badgeClasses = "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium";
  
  switch (role) {
    case "ADMIN":
      badgeClasses += " bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20";
      break;
    case "TRAINER":
      badgeClasses += " bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20";
      break;
    default: // USER
      badgeClasses += " bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20";
      break;
  }
  
  return <span className={badgeClasses}>{role}</span>;
}
