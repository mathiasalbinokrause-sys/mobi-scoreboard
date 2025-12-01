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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, XCircle } from "lucide-react";
import { useState } from "react";

interface ClearMonthDialogProps {
  months: string[];
  onClearMonth: (month: string) => void;
}

export const ClearMonthDialog = ({ months, onClearMonth }: ClearMonthDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    if (selectedMonth) {
      onClearMonth(selectedMonth);
      setOpen(false);
      setSelectedMonth("");
      setConfirming(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="border-destructive/50 text-destructive hover:bg-destructive/10"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Zerar Mês
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Zerar Mês Específico
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação irá remover TODAS as pontuações de um mês específico.
            Esta ação não pode ser desfeita!
          </AlertDialogDescription>
        </AlertDialogHeader>

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

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedMonth("")}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={!selectedMonth}
                onClick={() => setConfirming(true)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-destructive">
              Confirme que deseja zerar todas as pontuações de{" "}
              <strong>{selectedMonth}</strong>
            </p>
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => setConfirming(false)}>
                Voltar
              </Button>
              <AlertDialogAction onClick={handleConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Confirmar e Zerar
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
