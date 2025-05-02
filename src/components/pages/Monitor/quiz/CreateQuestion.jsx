import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, Image as ImageIcon, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { getAuthHeader } from "@/utils/auth";
import toast from "react-hot-toast";

export default function CreateQuizQuestionPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answers: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false }
    ]
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState({
    question: "",
    answers: ["", "", "", ""],
    image: "",
    general: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error[name]) {
      setError(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleAnswerChange = (index, value) => {
    setFormData(prev => {
      const newAnswers = [...prev.answers];
      newAnswers[index] = { ...newAnswers[index], text: value };
      return { ...prev, answers: newAnswers };
    });

    if (error.answers[index]) {
      setError(prev => {
        const newErrors = [...prev.answers];
        newErrors[index] = "";
        return { ...prev, answers: newErrors };
      });
    }
  };

  const handleCorrectAnswerChange = (index) => {
    setFormData(prev => {
      const newAnswers = prev.answers.map((answer, i) => ({
        ...answer,
        isCorrect: i === index
      }));
      return { ...prev, answers: newAnswers };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setError(prev => ({
      ...prev,
      image: ""
    }));

    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError(prev => ({
        ...prev,
        image: "Le format de l'image doit être JPG, JPEG ou PNG"
      }));
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError(prev => ({
        ...prev,
        image: "L'image ne doit pas dépasser 2MB"
      }));
      e.target.value = "";
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    let hasError = false;
    const newError = {
      question: "",
      answers: ["", "", "", ""],
      image: "",
      general: ""
    };

    if (!formData.question.trim()) {
      newError.question = "La question est requise";
      hasError = true;
    }

    formData.answers.forEach((answer, index) => {
      if (!answer.text.trim()) {
        newError.answers[index] = `La réponse ${index + 1} est requise`;
        hasError = true;
      }
    });

    setError(newError);
    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    const loadingToast = toast.loading("Enregistrement de la question...");

    try {
      const apiFormData = new FormData();
      apiFormData.append("question", formData.question);
      
      formData.answers.forEach((answer, index) => {
        apiFormData.append(`answers[${index}][text]`, answer.text);
        apiFormData.append(`answers[${index}][is_correct]`, answer.isCorrect ? '1' : '0');
      });
      
      if (image) {
        apiFormData.append("image", image);
      }

      const response = await axios.post(
        "http://localhost:8000/api/quiz-questions",
        apiFormData,
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data"
          }
        }
      );

      toast.success("Question ajoutée avec succès", { id: loadingToast });
      navigate("/monitor/quiz/questions");
    } catch (err) {
      console.error("Erreur lors de la création de la question:", err);
      
      if (err.response?.data?.errors) {
        const apiErrors = err.response.data.errors;
        const newError = { ...error };
        
        if (apiErrors.question) {
          newError.question = apiErrors.question[0];
        }
        
        if (apiErrors.image) {
          newError.image = apiErrors.image[0];
        }
        
        if (apiErrors.answers) {
          Object.keys(apiErrors.answers).forEach(index => {
            if (newError.answers[index]) {
              newError.answers[index] = apiErrors.answers[index].text[0];
            }
          });
        }
        
        setError(newError);
      }
      
      toast.error("Erreur lors de l'ajout de la question", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <Link to="/monitor/quiz/questions" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} />
          <span>Retour aux questions</span>
        </Link>
        <h1 className="dashboard-title">Ajouter une nouvelle question</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500" />
            Nouvelle question de quiz
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
              {/* Question */}
              <div>
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                  Question* <span className="text-xs text-gray-500">(ex: Que signifie ce panneau ?)</span>
                </label>
                <textarea
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
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

              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image <span className="text-xs text-gray-500">(panneau, situation de conduite, etc.)</span>
                </label>
                <div className="mt-1 flex items-center">
                  <div className={`mr-4 w-full max-w-sm aspect-video rounded-md border ${
                    imagePreview ? "border-slate-300" : "border-dashed border-slate-300"
                  } flex items-center justify-center overflow-hidden`}>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Aperçu"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="h-10 w-10 text-slate-400 mx-auto" />
                        <span className="text-sm text-slate-500 block mt-1">Aucune image sélectionnée</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageChange}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                  <p className="mt-1 text-xs text-slate-500">JPG, JPEG ou PNG. Taille max: 2MB</p>
                  {error.image && (
                    <p className="mt-1 text-xs text-red-500">{error.image}</p>
                  )}
                </div>
              </div>

              {/* Answers */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Réponses* <span className="text-xs text-gray-500">(sélectionnez la réponse correcte)</span>
                </h3>
                
                <div className="space-y-3">
                  {formData.answers.map((answer, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-3">
                        <input
                          type="radio"
                          id={`correct-${index}`}
                          name="correctAnswer"
                          checked={answer.isCorrect}
                          onChange={() => handleCorrectAnswerChange(index)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-grow">
                        <label htmlFor={`answer-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          {answer.isCorrect ? 'Réponse correcte*' : `Réponse incorrecte ${index}*`}
                        </label>
                        <Input
                          type="text"
                          id={`answer-${index}`}
                          value={answer.text}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          placeholder={`Option de réponse ${index + 1}`}
                          error={error.answers[index]}
                          className={error.answers[index] ? "border-red-500" : ""}
                        />
                        {error.answers[index] && (
                          <p className="mt-1 text-xs text-red-500">{error.answers[index]}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
                  disabled={isLoading}
                >
                  {isLoading ? "Enregistrement..." : "Enregistrer la question"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}