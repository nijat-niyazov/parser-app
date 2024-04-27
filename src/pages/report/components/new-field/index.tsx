import { TableCell, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { PropertyType } from '../..';
import { headers } from '../../static';

type Props = {
  removeAddedField: (id: number) => void;
  handleChangeNewFields: (e: React.ChangeEvent<HTMLInputElement>) => void;
  field: PropertyType;
  value: PropertyType;
};
const NewField = ({ removeAddedField, handleChangeNewFields, field, value }: Props) => {
  return (
    <TableRow>
      <TableCell className="font-medium overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black">
        <button onClick={() => removeAddedField(3)}>
          <Trash2 />
        </button>
      </TableCell>

      {headers.map(({ queryParam }, index) => {
        const id = field.id;
        const propName = queryParam;

        const inputValue = value?.[queryParam] ?? '';

        return (
          <TableCell key={index} className="font-medium whitespace-nowrap overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black">
            <input
              autoFocus={index === 0}
              type="text"
              className="p-2 rounded-md border-2 broder-black min-w-40 w-full"
              id={id.toString()}
              name={propName}
              value={inputValue}
              onChange={handleChangeNewFields}
            />
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default NewField;
