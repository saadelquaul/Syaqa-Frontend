import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { getAuthHeader } from "@/utils/auth";
import toast from "react-hot-toast";

export default function TakeQuizPage() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 minutes in seconds
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [results, setResults] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {

        if (!quizStarted || quizSubmitted) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    submitQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizStarted, quizSubmitted]);

    const fetchQuestions = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:8000/api/candidate/quiz/generate', {
                headers: getAuthHeader()
            });

            setQuestions(response.data.questions || []);
        } catch (err) {
            console.error("Failed to fetch questions:", err);
            setError("Impossible de charger les questions du quiz. Veuillez réessayer plus tard.");
            toast.error("Erreur lors du chargement du quiz");
        } finally {
            setIsLoading(false);
        }
    };

    const startQuiz = () => {
        setQuizStarted(true);
    };

    const handleAnswer = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const navigateToQuestion = (index) => {
        if (index >= 0 && index < questions.length) {
            setCurrentQuestionIndex(index);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' + secs : secs}`;
    };

    const submitQuiz = async () => {
        if (Object.keys(answers).length < questions.length) {
            if (!confirm("Vous n'avez pas répondu à toutes les questions. Êtes-vous sûr de vouloir soumettre le quiz ?")) {
                return;
            }
        }

        setIsLoading(true);

        try {

            const total_questions = questions.length;
            let correct_answers = 0;
            let incorrect_answers = 0;

            questions.forEach(question => {
                const userAnswer = answers[question.id];
                if (!userAnswer) return;

                if (userAnswer === question.correct_answer) {
                    correct_answers++;
                } else {
                    incorrect_answers++;
                }
            });

            const score = Math.round((correct_answers / total_questions) * 100);


            const response = await axios.post('http://localhost:8000/api/candidate/quiz/submit', {
                correct_answers,
                incorrect_answers,
                total_questions,
                score
            }, {
                headers: getAuthHeader()
            });
            console.log("Quiz submission response:", response.data);

            setQuizSubmitted(true);

            setResults({
                score: score,
                total_questions: total_questions,
                correct_answers: correct_answers,
                wrong_answers: incorrect_answers,
                unanswered: total_questions - (correct_answers + incorrect_answers),
                passing_score: 70,
                passed: score >= 70
            }); 
            toast.success("Quiz soumis avec succès");
        } catch (err) {
            console.error("Failed to submit quiz:", err);
            toast.error("Erreur lors de la soumission du quiz");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !quizStarted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600">Chargement du quiz...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 my-6">
                <p className="text-red-700">{error}</p>
                <Button
                    onClick={fetchQuestions}
                    className="mt-3 bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Réessayer
                </Button>
            </div>
        );
    }

    if (quizSubmitted && results) {
        const passedQuiz = results.score >= results.passing_score;

        return (
            <div className="dashboard-page">
                <div className="page-header">
                    <Link to="/candidate/quiz" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
                        <ArrowLeft size={16} />
                        <span>Retour aux quiz</span>
                    </Link>
                    <h1 className="dashboard-title">Résultats du quiz</h1>
                </div>

                <Card className="max-w-3xl mx-auto">
                    <CardHeader className={`${passedQuiz ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                        <CardTitle className="flex items-center gap-3">
                            {passedQuiz ? (
                                <>
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                    <span className="text-green-800">Quiz réussi!</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-6 w-6 text-red-600" />
                                    <span className="text-red-800">Quiz échoué</span>
                                </>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="text-5xl font-bold mb-2">
                                    {results.score}%
                                </div>
                                <p className="text-sm text-gray-500">
                                    Note de passage: {results.passing_score}%
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-500">Questions totales</p>
                                    <p className="font-medium">{results.total_questions}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Réponses correctes</p>
                                    <p className="font-medium">{results.correct_answers}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Réponses incorrectes</p>
                                    <p className="font-medium">{results.wrong_answers}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Sans réponse</p>
                                    <p className="font-medium">{results.unanswered}</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-3 pt-4 border-t">
                                <Button
                                    className="w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white"
                                    onClick={() => navigate('/candidate/quiz/history')}
                                >
                                    Voir l'historique des quiz
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full max-w-xs"
                                    onClick={() => {
                                        // Reset and restart quiz
                                        setAnswers({});
                                        setCurrentQuestionIndex(0);
                                        setQuizSubmitted(false);
                                        setTimeLeft(40 * 60);
                                        setQuizStarted(false);
                                        fetchQuestions();
                                    }}
                                >
                                    Démarrer un nouveau quiz
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Quiz start screen
    if (!quizStarted) {
        return (
            <div className="dashboard-page">
                <div className="page-header">
                    <Link to="/candidate/quiz" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
                        <ArrowLeft size={16} />
                        <span>Retour aux quiz</span>
                    </Link>
                    <h1 className="dashboard-title">Quiz Code de la Route</h1>
                </div>

                <Card className="max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle>Prêt à commencer le quiz?</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3">
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-medium text-blue-800 mb-2">Instructions:</h3>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Ce quiz contient 40 questions sur le code de la route</li>
                                    <li>• Vous disposerez de 40 minutes pour compléter le quiz</li>
                                    <li>• Vous devez obtenir au moins 70% pour réussir</li>
                                    <li>• Une seule réponse est correcte pour chaque question</li>
                                </ul>
                            </div>

                            <div className="flex justify-center pt-6">
                                <Button
                                    onClick={startQuiz}
                                    size="lg"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-8"
                                >
                                    Commencer le Quiz
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div className="flex-1">
                    <h1 className="dashboard-title">Quiz Code de la Route</h1>
                    <p className="text-sm text-gray-500">
                        Question {currentQuestionIndex + 1} sur {questions.length}
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-full text-yellow-800">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <Card>
                        <CardContent className="p-6">
                            {currentQuestion?.image_url && (
                                <div className="mb-6 bg-gray-100 p-4 rounded-md flex justify-center">
                                    <img
                                        src={`http://localhost:8000/storage/${currentQuestion.image_url}`}
                                        alt="Question Image"
                                        className="max-h-80 object-contain"
                                    />
                                </div>
                            )}

                            <h2 className="text-xl font-medium mb-6">
                                {currentQuestionIndex + 1}. {currentQuestion?.question}
                            </h2>

                            <div className="space-y-3 mt-4">
                                {['option_a', 'option_b', 'option_c', 'option_d'].map(option => {
                                    if (!currentQuestion.options[option]) return null;
                                    return (
                                        <div
                                            key={option}
                                            className={`p-3 border rounded-md cursor-pointer ${answers[currentQuestion.id] === option
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'hover:bg-gray-50'
                                                }`}
                                            onClick={() => handleAnswer(currentQuestion.id, option)}
                                        >
                                            <div className="flex items-center">
                                                <div className={`h-5 w-5 rounded-full border ${answers[currentQuestion.id] === option
                                                    ? 'border-blue-500'
                                                    : 'border-gray-300'
                                                    } flex items-center justify-center mr-3`}>
                                                    {answers[currentQuestion.id] === option && (
                                                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                                    )}
                                                </div>
                                                <span>{option === 'option_a'
                                                    ? 'A'
                                                    : option === 'option_b'
                                                        ? 'B'
                                                        : option === 'option_c'
                                                            ? 'C'
                                                            : 'D'
                                                }. {currentQuestion.options[option]}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-end mt-8">

                                {currentQuestionIndex === questions.length - 1 ? (
                                    <Button
                                        onClick={submitQuiz}
                                        className="bg-green-500 hover:bg-green-600 text-white"
                                    >
                                        Soumettre le quiz
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => navigateToQuestion(currentQuestionIndex + 1)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                        Question suivante
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:w-64 flex-shrink-0">
                    <Card>
                        <div className="p-4 border-b">
                            <h3 className="font-medium">Navigation</h3>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-5 gap-2">
                                {questions.map((question, index) => (
                                    <button
                                        key={question.id}
                                        className={`h-9 w-9 flex items-center justify-center rounded-md text-sm font-medium
                      ${currentQuestionIndex === index ? 'ring-2 ring-blue-500' : ''}
                      ${answers[question.id]
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }
                    `}
                                        onClick={() => navigateToQuestion(index)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-6">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-500">Répondues:</span>
                                    <span className="font-medium">{Object.keys(answers).length}/{questions.length}</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500"
                                        style={{ width: `${Object.keys(answers).length / questions.length * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <Button
                                onClick={submitQuiz}
                                className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white"
                            >
                                Soumettre le quiz
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}