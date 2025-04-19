import { Calendar } from "lucide-react"

const upcomingLessons = [
  {
    id: "1",
    date: "2023-11-20",
    dayName: "Lundi",
    lessons: [
      {
        id: "l1",
        time: "09:00 - 10:30",
        student: "Ahmed Benani",
        type: "Conduite en ville",
      },
      {
        id: "l2",
        time: "11:00 - 12:30",
        student: "Fatima Zahra",
        type: "Manœuvres",
      },
    ],
  },
  {
    id: "2",
    date: "2023-11-21",
    dayName: "Mardi",
    lessons: [
      {
        id: "l3",
        time: "14:00 - 15:30",
        student: "Karim Idrissi",
        type: "Conduite sur autoroute",
      },
    ],
  },
  {
    id: "3",
    date: "2023-11-22",
    dayName: "Mercredi",
    lessons: [
      {
        id: "l4",
        time: "10:00 - 11:30",
        student: "Leila Mansouri",
        type: "Examen blanc",
      },
    ],
  },
]

export default function UpcomingLessons() {
  return (
    <div className="upcoming-lessons">
      {upcomingLessons.length > 0 ? (
        <div className="lessons-timeline">
          {upcomingLessons.map((day) => (
            <div key={day.id} className="day-group">
              <div className="day-header">
                <div className="day-calendar">
                  <Calendar className="day-icon" />
                </div>
                <div className="day-info">
                  <span className="day-name">{day.dayName}</span>
                  <span className="day-date">{day.date}</span>
                </div>
              </div>
              <div className="day-lessons">
                {day.lessons.map((lesson) => (
                  <div key={lesson.id} className="lesson-item">
                    <div className="lesson-time">{lesson.time}</div>
                    <div className="lesson-details">
                      <div className="lesson-student">{lesson.student}</div>
                      <div className="lesson-type">{lesson.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Aucune leçon à venir</p>
        </div>
      )}
    </div>
  )
}
