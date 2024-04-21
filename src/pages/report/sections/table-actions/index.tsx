import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { Check, Pencil, SquareFunction, Trash2 } from "lucide-react";
import { DatePickerWithRange, SelectShownCount } from "../../components";

type Props = {
  disabledButtons: {
    editDisabled: boolean;
    deleteDisabled: boolean;
    savedDisabled: boolean;
  };
};

const TableActions = ({ disabledButtons }: Props) => {
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
      <button
        disabled={disabledButtons.editDisabled}
        className="bg-gray-600 p-2 rounded-md disabled:opacity-50"
      >
        <Pencil className="text-white " />
      </button>
      <button
        disabled={disabledButtons.deleteDisabled}
        className="bg-gray-600 p-2 rounded-md disabled:opacity-50"
      >
        <Trash2 className="text-white " />
      </button>
      <button
        disabled={disabledButtons.editDisabled}
        className="bg-gray-600 p-2 rounded-md disabled:opacity-50"
      >
        <Check className="text-white " />
      </button>
    </section>
  );
};

export default TableActions;
