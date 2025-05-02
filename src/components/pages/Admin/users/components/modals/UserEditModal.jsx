import { X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UserEditModal({
  showEditModal,
  setShowEditModal,
  selectedUser,
  editForm,
  handleEditFormChange,
  handleUpdateUser
}) {
  if (!showEditModal || !selectedUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Modifier l'utilisateur</h2>
          <button
            onClick={() => setShowEditModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleUpdateUser} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <Input
                id="name"
                name="name"
                value={editForm.name}
                onChange={handleEditFormChange}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={editForm.email}
                onChange={handleEditFormChange}
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <Input
                id="address"
                name="address"
                value={editForm.address}
                onChange={handleEditFormChange}
                required
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <Input
                id="phone_number"
                name="phone_number"
                value={editForm.phone_number}
                onChange={handleEditFormChange}
                required
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                id="status"
                name="status"
                value={editForm.status}
                onChange={handleEditFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="active">Actif</option>
                <option value="inactive">En attente</option>
                <option value="graduated">Titulaire du permis</option>
                <option value="rejected">Refusé</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600"
            >
              <CheckCircle size={16} className="mr-2" />
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}