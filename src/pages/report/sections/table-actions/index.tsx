import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, ListRestart, Pencil, Plus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import { AreYouSureModal } from '@/components';
import { useToast } from '@/components/ui/use-toast';
import { FormulaType, setFormulaToField } from '@/services/api/endpoints';
import { useMutation } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useState } from 'react';
import { PropertyType } from '../..';
import { DatePickerWithRange, SelectShownCount } from '../../components';

type Props = {
  disabledButtons: { deleteDisabled: boolean; savedDisabled: boolean };
  handleAddField: () => void;
  handleSaveNewFields: () => void;
  handleUpdate: () => void;
  handleDelete: () => void;
  saveMode: 'save' | 'update';
  formulas: FormulaType[];
  selectedFieldsIds: (number | string)[];
  setSelectedFields: Dispatch<SetStateAction<PropertyType[]>>;
  resetFilters: () => void;
  toggleEditMode: () => void;
};

const TableActions = ({
  selectedFieldsIds,
  setSelectedFields,

  handleUpdate,
  handleDelete,
  handleAddField,
  handleSaveNewFields,

  disabledButtons,
  saveMode,
  formulas,
  toggleEditMode,
  resetFilters,
}: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFormula, setSelectedFormula] = useState<string | null>(null);

  const { toast } = useToast();

  const { mutate: setFormula, isPending } = useMutation({
    mutationFn: () => setFormulaToField({ productIds: selectedFieldsIds, formulaId: selectedFormula as string }),
    onSuccess: (comingRes) => {
      if (comingRes.data.code === 200) {
        toast({ title: 'Changes implemented', description: 'Formula is set! ✔' });
        setSelectedFormula(null);
        setSelectedFields([]);
      }
    },
  });

  // async function setFormula() {
  //   const { data } = await setFormulaToField({ productIds: selectedFieldsIds, formulaId: selectedFormula as string });

  //   if (data.code === 200) {
  //     toast({ title: 'Changes implemented', description: 'Formula is set! ✔' });
  //     setSelectedFormula(null);
  //     setSelectedFields([]);
  //   }
  // }

  return (
    <section className="flex items-center justify-end gap-4 bg-slate-800 p-2 rounded-t-lg">
      {/* ------------------------------ Select Range ------------------------------ */}
      <DatePickerWithRange />

      {/* ------------------------------- Set Formula ------------------------------ */}
      {formulas.length > 0 && (
        <Select onValueChange={(value) => setSelectedFormula(value)}>
          <SelectTrigger className="w-auto bg-transparent border-none text-white">
            <SelectValue placeholder="Select a formula" />
          </SelectTrigger>
          <SelectContent>
            {formulas.map((formula) => (
              <SelectItem key={formula.id} value={`${formula.id}`}>
                {formula.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* ---------------------------------- Limit --------------------------------- */}
      <SelectShownCount />

      {/* ------------------------------ Add New Field ----------------------------- */}
      <button
        disabled={!disabledButtons.deleteDisabled || isPending}
        onClick={handleAddField}
        className="bg-gray-600 p-2 rounded-md disabled:opacity-50"
      >
        <Plus className="text-white " />
      </button>

      <button
        onClick={toggleEditMode}
        disabled={disabledButtons.deleteDisabled || isPending}
        className="bg-gray-600 p-2 rounded-md disabled:opacity-50"
      >
        <Pencil className="text-white " />
      </button>

      {/* ------------------------------ Delete Field ------------------------------ */}
      <AreYouSureModal
        title="Are you sure?"
        disabled={disabledButtons.deleteDisabled || isPending}
        handleDelete={handleDelete}
        description="This changes will be unrecoverable."
      />

      {/* ------------------------------ Save Changes ------------------------------ */}
      <button
        onClick={() => {
          selectedFormula ? setFormula() : saveMode === 'save' ? handleSaveNewFields() : handleUpdate();
          toggleEditMode();
        }}
        disabled={disabledButtons.savedDisabled || isPending}
        className="bg-gray-600 p-2 rounded-md disabled:opacity-50"
      >
        <Check className="text-white " />
      </button>

      {/* ------------------------------ Reset Filters ----------------------------- */}
      <button onClick={resetFilters} disabled={!searchParams.toString()} className="bg-gray-600 p-2 rounded-md disabled:opacity-50">
        <ListRestart className="text-white " />
      </button>
    </section>
  );
};

export default TableActions;
