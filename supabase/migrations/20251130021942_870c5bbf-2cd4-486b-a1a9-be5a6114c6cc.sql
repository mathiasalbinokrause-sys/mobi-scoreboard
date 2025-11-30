-- Criar tabela de times
CREATE TABLE public.teams (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela de membros
CREATE TABLE public.members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela de pontuações
CREATE TABLE public.scores (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  description text NOT NULL,
  points decimal(10, 2) NOT NULL CHECK (points >= 10 AND points <= 100),
  month text NOT NULL CHECK (month IN ('janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para leitura pública (gincana pública)
CREATE POLICY "Teams são visíveis para todos" ON public.teams
  FOR SELECT USING (true);

CREATE POLICY "Membros são visíveis para todos" ON public.members
  FOR SELECT USING (true);

CREATE POLICY "Pontuações são visíveis para todos" ON public.scores
  FOR SELECT USING (true);

-- Políticas RLS para inserção e edição (qualquer um pode adicionar)
CREATE POLICY "Qualquer um pode adicionar times" ON public.teams
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Qualquer um pode adicionar membros" ON public.members
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Qualquer um pode adicionar pontuações" ON public.scores
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Qualquer um pode editar membros" ON public.members
  FOR UPDATE USING (true);

CREATE POLICY "Qualquer um pode deletar membros" ON public.members
  FOR DELETE USING (true);

CREATE POLICY "Qualquer um pode deletar pontuações" ON public.scores
  FOR DELETE USING (true);

-- Inserir os dois times fixos
INSERT INTO public.teams (name) VALUES ('Time A'), ('Time B');

-- Criar índices para performance
CREATE INDEX idx_members_team_id ON public.members(team_id);
CREATE INDEX idx_scores_team_id ON public.scores(team_id);
CREATE INDEX idx_scores_member_id ON public.scores(member_id);
CREATE INDEX idx_scores_month ON public.scores(month);