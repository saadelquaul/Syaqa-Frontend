import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, ImageIcon, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { getAuthHeader } from "@/utils/auth"

export default function EditCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [originalVideoUrl, setOriginalVideoUrl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState({
    title: "",
    description: "",
    category_id: "",
    image: "",
    video: "",
  });
  const [formError, setFormError] = useState("");
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    return () => {
      if (videoPreview && videoPreview !== originalVideoUrl) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview, originalVideoUrl]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setApiError("");
        
        const categoriesResponse = await axios.get('http://localhost:8000/api/categories', {
          headers: getAuthHeader()
        });
        setCategories(categoriesResponse.data.data || []);
        
        const courseResponse = await axios.get(`http://localhost:8000/api/courses/${id}`, {
          headers: getAuthHeader()
        });
        const courseData = courseResponse.data.course;
        
        setFormData({
          title: courseData.title,
          description: courseData.description,
          category_id: courseData.category_id,

        });

        if (courseData.image_url) {
          setImagePreview(`http://localhost:8000/storage/${courseData.image_url}`);
        }

        if (courseData.video_url) {
          const videoUrl = `http://localhost:8000/storage/${courseData.video_url}`;
          setVideoPreview(videoUrl);
          setOriginalVideoUrl(videoUrl);
        }
        
      } catch (err) {
        console.error("Failed to fetch course data:", err);
        setApiError("Impossible de charger les informations du cours. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
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

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    
    setError(prev => ({
      ...prev,
      video: ""
    }));
    
    if (!file) return;
    
    const validTypes = ['video/mp4'];
    if (!validTypes.includes(file.type)) {
      setError(prev => ({
        ...prev,
        video: "Le fichier doit être au format MP4"
      }));
      e.target.value = "";
      return;
    }
    
    if (file.size > 100 * 1024 * 1024) {
      setError(prev => ({
        ...prev,
        video: "La taille du fichier doit être inférieure à 500MB"
      }));
      e.target.value = "";
      return;
    }
    
    setVideo(file);
    
    if (videoPreview && videoPreview !== originalVideoUrl) {
      URL.revokeObjectURL(videoPreview);
    }
    
    const videoUrl = URL.createObjectURL(file);
    setVideoPreview(videoUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setFormError("");
    
    let hasError = false;
    const newErrors = { 
      title: "", 
      description: "", 
      category_id: "", 
      image: "",
      video: "",
    };
    
    if (!formData.title) {
      newErrors.title = "Le titre du cours est requis";
      hasError = true;
    }
    
    if (!formData.description) {
      newErrors.description = "La description est requise";
      hasError = true;
    }
    
    if (!formData.category_id) {
      newErrors.category_id = "La catégorie est requise";
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
      apiFormData.append("title", formData.title);
      apiFormData.append("description", formData.description);
      apiFormData.append("category_id", formData.category_id);
      
      if (image) {
        apiFormData.append("image", image);
      }

      if (video) {
        apiFormData.append("video", video);
      }
      
       await axios.post(
        `http://localhost:8000/api/courses/${id}`,
        apiFormData,
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data"
          }
        }
      );
      
      navigate(`/monitor/courses/${id}`);
    } catch (err) {
      console.error("Error updating course:", err);
      
      if (err.response?.data?.errors) {
        const apiErrors = err.response.data.errors;
        setError({
          title: apiErrors.title?.[0] || "",
          description: apiErrors.description?.[0] || "",
          category_id: apiErrors.category_id?.[0] || "",
          image: apiErrors.image?.[0] || "",
        });
      } else if (err.response?.data?.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError("Une erreur s'est produite lors de la modification du cours. Veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (apiError && !isLoading) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <Link to="/monitor/courses" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
            <ArrowLeft size={16} />
            <span>Retour aux cours</span>
          </Link>
          <h1 className="dashboard-title">Modifier le cours</h1>
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
          <Link to="/monitor/courses" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
            <ArrowLeft size={16} />
            <span>Retour aux cours</span>
          </Link>
          <h1 className="dashboard-title">Modifier le cours</h1>
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
        <Link to="/monitor/courses" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} />
          <span>Retour aux cours</span>
        </Link>
        <h1 className="dashboard-title">Modifier le cours</h1>
      </div>

      {formError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erreur
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{formError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Informations du cours</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Titre du cours*
                  </label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Code de la route complet"
                    error={error.title}
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
                    placeholder="Décrivez brièvement le contenu du cours"
                  ></textarea>
                  {error.description && (
                    <p className="mt-1 text-xs text-red-500">{error.description}</p>
                  )}
                </div>

                
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Vidéo du cours</h2>
              
              <div className="space-y-4">
                {videoPreview ? (
                  <div className="w-full aspect-video bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                    <video 
                      controls 
                      className="w-full h-full"
                      src={videoPreview}
                    >
                      Votre navigateur ne prend pas en charge la lecture vidéo.
                    </video>
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-gray-100 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center p-4">
                      <Video className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-500">
                        Aucune vidéo associée à ce cours
                      </p>
                    </div>
                  </div>
                )}
                
                <div>
                  <input
                    type="file"
                    id="video"
                    name="video"
                    accept="video/mp4"
                    onChange={handleVideoChange}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Format MP4 uniquement. Taille max: 100MB. Laissez vide pour conserver la vidéo actuelle.
                  </p>
                  {error.video && (
                    <p className="mt-1 text-xs text-red-500">{error.video}</p>
                  )}
                  {video && (
                    <p className="mt-2 text-xs text-slate-700">
                      <strong>Nom du fichier:</strong> {video.name}<br />
                      <strong>Taille:</strong> {(video.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>
            </div>
            
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Paramètres</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie*
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                      error.category_id ? "border-red-500" : "border-slate-300"
                    }`}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {error.category_id && (
                    <p className="mt-1 text-xs text-red-500">{error.category_id}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Image du cours
                  </label>
                  <div className="mt-1 flex items-center">
                    <div 
                      className="w-full aspect-video bg-gray-100 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden mb-4"
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Course preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-1 text-sm text-gray-500">
                            Image de couverture du cours
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageChange}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, JPEG ou PNG. Taille max: 2MB. Laissez vide pour conserver l'image actuelle.
                  </p>
                  {error.image && (
                    <p className="mt-1 text-xs text-red-500">{error.image}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Link to={`/monitor/courses/${id}`}>
                <Button type="button" variant="ghost" className="bg-gray-100 hover:bg-gray-200">
                  Annuler
                </Button>
              </Link>
              
              <Button 
                type="submit" 
                className="bg-blue-500 hover:bg-blue-600 text-white" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}