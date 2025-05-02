import { X, Mail, Calendar, Phone, MapPin, User, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "../LoadingSpinner";
import DefaultProfileImage from "@/assets/images/default-profile-icon.jpg";


export function UserDetailsModal({
    showDetailsModal,
    setShowDetailsModal,
    isLoadingDetails,
    selectedUser,
    handleEdit
}) {
    if (!showDetailsModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-xl font-semibold">Détails de l'utilisateur</h2>
                    <button
                        onClick={() => setShowDetailsModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                {isLoadingDetails ? (
                    <LoadingSpinner />
                ) : selectedUser ? (
                    <div className="p-6">
                        {/* User header */}
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-gray-200">
                                    <img
                                        src={selectedUser.role === 'admin' ? 'https://avatar.iran.liara.run/public/job/operator/male'
                                            : selectedUser.profile_picture ? selectedUser.profile_picture.startsWith('https://avatar.iran.liara.run')
                                                ? selectedUser.profile_picture :
                                                `http://localhost:8000/storage/${selectedUser.profile_picture}` :
                                                DefaultProfileImage
                                        }
                                        alt={selectedUser.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold mb-2">{selectedUser.name}</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Mail className="text-gray-500" size={16} />
                                        <span>{selectedUser.email}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Calendar className="text-gray-500" size={16} />
                                        <span>Inscrit le {new Date(selectedUser.created_at).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedUser.role === 'admin'
                                        ? 'bg-red-100 text-red-800'
                                        : selectedUser.role === 'monitor'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {selectedUser.role === 'admin' ? 'Admin' :
                                            selectedUser.role === 'monitor' ? 'Moniteur' : 'Candidat'}
                                    </span>

                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedUser.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : selectedUser.status === 'inactive'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : selectedUser.status === 'graduated'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                        {selectedUser.status === 'active' ? 'Actif' :
                                            selectedUser.status === 'inactive' ? 'En attente' :
                                                selectedUser.status === 'graduated' ? 'Titulaire du permis' : 'Refusé'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <hr className="my-6" />

                        {selectedUser.role === 'candidate' && selectedUser.candidate && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold mb-4">Informations du Candidat</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedUser.phone_number && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="text-gray-500" size={16} />
                                            <div>
                                                <div className="text-sm text-gray-500">Téléphone</div>
                                                <div>{selectedUser.phone_number}</div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedUser.address && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="text-gray-500 mt-1" size={16} />
                                            <div>
                                                <div className="text-sm text-gray-500">Adresse</div>
                                                <div>{selectedUser.address}</div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedUser.candidate.license_type && (
                                        <div className="flex items-center gap-2">
                                            <User className="text-gray-500" size={16} />
                                            <div>
                                                <div className="text-sm text-gray-500">Type de permis</div>
                                                <div>{selectedUser.candidate.license_type}</div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedUser.candidate.document && (
                                        <div className="flex items-center gap-2">
                                            <User className="text-gray-500" size={16} />
                                            <div>
                                                <div className="text-sm text-gray-500">Document</div>
                                                <a href={`http://localhost:8000/storage/${selectedUser.candidate.document.CIN}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                    Voir le document
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {selectedUser.role === 'monitor' && selectedUser.monitor && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold mb-4">Informations du Moniteur</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedUser.phone_number && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="text-gray-500" size={16} />
                                            <div>
                                                <div className="text-sm text-gray-500">Téléphone</div>
                                                <div>{selectedUser.phone_number}</div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedUser.address && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="text-gray-500 mt-1" size={16} />
                                            <div>
                                                <div className="text-sm text-gray-500">Adresse</div>
                                                <div>{selectedUser.address}</div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedUser.monitor.license_number && (
                                        <div className="flex items-center gap-2">
                                            <User className="text-gray-500" size={16} />
                                            <div>
                                                <div className="text-sm text-gray-500">Numéro de permis</div>
                                                <div>{selectedUser.monitor.license_number}</div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedUser.monitor.employment_date && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="text-gray-500" size={16} />
                                            <div>
                                                <div className="text-sm text-gray-500">Date d'embauche</div>
                                                <div>{new Date(selectedUser.monitor.employment_date).toLocaleDateString('fr-FR')}</div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-4 mt-6">
                            <Button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    handleEdit(selectedUser.id);
                                }}
                                className="bg-blue-500 hover:bg-blue-600"
                            >
                                <Edit size={16} className="mr-2" />
                                Modifier
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowDetailsModal(false)}
                            >
                                Fermer
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 text-center text-red-500">
                        Impossible de charger les détails de l'utilisateur
                    </div>
                )}
            </div>
        </div>
    );
}