import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createFormula, getFormulaList } from "@/services-test/api/endpoints";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useState } from "react";

const Formulas = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["formulas"],
    queryFn: getFormulaList,
  });
  const [name, setName] = useState("");
  const [formula, setFormula] = useState("");

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    } else {
      setFormula(value);
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = createFormula({ name, formula });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-red-400 w-40 text-center p-2  rounded-md text-white font-semibold my-3">
          Formulas
        </button>
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
              value={name}
              onChange={onChange}
              className="p-2 block rounded-md border-black border-2 w-full focus:outline-none focus:border-blue-500"
              type="text"
            />
          </label>
          <label>
            <span>Formula</span>
            <input
              name="value"
              value={formula}
              type="text"
              onChange={onChange}
              className="p-2 block rounded-md border-black border-2 w-full focus:outline-none focus:border-blue-500"
            />
          </label>
          <button
            disabled={!name || !formula}
            className="bg-green-600 p-2 w-full text-center rounded-lg font-bold text-white disabled:opacity-50"
            type="submit"
          >
            Submit
          </button>
        </form>

        {/* <ul className="my-3 grid gap-3">
          {data?.data?.map(
            (formula: { name: string; formula: string }, i: number) => {
              return (
                <li key={i} className="bg-gray-200 p-2 rounded-md flex gap-2 ">
                  <span className="grow"> {formula.name}</span>
                  <button
                    onClick={() => {
                      setName(formula.name);
                      setFormula(formula.formula);
                    }}
                  >
                    <Pencil />
                  </button>
                  <button>
                    <Delete />
                  </button>
                </li>
              );
            }
          )}
        </ul> */}
      </DialogContent>
    </Dialog>
  );
};

export default Formulas;
