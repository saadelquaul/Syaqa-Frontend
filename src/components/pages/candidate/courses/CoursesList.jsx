import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, BookOpen, Clock, Tag, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { getAuthHeader } from "@/utils/auth";
import toast from "react-hot-toast";

export default function CandidateCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("enrolled");

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setIsLoading(true);


            const enrolledResponse = await axios.get('http://localhost:8000/api/candidate/courses/enrolled', {
                headers: getAuthHeader()
            });

            const availableResponse = await axios.get('http://localhost:8000/api/candidate/courses/available', {
                headers: getAuthHeader()
            });

            setCourses(enrolledResponse.data.courses || []);
            setAvailableCourses(availableResponse.data.courses || []);
        } catch (err) {
            console.error("Failed to fetch courses:", err);
            setError("Impossible de charger les cours. Veuillez réessayer plus tard.");
            toast.error("Erreur lors du chargement des cours");
        } finally {
            setIsLoading(false);
        }
    };

    const enrollInCourse = async (courseId) => {
        try {
            const loadingToast = toast.loading("Inscription en cours...");

            await axios.post(`http://localhost:8000/api/candidate/courses/${courseId}/enroll`, {}, {
                headers: getAuthHeader()
            });
            fetchCourses();

            toast.success("Inscription réussie!", { id: loadingToast });
        } catch (err) {
            console.error("Failed to enroll:", err);
            toast.error("Erreur lors de l'inscription au cours");
        }
    };

    const filteredCourses = activeTab === "enrolled"
        ? courses.filter(course => course.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : availableCourses.filter(course => course.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1 className="dashboard-title">
                    {activeTab === "enrolled" ? "Mes formations" : "Formations disponibles"}
                </h1>
            </div>

            <div className="mb-6">
                <div className="bg-white rounded-lg p-1 inline-flex items-center">
                    <button
                        className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === "enrolled"
                                ? "bg-blue-500 text-white"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                        onClick={() => setActiveTab("enrolled")}
                    >
                        Mes formations
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === "available"
                                ? "bg-blue-500 text-white"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                        onClick={() => setActiveTab("available")}
                    >
                        Explorer les formations
                    </button>
                </div>
            </div>

            <Card className="dashboard-card">
                <CardHeader>
                    <CardTitle>{activeTab === "enrolled" ? "Mes formations" : "Explorer les formations"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            placeholder={`Rechercher des formations ${activeTab === "enrolled" ? "suivies" : "disponibles"}...`}
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
                            <p>Chargement des cours...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <p>{error}</p>
                            <button
                                className="text-blue-600 underline mt-2"
                                onClick={fetchCourses}
                            >
                                Réessayer
                            </button>
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-8">
                            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 mb-4">
                                {activeTab === "enrolled"
                                    ? "Vous n'êtes inscrit à aucune formation pour le moment"
                                    : "Aucune formation disponible pour le moment"}
                            </p>
                            {activeTab === "enrolled" && (
                                <Button
                                    onClick={() => setActiveTab("available")}
                                    className="bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                    Explorer les formations disponibles
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredCourses.map((course) => (
                                <div key={course.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    {course.image_url ? (
                                        <div className="aspect-video w-full overflow-hidden">
                                            <img
                                                src={`http://localhost:8000/storage/${course.image_url}`}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
                                            <BookOpen className="h-12 w-12 text-gray-400" />
                                        </div>
                                    )}

                                    <div className="p-4">
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {course.category_name}
                                            </span>

                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${ course.enrollment_status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                                { course.enrollment_status === "completed" ? "Terminé" : "En cours" }
                                            </span>

                                        </div>

                                        <h3 className="text-lg font-medium mb-2">{course.title}</h3>

                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                            {course.description}
                                        </p>

                                        {activeTab === "enrolled" ? (
                                            <Link
                                                to={`/candidate/courses/${course.id}`}
                                                className="block w-full"
                                            >
                                                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                                                    <PlayCircle className="h-4 w-4 mr-2" />
                                                    Continuer
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button
                                                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                                                onClick={() => enrollInCourse(course.id)}
                                            >
                                                S'inscrire au cours
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}