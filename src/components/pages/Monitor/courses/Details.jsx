import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Edit, Trash, Calendar, UserRound, 
  Tag, Clock, CheckCircle, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { getAuthHeader } from "@/utils/auth";
import { useAuth } from "@/hooks/useAuth";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState({ type: '', message: '' });
  
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8000/api/courses/${id}`, {
          headers: getAuthHeader()
        });
        
        setCourse(response.data.course);
        setSelectedStatus(response.data.course.status);
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError("Impossible de charger les informations du cours");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourse();
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`http://localhost:8000/api/courses/${id}`, {
        headers: getAuthHeader()
      });
      
      navigate("/monitor/courses");
    } catch (error) {
      console.error("Failed to delete course:", error);
      setError("Impossible de supprimer le cours. Veuillez réessayer.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setIsUpdatingStatus(true);
      setStatusUpdateMessage({ type: '', message: '' });
      
      await axios.patch(
        `http://localhost:8000/api/courses/${id}/status`,
        { status: selectedStatus },
        { headers: getAuthHeader() }
      );
      
      setCourse(prev => ({
        ...prev,
        status: selectedStatus
      }));
      
      setStatusUpdateMessage({
        type: 'success',
        message: 'Le statut du cours a été mis à jour avec succès'
      });
      
      setTimeout(() => {
        setStatusUpdateMessage({ type: '', message: '' });
      }, 3000);
      
    } catch (err) {
      console.error("Failed to update course status:", err);
      setStatusUpdateMessage({
        type: 'error',
        message: "Impossible de mettre à jour le statut du cours. Veuillez réessayer."
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Show loading state while either course data or auth is loading
  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <span className="ml-2">Chargement des données...</span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 my-6">
        <p className="text-red-700">{error || "Cours introuvable"}</p>
        <Link to="/monitor/courses" className="text-blue-600 underline mt-2 inline-block">
          Retour à la liste des cours
        </Link>
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
        <div className="flex gap-2">
          <Link to={`/monitor/courses/${id}/edit`}>
            <Button leftIcon={<Edit className="h-4 w-4" />} className="bg-blue-500 hover:bg-blue-600 text-white">
              Modifier
            </Button>
          </Link>
          
          {!showConfirmDelete ? (
            <Button 
              leftIcon={<Trash className="h-4 w-4" />} 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => setShowConfirmDelete(true)}
            >
              Supprimer
            </Button>
          ) : (
            <div className="flex items-center gap-2 bg-red-50 p-2 rounded border border-red-200">
              <span className="text-sm text-red-700">Confirmer ?</span>
              <Button 
                size="sm" 
                className="bg-red-500 hover:bg-red-600 text-white" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Suppression..." : "Oui"}
              </Button>
              <Button 
                size="sm" 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700" 
                onClick={() => setShowConfirmDelete(false)}
                disabled={isDeleting}
              >
                Non
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Only show status management section to admins */}
      {isAdmin && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-medium">Statut du cours</h2>
              <p className="text-sm text-gray-500">Modifiez le statut du cours pour le rendre visible aux étudiants</p>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-full md:w-auto">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isUpdatingStatus}
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>
              <Button
                onClick={handleStatusUpdate}
                className={`w-full md:w-auto ${
                  selectedStatus === 'published'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
                disabled={isUpdatingStatus || selectedStatus === course.status}
              >
                {isUpdatingStatus ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                    Mise à jour...
                  </>
                ) : selectedStatus === 'published' ? (
                  'Publier le cours'
                ) : (
                  'Enregistrer comme brouillon'
                )}
              </Button>
            </div>
          </div>

          {statusUpdateMessage.message && (
            <div className={`mt-4 p-3 rounded-md flex items-center ${
              statusUpdateMessage.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {statusUpdateMessage.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              {statusUpdateMessage.message}
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {course.image_url && (
          <div className="w-full h-64 overflow-hidden">
            <img 
              src={`http://localhost:8000/storage/${course.image_url}`}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {course.category_name}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {course.status === 'active' ? 'Publié' : 'Brouillon'}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-700 whitespace-pre-wrap">{course.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Date de création</div>
                <div>{new Date(course.created_at).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Dernière mise à jour</div>
                <div>{new Date(course.updated_at).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UserRound className="h-5 w-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Étudiants inscrits</div>
                <div>{course.students_count || 0}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Catégorie</div>
                <div>{course.category.name}</div>
              </div>
            </div>
          </div>
          
          {course.video_url && (
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-3">Vidéo du cours</h2>
              <div className="aspect-video w-full max-w-2xl mx-auto bg-black rounded-md overflow-hidden">
                <video 
                  controls 
                  className="w-full h-full"
                  src={`http://localhost:8000/storage/${course.video_url}`}
                >
                  Votre navigateur ne prend pas en charge la lecture de vidéos.
                </video>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}