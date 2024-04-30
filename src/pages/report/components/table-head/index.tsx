import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import useDebounce from '@/hooks/useDebounce';
import { PropertyType, SearchQuery } from '@/pages/report';
import { renameField } from '@/services/api/endpoints';
import { cn } from '@/utils';
import { defaultSearchParams } from '@/utils/constants/defaultSearchParam';
import getUniqueValues from '@/utils/helpers/uniqueValues';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TableHead } from '../../../../components/ui/table';
import { Spinner } from '../../sections/top-section/formulas';
import { comparisonOperations } from './static';

type Props = {
  data: PropertyType[];
  header: { label: string; queryParam: string };
  searchedFields: SearchQuery[];
  addNewQuery: (items: SearchQuery[]) => void;
  addUIFilters: (e: ChangeEvent<HTMLInputElement>) => void;
  filteredKeys: { paramName: string; value: string }[];
  orderColumn: number;
};

const TH = ({ data, header, addNewQuery, searchedFields, orderColumn, addUIFilters, filteredKeys }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams(defaultSearchParams);

  const activeDirection = searchParams.get('orderDirection');
  const activeColDirection = searchParams.get('orderColumn');

  /* --------------------------- Searching for field -------------------------- */
  const activeField = searchedFields.find((queryObj) => queryObj.key === header.queryParam);
  const [operation, setOperation] = useState(activeField ? activeField.operation : 'EQUALS');
  const [query, setQuery] = useState<string>(activeField ? activeField.value : '');

  useEffect(() => {
    if (!activeField) {
      setQuery('');
      setOperation('EQUALS');
    }
  }, [searchedFields.length]);

  const debounced = useDebounce(query, 500);

  /* -------------------------- Update Search Fields -------------------------- */
  function updateSearchdFields(items: SearchQuery[]) {
    addNewQuery(items);

    searchParams.set('search', JSON.stringify(items.length ? items : []));

    setSearchParams(searchParams);
  }

  const firstMount = useRef(true);
  useEffect(() => {
    // Stop from first debounced value triggering
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }

    const newQuery = { key: header.queryParam, operation, value: debounced };

    const alreadyAdded = searchedFields.some(({ key }) => key === newQuery.key);

    const items = debounced
      ? alreadyAdded
        ? searchedFields.map((queryObj) => (queryObj.key === newQuery.key ? newQuery : queryObj))
        : [...searchedFields, newQuery]
      : searchedFields.filter((queryObj) => queryObj.key !== newQuery.key);

    updateSearchdFields(items);
  }, [debounced]);

  function changeOperation(operation: string) {
    setOperation(operation);

    const newQuery = { key: header.queryParam, operation, value: debounced };
    const items = searchedFields.map((queryObj) => (queryObj.key === newQuery.key ? newQuery : queryObj));

    updateSearchdFields(items);
  }

  /* ------------------------------ Rename Value ------------------------------ */
  const [rename, setRename] = useState({ fieldValue: '', renameValue: '' });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: renameMutate, isPending: renameIsPending } = useMutation({
    mutationFn: renameField,
    onSuccess: (returnedDataFromMutation) => {
      if (returnedDataFromMutation.data.code === 200) {
        setRename({ fieldValue: '', renameValue: '' });
        toast({ title: 'Changes implemented ✔', description: 'Field has been renamed successfully! ' });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['repoData', searchParams.toString()] });
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = { fieldName: header.queryParam, fieldValue: rename.fieldValue, renameValue: rename.renameValue };

    renameMutate(data);
  }

  /* -------------------------- Uniqe values checkbox ------------------------- */

  const uniqueValues = useMemo(() => getUniqueValues(data.map((item) => item[header.queryParam as keyof typeof item])), [data]);

  const filteredUniqeValues = useMemo(() => uniqueValues.filter((item) => item.toString().includes(query)), [query, uniqueValues]);

  return (
    <TableHead className="w-auto whitespace-nowrap overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black text-black p-0">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 w-full h-full bg-blue-300 p-4">{header.label}</button>
        </PopoverTrigger>
        <PopoverContent className="w-96 max-h-[450px] overflow-y-auto">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">{header.label}</h4>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-4">
                <button
                  className={cn('flex-1 p-1 rounded-md text-white font-semibold  bg-sky-600 scale-90 opacity-50', {
                    'opacity-100 scale-100 ': activeColDirection === orderColumn.toString() && activeDirection === 'ASC',
                  })}
                  onClick={() => {
                    searchParams.set('orderDirection', 'ASC');
                    searchParams.set('orderColumn', orderColumn.toString());

                    setSearchParams(searchParams);
                  }}
                >
                  ASC
                </button>
                <button
                  className={cn('flex-1 p-1 rounded-md text-white font-semibold  bg-red-600 scale-90 opacity-50', {
                    'opacity-100 scale-100 ': activeColDirection === orderColumn.toString() && activeDirection === 'DESC',
                  })}
                  onClick={() => {
                    searchParams.set('orderDirection', 'DESC');
                    searchParams.set('orderColumn', orderColumn.toString());
                    setSearchParams(searchParams);
                  }}
                >
                  DESC
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {comparisonOperations.map(({ label, value }, i) => (
                  <button
                    key={i}
                    disabled={!query}
                    onClick={() => changeOperation(value)}
                    className={cn(
                      'flex-1 bg-gray-400 disabled:opacity-50 rounded-md py-1 font-semibold scale-90 transition-all duration-200',
                      {
                        'bg-green-400 scale-100': value === operation && query,
                      }
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 border-b-2 my-2 border-black/10 pb-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                  className="h-8 flex-1"
                />
              </div>

              <form onSubmit={handleSubmit} className="space-y-2">
                <Label htmlFor="rename">Rename</Label>
                <div className="space-y-2">
                  <Input
                    value={rename.fieldValue}
                    onChange={(e) => setRename({ ...rename, fieldValue: e.target.value })}
                    id="rename"
                    className="flex-1"
                    placeholder="Old Value"
                  />
                  <Input
                    value={rename.renameValue}
                    onChange={(e) => setRename({ ...rename, renameValue: e.target.value })}
                    id="rename"
                    className="flex-1"
                    placeholder="New Value"
                  />
                </div>
                <button
                  disabled={!rename.fieldValue || !rename.renameValue || renameIsPending}
                  className="bg-green-600 p-1 text-white rounded-md w-full disabled:opacity-50"
                >
                  {!renameIsPending ? 'Rename Field' : <Spinner />}
                </button>
              </form>

              <ul className="grid gap-2 ">
                {filteredUniqeValues.map((item: string | number, i: number) => {
                  const checked = filteredKeys.some(({ paramName, value }) => paramName === header.queryParam && value === item);

                  return (
                    <li key={i} className="flex items-start gap-3 text-balance">
                      <Input
                        id={`${item}`.toLowerCase()}
                        onChange={addUIFilters}
                        name={header.queryParam}
                        value={item}
                        className="w-5 h-5"
                        type="checkbox"
                        checked={checked}
                      />
                      <Label htmlFor={`${item}`.toLowerCase()} className="text-balance">
                        {i + 1}. {item}
                      </Label>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TableHead>
  );
};

export default TH;
