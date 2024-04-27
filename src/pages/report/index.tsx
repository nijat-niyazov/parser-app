import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

import { FormulaType, addNewFields, deleteFields, getFormulaList, getReportData, updateFields } from '@/services/api/endpoints';
import { cn, generateParams } from '@/utils';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { NewField, TablePagination } from './components';
import TableActions from './sections/table-actions';
import TopSection from './sections/top-section';
import { headers } from './static';

import { formatDate } from '@/utils';
import { subMonths } from 'date-fns';
import TH from './components/table-head';

const currentDate = new Date();
const monthAgo = subMonths(currentDate, 1);

const defaultParams = {
  search: '[]',
  offset: '0',
  limit: '10',
  orderColumn: '3',
  orderDirection: 'DESC',
  timezone: '+04:00',
  fromDate: formatDate(monthAgo),
  toDate: formatDate(currentDate),
};

export type PropertyType = { [key: string]: string | number };

export type SearchQuery = { key: string; operation: string; value: string };

const ReportPage = () => {
  const { toast } = useToast();

  /* -------------------------------------------------------------------------- */
  /*                                 New Fields                                 */
  /* -------------------------------------------------------------------------- */
  const [newFields, setNewFields] = useState<PropertyType[]>([]);

  function handleChangeValues(e: ChangeEvent<HTMLInputElement>, items: PropertyType[]) {
    const { name, value, id } = e.target;

    const newItems = items.map((item) => (item.id.toString() === id ? { ...item, [name]: value } : item));

    return newItems;
  }

  /* ----------------------------- Add New Fields ----------------------------- */
  function handleChangeNewFields(e: ChangeEvent<HTMLInputElement>) {
    const newItems = handleChangeValues(e, newFields);

    setNewFields(newItems);
  }

  function handleAddNewProduct() {
    setNewFields((prev) => [...prev, { id: prev.length + 1 }]);
  }

  function removeAddedField(id: number) {
    setNewFields((prev) => prev.filter((item) => item.id !== id));
  }

  async function saveNewProducts() {
    const fields = newFields.map((field) => {
      const { id, ...rest } = field;
      return rest;
    });

    const { status } = await addNewFields(fields);

    if (status === 202) {
      toast({ title: `Changes implemented! ✔`, description: `New fields are added !` });
      setNewFields([]);
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               Existing Items                               */
  /* -------------------------------------------------------------------------- */
  const [selectedFields, setSelectedFields] = useState<PropertyType[]>([]);

  /* ------------------------------ Update Fields ----------------------------- */
  function handleChangeOldFields(e: ChangeEvent<HTMLInputElement>) {
    const changedItems = handleChangeValues(e, selectedFields);
    setSelectedFields(changedItems);
  }

  async function handleUpdateFields() {
    const { data } = await updateFields(selectedFields);

    if (data.code === 200) {
      toast({ title: `Changes implemented! ✔`, description: `Selected fields got updated !` });
      setSelectedFields([]);
    }
  }

  /* ------------------------------ Delete Fields ----------------------------- */
  async function handleDeleteFields() {
    const { data } = await deleteFields(selectedFields.map((item) => item.id) as number[]);

    if (data.code === 200) {
      toast({ title: `Changes implemented! ✔`, description: `Selected fields are deleted !` });
      setSelectedFields([]);
    }
  }

  const [filteredKeys, setFilteredKeys] = useState<string[]>([]);

  function addKeyToFilters(key: string) {
    setFilteredKeys((prev) => [...prev, key]);
  }

  const filteredItems = useMemo(() => {}, [filteredKeys.join(',')]);

  const deleteDisabled = !selectedFields.length;
  const savedDisabled = !selectedFields.length && !newFields.length;
  const saveMode = newFields.length > 0 ? 'save' : 'update';

  /* -----------------------------------  ---------------------------------- */
  const [searchParams, setSearchParams] = useSearchParams(defaultParams);

  const searchedItems = searchParams.has('search') ? JSON.parse(searchParams.get('search') as string) : [];
  const [searchedFields, setSearchedFields] = useState<SearchQuery[]>(searchedItems);
  const addNewQuery = (items: SearchQuery[]) => setSearchedFields(items);

  const params = generateParams(Object.fromEntries(searchParams.entries()));

  const queryClient = useQueryClient();
  const { isPending, error, data, isPlaceholderData, isFetching } = useQuery({
    queryKey: ['repoData', searchParams.toString()],
    queryFn: () => getReportData(params),
    placeholderData: keepPreviousData,
  });

  const {
    isPending: formulasIsPending,
    error: formulasError,
    data: formulasData,
    refetch: refetchFormulas,
  } = useQuery({ queryKey: ['formulas'], queryFn: getFormulaList });

  const itemsLoading = isPending && isFetching;

  if (itemsLoading) {
    return <div className="flex-1 bg-red-400 flex items-center justify-center font-semibold text-3xl">Loading...</div>;
  }

  if (error) {
    console.log(error);

    return <div>Error</div>;
  }

  if (data) {
    const items = data.data.data as PropertyType[];
    const formulas = formulasData?.data.data as FormulaType[];

    /* ------------------------------ Select Items ------------------------------ */
    function onSelect(e: ChangeEvent<HTMLInputElement>, item?: PropertyType) {
      const { checked, id } = e.target;

      const selectedOptions =
        id !== 'all'
          ? checked
            ? [...selectedFields, item]
            : selectedFields.filter((item) => item.id?.toString() !== id)
          : checked
          ? items
          : [];

      setSelectedFields(selectedOptions as PropertyType[]);
    }

    const totalPages = Math.ceil(data.data.total / data.data.limit);

    return (
      <div className="p-10  bg-slate-200 min-h-screen">
        <TopSection formulas={formulas} refetchFormulas={refetchFormulas} />

        <TableActions
          disabledButtons={{ deleteDisabled, savedDisabled }}
          handleAddField={handleAddNewProduct}
          handleDelete={handleDeleteFields}
          handleSaveNewFields={saveNewProducts}
          handleUpdate={handleUpdateFields}
          saveMode={saveMode}
          formulas={formulas}
          selectedFieldsIds={selectedFields.map((field) => field.id)}
          setSelectedFields={setSelectedFields}
        />

        <Table className={cn({ 'opacity-20  pointer-events-none': isPlaceholderData && isFetching })}>
          {/* ------------------------------ Table Header ------------------------------ */}
          <TableHeader>
            <TableRow>
              <TableHead className="border-r-[0.5px] border-b-[0.5px] border-black">
                <input name="all" id="all" value="all" onChange={onSelect} type="checkbox" className="w-5 h-5 " />
              </TableHead>
              {headers.map((header, i) => (
                <TH
                  key={i}
                  searchedFields={searchedFields}
                  addNewQuery={addNewQuery}
                  data={items}
                  header={header}
                  handleFilter={addKeyToFilters}
                />
              ))}
            </TableRow>
          </TableHeader>

          {/* ---------------------------------- Data ---------------------------------- */}
          <TableBody>
            {items.length ? (
              items.map((listItem) => (
                <TableRow key={listItem.id}>
                  <TableCell className="font-medium overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black">
                    <input
                      id={`${listItem.id}`}
                      name={`${listItem.id}`}
                      onChange={(e) => onSelect(e, listItem)}
                      checked={selectedFields.find((item) => item.id === listItem.id) ? true : false}
                      type="checkbox"
                      className="w-5 h-5"
                    />
                  </TableCell>
                  {headers.map(({ queryParam }, i) => {
                    const isLink = queryParam.includes('link');
                    const value = listItem[queryParam] ?? '';

                    return (
                      <TableCell
                        key={i}
                        className="font-medium whitespace-nowrap overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black"
                      >
                        {selectedFields.find((item) => item.id === listItem.id) && queryParam !== 'id' ? (
                          <input
                            type="text"
                            className="p-2 rounded-md border-2 broder-black"
                            id={listItem.id?.toString()}
                            name={queryParam}
                            value={selectedFields.find((item) => item.id === listItem.id)?.[queryParam] ?? ''}
                            onChange={handleChangeOldFields}
                          />
                        ) : isLink ? (
                          <Link to={value as string} target="_blank" className="text-blue-500">
                            {value}
                          </Link>
                        ) : (
                          <p>{value}</p>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              /* ----------------------------- For emtpy data ----------------------------- */
              <TableRow>
                <TableCell
                  colSpan={headers.length + 1}
                  className="font-medium overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black"
                >
                  <p className="text-3xl  font-bold">Nothing is found for your filters</p>
                </TableCell>
              </TableRow>
            )}

            {/* ------------------------------- New Fields ------------------------------- */}

            {newFields.map((field) => (
              <NewField
                key={field.id}
                field={field}
                handleChangeNewFields={handleChangeNewFields}
                removeAddedField={removeAddedField}
                value={newFields.find((item) => item.id === field.id) as PropertyType}
              />
            ))}
          </TableBody>
        </Table>

        {/* ------------------------------- Pagination ------------------------------- */}
        {totalPages != 0 && <TablePagination totalPages={totalPages} />}
      </div>
    );
  }
};

export default ReportPage;

// <TableRow key={field.id}>
//   <TableCell className="font-medium overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black">
//     <button onClick={() => setNewFields(newFields.filter((item) => item.id !== field.id))}>
//       <Trash2 />
//     </button>
//   </TableCell>

//   {headers.map(({ queryParam }, index) => {
//     const id = field.id;
//     const propName = queryParam;
//     // const value = newFields.at(id - 1)?.[queryParam] ?? '';
//     const value = newFields.find((item) => item.id === id)?.[queryParam] ?? '';

//     return (
//       <TableCell
//         key={index}
//         className="font-medium whitespace-nowrap overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black"
//       >
//         <input
//           autoFocus={index === 0}
//           type="text"
//           className="p-2 rounded-md border-2 broder-black min-w-40 w-full"
//           id={id.toString()}
//           name={propName}
//           value={value}
//           onChange={handleChangeNewFields}
//         />
//       </TableCell>
//     );
//   })}
// </TableRow>
