import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, TrashIcon } from "lucide-react";
import { Member } from "@/types/Member";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ColumnProps {
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const columns = ({
  onDelete,
  onEdit,
}: ColumnProps): ColumnDef<Member, unknown>[] => [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 font-medium"
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fullNamesplit = row.original.fullName.split(" ");
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={`${row.original.imageURL}`} />
            <AvatarFallback>{`${
              fullNamesplit[0].charAt(0) + fullNamesplit[1].charAt(0)
            }`}</AvatarFallback>
          </Avatar>
          <span>{row.original.fullName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "NIC",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 font-medium text-center"
        >
          Books Borrowed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-center">{row.original.noOfBooksBorrowed}</span>
      );
    },
  },
  {
    accessorKey: "Actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              onEdit(row.original.id);
            }}
          >
            <Edit />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onDelete(row.original.id);
            }}
          >
            <TrashIcon />
          </Button>
        </div>
      );
    },
  },
];
