import React, { useState, useEffect } from "react"
import { ArrowLeft, ImageIcon, AlertCircle } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { getAuthHeader } from "@/utils/auth"


export default function EditCategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const [formError, setFormError] = useState("");
  const [apiError, setApiError] = useState("");
  
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        setApiError("");

        const response = await axios.get(`http://localhost:8000/api/categories/${id}`, {
          headers: getAuthHeader()
        });

      
        
        const category = response.data.data;
        setFormData({
          name: category.name,
          description: category.description
        });
        
        if (category.image) {
          setImagePreview(`http://localhost:8000/storage/${category.image}`);
        }
        
      } catch (err) {
        console.error("Failed to fetch category:", err);
        setApiError("Impossible de charger les informations de la catégorie");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategory();
  }, [id]);

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

    if (formError) {
      setFormError("");
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
    
    setFormError("");


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
    
    if (hasError) {
      setError(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
  
      const apiFormData = new FormData();
      apiFormData.append("_method", "PUT");
      apiFormData.append("name", formData.name);
      apiFormData.append("description", formData.description);
      
      if (image) {
        apiFormData.append("image", image);
      }
      
   
      await axios.post(
        `http://localhost:8000/api/categories/${id}`,
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
      console.error("Error updating category:", err);
      
      if (err.response?.data?.errors) {
        const apiErrors = err.response.data.errors;
        setError({
          name: apiErrors.name?.[0] || "",
          description: apiErrors.description?.[0] || "",
          image: apiErrors.image?.[0] || ""
        });
      } else {
        setFormError("Une erreur s'est produite lors de la modification de la catégorie");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (apiError && !isLoading) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <Link to="/monitor/categories" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
            <ArrowLeft size={16} />
            <span>Retour aux catégories</span>
          </Link>
          <h1 className="dashboard-title">Modifier la catégorie</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-md p-4 my-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <h3 className="text-red-800 font-medium">Erreur de chargement</h3>
              <p className="text-red-700 text-sm mt-1">{apiError}</p>
              <Button
                variant="ghost"
                className="mt-3 text-red-700 hover:bg-red-100"
                onClick={() => window.location.reload()}
              >
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <Link to="/monitor/categories" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
            <ArrowLeft size={16} />
            <span>Retour aux catégories</span>
          </Link>
          <h1 className="dashboard-title">Modifier la catégorie</h1>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <span className="ml-2">Chargement des données...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <Link to="/monitor/categories" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} />
          <span>Retour aux catégories</span>
        </Link>
        <h1 className="dashboard-title">Modifier la catégorie</h1>
      </div>

      <div className="dashboard-card max-w-2xl mx-auto">
        <div className="p-6">

        {formError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{formError}</p>
              </div>
            </div>
          )}

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
                  Icône de catégorie (JPG, JPEG ou PNG)
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
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      JPG, JPEG ou PNG. Taille max: 2MB. Laissez vide pour conserver l'image actuelle.
                    </p>
                    {error.image && (
                      <p className="mt-1 text-xs text-red-500">{error.image}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Link to="/monitor/categories">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    Annuler
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}