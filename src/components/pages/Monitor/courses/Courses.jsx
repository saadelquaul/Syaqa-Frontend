import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CourseActions from "@/components/dashboard/course-actions"
import axios from "axios"
import { getAuthHeader } from "@/utils/auth"
import { useEffect } from "react"

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        const categoriesResponse = await axios.get('http://localhost:8000/api/categories', {
          headers: getAuthHeader()
        })
        const categoriesData = categoriesResponse.data.data || []
        setCategories(categoriesData)
        
        const coursesResponse = await axios.get('http://localhost:8000/api/monitor/courses', {
          headers: getAuthHeader()
        })
        
        setCourses(coursesResponse.data.courses)
        
      } catch (err) {
        console.error("Failed to fetch data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleDeleteCourse = (courseId) => {
    setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId))
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter ? course.category_name === categoryFilter : true
    const matchesStatus = statusFilter ? course.status === statusFilter : true
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="dashboard-title">Gestion des cours</h1>
        <Link to="/monitor/courses/create">
          <Button className="btn-primary" leftIcon={<Plus className="h-4 w-4" />}>Ajouter un cour</Button>
        </Link>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Mes cours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="filters-container">
            <div className="search-container">
              <Search className="search-icon" />
              <Input
                placeholder="Rechercher un cours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filters">
              <select 
                className="px-3 py-2 border rounded-md"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
              
              <select
                className="px-3 py-2 border rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="active">Publié</option>
                <option value="inactive">Brouillon</option>
              </select>
            </div>
          </div>

          
          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p>Chargement des cours...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiants</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière mise à jour</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCourses.map((course) => (
                    <tr key={course.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{course.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{course.category_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          course.status === "active" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {course.status === "active" ? "Publié" : "Brouillon"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{course.students_count}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(course.updated_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <CourseActions course={course} onDelete={handleDeleteCourse} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCourses.length === 0 && (
                <div className="text-center py-10">
                  <p className="mb-4">Aucun cours trouvé. Veuillez ajuster vos filtres ou créer un nouveau cours.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}