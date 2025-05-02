import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function UserFilters({ 
  searchQuery, 
  setSearchQuery, 
  roleFilter, 
  setRoleFilter,
  statusFilter,
  setStatusFilter 
}) {
  return (
    <div className="filters-container">
      <div className="search-container">
        <Search className="search-icon" />
        <Input
          placeholder="Rechercher un utilisateur..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="filters">
        <select
          className="px-3 py-2 border rounded-md"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Tous les rôles</option>
          <option value="admin">Administrateur</option>
          <option value="monitor">Moniteur</option>
          <option value="candidate">Candidat</option>
        </select>

        <select
          className="px-3 py-2 border rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">En attente</option>
          <option value="rejected">Refusée</option>
          <option value="graduated">Titulaire du permis</option>
        </select>
      </div>
    </div>
  );
}