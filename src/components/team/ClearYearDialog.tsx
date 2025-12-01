import { Button } from "@/components/ui/button";
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
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";

interface ClearYearDialogProps {
  totalScores: number;
  onClearYear: () => void;
}

export const ClearYearDialog = ({ totalScores, onClearYear }: ClearYearDialogProps) => {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    onClearYear();
    setOpen(false);
    setConfirming(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Zerar Ano
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Zerar Ano Completo
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2 pt-2">
            <p>
              ATENÇÃO! Esta ação irá remover TODAS as pontuações do ano inteiro deste time.
            </p>
            <p>Esta ação é PERMANENTE e não pode ser desfeita!</p>
            <p className="font-semibold text-foreground">
              Total de pontuações que serão removidas: {totalScores}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!confirming ? (
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => setConfirming(true)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        ) : (
          <>
            <p className="text-sm font-medium text-destructive">
              Confirme que deseja zerar todas as {totalScores} pontuações
            </p>
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => setConfirming(false)}>
                Voltar
              </Button>
              <AlertDialogAction onClick={handleConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Confirmar e Zerar Tudo
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
