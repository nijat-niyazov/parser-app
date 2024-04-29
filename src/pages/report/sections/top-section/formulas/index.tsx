import { AreYouSureModal } from '@/components';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { FormulaType, createFormula, deleteFormula } from '@/services/api/endpoints';
import { cn } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';

const initialSate = { name: '', formula: '' };

type OldDataType = {
  status: number;
  data: { data: FormulaType[]; code: number; message: string };
};

const Formulas = ({ formulas: formulaList }: { formulas: FormulaType[] }) => {
  const [formula, setFormula] = useState<Omit<FormulaType, 'id'> & { id?: number }>(initialSate);
  const isEditMode = formula.id;

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormula((prev) => ({ ...prev, [name]: value }));
  }

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const {
    mutate: addMutate,
    isError,
    isPending,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: createFormula,

    /* -------------------------- Without Optimistic UI ------------------------- */
    // onSuccess: (successResponseFromMutationFnReq, payload) => {
    //   console.log({ successResponseFromMutationFnReq, payload });

    //   // queryClient.invalidateQueries({ queryKey: ['formulas'] });
    //   // ! if coming request is succeseded in server, we don't need refetch again

    //   queryClient.setQueryData(['formulas'], (oldFormulaData: OldDataType) => {
    //     const newData = { ...oldFormulaData, data: { ...oldFormulaData.data, data: [...oldFormulaData.data.data, payload] } };

    //     return newData;
    //   });
    // },

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
      } else {
        toast({ title: 'Something went wrong', description: successResponseFromMutationFnReq.data.message });
      }
    },
    onError: (error, payload, prevFormulaData) => {
      queryClient.setQueryData(['formulas'], prevFormulaData);
    },
    onSettled: (successResponseFromMutationFnReq, error, payload, prevFormulaData) => {
      console.log({ successResponseFromMutationFnReq, error, payload, prevFormulaData });
      queryClient.invalidateQueries({ queryKey: ['formulas'] });
    },
  });

  const {
    mutate: deleteMutate,
    isError: deleteHasError,
    isPending: isDeletePending,
    error: deleteError,
    isSuccess: isDeleteSuccess,
  } = useMutation({
    mutationFn: deleteFormula,

    onMutate: async (payload) => {
      const formulaId = payload[0];

      await queryClient.cancelQueries({ queryKey: ['formulas'] });
      const prevFormulaData = queryClient.getQueryData<OldDataType>(['formulas']);

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
      }
    },
    onError: (error, payload, prevFormulaData) => {
      queryClient.setQueryData(['formulas'], prevFormulaData);
    },
    onSettled: (successResponseFromMutationFnReq, error, payload, prevFormulaData) => {
      queryClient.invalidateQueries({ queryKey: ['formulas'] });
    },
  });

  /* -------------------------- Add & Update Formula -------------------------- */
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    addMutate(formula);
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
            disabled={Object.values(formula).includes('') || isPending}
            className="bg-green-600 p-2 w-full text-center rounded-lg font-bold text-white disabled:opacity-50"
            type="submit"
          >
            {isPending ? <Spinner /> : isEditMode ? 'Edit' : 'Submit'}
          </button>
        </form>

        <ol className="my-3 grid gap-3 max-h-64 overflow-y-auto">
          {formulaList.map((formulaItem, i) => {
            return (
              <li
                key={formulaItem.id}
                className={cn('bg-gray-200 p-2 rounded-md flex gap-2 ', {
                  'brightness-50 pointer-events-none ': !isEditMode
                    ? i === formulaList.length - 1 && isPending
                    : formulaItem.id === formula.id,
                })}
              >
                <span className="grow">
                  {i + 1}. {formulaItem.name}
                </span>
                <button onClick={() => setFormula(formulaItem as FormulaType)}>
                  <Pencil />
                </button>
                <AreYouSureModal
                  title="Are you sure?"
                  description="This changes will be unrecoverable."
                  handleDelete={() => deleteMutate([formulaItem.id])}
                />
              </li>
            );
          })}
        </ol>
      </DialogContent>
    </Dialog>
  );
};

export default Formulas;

export function Spinner() {
  return <div className="w-6 h-6 mx-auto rounded-full bg-transparent border-2 border-t-gray-400 border-black animate-spin" />;
}
