import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, BookOpen, Users, CreditCard } from "lucide-react"
import RecentBookings from "@/components/dashboard/recent-bookings"
import StatsCard from "@/components/dashboard/stats-card"
import UpcomingLessons from "@/components/dashboard/upcoming-lessons"
import axios from "axios"
import { getAuthHeader } from "@/utils/auth"
import { useEffect, useState } from "react"

export default function MonitorDashboard() {

  const [coursesCount, setCoursesCount] = useState("--");
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        setIsLoadingCourses(true);
        
        const response = await axios.get("http://localhost:8000/api/monitor/getCourses", {
          headers: getAuthHeader()
        });
        
        setCoursesCount(response.data.courses?.length || 0);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setCoursesCount("--");
      } finally {
        setIsLoadingCourses(false);
      }
    };
    
    fetchCoursesData();
  }, []);


  return (
    <>
      <h1 className="dashboard-title p-5">
        Bienvenue sur votre tableau de bord !
      </h1>
      
      <div className="stats-grid">
        <StatsCard
          title="Cours publiés"
          value={isLoadingCourses ? "..." : coursesCount}
          icon={<BookOpen className="stats-icon" />}
        />
      </div>

      <div className="dashboard-grid">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Réservations récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentBookings />
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Leçons à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingLessons />
          </CardContent>
        </Card>
      </div>
    </>
  )
}