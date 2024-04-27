import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useDebounce from '@/hooks/useDebounce';
import { PropertyType, SearchQuery } from '@/pages/report';
import { cn } from '@/utils';
import getUniqueValues from '@/utils/helpers/uniqueValues';
import { Check } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TableHead } from '../../../../components/ui/table';
import { comparisonOperations } from './static';

type Props = {
  data: PropertyType[];
  header: { label: string; queryParam: string };
  searchedFields: SearchQuery[];
  addNewQuery: (items: SearchQuery[]) => void;
  handleFilter: (value: string) => void;
};

const TH = ({ data, header, addNewQuery, searchedFields }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeField = searchedFields.find((queryObj) => queryObj.key === header.queryParam);

  const [operation, setOperation] = useState(activeField?.operation ?? 'EQUALS');

  const [query, setQuery] = useState<string>(activeField?.value ?? '');
  const debounced = useDebounce(query, 500);

  useEffect(() => {
    const newQuery = { key: header.queryParam, operation, value: debounced };

    const alreadyAdded = searchedFields.some(({ key }) => key === newQuery.key);

    const items = debounced
      ? alreadyAdded
        ? searchedFields.map((queryObj) => (queryObj.key === header.queryParam ? newQuery : queryObj))
        : [...searchedFields, newQuery]
      : searchedFields.filter((queryObj) => queryObj.key !== newQuery.key);

    addNewQuery(items);

    items.length ? searchParams.set('search', JSON.stringify(items)) : searchParams.delete('search');

    // setSearchParams(searchParams);
  }, [debounced, operation]);

  const uniqueValues = useMemo(() => getUniqueValues(data.map((item) => item[header.queryParam as keyof typeof item])), []);
  const filteredUniqeValues = useMemo(() => uniqueValues.filter((item) => item.toString().includes(query)), [query]);

  const [rename, setRename] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = { fieldName: header.queryParam, fieldValue: query, renameValue: rename };
    console.log(data);
  }

  return (
    <TableHead className="w-auto whitespace-nowrap overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black text-black p-0">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 w-full h-full bg-blue-300 p-4">{header.label}</button>
        </PopoverTrigger>
        <PopoverContent className="w-96 max-h-[500px] overflow-y-auto">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Dimensions</h4>
              <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-4">
                <button className="flex-1 bg-green-400">ASC</button>
                <button className="flex-1 bg-red-400">DESC</button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {comparisonOperations.map(({ label, value }, i) => (
                  <button
                    key={i}
                    disabled={!query}
                    onClick={() => setOperation(value)}
                    className={cn('flex-1 bg-gray-400 disabled:opacity-50', { 'bg-green-400': value === operation })}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                  className="col-span-2 h-8"
                />
              </div>
              <form onSubmit={handleSubmit} className="flex items-center gap-4">
                <Label htmlFor="rename">Rename</Label>
                <Input value={rename} onChange={(e) => setRename(e.target.value)} id="rename" className="flex-1" />
                <button className="bg-green-300">
                  <Check />
                </button>
              </form>

              <ul className="grid gap-2 ">
                {filteredUniqeValues.map((item: string | number, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-balance">
                    <Input
                      // id={`${header.queryParam}-${header.label}`.toLowerCase()}
                      className="w-5 h-5"
                      type="checkbox"
                    />
                    <Label htmlFor={`${header.queryParam}-${header.label}`.toLowerCase()} className="text-balance">
                      {i + 1}. {item}
                    </Label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TableHead>
  );
};

export default TH;
