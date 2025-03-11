// import { Book, BookStatus } from "@/types/Book";
import { DataTable } from "../tanstack-table/data-table";
import { columns } from "./table/columns";
import {
  useGetBooksQuery,
  useDeleteBookMutation,
} from "@/state/book/BookApiSlice";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AddBookModal } from "./AddBookModal";

export const ViewBooksView = () => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: apiData, isLoading, isError } = useGetBooksQuery();
  const [deleteBook] = useDeleteBookMutation();

  // Check URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const modalParam = searchParams.get("modal");
    // const idParam = searchParams.get("id");

    if (
      (modalParam === "edit-book" || modalParam === "add-book") &&
      !openModal
    ) {
      setOpenModal(true);
    }
  }, [location.search, openModal]);

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id).unwrap();
      console.log("Book deleted successfully");
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
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
    newSearchParams.set("modal", "edit-book");
    newSearchParams.set("id", id);

    navigate(`${location.pathname}?${newSearchParams.toString()}`, {
      replace: false,
    });
  };

  // const handleAddNew = () => {
  //   const newSearchParams = new URLSearchParams(location.search);
  //   newSearchParams.set("modal", "add-book");
  //   newSearchParams.delete("id");

  //   navigate(`${location.pathname}?${newSearchParams.toString()}`, {
  //     replace: false,
  //   });
  // };

  if (isLoading) {
    return <div className="w-full mt-5 text-center">Loading books...</div>;
  }

  if (isError) {
    console.error("Failed to fetch books:");
    return (
      <div className="w-full mt-5">
        <div className="text-red-500 mb-4">Error loading books.</div>
      </div>
    );
  }

  const booksWithActions = columns({
    onDelete: handleDelete,
    onEdit: handleEdit,
  });

  return (
    <div className="w-full mt-5">
      {/* <div className="flex justify-between mb-4"></div> */}
      <DataTable columns={booksWithActions} data={apiData?.value || []} />
      {openModal && (
        <AddBookModal open={openModal} openChange={handleOpenChange} />
      )}
    </div>
  );
};
