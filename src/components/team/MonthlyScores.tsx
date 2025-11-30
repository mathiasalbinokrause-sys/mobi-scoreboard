import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTeamData } from "@/hooks/useTeamData";
import { Calendar, ChevronRight, Trash2, XCircle, AlertTriangle, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MonthlyScoresProps {
  teamId: string;
}

const months = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];

const MonthlyScores = ({ teamId }: MonthlyScoresProps) => {
  const { scores, deleteScore, clearMonth, clearYear } = useTeamData(teamId);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});
  const [openAlerts, setOpenAlerts] = useState<Record<string, boolean>>({});

  const monthlyData = months.map((month) => {
    const monthScores = scores.filter((s) => s.month === month);
    return {
      month,
      total: monthScores.reduce((sum, s) => sum + Number(s.points), 0),
      count: monthScores.length,
    };
  });

  const chartData = monthlyData.map((data) => ({
    name: data.month.slice(0, 3),
    pontos: data.total,
  }));

  const selectedMonthScores = selectedMonth
    ? scores.filter((s) => s.month === selectedMonth)
    : [];

  const filteredScores = searchTerm
    ? selectedMonthScores.filter((score) =>
        (score.members?.name || "Todos").toLowerCase().includes(searchTerm.toLowerCase()) ||
        score.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : selectedMonthScores;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
              <XCircle className="h-4 w-4 mr-2" />
              Zerar Mês
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Zerar Mês Específico
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação irá remover TODAS as pontuações de um mês específico.
                Esta ação não pode ser desfeita!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Label htmlFor="month-select" className="mb-2 block">Selecione o mês:</Label>
              <Select value={selectedMonth || ""} onValueChange={setSelectedMonth}>
                <SelectTrigger id="month-select">
                  <SelectValue placeholder="Escolha o mês" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month.charAt(0).toUpperCase() + month.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedMonth && clearMonth.mutate(selectedMonth)}
                disabled={!selectedMonth}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Confirmar e Zerar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Zerar Ano
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Zerar Ano Completo
              </AlertDialogTitle>
              <AlertDialogDescription>
                ATENÇÃO! Esta ação irá remover TODAS as pontuações do ano inteiro deste time.
                Esta ação é PERMANENTE e não pode ser desfeita!
                <br /><br />
                <strong>Total de pontuações que serão removidas: {scores.length}</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => clearYear.mutate()}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Confirmar e Zerar Tudo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
              <Dialog 
                key={`dialog-${data.month}`}
                open={openDialogs[data.month] || false}
                onOpenChange={(open) => {
                  setOpenDialogs(prev => ({ ...prev, [data.month]: open }));
                  if (open) {
                    setSelectedMonth(data.month);
                    setSearchTerm("");
                  }
                }}
              >
                <DialogTrigger asChild>
                  <div
                    className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold capitalize">{data.month}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {data.total.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {data.count} {data.count === 1 ? "pontuação" : "pontuações"}
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="capitalize">
                      Detalhes - {data.month}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="my-4">
                    <Label htmlFor="search">Pesquisar</Label>
                    <Input
                      id="search"
                      placeholder="Buscar por nome ou descrição..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-3 mt-4">
                    {filteredScores.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">
                        {searchTerm 
                          ? "Nenhuma pontuação encontrada com esses termos"
                          : "Nenhuma pontuação registrada neste mês"}
                      </p>
                    ) : (
                      filteredScores.map((score) => (
                        <div
                          key={score.id}
                          className="p-4 rounded-lg bg-muted/30 border border-border/50"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="font-medium mb-1">
                                {score.members?.name || "Todos"}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {score.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-primary text-lg">
                                {Number(score.points).toFixed(1)}
                              </span>
                              <AlertDialog
                                key={`alert-${score.id}`}
                                open={openAlerts[score.id] || false}
                                onOpenChange={(open) => {
                                  setOpenAlerts(prev => ({ ...prev, [score.id]: open }));
                                }}
                              >
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remover Pontuação</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja remover esta pontuação?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => {
                                        deleteScore.mutate(score.id);
                                        setOpenAlerts(prev => ({ ...prev, [score.id]: false }));
                                      }}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Remover
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(score.created_at).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyScores;
