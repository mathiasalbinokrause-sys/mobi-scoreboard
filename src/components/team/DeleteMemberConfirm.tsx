import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteMemberConfirmProps {
  memberName: string;
  onConfirm: () => void;
}

export const DeleteMemberConfirm = ({ memberName, onConfirm }: DeleteMemberConfirmProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-background border rounded-lg p-6 max-w-lg w-full space-y-4">
        <h2 className="text-lg font-semibold">Remover Membro</h2>
        
        <p className="text-sm text-muted-foreground">
          Tem certeza que deseja remover <strong>{memberName}</strong>?
          Todas as pontuações deste membro também serão removidas.
        </p>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Remover
          </Button>
        </div>
      </div>
    </Card>
  );
};
