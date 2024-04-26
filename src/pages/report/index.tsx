import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { addNewFields, deleteFields, getReportData, updateFields } from '@/services-test/api/endpoints';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';

import { useToast } from '@/components/ui/use-toast';
import TH from '@/pages/report/components/table-head';
import { cn, generateParams } from '@/utils';
import { Trash2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { TablePagination } from './components';
import TableActions from './sections/table-actions';
import { headers } from './static';

const defaultParams = {
  search: '[]',
  offset: '0',
  limit: '10',
  orderColumn: '3',
  orderDirection: 'DESC',
  timezone: '+04:00',
  fromDate: '2023-02-01',
  toDate: '2024-12-11',
};

export type PropertyType = { [key: string]: string | number };
// | number | null

export type SearchQuery = { key: string; operation: string; value: string };

const ReportPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams(defaultParams);

  const searchedItems = searchParams.has('search') ? JSON.parse(searchParams.get('search') as string) : [];
  const [searchedFields, setSearchedFields] = useState<SearchQuery[]>(searchedItems);

  const addNewQuery = (items: SearchQuery[]) => setSearchedFields(items);

  const params = generateParams(Object.fromEntries(searchParams.entries()));

  const { toast } = useToast();

  const { isPending, error, data, isPlaceholderData, isFetching } = useQuery({
    queryKey: ['repoData', searchParams.toString()],
    queryFn: () => getReportData(params),
    placeholderData: keepPreviousData,
  });
  const loading = isPending && isFetching;

  const [selectedItems, setSelectedItems] = useState<PropertyType[]>([]);
  const [newFields, setNewFields] = useState<PropertyType[]>([]);
  // const isAllSelected = selectedItems.includes('all');

  if (loading) {
    return <div className="flex-1 bg-red-400 flex items-center justify-center font-semibold text-3xl">Loading...</div>;
  }

  if (error) {
    console.log(error);

    return <div>Error</div>;
  }

  if (data) {
    const deleteDisabled = !selectedItems.length;
    const savedDisabled = !selectedItems.length && !newFields.length;
    const items = data.data.data as PropertyType[];

    function onSelect(e: ChangeEvent<HTMLInputElement>, item?: PropertyType) {
      const { checked, id } = e.target;

      const selectedOptions =
        id === 'all'
          ? checked
            ? items
            : []
          : checked
          ? [...selectedItems, item]
          : selectedItems.filter((item) => item.id?.toString() !== id);

      setSelectedItems(selectedOptions as PropertyType[]);
    }

    function handleChangeValues(e: ChangeEvent<HTMLInputElement>, items: PropertyType[]) {
      const { name, value, id } = e.target;
      // console.log({ name, value, id });

      const newItems = items.map((item) => (item.id.toString() === id ? { ...item, [name]: value } : item));

      return newItems;
    }

    /* ------------------------------ Add New Field ----------------------------- */

    function handleChangeNewFields(e: ChangeEvent<HTMLInputElement>) {
      // const items = handleChangeValues(e, newFields) as PropertyType & { id: string | number }[];
      // const { id, ...newItems } = items;
      const newItems = handleChangeValues(e, newFields);

      setNewFields(newItems);
    }

    function handleAddNewProduct() {
      setNewFields((prev) => [...prev, { id: prev.length + 1 }]);
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

    /* ------------------------ Update and Delete fields ------------------------ */
    function handleChangeOldFields(e: ChangeEvent<HTMLInputElement>) {
      const changedItems = handleChangeValues(e, selectedItems);
      setSelectedItems(changedItems);
    }

    async function handleUpdateFields() {
      const { data } = await updateFields(selectedItems);

      if (data.code === 200) {
        toast({ title: `Changes implemented! ✔`, description: `Selected fields got updated !` });
        setSelectedItems([]);
      }
    }

    async function handleDeleteFields() {
      const { data } = await deleteFields(selectedItems.map((item) => item.id) as number[]);

      if (data.code === 200) {
        toast({ title: `Changes implemented! ✔`, description: `Selected fields are deleted !` });
        setSelectedItems([]);
      }
    }

    const totalPages = Math.ceil(data.data.total / data.data.limit);
    const saveMode = newFields.length > 0 ? 'save' : 'update';

    return (
      <div className="p-10  bg-slate-200 min-h-screen">
        {/* <TopSection /> */}

        <TableActions
          disabledButtons={{ deleteDisabled, savedDisabled }}
          handleAddField={handleAddNewProduct}
          handleSaveNewFields={saveNewProducts}
          handleDelete={handleDeleteFields}
          handleUpdate={handleUpdateFields}
          saveMode={saveMode}
        />

        <Table className={cn({ 'opacity-20  pointer-events-none': isPlaceholderData && isFetching })}>
          {/* ------------------------------ Table Header ------------------------------ */}
          <TableHeader>
            <TableRow>
              <TableHead className="border-r-[0.5px] border-b-[0.5px] border-black">
                <input name="all" id="all" value="all" onChange={onSelect} type="checkbox" className="w-5 h-5 " />
              </TableHead>
              {headers.map((header, i) => (
                <TH key={i} searchedFields={searchedFields} addNewQuery={addNewQuery} data={items} header={header} />
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
                      checked={selectedItems.find((item) => item.id === listItem.id) ? true : false}
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
                        // max-w-96 break-words
                      >
                        {selectedItems.find((item) => item.id === listItem.id) && queryParam !== 'id' ? (
                          <input
                            type="text"
                            className="p-2 rounded-md border-2 broder-black"
                            id={listItem.id?.toString()}
                            name={queryParam}
                            // defaultValue={value}
                            value={selectedItems.find((item) => item.id === listItem.id)?.[queryParam] ?? ''}
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
              <TableRow key={field.id}>
                <TableCell className="font-medium overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black">
                  <button onClick={() => setNewFields(newFields.filter((item) => item.id !== field.id))}>
                    <Trash2 />
                  </button>
                </TableCell>

                {headers.map(({ queryParam }, index) => {
                  const id = field.id;
                  const propName = queryParam;
                  // const value = newFields.at(id - 1)?.[queryParam] ?? '';
                  const value = newFields.find((item) => item.id === id)?.[queryParam] ?? '';

                  return (
                    <TableCell
                      key={index}
                      className="font-medium whitespace-nowrap overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black"
                      // max-w-96 break-words
                    >
                      <input
                        type="text"
                        className="p-2 rounded-md border-2 broder-black min-w-40 w-full"
                        id={id.toString()}
                        name={propName}
                        value={value}
                        onChange={handleChangeNewFields}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
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
