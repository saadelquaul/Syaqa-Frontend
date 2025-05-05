import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { getAuthHeader } from "@/utils/auth";
import toast from "react-hot-toast";

export default function CourseViewPage() {
  const { id: courseId } = useParams();
  const videoRef = useRef(null);
  
  const [course, setCourse] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:8000/api/candidate/courses/${courseId}`, {
        headers: getAuthHeader()
      });
      
      setCourse(response.data.course);
      setIsCompleted(response.data.enrollment.status == 'completed' ? true : false);
    } catch (err) {
      console.error("Failed to fetch course:", err);
      setError("Impossible de charger le cours. Veuillez réessayer plus tard.");
      toast.error("Erreur lors du chargement du cours");
    } finally {
      setIsLoading(false);
    }
  };

  const markCourseCompleted = async () => {
    try {
      await axios.post(`http://localhost:8000/api/candidate/courses/${courseId}/progress`, {
        status: "completed"
      }, {
        headers: getAuthHeader()
      });
      
      setIsCompleted(true);
      toast.success("Cours marqué comme terminé");
    } catch (err) {
      console.error("Failed to mark course as completed:", err);
      toast.error("Erreur lors de la mise à jour du progrès");
    }
  };

  const handleVideoEnded = () => {
    if (!isCompleted) {
      markCourseCompleted();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Chargement du cours...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 my-6">
        <p className="text-red-700">{error || "Cours introuvable"}</p>
        <Link to="/candidate/courses" className="text-blue-600 underline mt-2 inline-block">
          Retour à mes formations
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <Link to="/candidate/courses" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} />
          <span>Retour aux formations</span>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="p-0">
          {course.video_url ? (
            <div className="aspect-video w-full">
              <video
                ref={videoRef}
                src={`http://localhost:8000/storage/${course.video_url}`}
                controls
                className="w-full h-full"
                onEnded={handleVideoEnded}
                autoPlay
              ></video>
            </div>
          ) : course.image_url ? (
            <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
              <img 
                src={`http://localhost:8000/storage/${course.image_url}`} 
                alt={course.title} 
                className="max-h-full max-w-full"
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
              <Book className="h-12 w-12 text-gray-400" />
            </div>
          )}

          <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">{course.title}</h1>
            
            {course.description && (
              <div className="prose max-w-none mb-6">
                {course.description}
              </div>
            )}
            
            {!isCompleted && (
              <div className="flex justify-end mt-4">
                <Button
                  onClick={markCourseCompleted}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marquer comme terminé
                </Button>
              </div>
            )}
            
            {isCompleted && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-green-700">Vous avez terminé ce cours!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-4">Détails du cours</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {course.category_name && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Catégorie</h3>
                <p className="mt-1">{course.category_name}</p>
              </div>
            )}
            
            {course.duration && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Durée</h3>
                <p className="mt-1">{Math.round(course.duration / 60)} min</p>
              </div>
            )}
            
            {course.created_at && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date d'ajout</h3>
                <p className="mt-1">{new Date(course.created_at).toLocaleDateString()}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Statut</h3>
              <div className="mt-1">
                {isCompleted ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Terminé
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    En cours
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}