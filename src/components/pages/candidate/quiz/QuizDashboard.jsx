import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, CheckCircle, Award, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { getAuthHeader } from "@/utils/auth";
import toast from "react-hot-toast";

export default function QuizDashboardPage() {
  const [quizHistory, setQuizHistory] = useState([]);
  const [quizStats, setQuizStats] = useState({
    total_attempts: 0,
    best_score: 0,
    average_score: 0,
    last_attempt: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    try {
      setIsLoading(true);
      
      const [historyResponse, statsResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/candidate/quiz/history', {
          headers: getAuthHeader()
        }),
        axios.get('http://localhost:8000/api/candidate/quiz/statistics', {
          headers: getAuthHeader()
        })
      ]);

      console.log("historyResponse", historyResponse.data, "\n", "statsResponse", statsResponse.data);
      
      setQuizHistory(historyResponse.data.quizzes || []);
      setQuizStats(statsResponse.data || {
        total_attempts: 0,
        best_score: 0,
        average_score: 0,
        last_attempt: null
      });
    } catch (err) {
      console.error("Failed to fetch quiz data:", err);
      setError("Impossible de charger les données des quiz. Veuillez réessayer plus tard.");
      toast.error("Erreur lors du chargement des quiz");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="dashboard-title">Quiz Code de la Route</h1>
        <Link to="/candidate/quiz/take">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <BookOpen size={16} className="mr-2" />
            Démarrer un nouveau quiz
          </Button>
        </Link>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-md">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total des tentatives</p>
                <p className="text-2xl font-semibold">{quizStats.total_quizzes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Meilleur score</p>
                <p className="text-2xl font-semibold">{quizStats.best_score}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-md">
                <CheckCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Score moyen</p>
                <p className="text-2xl font-semibold">{quizStats.average_score}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Historique des quiz</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
              <button 
                className="text-blue-600 underline mt-2"
                onClick={fetchQuizData}
              >
                Réessayer
              </button>
            </div>
          ) : quizHistory.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Vous n'avez pas encore passé de quiz</p>
              <Link to="/candidate/quiz/take">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Démarrer votre premier quiz
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bonnes réponses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Résultat
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {quizHistory.slice(0, 5).map((quiz) => (
                    <tr key={quiz.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(quiz.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          quiz.score >= 70 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {quiz.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {quiz.correct_answers} / {quiz.total_questions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {quiz.score >= 70 ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Réussi
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            Échoué
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}