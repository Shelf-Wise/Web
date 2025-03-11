import { Book, BookStatus, mapBookEnum } from "@/types/Book";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, TrashIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define an interface for the column props
interface ColumnProps {
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

// Export columns as a function that accepts action handlers
export const columns = ({
  onDelete,
  onEdit,
}: ColumnProps): ColumnDef<Book>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 font-medium"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "author",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium"
        >
          Author
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "publicationYear", // Changed from publicationYear to match API
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 font-medium"
        >
          Publication Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: BookStatus = row.original.status;

      const statusVariant: Record<BookStatus, string> = {
        [BookStatus.AVAILABLE]: "available",
        [BookStatus.BORROWED]: "borrowed",
        [BookStatus.DAMAGED]: "damaged",
      };

      return (
        <Badge
          variant={
            statusVariant[status] as "available" | "borrowed" | "damaged"
          }
          className="px-3 py-1"
        >
          {mapBookEnum[status]}
        </Badge>
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
            onClick={() => onEdit(row.original.id)}
            title="Edit book"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(row.original.id)}
            title="Delete book"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
