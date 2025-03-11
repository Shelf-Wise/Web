import {
  useDeleteMemberMutation,
  useGetMembersQuery,
} from "@/state/member/MemberApiSlice";
import { DataTable } from "../tanstack-table/data-table";
import { columns } from "./table/columns";
import { useLocation, useNavigate } from "react-router-dom";
import { MemberModal } from "./MemberModal";
import React, { useEffect } from "react";

export const ViewMembersView = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: apiData, isError, isLoading } = useGetMembersQuery();
  const [deleteMember] = useDeleteMemberMutation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const modalParam = searchParams.get("modal");
    const idParam = searchParams.get("id");

    if (modalParam === "edit-member" && idParam) {
      setOpenModal(true);
    }
  }, [location.search]);

  if (isLoading) {
    return <div className="w-full mt-5 text-center">Loading members...</div>;
  }

  if (isError) {
    console.error("Failed to fetch members:");
    return (
      <div className="w-full mt-5">
        <div className="text-red-500 mb-4">Error loading members.</div>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMember(id).unwrap();
      console.log("Member deleted successfully");
    } catch (error) {
      console.error("Failed to delete member:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpenModal(open);

    setOpenModal(open);

    // If modal is being closed, clean up URL params
    if (!open) {
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.delete("modal");
      newSearchParams.delete("id");
      const newSearch = newSearchParams.toString();
      navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ""}`, {
        replace: true, // Using replace to avoid adding to navigation history
      });
    }
  };

  const handleEdit = (id: string) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("modal", "edit-member");
    newSearchParams.set("id", id);

    navigate(`${location.pathname}?${newSearchParams.toString()}`, {
      replace: false,
    });

    handleOpenChange(true);
  };

  const columnWithActions = columns({
    onDelete: handleDelete,
    onEdit: handleEdit,
  });

  return (
    <div className="w-full mt-5">
      <DataTable columns={columnWithActions} data={apiData?.value || []} />
      {openModal && (
        <MemberModal open={openModal} openChange={handleOpenChange} />
      )}
    </div>
  );
};
