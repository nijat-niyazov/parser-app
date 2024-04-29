import { TableCell, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { PropertyType } from '../..';
import { headers } from '../../static';

type Props = {
  removeAddedField: (id: number) => void;
  handleChangeNewFields: (e: React.ChangeEvent<HTMLInputElement>) => void;
  field: PropertyType;
  property: PropertyType;
};
const NewField = ({ removeAddedField, handleChangeNewFields, field, property }: Props) => {
  return (
    <TableRow>
      <TableCell className="font-medium overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black">
        <button onClick={() => removeAddedField(Number(field.id))}>
          <Trash2 />
        </button>
      </TableCell>

      {headers.map(({ queryParam }, index) => {
        const value = property[queryParam] ?? '';

        return (
          <TableCell key={index} className="font-medium whitespace-nowrap overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black">
            <input
              autoFocus={index === 0}
              type="text"
              className="p-2 rounded-md border-2 broder-black min-w-40 w-full"
              id={field.id.toString()}
              name={queryParam}
              value={value}
              onChange={handleChangeNewFields}
            />
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default NewField;
