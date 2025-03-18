import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllGenreQuery, useAddGenreMutation } from "@/state/genre/genreApiSlice";

const GenreHandle: React.FC = () => {
  const [genreName, setGenreName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  
  // RTK Query hooks
  const { data: genreData, isLoading, refetch } = useGetAllGenreQuery();
  const [addGenre, { isLoading: isAddingGenre }] = useAddGenreMutation();
  
  const genres = genreData?.value || [];

  const addOrUpdateGenre = async () => {
    if (genreName.trim() === "") return;
    
    try {
      if (editId !== null) {
        // Update existing genre
        await addGenre({ id: editId, name: genreName }).unwrap();
      } else {
        // Add new genre
        if (!genres.some((g) => g.name === genreName)) {
          await addGenre({ name: genreName }).unwrap();
        }
      }
      
      setGenreName("");
      setEditId(null);
      refetch(); // Refresh the genres list
    } catch (error) {
      console.error("Failed to save genre:", error);
    }
  };

  const editGenre = (id: string) => {
    const genreToEdit = genres.find((genre) => genre.id === id);
    if (genreToEdit) {
      setGenreName(genreToEdit.name);
      setEditId(id);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-4">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Manage Genres</h2>
          <div className="flex gap-4 items-center">
            <Input
              type="text"
              value={genreName}
              onChange={(e) => setGenreName(e.target.value)}
              placeholder="Enter genre name"
              className="flex-grow max-w-xs"
            />
            <Button 
              onClick={addOrUpdateGenre} 
              disabled={isAddingGenre || genreName.trim() === ""}
            >
              {isAddingGenre ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editId ? "Updating..." : "Adding..."}
                </>
              ) : (
                editId ? "Update" : "Add"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Genre Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {genres.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4 text-gray-500">
                      No genres found. Add a new genre to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  genres.map((genre) => (
                    <TableRow key={genre.id}>
                      <TableCell>{genre.name}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => editGenre(genre.id!)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GenreHandle;