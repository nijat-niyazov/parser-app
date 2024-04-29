import { TableCell, TableRow } from '@/components/ui/table';

const EmptyInfo = ({ colSpan }: { colSpan: number }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="font-medium overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black">
        <p className="text-3xl  font-bold">Nothing is found for your filters</p>
      </TableCell>
    </TableRow>
  );
};

export default EmptyInfo;
