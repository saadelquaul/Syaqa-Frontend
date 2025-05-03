import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Filter, Eye, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { getAuthHeader } from "@/utils/auth";
import toast from "react-hot-toast";

export default function QuizQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8000/api/quiz-questions', {
        headers: getAuthHeader()
      });

      console.log("Fetched questions:", response.data.data);
      
      setQuestions(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      setError("Impossible de charger les questions. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await toast.promise(
        axios.delete(`http://localhost:8000/api/quiz-questions/${id}`, {
          headers: getAuthHeader()
        }),
        {
          loading: 'Suppression de la question...',
          success: 'Question supprimée avec succès',
          error: 'Erreur lors de la suppression'
        }
      );
      
      setQuestions(prev => prev.filter(question => question.id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete question:", err);
    }
  };

  const filteredQuestions = questions.filter(question => 
    question.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="dashboard-title">Questions de Quiz</h1>
        <Link to="/monitor/quiz/questions/create">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus size={16} className="mr-2" />
            Ajouter une question
          </Button>
        </Link>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Liste des questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Rechercher des questions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p>Chargement des questions...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
              <button 
                className="text-blue-600 underline mt-2"
                onClick={fetchQuestions}
              >
                Réessayer
              </button>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Aucune question trouvée</p>
              <Link to="/monitor/quiz/questions/create" className="text-blue-500 hover:underline">
                Créer votre première question
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Réponses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'ajout
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredQuestions.map((question) => (
                    <tr key={question.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="max-w-xs overflow-hidden text-ellipsis">
                          {question.question}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                          {question.correct_answer?.text || "1 correcte"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(question.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {showDeleteConfirm === question.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm text-red-600 mr-2">Confirmer?</span>
                            <Button 
                              size="sm" 
                              className="bg-red-500 hover:bg-red-600 text-white"
                              onClick={() => handleDelete(question.id)}
                            >
                              Oui
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                              onClick={() => setShowDeleteConfirm(null)}
                            >
                              Non
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Link to={`/monitor/quiz/questions/${question.id}/edit`}>
                              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                                <Edit size={16} />
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              className="bg-red-500 hover:bg-red-600 text-white"
                              onClick={() => setShowDeleteConfirm(question.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
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