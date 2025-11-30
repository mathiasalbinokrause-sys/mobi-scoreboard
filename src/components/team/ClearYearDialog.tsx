import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";

interface ClearYearDialogProps {
  totalScores: number;
  onClearYear: () => void;
}

export const ClearYearDialog = ({ totalScores, onClearYear }: ClearYearDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    onClearYear();
    setIsOpen(false);
    setConfirming(false);
  };

  if (!isOpen) {
    return (
      <Button variant="destructive" onClick={() => setIsOpen(true)}>
        <Trash2 className="h-4 w-4 mr-2" />
        Zerar Ano
      </Button>
    );
  }

  return (
    <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-background border rounded-lg p-6 max-w-lg w-full space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h2 className="text-lg font-semibold">Zerar Ano Completo</h2>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            ATENÇÃO! Esta ação irá remover TODAS as pontuações do ano inteiro deste
            time.
          </p>
          <p>Esta ação é PERMANENTE e não pode ser desfeita!</p>
          <p className="font-semibold text-foreground">
            Total de pontuações que serão removidas: {totalScores}
          </p>
        </div>

        {!confirming ? (
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => setConfirming(true)}>
              Continuar
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-destructive">
              Digite "CONFIRMAR" para prosseguir com a exclusão de todas as {totalScores}{" "}
              pontuações
            </p>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirming(false)}>
                Voltar
              </Button>
              <Button variant="destructive" onClick={handleConfirm}>
                Confirmar e Zerar Tudo
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
