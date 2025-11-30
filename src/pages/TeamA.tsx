import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import TeamLayout from "@/components/TeamLayout";

const TeamA = () => {
  const [teamId, setTeamId] = useState<string>("");

  useEffect(() => {
    const fetchTeam = async () => {
      const { data } = await supabase
        .from("teams")
        .select("id")
        .eq("name", "Time A")
        .single();
      if (data) setTeamId(data.id);
    };
    fetchTeam();
  }, []);

  if (!teamId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <TeamLayout teamId={teamId} teamName="Time A" />;
};

export default TeamA;
