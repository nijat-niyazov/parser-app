import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Spinner } from '@/pages/report/sections/top-section/formulas';
import { Trash2 } from 'lucide-react';
import { ReactNode } from 'react';
type Props = {
  title: string;
  description: string;
  disabled?: boolean;
  handleDelete: () => void;
  isPending: boolean;
  open: boolean;
  handleOpenModal: () => void;
  triggerer?: ReactNode;
};

const AreYouSureModal = ({ triggerer, handleOpenModal, title, description, disabled = false, handleDelete, isPending, open }: Props) => {
  return (
    <Dialog open={open}>
      {triggerer ?? (
        <DialogTrigger asChild>
          <button disabled={disabled} onClick={handleOpenModal} className="bg-red-600 p-2 rounded-md disabled:opacity-50">
            <Trash2 className="text-white " />
          </button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center gap-3">
          <Button disabled={isPending} onClick={handleDelete} className="flex-1 bg-red-500">
            {isPending ? <Spinner /> : 'Delete'}
          </Button>

          <Button onClick={handleOpenModal} className="flex-1">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AreYouSureModal;
