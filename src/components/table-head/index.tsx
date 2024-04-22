import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useDebounce from "@/hooks/useDebounce";
import { PropertyType, SearchQuery } from "@/pages/report";
import { cn } from "@/utils";
import getUniqueValues from "@/utils/uniqueValues";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TableHead } from "../ui/table";

type Props = {
  data: PropertyType[];
  label: { label: string; queryParam: string };
  searchedFields: SearchQuery[];
  addNewQuery: (items: SearchQuery[]) => void;
};

const TH = ({ data, label, addNewQuery, searchedFields }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [operation, setOperation] = useState({ index: 0, name: "Equals" });

  const activeLabel = searchParams.get("key");
  const searchValue = searchParams.get("value") as string;

  const [query, setQuery] = useState<string>(activeLabel === label.queryParam ? searchValue : "");

  const debounced = useDebounce(query, 500);

  useEffect(() => {
    const newQuery = {
      key: label.queryParam,
      operation: operation.name,
      value: debounced,
    };

    const alreadyAdded = searchedFields.some((queryObj) => queryObj.key === newQuery.key);

    const items = debounced
      ? alreadyAdded
        ? searchedFields.map((queryObj) => (queryObj.key === label.queryParam ? newQuery : queryObj))
        : [...searchedFields, newQuery]
      : searchedFields.filter((queryObj) => queryObj.key !== newQuery.key);

    addNewQuery(items);

    if (items.length) {
      searchParams.set("search", JSON.stringify(items));
    } else {
      searchParams.delete("search");
    }

    setSearchParams(searchParams);
  }, [debounced, operation]);

  const uniqueValues = useMemo(() => getUniqueValues(data.map((item) => item[label.queryParam as keyof typeof item])), []);
  const filteredUniqeValues = useMemo(() => uniqueValues.filter((item) => item.toString().includes(query)), [query]);

  return (
    <TableHead className="w-auto whitespace-nowrap overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black text-black p-0">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 w-full h-full bg-blue-300 p-4">{label.label}</button>
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
                {["Equals", "Starts with", "Ends with", "Contains", "Greater Than", "Less Than"].map((operationLabel, i) => (
                  <button
                    key={i}
                    disabled={!query}
                    onClick={() => setOperation({ index: i, name: operationLabel })}
                    className={cn("flex-1 bg-gray-400 disabled:opacity-50", {
                      "bg-green-400": operation.index === i,
                    })}
                  >
                    {operationLabel}
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
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="replace">Replace</Label>
                <Input id="replace" defaultValue="300px" className="col-span-2 h-8" />
              </div>

              <ul className="grid gap-2 ">
                {filteredUniqeValues.map((item: string | number, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-balance">
                    <Input
                      // id={`${label.queryParam}-${label.label}`.toLowerCase()}
                      className="w-5 h-5"
                      type="checkbox"
                    />
                    <Label htmlFor={`${label.queryParam}-${label.label}`.toLowerCase()} className="text-balance">
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
