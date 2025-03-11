import { DialogDescription } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
  useAddBookMutation,
  useGetBookByIdQuery,
  useUpdateBookMutation,
} from "@/state/book/BookApiSlice";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";

// Define the form schema with Zod
const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().min(1, "ISBN is required"),
  publicationYear: z.string().min(1, "Publication year is required"),
  coverImage: z.any().optional(),
  // Add more fields as needed
});

type BookForm = z.infer<typeof bookFormSchema>;

interface AddBookModalProps {
  open: boolean;
  openChange: (open: boolean) => void;
}

export const AddBookModal = ({ open, openChange }: AddBookModalProps) => {
  const [addBook] = useAddBookMutation();
  const [updateBook] = useUpdateBookMutation();
  const [bookId, setBookId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    "https://ui.shadcn.com/placeholder.svg"
  );
  const location = useLocation();
  const initialUrlChecked = useRef(false);

  // Determine if we're in edit mode
  const isEditMode = !!bookId;

  // Fetch book data if we're in edit mode
  const { data: bookData, isLoading: isBookLoading } = useGetBookByIdQuery(
    bookId || "",
    {
      skip: !bookId,
      refetchOnMountOrArgChange: true,
    }
  );

  // Setup form with validation
  const form = useForm<BookForm>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      publicationYear: "",
    },
  });

  // Check URL parameters for edit mode
  useEffect(() => {
    if (initialUrlChecked.current) return;

    const searchParams = new URLSearchParams(location.search);
    const modalParam = searchParams.get("modal");
    const idParam = searchParams.get("id");

    if (modalParam === "edit-book" && idParam) {
      setBookId(idParam);
      openChange(true);
    } else if (modalParam === "add-book") {
      setBookId(null);
      openChange(true);
    }

    initialUrlChecked.current = true;
  }, [location.search, openChange]);

  // Update form values when book data is loaded
  useEffect(() => {
    if (bookData?.value && isEditMode) {
      form.reset({
        title: bookData.value.title || "",
        author: bookData.value.author || "",
        isbn: bookData.value.isbn || "",
        publicationYear: bookData.value.publicationYear?.toString() || "",
      });

      // if (bookData.value.coverImage) {
      //   setPreviewUrl(bookData.value.coverImage);
      // }
    }
  }, [bookData, form, isEditMode]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.reset({
        title: "",
        author: "",
        isbn: "",
        publicationYear: "",
      });
      setBookId(null);
      setPreviewUrl("https://ui.shadcn.com/placeholder.svg");
    }
  }, [open, form]);

  // Handle image file changes
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPreviewUrl(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //     form.setValue("coverImage", file);
  //   }
  // };

  // Form submission handler
  const onSubmit: SubmitHandler<BookForm> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("author", data.author);
      formData.append("isbn", data.isbn);
      formData.append("publishYear", data.publicationYear);

      if (data.coverImage) {
        formData.append("coverImage", data.coverImage);
      }

      if (isEditMode && bookId) {
        formData.append("id", bookId);
        await updateBook(form.getValues()).unwrap();
      } else {
        await addBook(form.getValues()).unwrap();
      }

      openChange(false);
    } catch (error) {
      console.error("Failed to save book:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Book</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[925px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditMode ? "Update Book" : "Add Book"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {isEditMode
              ? "Update book information"
              : "Add a new book to your collection"}
          </DialogDescription>
        </DialogHeader>

        {isBookLoading && isEditMode ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading book information...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="gap-4 py-4 flex">
                <div className="space-y-4">
                  <img
                    src={previewUrl}
                    alt="Book Cover"
                    className="w-[200px] h-[300px] object-cover border rounded-md"
                  />
                  <div className="space-y-2">
                    <Label htmlFor="coverImage">Book Cover</Label>
                    <Input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      // onChange={handleImageChange}
                    />
                  </div>
                </div>

                <Separator orientation="vertical" className="mx-4" />

                <div className="space-y-4 flex-1">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Book Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Harry Potter"
                            className="col-span-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="col-span-3 col-start-2" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Author</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="J.K. Rowling"
                            className="col-span-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="col-span-3 col-start-2" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isbn"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">ISBN</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="978-3-16-148410-0"
                            className="col-span-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="col-span-3 col-start-2" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="publicationYear"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">
                          Publication Year
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="2005"
                            className="col-span-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="col-span-3 col-start-2" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Saving..."}
                    </>
                  ) : isEditMode ? (
                    "Update Book"
                  ) : (
                    "Add Book"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
