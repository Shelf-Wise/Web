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
import { Loader2, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useUploadBlobMutation } from "@/state/image/imageApiSlice";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useGetAllGenreQuery } from "@/state/genre/genreApiSlice";

// Define Genre interface based on your API response
interface Genre {
  id: string;
  name: string;
  description: string | null;
}

// Define the form schema with Zod
const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().min(1, "ISBN is required"),
  publicationYear: z.string().min(1, "Publication year is required"),
  imageUrl: z.any(),
  genreIds: z.array(z.string()).default([]),
});

type BookForm = z.infer<typeof bookFormSchema>;

interface AddBookModalProps {
  open: boolean;
  openChange: (open: boolean) => void;
}

export const AddBookModal = ({ open, openChange }: AddBookModalProps) => {
  const [addBook] = useAddBookMutation();
  const [updateBook] = useUpdateBookMutation();
  const [uploadBlob, { isLoading: uploadingImage }] = useUploadBlobMutation();
  const { data: genresData, isLoading: isLoadingGenre } = useGetAllGenreQuery();
  const [bookId, setBookId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    "https://ui.shadcn.com/placeholder.svg"
  );
  const [selectedGenreId, setSelectedGenreId] = useState<string>("");
  const location = useLocation();
  const initialUrlChecked = useRef(false);

  console.log("GeneD", genresData);


  const isEditMode = !!bookId;


  const { data: bookData, isLoading: isBookLoading } = useGetBookByIdQuery(
    bookId || "",
    {
      skip: !bookId,
      refetchOnMountOrArgChange: true,
    }
  );

  const form = useForm<BookForm>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      publicationYear: "",
      imageUrl: z.string(),
      genreIds: [],
    },
  });

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
        imageUrl: bookData.value.imageUrl || "",
        genreIds: bookData.value.genreIds || [],
      });

      if (bookData.value.imageUrl) {
        setPreviewUrl(bookData.value.imageUrl);
      }
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
        genreIds: [],
      });
      setBookId(null);
      setPreviewUrl("https://ui.shadcn.com/placeholder.svg");
      setSelectedGenreId("");
    }
  }, [open, form]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const imageData = new FormData();
        imageData.append('file', file);

        const result = await uploadBlob(imageData).unwrap();

        if (result?.url) {
          form.setValue("imageUrl", result.url);
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
  };

  // Add selected genre to form
  const addGenre = () => {
    if (!selectedGenreId) return;

    const currentGenreIds = form.getValues("genreIds");
    if (!currentGenreIds.includes(selectedGenreId)) {
      form.setValue("genreIds", [...currentGenreIds, selectedGenreId]);
    }

    setSelectedGenreId("");
  };

  // Remove genre from form
  const removeGenre = (genreIdToRemove: string) => {
    const currentGenreIds = form.getValues("genreIds");
    form.setValue(
      "genreIds",
      currentGenreIds.filter(id => id !== genreIdToRemove)
    );
  };

  // Helper to get genre name by ID
  const getGenreNameById = (id: string): string => {
    const genre = genresData?.value.find(g => g.id === id);
    return genre?.name || "Unknown Genre";
  };

  // Form submission handler
  const onSubmit: SubmitHandler<BookForm> = async (data) => {
    try {
      console.log(data, ":oncusd");
      
      if (isEditMode && bookId) {
        await updateBook({
          id: bookId,
          ...data
        }).unwrap();
      } else {
        const updatedData = {
          ...data,
          imageUrl: "https://ui.shadcn.com/placeholder.svg"
        };
        console.log(updatedData);
        await addBook(updatedData).unwrap();
      }

      openChange(false);
    } catch (error) {
      console.error("Failed to save book:", error);
    }
  };

  if (isLoadingGenre || genresData == undefined) {
    console.log("Sttill loading", genresData);
    return <div><Loader2 /></div>
  }
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
                      onChange={handleImageChange}
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

                  {/* Genres Selection */}
                  <FormField
                    control={form.control}
                    name="genreIds"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-start gap-4">
                        <FormLabel className="text-right pt-2">Genres</FormLabel>
                        <div className="col-span-3 space-y-3">
                          <div className="flex items-center gap-2">
                            <Select
                              value={selectedGenreId}
                              onValueChange={setSelectedGenreId}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Genre" />
                              </SelectTrigger>
                              <SelectContent>
                                {genresData?.value && genresData.value.map((genre: Genre) => (
                                  <SelectItem key={genre.id
                                  } value={genre.id}>
                                    {genre.name}
                                  </SelectItem>
                                ))}
                                {(!genresData?.value || genresData.value.length === 0) && (
                                  <SelectItem value="" disabled>
                                    No genres available
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              onClick={addGenre}
                              disabled={!selectedGenreId}
                              size="sm"
                            >
                              Add
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {field.value.map((genreId) => (
                              <Badge
                                key={genreId}
                                variant="secondary"
                                className="flex items-center gap-1 px-3 py-1"
                              >
                                {getGenreNameById(genreId)}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 hover:bg-transparent"
                                  onClick={() => removeGenre(genreId)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                            {field.value.length === 0 && (
                              <span className="text-muted-foreground text-sm">
                                No genres selected
                              </span>
                            )}
                          </div>
                          <FormMessage />
                        </div>
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
                <Button type="submit" disabled={form.formState.isSubmitting || uploadingImage}>
                  {form.formState.isSubmitting || uploadingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Please wait..."}
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