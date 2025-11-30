import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeamData } from "@/hooks/useTeamData";
import { Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MonthlyScoreCard } from "./MonthlyScoreCard";
import { ClearMonthDialog } from "./ClearMonthDialog";
import { ClearYearDialog } from "./ClearYearDialog";

interface MonthlyScoresProps {
  teamId: string;
}

const months = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];

const MonthlyScores = ({ teamId }: MonthlyScoresProps) => {
  const { scores, deleteScore, clearMonth, clearYear } = useTeamData(teamId);

  const monthlyData = months.map((month) => {
    const monthScores = scores.filter((s) => s.month === month);
    return {
      month,
      total: monthScores.reduce((sum, s) => sum + Number(s.points), 0),
      count: monthScores.length,
      scores: monthScores,
    };
  });

  const chartData = monthlyData.map((data) => ({
    name: data.month.slice(0, 3),
    pontos: data.total,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-end">
        <ClearMonthDialog
          months={months}
          onClearMonth={(month) => clearMonth.mutate(month)}
        />
        <ClearYearDialog
          totalScores={scores.length}
          onClearYear={() => clearYear.mutate()}
        />
      </div>

      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Gráfico de Pontuação por Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar dataKey="pontos" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle>Pontuação por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {monthlyData.map((data) => (
              <MonthlyScoreCard
                key={data.month}
                month={data.month}
                total={data.total}
                count={data.count}
                scores={data.scores}
                onDeleteScore={(scoreId) => deleteScore.mutate(scoreId)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyScores;
