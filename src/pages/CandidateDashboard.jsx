import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, CheckSquare, Calendar, ArrowRight, 
  Award, Clock, TrendingUp, PlaySquare, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { getAuthHeader } from "@/utils/auth";
import toast from "react-hot-toast";

export default function CandidateDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    user: {
      name: "",
      email: ""
    },
    stats: {
      quiz_taken: 0,
      courses_watched: 0,
      booked_lessons: 0
    },
    quiz: {
      recent_score: null,
      best_score: 0,
      average_score: 0
    },
    courses: {
      in_progress: "",
      completed: 0,
      recent_courses: []
    },
    upcoming_lessons: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8000/api/candidate/dashboard", {
        headers: getAuthHeader()
      });
      
      setDashboardData(response.data);
      console.log("Dashboard data:", response.data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Impossible de charger les données du tableau de bord. Veuillez réessayer.");
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 my-6">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={fetchDashboardData} 
          className="text-blue-600 underline mt-2"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header mb-6">
        <div>
          <h1 className="dashboard-title">
            Bonjour, {dashboardData.user.name.split(" ")[0]}
          </h1>
          <p className="text-gray-500">
            Bienvenue dans votre tableau de bord
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Cours suivis</p>
                <p className="text-2xl font-semibold">{dashboardData.stats.courses_watched}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-6 py-3 bg-gray-50">
            <Link to="/candidate/courses" className="text-sm text-blue-600 hover:underline flex items-center">
              Voir mes cours <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Quiz terminés</p>
                <p className="text-2xl font-semibold">{dashboardData.stats.quiz_taken}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-6 py-3 bg-gray-50">
            <Link to="/candidate/quiz" className="text-sm text-blue-600 hover:underline flex items-center">
              Faire un quiz <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardFooter>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 text-blue-500 mr-2" />
                Performance aux quiz
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.quiz.recent_score === null ? (
                <div className="text-center py-6">
                  <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">
                    Vous n'avez pas encore passé de quiz
                  </p>
                  <Link to="/candidate/quiz/take">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      Démarrer un quiz
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500">Votre dernier score</span>
                        <span className="text-sm font-medium">{dashboardData.quiz.recent_score}%</span>
                      </div>
                      <Progress value={dashboardData.quiz.recent_score} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500">Meilleur score</span>
                        <span className="text-sm font-medium">{dashboardData.quiz.best_score}%</span>
                      </div>
                      <Progress value={dashboardData.quiz.best_score} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500">Score moyen</span>
                        <span className="text-sm font-medium">{dashboardData.quiz.average_score}%</span>
                      </div>
                      <Progress value={dashboardData.quiz.average_score} className="h-2" />
                    </div>
                    
                    <div className="text-xs text-gray-500 border-t pt-3 mt-3">
                      <p>Une note de 70% ou plus est requise pour réussir l'examen du code.</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6 pt-3 border-t">
                    <Link to="/candidate/quiz">
                      <Button variant="outline" size="sm">
                        Historique
                      </Button>
                    </Link>
                    <Link to="/candidate/quiz/take">
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white" size="sm">
                        Nouveau quiz
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                Progression des cours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Cours en cours</div>
                  <div className="text-2xl font-semibold">{dashboardData.courses.in_progress}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Cours terminés</div>
                  <div className="text-2xl font-semibold">{dashboardData.courses.completed}</div>
                </div>
              </div>

              <h3 className="text-sm font-medium text-gray-700 mb-3">Cours récents</h3>
              
              {dashboardData.courses.recent_courses.length === 0 ? (
                <div className="text-center py-5 bg-gray-50 rounded-lg">
                  <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Vous n'avez pas encore commencé de cours</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboardData.courses.recent_courses.map(course => (
                    <Link 
                      key={course.id} 
                      to={`/candidate/courses/${course.id}`}
                      className="block p-3 hover:bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded bg-blue-100 flex-shrink-0 flex items-center justify-center">
                          <PlaySquare className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="font-medium">{course.title}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.progress === "completed" ? (
                            <span className="text-green-500">Terminé</span>
                          ) : (
                            <span className="text-yellow-500">En cours</span>
                          )}
                          </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              
              <div className="mt-4 pt-3 border-t">
                <Link to="/candidate/courses" className="text-sm text-blue-600 hover:underline flex items-center">
                  Voir tous mes cours <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}