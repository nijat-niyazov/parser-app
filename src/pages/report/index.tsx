import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getReportData } from "@/services-test/api/endpoints";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";

import TH from "@/components/table-head";
import { cn } from "@/utils";
import { useSearchParams } from "react-router-dom";
import { TablePagination } from "./components";
import TableActions from "./sections/table-actions";
import TopSection from "./sections/top-section";
import { headers } from "./static";

const defaultParams = {
  // limit: "50",
  // offset: "1",
};

export type PropertyType = { [key: string]: string | number | null };

type ComingData = { data: PropertyType[]; limit: number; offset: number; total: number };

const params = {
  // offset: 1,
  // limit: 10,
  // timezone: "+04:00",
  // fromDate: "2023-02-01",
  // toDate: "2024-03-11",
};

export type SearchQuery = { key: string; operation: string; value: string | number };

const ReportPage = () => {
  const [searchParams, setSearchParams] = useSearchParams(defaultParams);

  const searchedItems = searchParams.get("search") ? JSON.parse(searchParams.get("search") as string) : [];

  const [changed, setChanged] = useState<SearchQuery[]>(searchedItems);

  function addNewQuery(items: SearchQuery[]) {
    setChanged(items);
  }

  // const params2 = Object.assign(Object.fromEntries(searchParams.entries()), { search: searchedItems });
  const params2 = Object.fromEntries(searchParams.entries());

  const parames = {
    search: [
      {
        key: "brandName",
        operation: "Equals",
        value: "bershka",
      },
    ],
  };

  // const queryParams = JSON.stringify(parames);
  // const test = queryString.parse("foo={'name':1},{'name':2},{'name':3}", { arrayFormat: "comma" });
  const myParams = JSON.stringify(params2);

  // console.log("queryParams", queryParams, "\n", "myParams", myParams, "\n", "test", test);
  console.log(
    "params2",
    params2,
    "\n",
    "myParams",
    myParams,
    "\n",
    "Myparsed",
    JSON.parse(JSON.stringify(myParams)),
    "\n",
    "parsed",
    JSON.parse(JSON.stringify(parames))
  );

  // const str =
  //   '{"limit":"50","search":"[{\\"key\\":\\"brandName\\",\\"operation\\":\\"Equals\\",\\"value\\":\\"bershla\\"}]"}';
  //  JSON.parse(str),

  // console.log(parames.search, "\n", params2, "\n", );
  // console.log(JSON.parse(queryParams).search, );

  const { isPending, error, data, isPlaceholderData, isFetching } = useQuery<ComingData>({
    queryKey: ["repoData", searchParams.toString()],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return await getReportData(params2);
    },
    placeholderData: keepPreviousData,
  });

  // const [isEditMote, setIsEditMote] = useState<boolean>(false);
  const [selecteds, setSelecteds] = useState<string[]>([]);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, checked } = e.target;

    const selectedOptions = checked ? [...selecteds, value] : selecteds.filter((item) => item !== value);

    setSelecteds(selectedOptions);
  }

  const loading = isPending && isFetching;
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  const editDisabled = !selecteds.length;
  const deleteDisabled = !selecteds.length;
  const savedDisabled = !selecteds.length;

  return (
    <div className="p-10  bg-slate-200 min-h-screen">
      <TopSection />

      <TableActions disabledButtons={{ editDisabled, deleteDisabled, savedDisabled }} />

      <Table
        className={cn("", {
          "opacity-20  pointer-events-none": isPlaceholderData && isFetching,
        })}
      >
        <TableHeader>
          <TableRow>
            <TableHead className="border-r-[0.5px] border-b-[0.5px] border-black">
              <input
                // name="all"
                // id="all"
                value="all"
                onChange={onChange}
                checked={selecteds.includes("all")}
                type="checkbox"
                className="w-5 h-5 "
              />
            </TableHead>
            {headers.map((label, i) => (
              <TH changed={changed} addNewQuery={addNewQuery} key={i} data={data?.data as PropertyType[]} label={label} />
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data.map((property) => (
            <TableRow key={property.id}>
              <TableCell className="font-medium w-auto whitespace-nowrap overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black">
                <input
                  // name={`${property.id}`}
                  // id={`${property.id}`}
                  onChange={onChange}
                  checked={selecteds.includes("all")}
                  type="checkbox"
                  className="w-5 h-5"
                />
              </TableCell>
              {headers.map(({ queryParam }, i) => (
                <TableCell
                  key={i}
                  className="font-medium w-auto whitespace-nowrap overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black"
                >
                  {/* {isEditMote ? (
                        <input
                          type="text"
                          value={value ?? ""}
                          className="p-2 rounded-md border-2 broder-black"
                        />
                      ) : (
                        value ?? ""
                      )} */}

                  {property[queryParam] ?? ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow></TableRow>
        </TableFooter>
      </Table>

      <TablePagination
        totalPages={Math.ceil(
          // (data?.total as number) / (data?.limit as number)
          77 / 10
        )}
      />
    </div>
  );
};

export default ReportPage;
