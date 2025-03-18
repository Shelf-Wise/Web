import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { Edit } from "lucide-react";

interface Genre {
  id: number;
  name: string;
}

const GenreHandle: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]); // Empty initial state for genres
  const [genreName, setGenreName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const addOrUpdateGenre = () => {
    if (genreName.trim() === "") return;
    if (editId !== null) {
      setGenres(
        genres.map((genre) =>
          genre.id === editId ? { ...genre, name: genreName } : genre
        )
      );
      setEditId(null);
    } else {
      if (!genres.some((g) => g.name === genreName)) {
        setGenres([...genres, { id: Date.now(), name: genreName }]);
      }
    }
    setGenreName("");
  };

  const editGenre = (id: number) => {
    const genreToEdit = genres.find((genre) => genre.id === id);
    if (genreToEdit) {
      setGenreName(genreToEdit.name);
      setEditId(id);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="p-4 mb-4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Manage Genres</h2>
          <div className="flex gap-4 items-center">
            <Button onClick={addOrUpdateGenre} className="order-1">
              {editId ? "Update" : "Add"}
            </Button>
            <Input
              type="text"
              value={genreName}
              onChange={(e) => setGenreName(e.target.value)}
              placeholder="Enter genre name"
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table>
            <thead>
              <tr>
                
                <th className="text-left">Genre Type</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((genre) => (
                <tr key={genre.id}>
                  <td>{genre.name}</td>
                  <td className="text-center flex gap-2 justify-center">
                    <Button variant="outline" onClick={() => editGenre(genre.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GenreHandle;
