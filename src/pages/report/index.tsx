import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

import { FormulaType, addNewFields, deleteFields, getFormulaList, getReportData, updateFields } from '@/services/api/endpoints';
import { cn, generateParams } from '@/utils';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { NewField, TablePagination } from './components';
import TableActions from './sections/table-actions';
import TopSection from './sections/top-section';
import { headers } from './static';

import { defaultSearchParams } from '@/utils/constants/defaultSearchParam';
import EmptyInfo from './components/empty-info';
import TH from './components/table-head';

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

  const queryClient = useQueryClient();

  const { mutate: addNewFieldsMutation, isPending: addingPending } = useMutation({
    mutationFn: addNewFields,
    onSuccess: (comingResFromMutFn) => {
      if (comingResFromMutFn.status === 202) {
        toast({ title: `Changes implemented! ✔`, description: `New fields are added !` });
        setNewFields([]);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['repoData', searchParams.toString()] });
    },
  });

  function saveNewProducts() {
    const fields = newFields.map((field) => {
      const { id, ...rest } = field;
      return rest;
    });

    addNewFieldsMutation(fields);
  }

  /* -------------------------------------------------------------------------- */
  /*                               Existing Items                               */
  /* -------------------------------------------------------------------------- */
  const [selectedFields, setSelectedFields] = useState<PropertyType[]>([]);

  /* ------------------------------ Update Fields ----------------------------- */

  const [editMode, setEditMode] = useState<boolean>(false);
  function toggleEditMode() {
    setEditMode(!editMode);
  }

  function handleChangeOldFields(e: ChangeEvent<HTMLInputElement>) {
    const changedItems = handleChangeValues(e, selectedFields);
    setSelectedFields(changedItems);
  }

  const { mutate: updateFieldsMutation, isPending: updatePending } = useMutation({
    mutationFn: () => updateFields(selectedFields),
    onSuccess: (comingResFromMutFn) => {
      if (comingResFromMutFn.data.code === 200) {
        toast({ title: `Changes implemented! ✔`, description: `Selected fields got updated !` });
        setSelectedFields([]);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['repoData', searchParams.toString()] });
    },
  });

  /* ------------------------------ Delete Fields ----------------------------- */

  const { mutate: deleteFieldsMutation, isPending: deletePending } = useMutation({
    mutationFn: () => deleteFields(selectedFields.map((item) => item.id) as number[]),
    onSuccess: (comingResFromMutFn) => {
      if (comingResFromMutFn.data.code === 200) {
        toast({ title: `Changes implemented! ✔`, description: `Selected fields are deleted !` });
        setSelectedFields([]);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['repoData', searchParams.toString()] });
    },
  });

  const [filteredKeys, setFilteredKeys] = useState<string[]>([]);

  function addKeyToFilters(key: string) {
    setFilteredKeys((prev) => [...prev, key]);
  }

  const filteredItems = useMemo(() => {}, [filteredKeys.join(',')]);

  const deleteDisabled = !selectedFields.length;
  const savedDisabled = !selectedFields.length && !newFields.length;
  const saveMode = newFields.length > 0 ? 'save' : 'update';

  function resetFilters() {
    setSearchParams(defaultSearchParams);
    setSearchedFields([]);
    setNewFields([]);
  }

  /* ------------------------------ Fetching Data ----------------------------- */
  const [searchParams, setSearchParams] = useSearchParams(defaultSearchParams);

  const searchedItems = searchParams.has('search') ? JSON.parse(searchParams.get('search') as string) : [];

  const [searchedFields, setSearchedFields] = useState<SearchQuery[]>(searchedItems);
  const addNewQuery = (items: SearchQuery[]) => setSearchedFields(items);

  const params = generateParams(Object.fromEntries(searchParams.entries()));

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
  } = useQuery({
    queryKey: ['formulas'],
    queryFn: getFormulaList,
  });

  const itemsLoading = isPending && isFetching;

  if (itemsLoading || formulasIsPending) {
    return <div className="flex-1 bg-red-400 flex items-center justify-center font-semibold text-3xl">Loading...</div>;
  }

  if (error || formulasError) {
    console.log(error);

    return <div>Error</div>;
  }

  if (data) {
    const items = data.data.data as PropertyType[];
    const formulas = formulasData.data.data as FormulaType[];

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
      <div
        className={cn('p-10  bg-slate-200 flex-1', {
          'opacity-20  pointer-events-none': (isPlaceholderData && isFetching) || addingPending,
        })}
      >
        <TopSection formulas={formulas} />

        <TableActions
          disabledButtons={{ deleteDisabled, savedDisabled }}
          handleAddField={handleAddNewProduct}
          handleDelete={deleteFieldsMutation}
          handleSaveNewFields={saveNewProducts}
          handleUpdate={updateFieldsMutation}
          saveMode={saveMode}
          formulas={formulas}
          selectedFieldsIds={selectedFields?.map((field) => field.id)}
          setSelectedFields={setSelectedFields}
          resetFilters={resetFilters}
          toggleEditMode={toggleEditMode}
        />

        <Table>
          {/* ------------------------------ Table Header ------------------------------ */}
          <TableHeader>
            <TableRow>
              <TableHead className="border-r-[0.5px] border-b-[0.5px] border-black">
                <input name="all" id="all" value="all" onChange={onSelect} type="checkbox" className="w-5 h-5 " />
              </TableHead>
              {headers.map((header, i) => (
                <TH
                  orderColumn={i + 1}
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
            {items.length > 0 ? (
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
                    const content = listItem[queryParam] ?? '';
                    const selectedField = selectedFields.find((item) => item.id === listItem.id);

                    const isEditMode = selectedField && editMode;

                    return (
                      <TableCell
                        key={i}
                        className={cn('font-medium whitespace-nowrap overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black', {
                          'opacity-50 pointer-events-none': updatePending && selectedField?.id === listItem.id,
                        })}
                      >
                        {isEditMode ? (
                          <input
                            type="text"
                            className="p-2 rounded-md border-2 broder-black"
                            id={listItem.id?.toString()}
                            name={queryParam}
                            value={selectedField[queryParam] ?? ''}
                            onChange={handleChangeOldFields}
                          />
                        ) : isLink ? (
                          <Link to={content as string} target="_blank" className="text-blue-500">
                            {content}
                          </Link>
                        ) : (
                          <p>{content}</p>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              /* ----------------------------- For emtpy data ----------------------------- */
              <EmptyInfo colSpan={headers.length + 1} />
            )}

            {/* ------------------------------- New Fields ------------------------------- */}

            {newFields.map((field) => {
              const property = newFields.find((item) => item.id === field.id) as PropertyType;

              return (
                <NewField
                  key={field.id}
                  field={field}
                  property={property}
                  removeAddedField={removeAddedField}
                  handleChangeNewFields={handleChangeNewFields}
                />
              );
            })}
          </TableBody>
        </Table>

        {/* ------------------------------- Pagination ------------------------------- */}
        {totalPages != 0 && <TablePagination totalPages={totalPages} />}
      </div>
    );
  }
};

export default ReportPage;
