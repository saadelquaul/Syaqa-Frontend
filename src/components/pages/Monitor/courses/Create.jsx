import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { ArrowLeft, Video, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { getAuthHeader } from "@/utils/auth"

export default function CreateCoursePage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category_id: "",
        video: ""
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [video, setVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState({
        title: "",
        description: "",
        category_id: "",
        image: "",
        general: "",
        video: "",
    });

    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await axios.get('http://localhost:8000/api/categories', {
                    headers: getAuthHeader()
                });
                setCategories(categories.data.data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError(prev => ({
                    ...prev,
                    general: "Impossible de charger les catégories. Veuillez réessayer."
                }));
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        return () => {
            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
            }
        };
    }, [videoPreview]);

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
    }

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
                video: "La taille du fichier doit être inférieure à 100MB"
            }));
            e.target.value = "";
            return;
        }

        setVideo(file);

        if (videoPreview) {
            URL.revokeObjectURL(videoPreview);
        }
        const videoUrl = URL.createObjectURL(file);
        setVideoPreview(videoUrl);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = {
            title: "",
            description: "",
            category_id: "",
            image: "",
            general: "",
            video: ""
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
            apiFormData.append("title", formData.title);
            apiFormData.append("description", formData.description);
            apiFormData.append("category_id", formData.category_id);


            if (image) {
                apiFormData.append("image", image);
            }

            if (video) {
                apiFormData.append("video", video);
            }

            const response = await axios.post(
                "http://localhost:8000/api/courses",
                apiFormData,
                {
                    headers: {
                        ...getAuthHeader(),
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            // navigate(`/monitor/courses/${response.data.data.id}`);
            console.log("Course created successfully:", response.data);
            navigate("/monitor/courses");
        } catch (err) {
            console.error("Error creating course:", err);

            if (err.response?.data?.errors) {
                const apiErrors = err.response.data.errors;
                setError({
                    title: apiErrors.title?.[0] || "",
                    description: apiErrors.description?.[0] || "",
                    category_id: apiErrors.category_id?.[0] || "",
                    image: apiErrors.image?.[0] || "",
                    video: apiErrors.video?.[0] || "",
                    general: ""
                });
            } else if (err.response?.data?.message) {
                setError(prev => ({ ...prev, general: err.response.data.message }));
            } else {
                setError(prev => ({
                    ...prev,
                    general: "Une erreur s'est produite lors de la création du cours. Veuillez réessayer."
                }));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <Link to="/monitor/courses" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
                    <ArrowLeft size={16} />
                    <span>Retour aux cours</span>
                </Link>
                <h1 className="dashboard-title">Créer un nouveau cours</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                    {/* General error message */}
                    {error.general && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                            <p className="text-red-700">{error.general}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
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
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 ${error.description ? "border-red-500" : "border-slate-300"
                                        }`}
                                    placeholder="Décrivez ce cours en quelques phrases..."
                                    required
                                ></textarea>
                                {error.description && (
                                    <p className="mt-1 text-xs text-red-500">{error.description}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    Catégorie*
                                </label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className={`w-full h-10 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 ${error.category_id ? "border-red-500" : "border-slate-300"
                                        }`}
                                    required
                                >
                                    <option value="">Sélectionnez une catégorie</option>
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
                                    Image du cours*
                                </label>
                                <div className="mt-1 flex items-center">
                                    <div
                                        className={`mr-4 flex items-center justify-center h-32 w-40 rounded-md border ${imagePreview ? "border-slate-300" : "border-dashed border-slate-300"
                                            }`}
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-full w-full object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <ImageIcon className="h-8 w-8 text-slate-400 mx-auto" />
                                                <span className="text-xs text-slate-500 block mt-1">Aperçu de l'image</span>
                                            </div>
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

                            <div>
                                <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-1">
                                    Vidéo du cours
                                </label>
                                <div className="mt-1 flex flex-col space-y-4">
                                    {videoPreview ? (
                                        <div className="w-full max-w-lg border border-slate-300 rounded-md overflow-hidden">
                                            <video
                                                controls
                                                className="w-full"
                                                src={videoPreview}
                                            >
                                                Votre navigateur ne prend pas en charge la lecture vidéo.
                                            </video>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-40 bg-slate-50 border border-dashed border-slate-300 rounded-md">
                                            <div className="text-center">
                                                <Video className="h-10 w-10 text-slate-400 mx-auto" />
                                                <span className="block mt-2 text-sm text-slate-500">
                                                    Aucune vidéo sélectionnée
                                                </span>
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
                                        <p className="mt-1 text-xs text-slate-500">Format MP4 uniquement. Taille max: 500MB</p>
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

                            <div className="pt-4 flex justify-between">
                                <Link to="/monitor/courses">
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
                                    isLoading={isLoading}
                                    disabled={isLoading}
                                >
                                    {"Enregistrer"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}