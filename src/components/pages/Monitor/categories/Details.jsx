"use client"

import React, { useState, useEffect } from "react"
import { ArrowLeft, Edit } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { getAuthHeader } from "@/utils/auth"

export default function CategoryDetailsPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8000/api/categories/${id}`, {
          headers: getAuthHeader()
        });
        
        setCategory(response.data.data);
      } catch (err) {
        console.error("Failed to fetch category:", err);
        setError("Impossible de charger les informations de la catégorie");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategory();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader"></div>
        <span className="ml-2">Chargement des données...</span>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="alert alert-error">
        <p>{error || "Catégorie introuvable"}</p>
        <Link to="/monitor/categories" className="underline">
          Retour à la liste des catégories
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <Link to="/monitor/categories" className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} />
          <span>Retour aux catégories</span>
        </Link>
        <Link to={`/monitor/categories/${id}/edit`}>
          <Button leftIcon={<Edit className="h-4 w-4" />} className="bg-blue-500 hover:bg-blue-600 text-white">
            Modifier
          </Button>
        </Link>
      </div>

      <div className="dashboard-card max-w-2xl mx-auto">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            {category.image && (
              <img 
                src={`http://localhost:8000/storage/${category.image}`}
                alt={category.name}
                className="w-24 h-24 rounded-md object-cover"
              />
            )}
            <h1 className="text-2xl font-bold">{category.name}</h1>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{category.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date de création</h3>
              <p>{new Date(category.created_at).toLocaleDateString("fr-FR")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Dernière mise à jour</h3>
              <p>{new Date(category.updated_at).toLocaleDateString("fr-FR")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nombre de cours</h3>
              <p>{category.courses_count || 0} cours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}