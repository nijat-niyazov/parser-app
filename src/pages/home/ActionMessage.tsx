import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Props = {
  showModal: boolean;
  handleChange: () => void;
  success?: boolean;
  errMessage: string;
};

const ActionMessage = ({ showModal, handleChange, success, errMessage }: Props) => {
  return (
    <Dialog open={showModal} onOpenChange={handleChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {success ? (
              <span className="text-green-600">Links succesfully sent ✔</span>
            ) : (
              <span className="text-red-700">{errMessage}</span>
            )}
          </DialogTitle>
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
