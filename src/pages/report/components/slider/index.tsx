import React, { useEffect, useState } from "react";

import { Slider } from "@/components/ui/slider";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/utils";
import { useSearchParams } from "react-router-dom";

type SliderProps = React.ComponentProps<typeof Slider>;
const SelectShownCount = ({ className, ...props }: SliderProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(
    searchParams.get("limit") ? parseInt(searchParams.get("limit")) : 50
  );

  const debounced = useDebounce(value, 1000);

  useEffect(() => {
    searchParams.set("limit", debounced.toString());
    setSearchParams(searchParams);
  }, [debounced]);

  return (
    <div className="flex gap-2 text-white">
      <Slider
        defaultValue={[value]}
        onValueChange={(v: number[]) => {
          console.log(v);

          setValue(v[0]);
        }}
        max={100}
        step={1}
        className={cn("w-80 ", className)}
        {...props}
      />
      <p>Show {value}</p>
    </div>
  );
};

export default SelectShownCount;
