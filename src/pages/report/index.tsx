import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getReportData } from "@/services-test/api/endpoints";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";

import { cn } from "@/utils";
import { useSearchParams } from "react-router-dom";
import TableActions from "./sections/table-actions";
import TopSection from "./sections/top-section";

const defaultParams = {
  limit: "50",
  offset: "1",
};

const ReportPage = () => {
  const [searchParams, setSearchParams] = useSearchParams(defaultParams);
  const params = Object.fromEntries(searchParams.entries());

  const { isPending, error, data, isPlaceholderData, isFetching } = useQuery({
    queryKey: ["repoData", searchParams.toString()],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return await getReportData(params);
    },
    placeholderData: keepPreviousData,
  });

  const loading = isPending && isFetching;

  const [selecteds, setSelecteds] = useState<string[]>([]);
  const [isEditMote, setIsEditMote] = useState<boolean>(false);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, checked } = e.target;

    const selectedOptions = checked
      ? [...selecteds, value]
      : selecteds.filter((item) => item !== value);

    setSelecteds(selectedOptions);
  }

  const [mode, setMode] = useState<null | "ASC" | "DESC">(null);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="p-10 ">
      <TopSection />

      <TableActions />

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
            {Object.keys(data.data[0]).map((label, i) => (
              <TableHead
                className="w-auto whitespace-nowrap overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black "
                key={i}
              >
                <span className="flex items-center gap-2">{label}</span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.map(
            (invoice: { [key: string]: string | number | null }) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium w-auto whitespace-nowrap overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black">
                  <input
                    // name={`${invoice.id}`}
                    // id={`${invoice.id}`}
                    onChange={onChange}
                    checked={selecteds.includes("all")}
                    type="checkbox"
                    className="w-5 h-5"
                  />
                </TableCell>
                {Object.values(invoice).map((value, i) => {
                  return (
                    <TableCell
                      key={i}
                      className="font-medium w-auto whitespace-nowrap overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black"
                    >
                      {isEditMote ? (
                        <input
                          type="text"
                          value={value ?? ""}
                          className="p-2 rounded-md border-2 broder-black"
                        />
                      ) : (
                        value ?? ""
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            )
          )}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>

      {/* <TablePagination /> */}
    </div>
  );
};

export default ReportPage;
