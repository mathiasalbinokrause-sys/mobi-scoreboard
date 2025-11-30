import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTeamData } from "@/hooks/useTeamData";
import { Users, UserPlus } from "lucide-react";
import { DeleteMemberConfirm } from "./DeleteMemberConfirm";

interface TeamMembersProps {
  teamId: string;
}

const TeamMembers = ({ teamId }: TeamMembersProps) => {
  const { members, addMember, deleteMember } = useTeamData(teamId);
  const [newMemberName, setNewMemberName] = useState("");

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
                  <DeleteMemberConfirm
                    memberName={member.name}
                    onConfirm={() => deleteMember.mutate(member.id)}
                  />
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
