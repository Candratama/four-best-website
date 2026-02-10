import { Card } from "@/components/ui/card";
import type { SubmissionStats } from "@/lib/db";

interface SubmissionStatsProps {
  stats: SubmissionStats;
}

export default function SubmissionStatsComponent({ stats }: SubmissionStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* This Week */}
      <Card className="p-6">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium text-muted-foreground">This Week</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold">{stats.thisWeek}</h3>
            <span className="text-sm text-muted-foreground">submissions</span>
          </div>
        </div>
      </Card>

      {/* Overdue */}
      <Card className="p-6">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Overdue</p>
          <div className="flex items-baseline space-x-2">
            <h3 className={`text-3xl font-bold ${stats.overdue > 0 ? "text-red-600" : ""}`}>
              {stats.overdue}
            </h3>
            <span className="text-sm text-muted-foreground">follow-ups</span>
          </div>
        </div>
      </Card>

      {/* New */}
      <Card className="p-6">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium text-muted-foreground">New</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold">{stats.newCount}</h3>
            <span className="text-sm text-muted-foreground">unread</span>
          </div>
        </div>
      </Card>

      {/* Response Rate */}
      <Card className="p-6">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold">{stats.responseRate}%</h3>
            <span className="text-sm text-muted-foreground">responded</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
