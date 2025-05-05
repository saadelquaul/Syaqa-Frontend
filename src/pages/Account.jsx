import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuthHeader } from "@/utils/auth";
import axios from "axios";
import { User, Phone, MapPin, Calendar, IdCard, Clock, Camera, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AccountPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const fileInputRef = useRef(null);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/default-avatar.png';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:8000/storage/${imagePath}`;
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:8000/api/user', {
                    headers: getAuthHeader()
                });

                setUserDetails(response.data.user);

                setFormData({
                    name: response.data.user.name || "",
                    email: response.data.user.email || "",
                    phone: response.data.user.phone_number || "",
                    address: response.data.user.address || "",
                    current_password: "",
                    password: "",
                    password_confirmation: "",
                });
            } catch (err) {
                console.error("Failed to fetch user details:", err);
                setError("Impossible de charger vos informations personnelles. Veuillez réessayer.");
                toast.error("Erreur lors du chargement des informations");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            toast.error("Veuillez sélectionner une image valide");
            return;
        }


        if (file.size > 5 * 1024 * 1024) {
            toast.error("L'image ne doit pas dépasser 5 MB");
            return;
        }
        
        setSelectedImage(file);


        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const uploadProfilePicture = async () => {
        if (!selectedImage) return;

        setIsUploadingImage(true);

        try {
            const formData = new FormData();
            formData.append('profile_picture', selectedImage);

            const response = await axios.post(
                'http://localhost:8000/api/user/profile-picture',
                formData,
                {
                    headers: {
                        ...getAuthHeader(),
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setUserDetails(prev => ({
                ...prev,
                profile_picture: response.data.profile_picture_url || response.data.profile_picture
            }));

            setSelectedImage(null);
            setImagePreview(null);

        } catch (err) {
            console.error("Failed to upload profile picture:", err);
            
            toast.error("Impossible de mettre à jour votre photo de profil");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (formData.name.trim() === "") {
            errors.name = "Le nom est requis";
            isValid = false;
        }

        if (formData.email.trim() === "") {
            errors.email = "L'email est requis";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Format d'email invalide";
            isValid = false;
        }

        if (formData.password && formData.password.length < 8) {
            errors.password = "Le mot de passe doit contenir au moins 8 caractères";
            isValid = false;
        }

        if (formData.password !== formData.password_confirmation) {
            errors.password_confirmation = "Les mots de passe ne correspondent pas";
            isValid = false;
        }

        if (formData.password && !formData.current_password) {
            errors.current_password = "Mot de passe actuel requis pour changer le mot de passe";
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        uploadProfilePicture();
        setIsSaving(true);
        const loadingToast = toast.loading("Mise à jour de votre profil...");

        try {
            const updateData = {
                name: formData.name,
                email: formData.email,
                phone_number: formData.phone,
                address: formData.address
            };

            if (formData.password) {
                updateData.current_password = formData.current_password;
                updateData.password = formData.password;
                updateData.password_confirmation = formData.password_confirmation;
            }

            await axios.put(
                'http://localhost:8000/api/user',
                updateData,
                {
                    headers: getAuthHeader()
                }
            );

            setUserDetails(prev => ({
                ...prev,
                name: formData.name,
                email: formData.email,
                phone_number: formData.phone,
                address: formData.address
            }));

            setIsEditing(false);
            toast.success("Profil mis à jour avec succès", { id: loadingToast });
            setFormData(prev => ({
                ...prev,
                current_password: "",
                password: "",
                password_confirmation: ""
            }));
        } catch (err) {
            console.error("Failed to update profile:", err);

            if (err.response?.data?.errors) {
                setValidationErrors(err.response.data.errors);
            }

            toast.error("Impossible de mettre à jour votre profil", { id: loadingToast });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600">Chargement de vos informations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 my-6">
                <p className="text-red-700">{error}</p>
                <Button
                    variant="ghost"
                    className="mt-3 text-red-700 hover:bg-red-100"
                    onClick={() => window.location.reload()}
                >
                    Réessayer
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-5">
            <h1 className="text-2xl font-bold mb-6">Mon Compte</h1>
            <div className="flex justify-end mb-4">
                <Button
                    variant="ghost"
                    className="bg-gray-100 hover:bg-gray-200"
                    onClick={() => navigate(`/${userDetails.role}/home`)}
                >
                    Retour au tableau de bord
                </Button>
            </div>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent>
                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Photo de profil
                                </label>
                                <div className="flex items-center space-x-6">
                                    <div className="relative">
                                        <img 
                                            src={imagePreview || getImageUrl(userDetails?.profile_picture)} 
                                            alt="Profile" 
                                            className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600"
                                        >
                                            <Camera size={16} />
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                    
                                    {selectedImage && (
                                        <Button 
                                            type="button"
                                            onClick={uploadProfilePicture}
                                            disabled={isUploadingImage}
                                            className="h-9"
                                        >
                                            {isUploadingImage ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Envoi...
                                                </>
                                            ) : "Mettre à jour"}
                                        </Button>
                                    )}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nom complet *
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={validationErrors.name ? "border-red-500" : ""}
                                    />
                                    {validationErrors.name && (
                                        <p className="mt-1 text-xs text-red-500">{validationErrors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={validationErrors.email ? "border-red-500" : ""}
                                    />
                                    {validationErrors.email && (
                                        <p className="mt-1 text-xs text-red-500">{validationErrors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Numéro de téléphone
                                    </label>
                                    <div className="flex">
                                        <Phone size={16} className="mr-2 mt-2 text-gray-500" />
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={validationErrors.phone ? "border-red-500" : ""}
                                        />
                                    </div>
                                    {validationErrors.phone && (
                                        <p className="mt-1 text-xs text-red-500">{validationErrors.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                        Adresse
                                    </label>
                                    <div className="flex">
                                        <MapPin size={16} className="mr-2 mt-2 text-gray-500" />
                                        <Input
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className={validationErrors.address ? "border-red-500" : ""}
                                        />
                                    </div>
                                    {validationErrors.address && (
                                        <p className="mt-1 text-xs text-red-500">{validationErrors.address}</p>
                                    )}
                                </div>
                            </div>

                            <div className="border-t pt-6 mt-6">
                                <h3 className="text-lg font-medium mb-4">Changer le mot de passe <span className="text-sm font-normal text-gray-500">(optionnel)</span></h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                                            Mot de passe actuel
                                        </label>
                                        <Input
                                            id="current_password"
                                            name="current_password"
                                            type="password"
                                            value={formData.current_password}
                                            onChange={handleChange}
                                            className={validationErrors.current_password ? "border-red-500" : ""}
                                        />
                                        {validationErrors.current_password && (
                                            <p className="mt-1 text-xs text-red-500">{validationErrors.current_password}</p>
                                        )}
                                    </div>

                                    <div className="col-span-1"></div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nouveau mot de passe
                                        </label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={validationErrors.password ? "border-red-500" : ""}
                                        />
                                        {validationErrors.password && (
                                            <p className="mt-1 text-xs text-red-500">{validationErrors.password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirmer le nouveau mot de passe
                                        </label>
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            value={formData.password_confirmation}
                                            onChange={handleChange}
                                            className={validationErrors.password_confirmation ? "border-red-500" : ""}
                                        />
                                        {validationErrors.password_confirmation && (
                                            <p className="mt-1 text-xs text-red-500">{validationErrors.password_confirmation}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="bg-gray-100 hover:bg-gray-200"
                                    onClick={() => setIsEditing(false)}
                                    disabled={isSaving}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600"
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="flex items-center gap-5 mb-6">
                                <div className="relative">
                                    <img 
                                        src={getImageUrl(userDetails?.profile_picture)} 
                                        alt="Avatar" 
                                        className="h-28 w-28 rounded-full object-cover border-2 border-gray-200" 
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(true);
                                            setTimeout(() => fileInputRef.current?.click(), 100);
                                        }}
                                        className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600"
                                    >
                                        <Camera size={16} />
                                    </button>
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium">{userDetails?.name}</h2>
                                    <p className="text-gray-500">{userDetails?.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-3">
                                    <User className="h-10 w-10 text-gray-400 bg-gray-100 p-2 rounded-full" />
                                    <div>
                                        <div className="text-sm text-gray-500">Nom complet</div>
                                        <div className="font-medium">{userDetails?.name}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 flex items-center justify-center text-gray-400 bg-gray-100 rounded-full">
                                        @
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Email</div>
                                        <div className="font-medium">{userDetails?.email}</div>
                                    </div>
                                </div>

                                {userDetails?.phone_number && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-10 w-10 text-gray-400 bg-gray-100 p-2 rounded-full" />
                                        <div>
                                            <div className="text-sm text-gray-500">Téléphone</div>
                                            <div className="font-medium">{userDetails.phone_number}</div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <Calendar className="h-10 w-10 text-gray-400 bg-gray-100 p-2 rounded-full" />
                                    <div>
                                        <div className="text-sm text-gray-500">Date de naissance</div>
                                        <div className="font-medium">
                                            {userDetails?.date_of_birth ? new Date(userDetails.date_of_birth).toLocaleDateString('fr-FR') : 'Non renseignée'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 col-span-1 md:col-span-2">
                                    <MapPin className="h-10 w-10 text-gray-400 bg-gray-100 p-2 rounded-full flex-shrink-0" />
                                    <div>
                                        <div className="text-sm text-gray-500">Adresse</div>
                                        <div className="font-medium">{userDetails?.address || 'Non renseignée'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <Button
                                    className="bg-blue-500 hover:bg-blue-600"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Modifier mes informations
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Informations de permis de conduire</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <IdCard className="h-10 w-10 text-gray-400 bg-gray-100 p-2 rounded-full" />
                            <div>
                                <div className="text-sm text-gray-500">Type de permis</div>
                                <div className="font-medium">Permis {userDetails?.license_type || 'B'}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Clock className="h-10 w-10 text-gray-400 bg-gray-100 p-2 rounded-full" />
                            <div>
                                <div className="text-sm text-gray-500">Date d'inscription</div>
                                <div className="font-medium">
                                    {userDetails?.enrollment_date
                                        ? new Date(userDetails.enrollment_date).toLocaleDateString('fr-FR')
                                        : new Date().toLocaleDateString('fr-FR')}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}