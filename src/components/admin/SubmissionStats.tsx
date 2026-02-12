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
          <p className="text-sm font-medium text-muted-foreground">Minggu Ini</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold">{stats.thisWeek}</h3>
            <span className="text-sm text-muted-foreground">pesan</span>
          </div>
        </div>
      </Card>

      {/* Overdue */}
      <Card className="p-6">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Terlambat</p>
          <div className="flex items-baseline space-x-2">
            <h3 className={`text-3xl font-bold ${stats.overdue > 0 ? "text-red-600" : ""}`}>
              {stats.overdue}
            </h3>
            <span className="text-sm text-muted-foreground">tindak lanjut</span>
          </div>
        </div>
      </Card>

      {/* New */}
      <Card className="p-6">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Baru</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold">{stats.newCount}</h3>
            <span className="text-sm text-muted-foreground">belum dibaca</span>
          </div>
        </div>
      </Card>

      {/* Total Messages */}
      <Card className="p-6">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Total Pesan</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold">{stats.totalMessages}</h3>
            <span className="text-sm text-muted-foreground">pesan</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
