import React, { useState } from "react"
import { ArrowLeft, Upload, ImageIcon } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { getAuthHeader } from "@/utils/auth"

export default function CreateCategoryPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState({
    name: "",
    description: "",
    image: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error[name]) {
      setError(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    setError(prev => ({
      ...prev,
      image: ""
    }));
    
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError(prev => ({
        ...prev,
        image: "Le type de fichier doit être JPG, JPEG ou PNG"
      }));
      e.target.value = "";
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setError(prev => ({
        ...prev,
        image: "La taille du fichier doit être inférieure à 2MB"
      }));
      e.target.value = "";
      return;
    }
    
    setImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let hasError = false;
    const newErrors = { name: "", description: "", image: "" };
    
    if (!formData.name) {
      newErrors.name = "Le nom de la catégorie est requis";
      hasError = true;
    }
    
    if (!formData.description) {
      newErrors.description = "La description est requise";
      hasError = true;
    }
    
    if (!image) {
      newErrors.image = "L'image est requise";
      hasError = true;
    }
    
    if (hasError) {
      setError(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const apiFormData = new FormData();
      apiFormData.append("name", formData.name);
      apiFormData.append("description", formData.description);
      apiFormData.append("image", image);
      
       await axios.post(
        "http://localhost:8000/api/categories",
        apiFormData,
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data"
          }
        }
      );
      
      navigate("/monitor/categories");
    } catch (err) {      
      if (err.response?.data?.errors) {
        const apiErrors = err.response.data.errors;
        setError({
          name: apiErrors.name?.[0] || "",
          description: apiErrors.description?.[0] || "",
          image: apiErrors.image?.[0] || ""
        });
      } else {
        setError("sssssUne erreur s'est produite lors de la création de la catégorie");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <Link to="/monitor/categories" className="flex hover:bg-blue-100 rounded p-2 items-center gap-1 text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} />
          <span>Retour aux catégories</span>
        </Link>
        <h1 className="dashboard-title">Créer une nouvelle catégorie</h1>
      </div>

      <div className="dashboard-card max-w-2xl mx-auto">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la catégorie*
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Code de la route"
                  error={error.name}
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                    error.description ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="Décrivez cette catégorie..."
                  required
                ></textarea>
                {error.description && (
                  <p className="mt-1 text-xs text-red-500">{error.description}</p>
                )}
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Icône de catégorie* (JPG, JPEG ou PNG)
                </label>
                <div className="mt-1 flex items-center">
                  <div 
                    className={`mr-4 flex items-center justify-center h-16 w-16 rounded-md border ${
                      imagePreview ? "border-slate-300" : "border-dashed border-slate-300"
                    }`}
                  >
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-full w-full object-cover rounded-md" 
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleImageChange}
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                      required
                    />
                    <p className="mt-1 text-xs text-slate-500">JPG, JPEG ou PNG. Taille max: 2MB</p>
                    {error.image && (
                      <p className="mt-1 text-xs text-red-500">{error.image}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600"
                >
                  Créer la catégorie
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}