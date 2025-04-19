import { Link } from "react-router-dom"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const recentBookings = [
  {
    id: "1",
    student: {
      name: "Ahmed Benani",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "Aujourd'hui",
    time: "14:00 - 15:30",
    status: "confirmed",
    type: "Conduite en ville",
  },
  {
    id: "2",
    student: {
      name: "Fatima Zahra",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "Demain",
    time: "09:00 - 10:30",
    status: "confirmed",
    type: "Manœuvres",
  },
  {
    id: "3",
    student: {
      name: "Karim Idrissi",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "23 Nov",
    time: "11:00 - 12:30",
    status: "pending",
    type: "Conduite sur autoroute",
  },
]

export default function RecentBookings() {
  return (
    <div className="recent-bookings">
      {recentBookings.length > 0 ? (
        <>
          <ul className="booking-list">
            {recentBookings.map((booking) => (
              <li key={booking.id} className="booking-item">
                <div className="booking-student">
                  <Avatar src={booking.student.avatar} alt={booking.student.name} size="sm" />
                  <span className="booking-student-name">{booking.student.name}</span>
                </div>
                <div className="booking-details">
                  <div className="booking-time">
                    <span className="booking-date">{booking.date}</span>
                    <span className="booking-hours">{booking.time}</span>
                  </div>
                  <div className="booking-type">{booking.type}</div>
                </div>
                <div className="booking-status">
                  <Badge
                    variant={
                      booking.status === "confirmed" ? "success" : booking.status === "pending" ? "warning" : "danger"
                    }
                    size="sm"
                  >
                    {booking.status === "confirmed"
                      ? "Confirmé"
                      : booking.status === "pending"
                        ? "En attente"
                        : "Annulé"}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
          <div className="view-all-link">
            <Link href="/monitor/bookings">
              <Button variant="ghost" size="sm">
                Voir toutes les réservations
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>Aucune réservation récente</p>
        </div>
      )}
    </div>
  )
}
