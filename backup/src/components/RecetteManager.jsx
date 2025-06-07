import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:1337/api/recettes';

export default function RecetteManager() {
  const [recettes, setRecettes] = useState([]);
  const [form, setForm] = useState({
    titre: '',
    description: '',
    ingredients: [],
    steps: [],
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchRecettes();
  }, []);

  const fetchRecettes = async () => {
    const res = await axios.get(API_URL);
    setRecettes(res.data.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const payload = {
      data: {
        ...form,
        ingredients: JSON.parse(form.ingredients || '[]'),
        steps: JSON.parse(form.steps || '[]'),
      },
    };

    if (editId) {
      await axios.put(`${API_URL}/${editId}`, payload);
    } else {
      await axios.post(API_URL, payload);
    }
    setForm({ titre: '', description: '', ingredients: '[]', steps: '[]' });
    setEditId(null);
    fetchRecettes();
  };

  const handleEdit = (recette) => {
    setEditId(recette.id);
    setForm({
      titre: recette.attributes.titre || '',
      description: recette.attributes.description || '',
      ingredients: JSON.stringify(recette.attributes.ingredients || [], null, 2),
      steps: JSON.stringify(recette.attributes.steps || [], null, 2),
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchRecettes();
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestion des Recettes</h1>

      <input
        name="titre"
        placeholder="Titre"
        value={form.titre}
        onChange={handleChange}
        className="border p-2 mb-2 w-full"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border p-2 mb-2 w-full"
      />
      <textarea
        name="ingredients"
        placeholder="Ingrédients (JSON)"
        value={form.ingredients}
        onChange={handleChange}
        className="border p-2 mb-2 w-full h-24 font-mono"
      />
      <textarea
        name="steps"
        placeholder="Étapes (JSON)"
        value={form.steps}
        onChange={handleChange}
        className="border p-2 mb-2 w-full h-24 font-mono"
      />

      <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
        {editId ? 'Mettre à jour' : 'Créer'}
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Liste des Recettes</h2>
        <ul>
          {recettes.map((r) => (
            <li key={r.id} className="border p-2 mb-2">
              <div className="flex justify-between items-center">
                <div>
                  <strong>{r.attributes.titre}</strong> — {r.attributes.description}
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleEdit(r)} className="text-yellow-600">Éditer</button>
                  <button onClick={() => handleDelete(r.id)} className="text-red-600">Supprimer</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
