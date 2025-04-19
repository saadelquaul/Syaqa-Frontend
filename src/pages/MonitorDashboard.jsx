import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, BookOpen } from "lucide-react"
import RecentBookings from "@/components/dashboard/recent-bookings"
import StatsCard from "@/components/dashboard/stats-card"
import UpcomingLessons from "@/components/dashboard/upcoming-lessons"

export default function MonitorDashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
      <main className="dashboard-main">
    <div className="dashboard-page">
      <h1 className="dashboard-title">Tableau de bord</h1>

      {/* Stats cards section */}
      <div className="stats-grid">
        <StatsCard
          title="Cours publiés"
          value="18"
          description="3 nouveaux ce mois-ci"
          icon={<BookOpen className="stats-icon" />}
          trend="up"
          percentage="8%"
        />
        <StatsCard
          title="Réservations"
          value="42"
          description="Cette semaine"
          icon={<Calendar className="stats-icon" />}
          trend="up"
          percentage="24%"
        />
      </div>

      {/* Dashboard cards grid */}
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
    </div>
    </main>
      </div>
    </div>
  )
}
