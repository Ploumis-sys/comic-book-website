import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";

const LOCAL_STORAGE_KEY = "comic_catalog_data";

export default function ComicCatalog() {
  const [comics, setComics] = useState([]);
  const [title, setTitle] = useState("");
  const [issue, setIssue] = useState("");
  const [publisher, setPublisher] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setComics(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(comics));
  }, [comics]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addComic = () => {
    if (!title || !issue || !publisher || !imageFile) return;
    const newComic = {
      id: uuidv4(),
      title,
      issue,
      publisher,
      imageUrl: imageFile,
    };
    setComics([...comics, newComic]);
    setTitle("");
    setIssue("");
    setPublisher("");
    setImageFile(null);
  };

  const deleteComic = (id) => {
    setComics(comics.filter((comic) => comic.id !== id));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Comic Book Catalog</h1>
      <div className="grid gap-2 mb-4">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Issue Number" value={issue} onChange={(e) => setIssue(e.target.value)} />
        <Input placeholder="Publisher" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        <Button onClick={addComic}>Add Comic</Button>
      </div>
      <div className="grid gap-4">
        {comics.map((comic) => (
          <Card key={comic.id} className="flex flex-col gap-2 p-4">
            <CardContent className="flex flex-col">
              <span className="font-bold text-lg">{comic.title} #{comic.issue}</span>
              <span className="text-sm text-gray-500 mb-2">{comic.publisher}</span>
              {comic.imageUrl && (
                <img src={comic.imageUrl} alt={`${comic.title} cover`} className="max-w-full h-auto rounded" />
              )}
            </CardContent>
            <Button variant="destructive" onClick={() => deleteComic(comic.id)}>
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
