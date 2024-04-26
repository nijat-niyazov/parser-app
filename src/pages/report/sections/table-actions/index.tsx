import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

import { Check, ListRestart, Plus, SquareFunction, Trash2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { DatePickerWithRange, SelectShownCount } from '../../components';

type Props = {
  disabledButtons: {
    // editDisabled: boolean;
    deleteDisabled: boolean;
    savedDisabled: boolean;
  };
  handleAddField: () => void;
  handleSaveNewFields: () => void;
  handleUpdate: () => void;
  handleDelete: () => void;
  saveMode: 'save' | 'update';
};

const TableActions = ({ disabledButtons, handleUpdate, handleDelete, handleAddField, handleSaveNewFields, saveMode }: Props) => {
  const [searchParams, setSerachParams] = useSearchParams();

  function resetFilters() {
    setSerachParams({});
  }

  return (
    <section className="flex items-center justify-end gap-4 bg-slate-800 p-2 rounded-t-lg">
      <DatePickerWithRange />

      <Select>
        <SelectTrigger className="w-auto bg-transparent border-none">
          <SquareFunction className="text-white " />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>

      <SelectShownCount />

      <button onClick={handleAddField} className="bg-gray-600 p-2 rounded-md disabled:opacity-50">
        <Plus className="text-white " />
      </button>

      <button onClick={handleDelete} disabled={disabledButtons.deleteDisabled} className="bg-gray-600 p-2 rounded-md disabled:opacity-50">
        <Trash2 className="text-white " />
      </button>
      <button
        onClick={saveMode === 'save' ? handleSaveNewFields : handleUpdate}
        disabled={disabledButtons.savedDisabled}
        className="bg-gray-600 p-2 rounded-md disabled:opacity-50"
      >
        <Check className="text-white " />
      </button>
      <button onClick={resetFilters} disabled={!searchParams.toString()} className="bg-gray-600 p-2 rounded-md disabled:opacity-50">
        <ListRestart className="text-white " />
      </button>
    </section>
  );
};

export default TableActions;
