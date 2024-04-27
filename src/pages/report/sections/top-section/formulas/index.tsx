import { AreYouSureModal } from '@/components';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { FormulaType, createFormula, deleteFormula } from '@/services/api/endpoints';
import { Pencil } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';

const initialSate = { name: '', formula: '' };

const Formulas = ({ formulas: formulaList, refetchFormulas }: { formulas: FormulaType[]; refetchFormulas: any }) => {
  const [formula, setFormula] = useState<Omit<FormulaType, 'id'> & { id?: number }>(initialSate);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormula((prev) => ({ ...prev, [name]: value }));
  }

  const { toast } = useToast();
  /* -------------------------- Add & Update Formula -------------------------- */
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const { data } = await createFormula(formula);

    if (data.code === 200) {
      toast({ title: `Changes implemented! ✔`, description: `Your formula has been ${formula.id ? 'edited' : 'created'} !` });

      refetchFormulas();
      setFormula(initialSate);
      setIsLoading(false);
    }
  }

  /* ----------------------------- Delete Formula ----------------------------- */
  async function handleDeleteFormula(id: number) {
    const { data } = await deleteFormula([id]);

    if (data.code === 200) {
      toast({ title: `Formula is deleted! ⚠` });
      refetchFormulas();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-red-400 w-40 text-center p-2  rounded-md text-white font-semibold my-3">Formulas</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Formula</DialogTitle>
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
            disabled={Object.values(formula).includes('') || isLoading}
            className="bg-green-600 p-2 w-full text-center rounded-lg font-bold text-white disabled:opacity-50"
            type="submit"
          >
            {isLoading ? <Spinner /> : formula.id ? 'Edit' : 'Submit'}
          </button>
        </form>

        <ol className="my-3 grid gap-3">
          {formulaList.map((formula, i) => {
            return (
              <li key={formula.id} className="bg-gray-200 p-2 rounded-md flex gap-2 ">
                <span className="grow">
                  {i + 1}. {formula.name}
                </span>
                <button onClick={() => setFormula(formula as FormulaType)}>
                  <Pencil />
                </button>
                <AreYouSureModal
                  title="Are you sure?"
                  description="This changes will be unrecoverable."
                  handleDelete={() => handleDeleteFormula(formula.id)}
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

function Spinner() {
  return <div className="w-6 h-6 mx-auto rounded-full bg-transparent border-2 border-t-gray-400 border-black animate-spin" />;
}
