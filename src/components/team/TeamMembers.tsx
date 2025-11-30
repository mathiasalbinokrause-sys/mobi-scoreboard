import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTeamData } from "@/hooks/useTeamData";
import { Users, Trash2, UserPlus } from "lucide-react";
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

interface TeamMembersProps {
  teamId: string;
}

const TeamMembers = ({ teamId }: TeamMembersProps) => {
  const { members, addMember, deleteMember } = useTeamData(teamId);
  const [newMemberName, setNewMemberName] = useState("");
  const [openAlerts, setOpenAlerts] = useState<Record<string, boolean>>({});

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      addMember.mutate(newMemberName.trim(), {
        onSuccess: () => setNewMemberName(""),
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Adicionar Novo Membro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMember} className="flex gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="member-name">Nome do Jovem</Label>
              <Input
                id="member-name"
                placeholder="Digite o nome completo"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="self-end bg-primary hover:bg-primary/90"
              disabled={addMember.isPending}
            >
              Adicionar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Membros da Equipe ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum membro cadastrado ainda. Adicione o primeiro jovem!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50"
                >
                  <span className="font-medium">{member.name}</span>
                  <AlertDialog
                    key={`alert-${member.id}`}
                    open={openAlerts[member.id] || false}
                    onOpenChange={(open) => {
                      setOpenAlerts(prev => ({ ...prev, [member.id]: open }));
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
                        <AlertDialogTitle>Remover Membro</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover <strong>{member.name}</strong>?
                          Todas as pontuações deste membro também serão removidas.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            deleteMember.mutate(member.id);
                            setOpenAlerts(prev => ({ ...prev, [member.id]: false }));
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamMembers;
