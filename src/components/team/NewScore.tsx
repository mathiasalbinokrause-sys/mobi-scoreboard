import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-no-portal";
import { useTeamData } from "@/hooks/useTeamData";
import { PlusCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface NewScoreProps {
  teamId: string;
}

const months = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];

const NewScore = ({ teamId }: NewScoreProps) => {
  const { members, addScore } = useTeamData(teamId);
  const [formData, setFormData] = useState({
    member_id: "",
    description: "",
    points: "",
    month: "",
  });

  if (!teamId) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            ID do time não encontrado.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!members) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Carregando membros...</span>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validações
      if (!formData.member_id) {
        toast.error("Selecione quem fez a atividade");
        return;
      }

      if (!formData.description.trim()) {
        toast.error("Digite uma descrição");
        return;
      }

      if (!formData.points) {
        toast.error("Digite a pontuação");
        return;
      }

      if (!formData.month) {
        toast.error("Selecione o mês");
        return;
      }
      
      const points = parseFloat(formData.points);
      
      if (isNaN(points)) {
        toast.error("Pontuação inválida");
        return;
      }

      if (points < 1 || points > 100) {
        toast.error("A pontuação deve estar entre 1 e 100");
        return;
      }

addScore.mutate(
  {
    member_id: formData.member_id === "todos" ? null : formData.member_id,
    description: formData.description.trim(),
    points,
    month: formData.month,
  },
  {
    onSuccess: () => {
      setFormData({
        member_id: "",
        description: "",
        points: "",
        month: "",
      });
      toast.success("Pontuação adicionada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao adicionar pontuação:", error);
      toast.error("Erro ao adicionar pontuação. Tente novamente.");
    },
  }
);
    } catch (error) {
      console.error("Erro no handleSubmit:", error);
      toast.error("Erro inesperado. Tente novamente.");
    }
  };

  const handleMemberChange = (value: string) => {
    try {
      setFormData(prev => ({ ...prev, member_id: value }));
    } catch (error) {
      console.error("Erro ao selecionar membro:", error);
      toast.error("Erro ao selecionar membro");
    }
  };

  const handleMonthChange = (value: string) => {
    try {
      setFormData(prev => ({ ...prev, month: value }));
    } catch (error) {
      console.error("Erro ao selecionar mês:", error);
      toast.error("Erro ao selecionar mês");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            Registrar Nova Pontuação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="member">Quem fez *</Label>
              <Select
                value={formData.member_id}
                onValueChange={handleMemberChange}
                disabled={!members || members.length === 0}
              >
                <SelectTrigger id="member" className="w-full">
                  <SelectValue placeholder="Selecione o jovem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {members && members.length > 0 ? (
                    members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Nenhum membro cadastrado
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                placeholder="Descreva a atividade realizada..."
                value={formData.description}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, description: e.target.value }))
                }
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Pontos (1 - 100) *</Label>
              <Input
                id="points"
                type="number"
                min="1"
                max="100"
                step="0.1"
                placeholder="Ex: 50.5"
                value={formData.points}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, points: e.target.value }))
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Digite um valor entre 1 e 100 (pode usar decimais)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="month">Mês *</Label>
              <Select
                value={formData.month}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger id="month" className="w-full">
                  <SelectValue placeholder="Selecione o mês" />
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

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={addScore.isPending}
            >
              {addScore.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Adicionar Pontuação"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewScore;
