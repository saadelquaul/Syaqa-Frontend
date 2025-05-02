import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { getAuthHeader } from "@/utils/auth";
import  CoursePlaceholder  from "@/assets/images/CoursePlaceHolder.jpg";

export default function RecentCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8000/api/admin/recent-courses', {
          headers: getAuthHeader()
        });
        setCourses(response.data.courses || []);
      } catch (err) {
        console.error("Failed to fetch recent courses:", err);
        setError("Impossible de charger les cours récents");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">{error}</div>
    );
  }

  if (courses.length === 0) {
    return <div className="empty-state">Aucun cours récent</div>;
  }

  return (
    <ul className="space-y-3">
      {courses.map((course) => (
        <li key={course.id} className="bg-white p-3 rounded-md border border-gray-200">
          <div className="flex gap-3">
            { course.image_url ? (
              <div className="w-25 h-15 flex-shrink-0">
                <img 
                  src={`http://localhost:8000/storage/${course.image_url}`} 
                  alt={course.title}
                  className="w-full h-full object-cover rounded-md" 
                />
              </div>
            ) :
                (
                    <div className="w-33 h-15 flex-shrink-0">
                      <img 
                        src={CoursePlaceholder} 
                        alt={course.title}
                        className="w-full h-full object-cover rounded-md" 
                      />
                    </div>
                  )
            }
            
            <div className="flex-grow">
              <div className="flex justify-between">
                <h3 className="font-medium">{course.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  course.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {course.status === 'active' ? 'Publié' : 'Brouillon'}
                </span>
              </div>
              
              <div className="text-sm text-gray-500 mt-1">
                Catégorie: {course.category_name}
              </div>
              
              <div className="text-xs text-gray-500 mt-1">
                Ajouté par: <span className="font-bold text-lg" >{course.monitor_name}  </span>• {new Date(course.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        </li>
      ))}
      
      <div className="text-center mt-4">
        <Link to="/admin/courses">
          <Button variant="outline" size="sm">
            Voir tous les cours
          </Button>
        </Link>
      </div>
    </ul>
  );
}