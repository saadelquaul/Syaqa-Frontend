import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ArrowLeft, HelpCircle, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { getAuthHeader } from "@/utils/auth";
import toast from "react-hot-toast";

export default function EditQuizQuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const [formData, setFormData] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: ""
  });
  
  const [error, setError] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "",
    general: ""
  });

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setIsLoading(true);
        const loadingToast = toast.loading("Chargement de la question...");
        
        const response = await axios.get(`http://localhost:8000/api/quiz-questions/${id}`, {
          headers: getAuthHeader()
        });
        
        const questionData = response.data.data;
        
        setFormData({
          question: questionData.question || "",
          option_a: questionData.option_a || "",
          option_b: questionData.option_b || "",
          option_c: questionData.option_c || "",
          option_d: questionData.option_d || "",
          correct_answer: questionData.correct_answer || ""
        });
        
        
        toast.success("Question chargée avec succès", { id: loadingToast });
      } catch (err) {
        console.error("Failed to fetch question:", err);
        toast.error("Erreur lors du chargement de la question");
        setError(prev => ({
          ...prev,
          general: "Impossible de charger les données de la question. Veuillez réessayer."
        }));
        
        setTimeout(() => {
          navigate("/monitor/quiz/questions");
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuestion();
  }, [id, navigate]);

  const handleQuestionChange = (e) => {
    setFormData(prev => ({
      ...prev,
      question: e.target.value
    }));
    
    if (error.question) {
      setError(prev => ({ ...prev, question: "" }));
    }
  };

  const handleOptionChange = (option, value) => {
    setFormData(prev => ({
      ...prev,
      [option]: value
    }));
    
    if (error[option]) {
      setError(prev => ({ ...prev, [option]: "" }));
    }
  };

  const handleCorrectAnswerChange = (option) => {
    setFormData(prev => ({
      ...prev,
      correct_answer: option
    }));
    
    if (error.correct_answer) {
      setError(prev => ({ ...prev, correct_answer: "" }));
    }
  };

  const validateForm = () => {
    let hasError = false;
    const newError = { ...error };
    
    if (!formData.question.trim()) {
      newError.question = "La question est requise";
      hasError = true;
    }
    
    if (!formData.option_a.trim()) {
      newError.option_a = "L'option A est requise";
      hasError = true;
    }
    
    if (!formData.option_b.trim()) {
      newError.option_b = "L'option B est requise";
      hasError = true;
    }
    
    newError.option_c = "";
    newError.option_d = "";
    
    if (!formData.correct_answer) {
      newError.correct_answer = "Veuillez sélectionner la réponse correcte";
      hasError = true;
    } else {
      if (formData.correct_answer === 'option_c' && !formData.option_c.trim()) {
        newError.option_c = "L'option C est requise si sélectionnée comme correcte";
        hasError = true;
      }
      if (formData.correct_answer === 'option_d' && !formData.option_d.trim()) {
        newError.option_d = "L'option D est requise si sélectionnée comme correcte";
        hasError = true;
      }
    }
    
    setError(newError);
    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    const loadingToast = toast.loading("Mise à jour de la question...");
    
    try {
      const apiFormData = new FormData();
      apiFormData.append("_method", "PUT");
      
      apiFormData.append("question", formData.question);
      apiFormData.append("option_a", formData.option_a);
      apiFormData.append("option_b", formData.option_b);
      
      if (formData.option_c.trim()) {
        apiFormData.append("option_c", formData.option_c);
      }
      
      if (formData.option_d.trim()) {
        apiFormData.append("option_d", formData.option_d);
      }
      
      apiFormData.append("correct_answer", formData.correct_answer);
      
      
       await axios.post(
        `http://localhost:8000/api/quiz-questions/${id}`,
        apiFormData,
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data"
          }
        }
      );
      
      toast.success("Question mise à jour avec succès", { id: loadingToast });
      navigate("/monitor/quiz/questions");
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la question:", err);
      
      if (err.response?.data?.errors) {
        const apiErrors = err.response.data.errors;
        const newError = { ...error };
        
        for (const field in apiErrors) {
          if (Object.prototype.hasOwnProperty.call(apiErrors, field)) {
            newError[field] = apiErrors[field][0];
          }
        }
        
        setError(newError);
      } else if (err.response?.data?.message) {
        setError(prev => ({
          ...prev,
          general: err.response.data.message
        }));
      }
      
      toast.error("Erreur lors de la mise à jour de la question", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Chargement de la question...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <Link to="/monitor/quiz/questions" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} />
          <span>Retour aux questions</span>
        </Link>
        <h1 className="dashboard-title">Modifier la question</h1>
      </div>

      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500" />
            Modification de la question
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-700">{error.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                  Question* <span className="text-xs text-gray-500">(ex: Que signifie ce panneau ?)</span>
                </label>
                <textarea
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleQuestionChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                    error.question ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="Saisissez votre question ici..."
                ></textarea>
                {error.question && (
                  <p className="mt-1 text-xs text-red-500">{error.question}</p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">
                  Options de réponse
                </h3>
                
                <div>
                  <label htmlFor="option_a" className="block text-sm font-medium text-gray-700 mb-1">
                    Option A*
                  </label>
                  <Input
                    type="text"
                    id="option_a"
                    name="option_a"
                    value={formData.option_a}
                    onChange={(e) => handleOptionChange('option_a', e.target.value)}
                    placeholder="Saisissez l'option A (obligatoire)"
                    className={error.option_a ? "border-red-500" : ""}
                  />
                  {error.option_a && (
                    <p className="mt-1 text-xs text-red-500">{error.option_a}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="option_b" className="block text-sm font-medium text-gray-700 mb-1">
                    Option B*
                  </label>
                  <Input
                    type="text"
                    id="option_b"
                    name="option_b"
                    value={formData.option_b}
                    onChange={(e) => handleOptionChange('option_b', e.target.value)}
                    placeholder="Saisissez l'option B (obligatoire)"
                    className={error.option_b ? "border-red-500" : ""}
                  />
                  {error.option_b && (
                    <p className="mt-1 text-xs text-red-500">{error.option_b}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="option_c" className="block text-sm font-medium text-gray-700 mb-1">
                    Option C <span className="text-xs text-gray-500">(optionnelle)</span>
                  </label>
                  <Input
                    type="text"
                    id="option_c"
                    name="option_c"
                    value={formData.option_c}
                    onChange={(e) => handleOptionChange('option_c', e.target.value)}
                    placeholder="Saisissez l'option C (optionnelle)"
                    className={error.option_c ? "border-red-500" : ""}
                  />
                  {error.option_c && (
                    <p className="mt-1 text-xs text-red-500">{error.option_c}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="option_d" className="block text-sm font-medium text-gray-700 mb-1">
                    Option D <span className="text-xs text-gray-500">(optionnelle)</span>
                  </label>
                  <Input
                    type="text"
                    id="option_d"
                    name="option_d" 
                    value={formData.option_d}
                    onChange={(e) => handleOptionChange('option_d', e.target.value)}
                    placeholder="Saisissez l'option D (optionnelle)"
                    className={error.option_d ? "border-red-500" : ""}
                  />
                  {error.option_d && (
                    <p className="mt-1 text-xs text-red-500">{error.option_d}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Réponse correcte* <span className="text-xs text-gray-500">(sélectionnez la bonne réponse)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'option_a', label: 'Option A' },
                    { id: 'option_b', label: 'Option B' },
                    { id: 'option_c', label: 'Option C' },
                    { id: 'option_d', label: 'Option D' }
                  ].map(option => (
                    <div key={option.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`correct_${option.id}`}
                        name="correct_answer"
                        value={option.id}
                        checked={formData.correct_answer === option.id}
                        onChange={() => handleCorrectAnswerChange(option.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 mr-2"
                        disabled={!formData[option.id] && (option.id === 'option_c' || option.id === 'option_d')}
                      />
                      <label 
                        htmlFor={`correct_${option.id}`} 
                        className={`text-sm ${
                          !formData[option.id] && (option.id === 'option_c' || option.id === 'option_d') 
                            ? 'text-gray-400' 
                            : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                {error.correct_answer && (
                  <p className="mt-1 text-xs text-red-500">{error.correct_answer}</p>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Link to="/monitor/quiz/questions">
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
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enregistrement..." : "Mettre à jour la question"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}