import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useDebounce from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TableHead } from "../ui/table";

type Props = {
  data: { [key: string]: string | number | null }[];

  label: { label: string; queryParam: string };
};

const TH = ({ data, label }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeLabel = searchParams.get("key");
  const searchValue = searchParams.get("value") as string;

  const [query, setQuery] = useState<string>(
    activeLabel === label.queryParam ? searchValue : ""
  );

  const debounced = useDebounce(query, 500);

  useEffect(() => {
    if (debounced) {
      searchParams.set("key", label.queryParam);
      searchParams.set("value", debounced.toString());
    } else {
      searchParams.delete(label.queryParam);
    }
    setSearchParams(searchParams);
  }, [debounced]);

  return (
    <TableHead className="w-auto whitespace-nowrap overflow-hidden border-r-[0.5px] border-b-[0.5px] border-black text-black p-0">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 w-full h-full bg-blue-300 p-4">
            {label.label}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 max-h-[500px] overflow-y-auto">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Dimensions</h4>
              <p className="text-sm text-muted-foreground">
                Set the dimensions for the layer.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-4">
                <button className="flex-1 bg-green-400">ASC</button>
                <button className="flex-1 bg-red-400">DESC</button>
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
                <Input
                  id="replace"
                  defaultValue="300px"
                  className="col-span-2 h-8"
                />
              </div>

              <ul className="grid gap-2 ">
                {data.map((item: any, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-balance">
                    <Input
                      id={`${label.queryParam}-${label.label}`.toLowerCase()}
                      className="w-5 h-5"
                      type="checkbox"
                    />
                    <Label
                      htmlFor={`${label.queryParam}-${label.label}`.toLowerCase()}
                      className="text-balance"
                    >
                      {i + 1}. {item[label.queryParam]}
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
