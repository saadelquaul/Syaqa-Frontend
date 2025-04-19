"use client"

import { useState, useEffect, useCallback } from "react"
import { MoreVertical, Edit, Trash, Check, X, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { getAuthHeader } from "@/utils/auth"

export default function CategoryActions({ category, onDelete }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  // Handle viewing category details
  const handleView = () => {
    // Navigate to category details page
    navigate(`/dashboard/categories/${category.id}`)
    setShowMenu(false)
  }

  // Handle editing a category
  const handleEdit = () => {
    // Navigate to category edit page
    navigate(`/dashboard/categories/${category.id}/edit`)
    setShowMenu(false)
  }

  // Show delete confirmation UI
  const handleDelete = () => {
    setShowConfirmDelete(true)
    setShowMenu(false)
  }

  const confirmDelete = async () => {
    try {
      setIsDeleting(true)
      
      await axios.delete(`http://localhost:8000/api/categories/${category.id}`, {
        headers: getAuthHeader()
      })
      
      if (onDelete) {
        onDelete(category.id)
      } else {
        window.location.reload()
      }
      
    } catch (error) {
      console.error("Failed to delete category:", error)
      alert("Impossible de supprimer la catégorie. Veuillez réessayer.")
    } finally {
      setIsDeleting(false)
      setShowConfirmDelete(false)
    }
  }

  const cancelDelete = () => {
    setShowConfirmDelete(false)
  }

  const handleClickOutside = useCallback(() => {
    if (showMenu) {
      setShowMenu(false)
    }
  }, [showMenu]);

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showMenu, handleClickOutside])

  return (
    <div >
      {showConfirmDelete ? (
        <div className="flex items-center space-x-2">
          <button
            onClick={confirmDelete}
            className="p-1 text-green-600 hover:text-green-800"
            title="Confirmer la suppression"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-t-2 border-green-600 rounded-full animate-spin" />
            ) : (
              <Check size={18} />
            )}
          </button>
          <button 
            onClick={cancelDelete} 
            className="p-1 text-red-600 hover:text-red-800" 
            title="Annuler"
            disabled={isDeleting}
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }} 
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <div className="absolute right-5 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
              <div className="py-1">
                <button
                  onClick={handleView}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Eye size={16} className="mr-2" />
                  Voir les détails
                </button>
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Edit size={16} className="mr-2" />
                  Modifier
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  <Trash size={16} className="mr-2" />
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
