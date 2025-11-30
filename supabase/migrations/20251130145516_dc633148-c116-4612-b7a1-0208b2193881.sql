-- Tornar member_id opcional para permitir pontuações de equipe
ALTER TABLE public.scores
ALTER COLUMN member_id DROP NOT NULL;

-- Adicionar comentário para documentar
COMMENT ON COLUMN public.scores.member_id IS 'ID do membro ou NULL quando a pontuação é para toda a equipe';