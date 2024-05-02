import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, ListRestart, Pencil, Plus, SearchCheck, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import { AreYouSureModal } from '@/components';
import { useToast } from '@/components/ui/use-toast';
import { deleteFields, getFormulaList, setFormulaToField } from '@/services/api/endpoints';
import { useGenerateReport } from '@/services/providers/Context';
import { defaultSearchParams } from '@/utils/constants/defaultSearchParam';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { DatePickerWithRange, SelectShownCount } from '../../components';

type Props = {
  disabledButtons: { deleteDisabled: boolean; savedDisabled: boolean };
  handleAddField: () => void;
  handleSaveNewFields: () => void;
  handleUpdate: () => void;
  saveMode: 'save' | 'update';
  selectedFieldsIds: (number | string)[];
  resetStates: () => void;
  resetFilters: () => void;
  openEditMode: () => void;
  closeEditMode: () => void;
  editMode: boolean;
};

const TableActions = ({
  selectedFieldsIds,
  resetStates,
  handleUpdate,
  handleAddField,
  handleSaveNewFields,
  editMode,
  disabledButtons,
  saveMode,
  openEditMode,
  closeEditMode,
  resetFilters,
}: Props) => {
  const [searchParams] = useSearchParams(defaultSearchParams);
  const { toast } = useToast();

  const { setEnabled } = useGenerateReport();

  /* ------------------------------ Delete Field ------------------------------ */
  const queryClient = useQueryClient();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  function handleOpenModal() {
    setShowDeleteModal(!showDeleteModal);
  }

  const { mutate: deleteFieldsMutation, isPending: deletePending } = useMutation({
    mutationFn: () => deleteFields(selectedFieldsIds as number[]),
    onSuccess: (comingResFromMutFn) => {
      if (comingResFromMutFn.data.code === 200) {
        toast({ title: `Changes implemented! ✔`, description: `Selected fields are deleted !` });
        resetStates();
        setEnabled(false);
      } else if ('error' in comingResFromMutFn.data) {
        const errorMessage = comingResFromMutFn.data.error.message;
        toast({ title: `Something went wrong`, description: errorMessage, variant: 'destructive' });
      }
      setShowDeleteModal(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['repoData', searchParams.toString()] });
      queryClient.invalidateQueries({ queryKey: ['reportsGenerate', searchParams.toString()] });
    },
  });

  /* -------------------------- Check Stock of Field -------------------------- */

  const { mutate: checkStockFieldsMutation, isPending: checkStockPending } = useMutation({
    mutationFn: () => deleteFields(selectedFieldsIds as number[]),
    // mutationFn: () => checkStocksOfFields(selectedFieldsIds as number[]),
    onSuccess: (comingResFromMutFn) => {
      if (comingResFromMutFn.data.code === 200) {
        toast({
          title: `Changes implemented! ✔`,
          description: `Stocks  are checked for selected fields !`,
        });
        resetStates();
        setEnabled(false);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['repoData', searchParams.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ['reportsGenerate', searchParams.toString()],
      });
    },
  });

  /* -------------------------- Set Formula To Field -------------------------- */
  const [selectedFormula, setSelectedFormula] = useState<string | null>(null);

  const { mutate: setFormula, isPending } = useMutation({
    mutationFn: () =>
      setFormulaToField({
        productIds: selectedFieldsIds,
        formulaId: selectedFormula as string,
      }),
    onSuccess: (comingRes) => {
      if (comingRes.data.code === 200) {
        toast({
          title: 'Changes implemented',
          description: 'Formula is set! ✔',
        });
        setSelectedFormula(null);
        resetStates();
        setEnabled(false);
      } else if ('error' in comingRes.data) {
        const errorMessage = comingRes.data.error.message;
        toast({ title: `Something went wrong`, description: errorMessage, variant: 'destructive' });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['repoData', searchParams.toString()] });
      queryClient.invalidateQueries({ queryKey: ['reportsGenerate', searchParams.toString()] });
    },
  });

  const { isPending: formulasPending, error, data } = useQuery({ queryKey: ['formulas'], queryFn: getFormulaList });

  let formulaContent;

  if (formulasPending) {
    formulaContent = <div>Loading...</div>;
  } else if (error) {
    formulaContent = <div>Error: {error.message}</div>;
  } else if (data) {
    const formulas = data.data.data;

    formulaContent = formulas.map((formula) => (
      <SelectItem key={formula.id} value={`${formula.id}`}>
        {formula.name}
      </SelectItem>
    ));
  }

  return (
    <section className="flex items-center justify-end gap-4 bg-slate-800 p-2 rounded-t-lg">
      {/* ------------------------------ Select Range ------------------------------ */}
      <DatePickerWithRange />

      {/* ------------------------------- Set Formula ------------------------------ */}
      {
        <Select onValueChange={(value) => setSelectedFormula(value)}>
          <SelectTrigger className="w-32 bg-gray-200   text-black">
            <SelectValue placeholder="Formulas" />
          </SelectTrigger>
          <SelectContent className="font-semibold">{formulaContent}</SelectContent>
        </Select>
      }

      {/* ---------------------------------- Limit --------------------------------- */}
      <SelectShownCount />

      {/* ------------------------------ Add New Field ----------------------------- */}
      <button
        disabled={!disabledButtons.deleteDisabled || isPending}
        onClick={handleAddField}
        className="bg-amber-500 p-2 rounded-md disabled:opacity-50"
      >
        <Plus className="text-white " />
      </button>

      <button
        onClick={editMode ? closeEditMode : openEditMode}
        disabled={disabledButtons.deleteDisabled || isPending}
        className="bg-blue-600 p-2 rounded-md disabled:opacity-50"
      >
        {editMode ? <X className="text-white " /> : <Pencil className="text-white " />}
      </button>

      {/* ------------------------------ Delete Field ------------------------------ */}
      <AreYouSureModal
        handleOpenModal={handleOpenModal}
        open={showDeleteModal}
        isPending={deletePending}
        title="Are you sure?"
        disabled={disabledButtons.deleteDisabled || isPending || editMode}
        handleDelete={deleteFieldsMutation}
        description="This changes will be unrecoverable."
      />

      {/* ------------------------------- Check Stock ------------------------------ */}

      <button
        disabled={disabledButtons.savedDisabled || isPending || editMode}
        className="bg-violet-600 p-2 rounded-md disabled:opacity-50"
        onClick={() => {
          checkStockFieldsMutation();
          closeEditMode();
        }}
      >
        <SearchCheck className="text-white " />
      </button>

      {/* ------------------------------ Save Changes ------------------------------ */}
      <button
        onClick={() => {
          if (selectedFormula) {
            setFormula();
          } else {
            saveMode === 'save' ? handleSaveNewFields() : handleUpdate();
            closeEditMode();
          }
        }}
        disabled={disabledButtons.savedDisabled || isPending}
        className="bg-green-600 p-2 rounded-md disabled:opacity-50"
      >
        <Check className="text-white " />
      </button>

      {/* ------------------------------ Reset Filters ----------------------------- */}
      <button onClick={resetFilters} className="bg-gray-500 p-2 rounded-md disabled:opacity-50">
        <ListRestart className="text-white " />
      </button>
    </section>
  );
};

export default TableActions;
