import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import TeamLayout from "@/components/TeamLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TeamB = () => {
  const [teamId, setTeamId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        setError("");
        
        const { data, error: fetchError } = await supabase
          .from("teams")
          .select("id")
          .eq("name", "Grupo B")
          .maybeSingle();
        
        if (fetchError) {
          console.error("Erro ao buscar time:", fetchError);
          setError("Erro ao carregar dados do time");
          return;
        }
        
        if (!data) {
          setError("Grupo B não encontrado no banco de dados");
          return;
        }
        
        setTeamId(data.id);
      } catch (err) {
        console.error("Erro inesperado:", err);
        setError("Erro inesperado ao carregar o time");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando Grupo B...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !teamId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-center text-muted-foreground">
              {error || "Time não encontrado"}
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <TeamLayout teamId={teamId} teamName="Grupo B" />;
};

export default TeamB;
