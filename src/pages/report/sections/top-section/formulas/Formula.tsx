import { AreYouSureModal } from '@/components';
import { FormulaType } from '@/services/api/endpoints';
import { cn } from '@/utils';
import { Pencil, Trash2 } from 'lucide-react';
import { Dispatch, HTMLAttributes, SetStateAction, useState } from 'react';

type Props = {
  formulaItem: FormulaType;
  setFormula: Dispatch<SetStateAction<Omit<FormulaType, 'id'>>>;
  isDeletePending: boolean;
  handleDelete: () => void;
} & HTMLAttributes<HTMLLIElement>;
const Formula = ({ className, formulaItem, setFormula, isDeletePending, handleDelete }: Props) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal((prev) => !prev);

  return (
    <li className={cn('bg-gray-200 p-2 rounded-md flex gap-2 ', className)}>
      <span className="grow">{formulaItem.name}</span>
      <button className="p-1 rounded-md bg-green-500" onClick={() => setFormula(formulaItem as FormulaType)}>
        <Pencil className="text-white" />
      </button>

      <AreYouSureModal
        triggerer={
          <button className="p-1 rounded-md bg-red-500" onClick={handleOpenModal}>
            <Trash2 className="text-white" />
          </button>
        }
        handleOpenModal={handleOpenModal}
        isPending={isDeletePending}
        open={showModal}
        title="Are you sure?"
        description="This changes will be unrecoverable."
        handleDelete={handleDelete}
      />
    </li>
  );
};

export default Formula;
