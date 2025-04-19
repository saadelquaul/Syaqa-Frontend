import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, BookOpen, Users, CreditCard } from "lucide-react"
import RecentBookings from "@/components/dashboard/recent-bookings"
import StatsCard from "@/components/dashboard/stats-card"
import UpcomingLessons from "@/components/dashboard/upcoming-lessons"

export default function MonitorDashboard() {
  return (
    <>
      <h1 className="dashboard-title">Tableau de bord</h1>
      
      <div className="stats-grid">
        <StatsCard
          title="Cours publiés"
          value="18"
          icon={<BookOpen className="stats-icon" />}
        />
        <StatsCard
          title="Réservations"
          value="42"
          icon={<Calendar className="stats-icon" />}
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