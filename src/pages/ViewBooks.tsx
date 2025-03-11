import { Button } from "@/components/ui/button";
import { AddBookModal } from "@/components/ViewBooks/AddBookModal";
import { ViewBooksView } from "@/components/ViewBooks/ViewBooksView";
import { Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ViewBooks = () => {
  const [openModal, setOpenModal] = React.useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleOpenChange = (open: boolean) => {
    setOpenModal(open);

    if (open) {
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set("modal", "add-book");
      navigate(`${location.pathname}?${newSearchParams.toString()}`, {
        replace: false,
      });
    } else {
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.delete("modal");
      const newSearch = newSearchParams.toString();
      navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ""}`, {
        replace: false,
      });
    }
  };

  useEffect(() => {
    const currentModalParam =
      new URLSearchParams(location.search).get("modal") === "add-book";
    setOpenModal(currentModalParam);
  }, [location.search]);

  return (
    <div className="px-16">
      <div>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <p className="font-bold text-xl">Manage Books</p>
            <span className="text-sm text-muted-foreground">
              View your books
            </span>
          </div>
          <div>
            <Button
              variant={"default"}
              onClick={() => {
                handleOpenChange(true);
              }}
            >
              <Plus /> Add Books
            </Button>
          </div>
        </div>
        <ViewBooksView />
      </div>
      {openModal && (
        <AddBookModal open={openModal} openChange={handleOpenChange} />
      )}
    </div>
  );
};
