import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createFormula, deleteFormula, getFormulaList, updateFormula } from '@/services-test/api/endpoints';
import { useQuery } from '@tanstack/react-query';
import { Delete, Pencil } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';

type DataType = { code: number; message: string };

const Formulas = () => {
  const { isPending, error, data: comingData } = useQuery({ queryKey: ['formulas'], queryFn: getFormulaList });

  const [name, setName] = useState('');
  const [formula, setFormula] = useState('');
  const [editableId, setEditableId] = useState<number | null>(null);
  const [formula2, setFormula2] = useState({ name: '', formula: '', id: null });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  console.log(comingData);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === 'name') {
      setName(value);
    } else {
      setFormula(value);
    }
  }

  // function handleChange(e: ChangeEvent<HTMLInputElement>) {
  //   const { name, value } = e.target;
  //   setFormula2((prev) => ({ ...prev, [name]: value }));
  // }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = editableId ? await updateFormula({ name, formula, id: editableId }) : await createFormula({ name, formula });

    setEditableId(null);
  }

  function handleUpdateFormula(formula: { name: string; formula: string; id: number }) {
    setEditableId(formula.id);
    setName(formula.name);
    setFormula(formula.formula);
  }

  async function handleDeleteFormula(id: number) {
    const data = await deleteFormula([id]);

    console.log(data);
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
              name="name"
              type="text"
              value={formula2.name}
              // onChange={handleChange}
              className="p-2 block rounded-md border-black border-2 w-full focus:outline-none focus:border-blue-500"
            />
          </label>
          <label>
            <span>Formula</span>
            <input
              type="text"
              name="formula"
              value={formula2.formula}
              // handleChange={onChange}
              className="p-2 block rounded-md border-black border-2 w-full focus:outline-none focus:border-blue-500"
            />
          </label>
          <button
            disabled={!name || !formula}
            className="bg-green-600 p-2 w-full text-center rounded-lg font-bold text-white disabled:opacity-50"
            type="submit"
          >
            {editableId ? 'Edit' : 'Submit'}
          </button>
        </form>

        <ul className="my-3 grid gap-3">
          {comingData.data.data.map((formula, i) => {
            return (
              <li key={i} className="bg-gray-200 p-2 rounded-md flex gap-2 ">
                <span className="grow"> {formula.name}</span>
                <button onClick={() => handleUpdateFormula(formula)}>
                  <Pencil />
                </button>
                <button onClick={() => handleDeleteFormula(formula.id)}>
                  <Delete />
                </button>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default Formulas;
