import React, { useEffect, useRef, useState } from 'react';

import { Slider } from '@/components/ui/slider';
import useDebounce from '@/hooks/useDebounce';
import { cn } from '@/utils';
import { defaultSearchParams } from '@/utils/constants/defaultSearchParam';
import { useSearchParams } from 'react-router-dom';

type SliderProps = React.ComponentProps<typeof Slider>;

const SelectShownCount = ({ className, ...props }: SliderProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const settedCounts = searchParams.has('limit') ? parseInt(searchParams.get('limit') as string) : +defaultSearchParams.limit;

  const [value, setValue] = useState(settedCounts);

  const debounced = useDebounce(value, 500);
  const isMountingRef = useRef(true);

  useEffect(() => {
    if (isMountingRef.current) {
      isMountingRef.current = false;
      return;
    }

    searchParams.set('limit', debounced.toString());
    setSearchParams(searchParams);
  }, [debounced]);

  useEffect(() => {
    if (settedCounts === +defaultSearchParams.limit) {
      setValue(+defaultSearchParams.limit);
    }
  }, [settedCounts]);

  function changeCount(v: number[]) {
    setValue(v[0]);
  }

  return (
    <div className="flex gap-2 text-white">
      <Slider value={[value]} onValueChange={changeCount} min={1} max={100} step={1} className={cn('w-56 ', className)} {...props} />
      <p>Show {value}</p>
    </div>
  );
};

export default SelectShownCount;
