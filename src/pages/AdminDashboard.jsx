import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Calendar, CheckCircle2, XCircle, UserCheck } from "lucide-react";
import StatsCard from "@/components/dashboard/stats-card";
import RecentRegistrations from "@/components/dashboard/recent-registrations";
import RecentCourses from "@/components/dashboard/recent-courses";
import axios from "axios";
import { getAuthHeader } from "@/utils/auth";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    usersCount: "--",
    coursesCount: "--",
    pendingUsers: "--",
    bookingsCount: "--"
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        
        const response = await axios.get("http://localhost:8000/api/admin/dashboard", {
          headers: getAuthHeader()
        });
        
        const data = response.data;
        setStats({
          usersCount: data.users_count || 0,
          coursesCount: data.courses_count || 0,
          pendingUsers: data.pending_users_count || 0,
          bookingsCount: data.bookings_count || 0
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, []);

  return (
    <>
      <h1 className="dashboard-title p-5">
        Tableau de bord administrateur
      </h1>
      
      <div className="stats-grid">
        <StatsCard
          title="Utilisateurs totaux"
          value={isLoading ? "..." : stats.usersCount}
          icon={<Users className="stats-icon" />}
        />
        
        <StatsCard
          title="Cours publiés"
          value={isLoading ? "..." : stats.coursesCount}
          icon={<BookOpen className="stats-icon" />}
        />
        
        <StatsCard
          title="Comptes en attente"
          value={isLoading ? "..." : stats.pendingUsers}
          icon={<UserCheck className="stats-icon" />}
        />
        
        <StatsCard
          title="Réservations"
          value={isLoading ? "..." : stats.bookingsCount}
          icon={<Calendar className="stats-icon" />}
        />
      </div>

      <div className="dashboard-grid">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Inscriptions récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentRegistrations />
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Derniers cours ajoutés</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentCourses />
          </CardContent>
        </Card>
      </div>
    </>
  );
}