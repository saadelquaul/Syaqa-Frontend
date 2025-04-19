import { Card, CardContent } from "@/components/ui/card"

export default function StatsCard({ title, value, icon }) {
  return (
    <Card className="stats-card">
      <CardContent>
        <div className="stats-icon-wrapper">{icon}</div>
        <div className="stats-content">
          <h3 className="stats-title">{title}</h3>
          <div className="stats-value">{value}</div>
        </div>
      </CardContent>
    </Card>
  )
}
