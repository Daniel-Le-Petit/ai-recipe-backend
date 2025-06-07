import { useState } from "react";
import axios from "axios";

export default function NouvelleRecette() {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Upload image
    let imageId = null;
    if (image) {
      const formData = new FormData();
      formData.append("files", image);

      const resUpload = await axios.post("http://localhost:1338/api/upload", formData);
      imageId = resUpload.data[0].id;
    }

    // 2. Créer la recette
    const payload = {
      data: {
        titre,
        description,
        ingredients: JSON.parse(ingredients),
        image: imageId,
      },
    };

    await axios.post("http://localhost:1338/api/recettes", payload);
    alert("Recette créée !");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Nouvelle Recette</h1>

      <input type="text" placeholder="Titre" value={titre} onChange={(e) => setTitre(e.target.value)} className="border p-2 w-full mb-3" />

      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full mb-3" />

      <textarea placeholder="Ingrédients (JSON)" value={ingredients} onChange={(e) => setIngredients(e.target.value)} className="border p-2 w-full mb-3" />

      <input type="file" onChange={(e) => setImage(e.target.files[0])} className="mb-3" />

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Créer</button>
    </form>
  );
}
