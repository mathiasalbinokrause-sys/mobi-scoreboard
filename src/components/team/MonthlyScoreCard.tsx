import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";

interface Score {
  id: string;
  points: number;
  description: string;
  created_at: string;
  members?: { name: string } | null;
}

interface MonthlyScoreCardProps {
  month: string;
  total: number;
  count: number;
  scores: Score[];
  onDeleteScore: (scoreId: string) => void;
}

export const MonthlyScoreCard = ({
  month,
  total,
  count,
  scores,
  onDeleteScore,
}: MonthlyScoreCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredScores = searchTerm
    ? scores.filter(
        (score) =>
          (score.members?.name || "Todos")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          score.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : scores;

  return (
    <Card className="p-4 border-primary/20">
      <div className="w-full">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold capitalize">{month}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors" />
            </div>
            <div className="text-2xl font-bold text-primary mb-1">
              {total.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              {count} {count === 1 ? "pontuação" : "pontuações"}
            </div>
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold capitalize">
                Detalhes - {month}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  setSearchTerm("");
                  setDeleteConfirm(null);
                }}
              >
                Fechar
              </Button>
            </div>

            <div>
              <Label>Pesquisar</Label>
              <Input
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="space-y-3">
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
                    {deleteConfirm === score.id ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">
                          Tem certeza que deseja remover esta pontuação?
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              onDeleteScore(score.id);
                              setDeleteConfirm(null);
                            }}
                          >
                            Confirmar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteConfirm(score.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(score.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
