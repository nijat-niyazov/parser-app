import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

const AreYouSureModal = ({
  title,
  description,
  disabled = false,
  handleDelete,
}: {
  title: string;
  description: string;
  disabled?: boolean;
  handleDelete: () => void;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button disabled={disabled} className="bg-gray-600 p-2 rounded-md disabled:opacity-50">
          <Trash2 className="text-white " />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex items-center gap-3">
          <Button onClick={handleDelete} className="flex-1 bg-red-500">
            Delete
          </Button>
          <DialogClose asChild>
            <Button className="flex-1">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AreYouSureModal;
