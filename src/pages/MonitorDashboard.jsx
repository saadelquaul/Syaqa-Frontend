import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, FolderTree, HelpCircle, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { getAuthHeader } from "@/utils/auth";

export default function MonitorDashboard() {
  const [stats, setStats] = useState({
    coursesCount: "--",
    categoriesCount: "--",
    quizQuestionsCount: "--"
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
    
        const [coursesRes, categoriesRes, questionsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/monitor/courses", {
            headers: getAuthHeader()
          }),
          axios.get("http://localhost:8000/api/categories", {
            headers: getAuthHeader()
          }),
          axios.get("http://localhost:8000/api/quiz-questions", {
            headers: getAuthHeader()
          })
        ]);
        
        
        setStats({
          coursesCount: coursesRes.data.courses?.length || 0,
          categoriesCount: categoriesRes.data.data?.length || 0,
          quizQuestionsCount: questionsRes.data.data?.length || 0
        });
        
      
        setRecentCourses(coursesRes.data.courses?.slice(0, 5) || []);
        setRecentQuestions(questionsRes.data.data?.slice(0, 5) || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <>
      <h1 className="dashboard-title p-5">
        Bienvenue sur votre tableau de bord !
      </h1>
      
      <div className="stats-grid">
        <StatsCard
          title="Cours créés"
          value={isLoading ? "..." : stats.coursesCount}
          icon={<BookOpen className="stats-icon" />}
          linkTo="/monitor/courses"
        />
        
        <StatsCard
          title="Catégories"
          value={isLoading ? "..." : stats.categoriesCount}
          icon={<FolderTree className="stats-icon" />}
          linkTo="/monitor/categories"
        />
        
        <StatsCard
          title="Questions de quiz"
          value={isLoading ? "..." : stats.quizQuestionsCount}
          icon={<HelpCircle className="stats-icon" />}
          linkTo="/monitor/quiz/questions"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="dashboard-card">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Cours récents</CardTitle>
            <Link to="/monitor/courses/create">
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                <Plus size={16} className="mr-1" /> Nouveau
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded"></div>
                ))}
              </div>
            ) : recentCourses.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">Vous n'avez pas encore créé de cours</p>
                <Link to="/monitor/courses/create">
                  <Button className="bg-blue-500 hover:bg-blue-600">Créer mon premier cours</Button>
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {recentCourses.map(course => (
                  <li key={course.id} className="p-3 bg-gray-50 rounded-md">
                    <Link to={`/monitor/courses/${course.id}`} className="hover:text-blue-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{course.title}</h3>
                          <p className="text-sm text-gray-500 truncate">{course.description}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          course.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {course.status === 'active' ? 'Publié' : 'Brouillon'}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Link to="/monitor/courses" className="text-blue-600 hover:underline text-sm flex items-center">
              Voir tous mes cours <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardFooter>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Questions de quiz récentes</CardTitle>
            <Link to="/monitor/quiz/questions/create">
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                <Plus size={16} className="mr-1" /> Nouvelle
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded"></div>
                ))}
              </div>
            ) : recentQuestions.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">Vous n'avez pas encore créé de questions</p>
                <Link to="/monitor/quiz/questions/create">
                  <Button className="bg-blue-500 hover:bg-blue-600">Créer ma première question</Button>
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {recentQuestions.map(question => (
                  <li key={question.id} className="p-3 bg-gray-50 rounded-md">
                    <Link to={`/monitor/quiz/questions/${question.id}/edit`} className="hover:text-blue-600">
                      <div className="flex items-center">
                        <div className="flex-1 overflow-auto">
                          <p className="truncate">{question.question}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(question.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Link to="/monitor/quiz/questions" className="text-blue-600 hover:underline text-sm flex items-center">
              Voir toutes mes questions <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Gestion des catégories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Organisez vos cours en créant des catégories thématiques (ex: Code de la route, Conduite en ville, etc.)
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/monitor/categories">
                <Button variant="outline">
                  Voir les catégories
                </Button>
              </Link>
              <Link to="/monitor/categories/create">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus size={16} className="mr-2" /> Ajouter une catégorie
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function StatsCard({ title, value, icon, linkTo }) {
  return (
    <Link to={linkTo} className="block">
      <Card className="hover:shadow-md transition-shadow ">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              {icon}
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">{title}</p>
              <p className="text-2xl font-semibold">{value}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}