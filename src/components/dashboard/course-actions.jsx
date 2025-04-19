"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"

export default function CourseActions({ courseId }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDelete = () => {
    console.log(`Deleting course ${courseId}`)
    setShowDeleteModal(false)
  }

  return (
    <div className="actions-dropdown">
      <Button variant="ghost" size="icon" onClick={() => setShowDropdown(!showDropdown)} aria-label="Actions">
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {showDropdown && (
        <div className="dropdown-menu actions-menu">
          <Link to={`/monitor/courses/${courseId}`} className="dropdown-item"> {/* Changed from href to to */}
            <Eye className="dropdown-icon" />
            <span>Voir</span>
          </Link>
          <Link to={`/monitor/courses/${courseId}/edit`} className="dropdown-item"> {/* Changed from href to to */}
            <Edit className="dropdown-icon" />
            <span>Modifier</span>
          </Link>
          <button
            className="dropdown-item text-red-600"
            onClick={() => {
              setShowDropdown(false)
              setShowDeleteModal(true)
            }}
          >
            <Trash2 className="dropdown-icon" />
            <span>Supprimer</span>
          </button>
        </div>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmer la suppression"
        description="Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible."
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Supprimer
            </Button>
          </div>
        }
      >
        <p>
          La suppression de ce cours entraînera la perte de toutes les données associées, y compris les statistiques et
          les commentaires des étudiants.
        </p>
      </Modal>
    </div>
  )
}
