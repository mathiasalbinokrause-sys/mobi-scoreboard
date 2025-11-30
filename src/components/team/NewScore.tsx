import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTeamData } from "@/hooks/useTeamData";
import { PlusCircle } from "lucide-react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const points = parseFloat(formData.points);
    if (points < 1 || points > 100) {
      return;
    }

    addScore.mutate({
      member_id: formData.member_id,
      description: formData.description,
      points,
      month: formData.month,
    }, {
      onSuccess: () => {
        setFormData({
          member_id: "",
          description: "",
          points: "",
          month: "",
        });
      }
    });
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
                onValueChange={(value) =>
                  setFormData({ ...formData, member_id: value })
                }
              >
                <SelectTrigger id="member">
                  <SelectValue placeholder="Selecione o jovem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
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
                  setFormData({ ...formData, description: e.target.value })
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
                  setFormData({ ...formData, points: e.target.value })
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
                onValueChange={(value) =>
                  setFormData({ ...formData, month: value })
                }
              >
                <SelectTrigger id="month">
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
              {addScore.isPending ? "Salvando..." : "Adicionar Pontuação"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewScore;
