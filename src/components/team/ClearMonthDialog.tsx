import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, XCircle } from "lucide-react";
import { useState } from "react";

interface ClearMonthDialogProps {
  months: string[];
  onClearMonth: (month: string) => void;
}

export const ClearMonthDialog = ({ months, onClearMonth }: ClearMonthDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    if (selectedMonth) {
      onClearMonth(selectedMonth);
      setIsOpen(false);
      setSelectedMonth("");
      setConfirming(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        className="border-destructive/50 text-destructive hover:bg-destructive/10"
        onClick={() => setIsOpen(true)}
      >
        <XCircle className="h-4 w-4 mr-2" />
        Zerar Mês
      </Button>
    );
  }

  return (
    <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-background border rounded-lg p-6 max-w-lg w-full space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h2 className="text-lg font-semibold">Zerar Mês Específico</h2>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Esta ação irá remover TODAS as pontuações de um mês específico.
          Esta ação não pode ser desfeita!
        </p>

        {!confirming ? (
          <>
            <div className="py-4">
              <Label htmlFor="month-select" className="mb-2 block">
                Selecione o mês:
              </Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger id="month-select">
                  <SelectValue placeholder="Escolha o mês" />
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

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedMonth("");
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                disabled={!selectedMonth}
                onClick={() => setConfirming(true)}
              >
                Continuar
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-destructive">
              Confirme que deseja zerar todas as pontuações de{" "}
              <strong>{selectedMonth}</strong>
            </p>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirming(false)}>
                Voltar
              </Button>
              <Button variant="destructive" onClick={handleConfirm}>
                Confirmar e Zerar
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
