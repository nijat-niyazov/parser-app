import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { Check, Pencil, SquareFunction, Trash2 } from "lucide-react";
import { SelectShownCount } from "../../components";

const TableActions = () => {
  return (
    <section className="flex items-center justify-end gap-4 bg-slate-800 p-2 rounded-t-lg">
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
      <button
        // disabled={!selecteds.length}
        className="bg-gray-600 p-2 rounded-md disabled:opacity-50"
        // onClick={() => setIsEditMote(!isEditMote)}
      >
        <Pencil className="text-white " />
      </button>
      <button
        // disabled={!selecteds.length}
        className="bg-gray-600 p-2 rounded-md disabled:opacity-50"
      >
        <Trash2 className="text-white " />
      </button>
      <button
        // disabled={!isEditMote}
        className="bg-gray-600 p-2 rounded-md disabled:opacity-50"
      >
        <Check className="text-white " />
      </button>
    </section>
  );
};

export default TableActions;
