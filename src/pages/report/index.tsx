import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

import { addNewFields, getReportData, updateFields } from '@/services/api/endpoints';
import { cn, generateParams } from '@/utils';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { headers } from '@/utils/constants/headers';
import { NewField, TablePagination } from './components';
import TableActions from './sections/table-actions';
import TopSection from './sections/top-section';

import { useGenerateReport } from '@/services/providers/Context';
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

  const { setEnabled } = useGenerateReport();

  /* ----------------------------- Add New Fields ----------------------------- */
  function handleChangeNewFields(e: ChangeEvent<HTMLInputElement>) {
    const newItems = handleChangeValues(e, newFields);
    setNewFields(newItems);
  }

  function handleAddNewField() {
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
        setEnabled(false);
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

  function openEditMode() {
    setEditMode(true);
  }

  function closeEditMode() {
    setEditMode(false);
  }

  function handleChangeOldFields(e: ChangeEvent<HTMLInputElement>) {
    const changedItems = handleChangeValues(e, selectedFields);
    setSelectedFields(changedItems);
  }

  const { mutate: updateFieldsMutation, isPending: updatePending } = useMutation({
    mutationFn: () => updateFields(selectedFields),
    onSuccess: (comingResFromMutFn) => {
      if (comingResFromMutFn.status === 200) {
        toast({
          title: `Changes implemented! ✔`,
          description: `Selected fields got updated !`,
        });
        setEnabled(false);

        setSelectedFields([]);
      } else {
        const detail = comingResFromMutFn.data.error.message;
        toast({ title: `Changes not implemented! ❌`, description: detail });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['repoData', searchParams.toString()],
      });
    },
  });

  /* ----------------------------- Disabled States ---------------------------- */
  const deleteDisabled = !selectedFields.length;
  const savedDisabled = !selectedFields.length && !newFields.length;
  const saveMode = newFields.length > 0 ? 'save' : 'update';

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

  const itemsLoading = isPending && isFetching;

  /* ----------------------------- Shown UI Items ----------------------------- */
  const [filteredKeys, setFilteredKeys] = useState<{ paramName: string; value: string }[]>([]);

  function addUIFilters(e: ChangeEvent<HTMLInputElement>) {
    const { checked, name: paramName, value } = e.target;
    const items = checked ? [...filteredKeys, { paramName, value }] : filteredKeys.filter((item) => item.value !== value);
    setFilteredKeys(items);
  }

  if (itemsLoading) {
    return <div className="flex-1 h-full bg-gray-300 flex items-center justify-center font-semibold text-4xl">Loading...</div>;
  }

  if (error) {
    console.log(error);

    return <div>Error</div>;
  }

  if (data?.status === 200) {
    const items = data.data.data;

    /* ------------------------------ Select Items ------------------------------ */
    function onSelect(e: ChangeEvent<HTMLInputElement>, item?: PropertyType) {
      const { checked, id } = e.target;

      if (!checked) {
        setEditMode(false);
      }

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

    const filteredItems = items.filter((item) => filteredKeys.some(({ paramName, value }) => item[paramName] === value));

    function resetStates() {
      setSelectedFields([]);
      setNewFields([]);
    }

    function resetFilters() {
      setSearchParams(defaultSearchParams);
      setSearchedFields([]);
      resetStates();
    }

    return (
      <div
        className={cn('p-10  bg-slate-200 flex-1 h-full flex flex-col', {
          'opacity-20  pointer-events-none': (isPlaceholderData && isFetching) || addingPending,
        })}
      >
        <TopSection />

        <TableActions
          editMode={editMode}
          handleAddField={handleAddNewField}
          handleSaveNewFields={saveNewProducts}
          handleUpdate={updateFieldsMutation}
          saveMode={saveMode}
          selectedFieldsIds={selectedFields?.map((field) => field.id)}
          resetStates={resetStates}
          resetFilters={resetFilters}
          openEditMode={openEditMode}
          closeEditMode={closeEditMode}
          disabledButtons={{ deleteDisabled, savedDisabled }}
        />

        <Table>
          {/* ------------------------------ Table Header ------------------------------ */}
          <TableHeader>
            <TableRow>
              <TableHead className="border-r-[0.5px] border-b-[0.5px] border-black">
                <input
                  name="all"
                  id="all"
                  value="all"
                  onChange={onSelect}
                  type="checkbox"
                  className="w-5 h-5"
                  checked={selectedFields.length === items.length}
                />
              </TableHead>
              {headers.map((header, i) => (
                <TH
                  data={items}
                  key={i}
                  searchedFields={searchedFields}
                  addNewQuery={addNewQuery}
                  header={header}
                  addUIFilters={addUIFilters}
                  filteredKeys={filteredKeys}
                />
              ))}
            </TableRow>
          </TableHeader>

          {/* ---------------------------------- Data ---------------------------------- */}
          <TableBody>
            {items.length > 0 ? (
              (filteredItems.length ? filteredItems : items).map((listItem) => (
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
                    const isLink = queryParam.toLowerCase().includes('link');
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
                            className="p-2 rounded-md border-2 border-black/30 w-full"
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
        {totalPages - 1 !== 0 && <TablePagination totalPages={totalPages} />}
      </div>
    );
  }
};

export default ReportPage;
