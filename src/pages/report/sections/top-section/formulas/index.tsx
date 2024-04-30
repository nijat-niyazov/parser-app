import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { FormulaType, createFormula, deleteFormula, getFormulaList } from '@/services/api/endpoints';
import { cn } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, useState } from 'react';
import Formula from './Formula';

const initialSate = { name: '', formula: '' };

type OldDataType = { status: number; data: { data: FormulaType[]; code: number; message: string } };

const Formulas = () => {
  const { isPending, error, data } = useQuery({ queryKey: ['formulas'], queryFn: getFormulaList });

  const [formula, setFormula] = useState<Omit<FormulaType, 'id'> & { id?: number }>(initialSate);
  const isEditMode = formula.id;

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormula((prev) => ({ ...prev, [name]: value }));
  }

  const { toast } = useToast();

  const queryClient = useQueryClient();

  /* -------------------------- Add & Update Formula -------------------------- */
  const { mutate: addMutate, isPending: mutatePending } = useMutation({
    mutationFn: createFormula,

    /* ------------------------------ Optimistic UI ----------------------------- */
    onMutate: async (payload) => {
      //* it will be fired before mutation FN and must be async to cancel queries
      await queryClient.cancelQueries({ queryKey: ['formulas'] });
      const prevFormulaData = queryClient.getQueryData<OldDataType>(['formulas']);

      const optimisticPayload = !isEditMode ? { ...payload, id: new Date().toISOString() } : payload;
      //* for optimistic UI we need temproraly ID, because we have to remove it from UI list if something goes wrong.

      queryClient.setQueryData(['formulas'], (oldFormulaData: OldDataType) => {
        const oldItems = oldFormulaData.data.data;
        const newItems = isEditMode
          ? oldItems.map((formula) => (formula.id === optimisticPayload.id ? optimisticPayload : formula))
          : [...oldItems, optimisticPayload];

        const newData = { ...oldFormulaData, data: { ...oldFormulaData.data, data: newItems } };

        return newData;
        //? We already made changes on UI, before the mutation FN
      });

      return prevFormulaData; //? we need have a previous version of data if something goes wrong or if we need to rollback
    },
    onSuccess: (successResponseFromMutationFnReq, payload, prevFormulaData) => {
      if (successResponseFromMutationFnReq.data.code === 200) {
        setFormula(initialSate);
        toast({ title: 'Changes Implemented', description: `Formula has been ${isEditMode ? 'edited' : 'added'}` });
      } else {
        toast({ title: 'Something went wrong', description: successResponseFromMutationFnReq.data.message });
      }
    },
    onError: (error, payload, prevFormulaData) => {
      queryClient.setQueryData(['formulas'], prevFormulaData);
      //? if something goes wrong, we need to rollback the changes
    },
    onSettled: (successResponseFromMutationFnReq, error, payload, prevFormulaData) => {
      queryClient.invalidateQueries({ queryKey: ['formulas'] });
    },
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    addMutate(formula);
  }

  /* ------------------------------ Delete Formula ----------------------------- */
  const {
    mutate: deleteMutate,
    isPending: isDeletePending,
    isError: deleteHasError,
    error: deleteError,
    isSuccess: isDeleteSuccess,
  } = useMutation({
    mutationFn: deleteFormula,

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['formulas'] });

      const prevFormulaData = queryClient.getQueryData<OldDataType>(['formulas']);

      const formulaId = payload[0];
      queryClient.setQueryData(['formulas'], (prevFormulaData: OldDataType) => {
        const items = prevFormulaData.data.data;
        const newList = {
          ...prevFormulaData,
          data: { ...prevFormulaData.data, data: items.filter((formula) => formula.id !== formulaId) },
        };
        return newList;
      });
      return prevFormulaData;
    },
    onSuccess: (successResponseFromMutationFnReq, payload, prevFormulaData) => {
      if (successResponseFromMutationFnReq.data.code !== 200) {
        toast({ title: 'Something went wrong', description: successResponseFromMutationFnReq.data.message });
      } else {
        toast({ title: 'Changes implemented', description: 'Formula is deleted' });
      }
    },
    onError: (error, payload, prevFormulaData) => {
      queryClient.setQueryData(['formulas'], prevFormulaData);
    },
    onSettled: (successResponseFromMutationFnReq, error, payload, prevFormulaData) => {
      queryClient.invalidateQueries({ queryKey: ['formulas'] });
    },
  });

  let formulaContent;
  if (isPending) {
    formulaContent = <p>Loading...</p>;
  } else if (error) {
    formulaContent = <p>Error while loading</p>;
  } else if (data) {
    const formulas = data.data.data;

    formulaContent = (
      <ol className="my-3 grid gap-3 max-h-64 overflow-y-auto">
        {formulas.map((formulaItem, i) => {
          return (
            <Formula
              handleDelete={() => deleteMutate([formulaItem.id])}
              isDeletePending={isDeletePending}
              setFormula={setFormula}
              key={i}
              formulaItem={formulaItem}
              className={cn({
                'brightness-50 pointer-events-none ': !isEditMode ? i === formulas.length - 1 && isPending : formulaItem.id === formula.id,
              })}
            />
          );
        })}
      </ol>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-sky-900 w-40 text-center p-2  rounded-md text-white font-semibold my-3">Formulas</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit' : 'New'} Formula</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          <label>
            <span>Name</span>
            <input
              type="text"
              name="name"
              className="p-2 block rounded-md border-black border-2 w-full focus:outline-none focus:border-blue-500"
              value={formula.name}
              onChange={onChange}
            />
          </label>
          <label>
            <span>Formula</span>
            <input
              type="text"
              name="formula"
              className="p-2 block rounded-md border-black border-2 w-full focus:outline-none focus:border-blue-500"
              value={formula.formula}
              onChange={onChange}
            />
          </label>
          <button
            disabled={Object.values(formula).includes('') || mutatePending}
            className="bg-green-600 p-2 w-full text-center rounded-lg font-bold text-white disabled:opacity-50"
            type="submit"
          >
            {isPending ? <Spinner /> : isEditMode ? 'Edit' : 'Submit'}
          </button>
        </form>

        {formulaContent}
      </DialogContent>
    </Dialog>
  );
};

export default Formulas;

export function Spinner() {
  return <div className="w-6 h-6 mx-auto rounded-full bg-transparent border-2 border-t-gray-400 border-black animate-spin" />;
}
