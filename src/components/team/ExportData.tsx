import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTeamData } from "@/hooks/useTeamData";
import { Download, FileSpreadsheet } from "lucide-react";
import { exportToExcel } from "@/lib/exportToExcel";
import { toast } from "sonner";

interface ExportDataProps {
  teamId: string;
  teamName: string;
}

const ExportData = ({ teamId, teamName }: ExportDataProps) => {
  const { members, scores } = useTeamData(teamId);

  const handleExport = () => {
    try {
      exportToExcel(teamName, members, scores);
      toast.success("Dados exportados com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar dados");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Exportar Dados do Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-muted-foreground">
              Exporte todos os dados do time em formato Excel (.xlsx) para análise offline
              ou compartilhamento.
            </p>
            
            <div className="p-4 bg-muted/30 rounded-lg space-y-2">
              <h3 className="font-semibold">O arquivo incluirá:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Lista completa de membros da equipe</li>
                <li>Todas as pontuações registradas com detalhes</li>
                <li>Resumo de pontuações por mês</li>
                <li>Ranking dos membros por pontuação</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">{members.length}</div>
                <div className="text-xs text-muted-foreground">Membros</div>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <div className="text-2xl font-bold text-accent">{scores.length}</div>
                <div className="text-xs text-muted-foreground">Pontuações</div>
              </div>
              <div className="p-3 bg-chart-2/10 rounded-lg">
                <div className="text-2xl font-bold text-chart-2">
                  {scores.reduce((sum, s) => sum + Number(s.points), 0).toFixed(0)}
                </div>
                <div className="text-xs text-muted-foreground">Pontos Total</div>
              </div>
              <div className="p-3 bg-chart-3/10 rounded-lg">
                <div className="text-2xl font-bold text-chart-3">
                  {new Set(scores.map(s => s.month)).size}
                </div>
                <div className="text-xs text-muted-foreground">Meses Ativos</div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleExport}
            className="w-full bg-primary hover:bg-primary/90 h-12 text-base"
          >
            <Download className="h-5 w-5 mr-2" />
            Exportar para Excel
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            O arquivo será baixado automaticamente no formato .xlsx
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportData;
