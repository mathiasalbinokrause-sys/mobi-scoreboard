import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Users, Award } from "lucide-react";
import { useTeamData } from "@/hooks/useTeamData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TeamDashboardProps {
  teamId: string;
}

const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

const TeamDashboard = ({ teamId }: TeamDashboardProps) => {
  const { totalPoints, scores, members } = useTeamData(teamId);

  const monthlyData = months.map((month) => ({
    name: month.slice(0, 3),
    pontos: scores
      .filter((s) => s.month === month)
      .reduce((sum, s) => sum + Number(s.points), 0),
  }));

  const ranking = members
    .map((member) => ({
      name: member.name,
      points: scores
        .filter((s) => s.member_id === member.id)
        .reduce((sum, s) => sum + Number(s.points), 0),
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  const recentScores = scores.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pontuação Total
            </CardTitle>
            <Trophy className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalPoints.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              pontos acumulados no ano
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Membros
            </CardTitle>
            <Users className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{members.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              jovens cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pontuações
            </CardTitle>
            <Award className="h-5 w-5 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{scores.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              registros no total
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Evolução Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
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
              <Bar dataKey="pontos" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle>🏆 Top 5 - Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ranking.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma pontuação registrada ainda
                </p>
              ) : (
                ranking.map((member, index) => (
                  <div
                    key={member.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-primary">
                        {index + 1}º
                      </span>
                      <span className="font-medium">{member.name}</span>
                    </div>
                    <span className="font-bold text-primary">
                      {member.points.toFixed(1)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle>📋 Últimas Pontuações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentScores.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma pontuação registrada ainda
                </p>
              ) : (
                recentScores.map((score) => (
                  <div
                    key={score.id}
                    className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">{score.members?.name || "Todos"}</span>
                      <span className="font-bold text-primary">
                        {Number(score.points).toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {score.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {score.month}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamDashboard;
