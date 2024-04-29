import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Props = { showModal: boolean; handleChange: () => void; success?: boolean };

const ActionMessage = ({ showModal, handleChange, success }: Props) => {
  return (
    <Dialog open={showModal} onOpenChange={handleChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{success ? 'Links succesfully sent ✔' : 'Something went wrong. Please try again'} </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4"></div>
        </div>
        <DialogFooter>
          <button onClick={handleChange} className="px-4 py-2 rounded-md w-full text-lg bg-slate-800 fosemib text-white">
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionMessage;
