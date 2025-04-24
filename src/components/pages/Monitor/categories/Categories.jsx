import React, { useState, useEffect } from "react"
import { Search, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import axios from "axios"
import CategoryActions from "@/components/dashboard/category-actions"
import { getAuthHeader } from "@/utils/auth"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await axios.get('http://localhost:8000/api/categories', {
          headers: getAuthHeader()
        })
        setCategories(response.data.data)
      } catch (err) {
        console.error("Failed to fetch categories:", err)
        setError("Impossible de charger les catégories. Veuillez réessayer plus tard.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleDeleteCategory = (deletedCategoryId) => {
    setCategories((prevCategories) =>
      prevCategories.filter((category) => category.id !== deletedCategoryId)
    )
  }


  const filteredCategories = categories.filter(
    (category) => 
      category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Catégories</h1>
        <Link
          to="/monitor/categories/create"
          className="bg-blue-200 hover:bg-blue-400  px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Nouvelle catégorie</span>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher des catégories..."
            className="pl-10 pr-4 py-2 border rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p>Chargement des catégories...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            className="text-blue-600 underline mt-2"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      ) : filteredCategories.length === 0 && categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="mb-4 text-gray-600">Aucune catégorie trouvée</p>
          <Link
            to="/monitor/categories/create"
            className="text-blue-600 underline"
          >
            Créer une nouvelle catégorie
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de création
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              { filteredCategories != 0 ? filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{category.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">{category.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{category.courses_count || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(category.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <CategoryActions category={category} onDelete={handleDeleteCategory}/>
                  </td>
                </tr>
              )) : categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{category.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">{category.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{category.courses_count || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(category.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <CategoryActions category={category} onDelete={handleDeleteCategory} />
                  </td>
                </tr>
              )) }
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
