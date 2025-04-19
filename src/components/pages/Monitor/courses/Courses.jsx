"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CourseActions from "@/components/dashboard/course-actions"

// Mock data for courses
const mockCourses = [
  {
    id: "1",
    title: "Code de la route complet",
    category: "Théorie",
    status: "published",
    students: 156,
    lastUpdated: "2023-11-15",
  },
  {
    id: "2",
    title: "Techniques de conduite essentielles",
    category: "Pratique",
    status: "published",
    students: 89,
    lastUpdated: "2023-11-10",
  },
  {
    id: "3",
    title: "Préparation à l'examen pratique",
    category: "Examen",
    status: "draft",
    students: 0,
    lastUpdated: "2023-11-18",
  },
  {
    id: "4",
    title: "Conduite en ville",
    category: "Pratique",
    status: "published",
    students: 42,
    lastUpdated: "2023-10-25",
  },
  {
    id: "5",
    title: "Conduite sur autoroute",
    category: "Pratique",
    status: "draft",
    students: 0,
    lastUpdated: "2023-11-05",
  },
]

export default function CoursesPage() {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Filter courses based on search query and filters
  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter ? course.category === categoryFilter : true
    const matchesStatus = statusFilter ? course.status === statusFilter : true
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="dashboard-title">Gestion des cours</h1>
        <Link href="/monitor/courses/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>Ajouter un cours</Button>
        </Link>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Mes cours</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and filters */}
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
              <Select
                options={[
                  { value: "", label: "Toutes les catégories" },
                  { value: "Théorie", label: "Théorie" },
                  { value: "Pratique", label: "Pratique" },
                  { value: "Examen", label: "Examen" },
                ]}
                value={categoryFilter}
                onChange={(value) => setCategoryFilter(value)}
                leftIcon={<Filter className="h-4 w-4" />}
              />
              <Select
                options={[
                  { value: "", label: "Tous les statuts" },
                  { value: "published", label: "Publié" },
                  { value: "draft", label: "Brouillon" },
                ]}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                leftIcon={<Filter className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Courses table */}
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Étudiants</TableHead>
                  <TableHead>Dernière mise à jour</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>
                      <Badge variant={course.status === "published" ? "success" : "warning"}>
                        {course.status === "published" ? "Publié" : "Brouillon"}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.students}</TableCell>
                    <TableCell>{course.lastUpdated}</TableCell>
                    <TableCell>
                      <CourseActions courseId={course.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Empty state when no courses match filters */}
            {filteredCourses.length === 0 && (
              <div className="empty-state">
                <p>Aucun cours trouvé. Veuillez ajuster vos filtres ou créer un nouveau cours.</p>
                <Link href="/monitor/courses/create">
                  <Button variant="outline" leftIcon={<Plus className="h-4 w-4" />}>
                    Ajouter un cours
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
