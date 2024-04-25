import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getReportData } from '@/services-test/api/endpoints';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';

import TH from '@/pages/report/components/table-head';
import { cn, generateParams } from '@/utils';
import { Link, useSearchParams } from 'react-router-dom';
import { TablePagination } from './components';
import TableActions from './sections/table-actions';
import TopSection from './sections/top-section';
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

export type PropertyType = { [key: string]: string | number | null };

export type SearchQuery = {
  key: string;
  operation: string;
  value: string;
};

const ReportPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams(defaultParams);

  const searchedItems = searchParams.has('search') ? JSON.parse(searchParams.get('search') as string) : [];
  const [searchedFields, setSearchedFields] = useState<SearchQuery[]>(searchedItems);

  const addNewQuery = (items: SearchQuery[]) => setSearchedFields(items);

  const params = generateParams(Object.fromEntries(searchParams.entries()));

  const { isPending, error, data, isPlaceholderData, isFetching } = useQuery({
    queryKey: ['repoData', searchParams.toString()],
    queryFn: () => getReportData(params),

    placeholderData: keepPreviousData,
  });

  const [editableSelecteds, setEditableSelecteds] = useState<string[]>([]);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, checked } = e.target;
    const selectedOptions = checked ? [...editableSelecteds, value] : editableSelecteds.filter((item) => item !== value);
    setEditableSelecteds(selectedOptions);
  }

  const loading = isPending && isFetching;
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.log(error);

    return <div>Error</div>;
  }

  if (data) {
    const editDisabled = !editableSelecteds.length;
    const deleteDisabled = !editableSelecteds.length;
    const savedDisabled = !editableSelecteds.length;
    const totalPages = Math.ceil(data.data.total / data.data.limit);
    const editMote = editableSelecteds.length;

    const items = data.data.data as PropertyType[];

    return (
      <div className="p-10  bg-slate-200 min-h-screen">
        <TopSection />

        <TableActions disabledButtons={{ editDisabled, deleteDisabled, savedDisabled }} />

        <Table className={cn('', { 'opacity-20  pointer-events-none': isPlaceholderData && isFetching })}>
          {/* ------------------------------ Table Header ------------------------------ */}
          <TableHeader>
            <TableRow>
              <TableHead className="border-r-[0.5px] border-b-[0.5px] border-black">
                <input
                  // name="all"
                  // id="all"
                  value="all"
                  onChange={onChange}
                  checked={editableSelecteds.includes('all')}
                  type="checkbox"
                  className="w-5 h-5 "
                />
              </TableHead>
              {headers.map((header, i) => (
                <TH key={i} searchedFields={searchedFields} addNewQuery={addNewQuery} data={items} header={header} />
              ))}
            </TableRow>
          </TableHeader>

          {/* ---------------------------------- Data ---------------------------------- */}
          <TableBody>
            {items.length ? (
              items.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black">
                    <input
                      // name={`${property.id}`}
                      // id={`${property.id}`}
                      onChange={onChange}
                      checked={editableSelecteds.includes('all')}
                      type="checkbox"
                      className="w-5 h-5"
                    />
                  </TableCell>
                  {headers.map(({ queryParam }, i) => {
                    const isLink = queryParam.includes('link');
                    const value = property[queryParam] ?? '';
                    return (
                      <TableCell
                        key={i}
                        className="font-medium whitespace-nowrap overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black"
                        // max-w-96 break-words
                      >
                        {editMote ? (
                          <input type="text" value={value} className="p-2 rounded-md border-2 broder-black" onChange={onChange} />
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
              <TableRow>
                <TableCell
                  colSpan={headers.length + 1}
                  className="font-medium overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black"
                >
                  <p className="text-3xl  font-bold">Nothing is found for your filters</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* ------------------------------- Pagination ------------------------------- */}
        {totalPages != 0 && <TablePagination totalPages={totalPages} />}
      </div>
    );
  }
};

export default ReportPage;
