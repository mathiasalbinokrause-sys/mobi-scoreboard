import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTeamData = (teamId: string) => {
  const queryClient = useQueryClient();

  const { data: team } = useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("id", teamId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: members = [] } = useQuery({
    queryKey: ["members", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("team_id", teamId)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: scores = [] } = useQuery({
    queryKey: ["scores", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scores")
        .select("*, members(name)")
        .eq("team_id", teamId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addMember = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase
        .from("members")
        .insert({ name, team_id: teamId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", teamId] });
      toast.success("Membro adicionado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao adicionar membro");
    },
  });

  const deleteMember = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from("members")
        .delete()
        .eq("id", memberId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", teamId] });
      queryClient.invalidateQueries({ queryKey: ["scores", teamId] });
      toast.success("Membro removido com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao remover membro");
    },
  });

  const addScore = useMutation({
    mutationFn: async (scoreData: {
      member_id: string | null;
      description: string;
      points: number;
      month: string;
    }) => {
      const { error } = await supabase.from("scores").insert({
        ...scoreData,
        team_id: teamId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scores", teamId] });
      toast.success("Pontuação registrada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao registrar pontuação");
    },
  });

  const deleteScore = useMutation({
    mutationFn: async (scoreId: string) => {
      const { error } = await supabase
        .from("scores")
        .delete()
        .eq("id", scoreId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scores", teamId] });
      toast.success("Pontuação removida!");
    },
    onError: () => {
      toast.error("Erro ao remover pontuação");
    },
  });

  const clearMonth = useMutation({
    mutationFn: async (month: string) => {
      const { error } = await supabase
        .from("scores")
        .delete()
        .eq("team_id", teamId)
        .eq("month", month);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scores", teamId] });
      toast.success("Mês zerado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao zerar mês");
    },
  });

  const clearYear = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("scores")
        .delete()
        .eq("team_id", teamId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scores", teamId] });
      toast.success("Ano zerado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao zerar ano");
    },
  });

  const totalPoints = scores.reduce((sum, score) => sum + Number(score.points), 0);

  return {
    team,
    members,
    scores,
    totalPoints,
    addMember,
    deleteMember,
    addScore,
    deleteScore,
    clearMonth,
    clearYear,
  };
};
