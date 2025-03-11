import { Button } from "@/components/ui/button";
import { MemberModal } from "@/components/ViewMembers/MemberModal";
import { ViewMembersView } from "@/components/ViewMembers/ViewMembersView";
import { Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ViewMembers = () => {
  const [openModal, setOpenModal] = React.useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleOpenChange = (open: boolean) => {
    setOpenModal(open);

    if (open) {
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set("modal", "add-member");
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
      new URLSearchParams(location.search).get("modal") === "add-member";
    setOpenModal(currentModalParam);
  }, [location.search]);
  return (
    <div className="px-16">
      <div>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <p className="font-bold text-xl">Manage Members</p>
            <span className="text-sm text-muted-foreground">
              View your members
            </span>
          </div>
          <div>
            <Button
              variant={"default"}
              onClick={() => {
                handleOpenChange(true);
              }}
            >
              <Plus /> Add Members
            </Button>
          </div>
        </div>
        <ViewMembersView />
      </div>
      {openModal && (
        <MemberModal open={openModal} openChange={handleOpenChange} />
      )}
    </div>
  );
};
