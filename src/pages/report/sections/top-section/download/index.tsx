import { generateReports } from '@/services/api/endpoints';
import { cn, formatDate, generateParams } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { subMonths } from 'date-fns';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spinner } from '../formulas';

const currentDate = new Date();
const monthAgo = subMonths(currentDate, 1);

const defaultParams = {
  search: '[]',
  offset: '0',
  limit: '10',
  orderColumn: '3',
  orderDirection: 'DESC',
  timezone: '+04:00',
  fromDate: formatDate(monthAgo),
  toDate: formatDate(currentDate),
};

export type PropertyType = { [key: string]: string | number };

export type SearchQuery = { key: string; operation: string; value: string };

const DownloadFile = () => {
  const [searchParams, setSearchParams] = useSearchParams(defaultParams);

  const params = generateParams(Object.fromEntries(searchParams.entries()));
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(false);
  }, [searchParams.toString()]);

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['reportsGenerate', searchParams.toString()],
    queryFn: () => generateReports(params),
    enabled,
  });

  function downloadFile() {
    if (error || data?.status === 500) {
      return alert(data?.data.message);
    } else if (!error && data) {
      const {
        data: { data: file },
      } = data;

      const filename = 'Report.xlsx';
      const b64string = file;

      const link = document.createElement('a');
      link.setAttribute('download', filename);
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${b64string}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => (!enabled ? setEnabled(true) : downloadFile())}
        disabled={isFetching}
        className={cn(
          ' flex min-w-36  items-center gap-2 text-center p-4 py-2  rounded-md text-white font-semibold my-3 disabled:opacity-50',
          {
            'bg-green-600': enabled && data,
            'bg-orange-500': !enabled,
          }
        )}
      >
        {!enabled ? (
          'Generate Report'
        ) : isFetching ? (
          <Spinner />
        ) : (
          <>
            Download <Download />
          </>
        )}
      </button>

      {/* <a download={'yeni.xlsx'} href={`data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${data?.data.data}`}>
        {!enabled ? (
          'Generate Report'
        ) : isFetching ? (
          <Spinner />
        ) : (
          <>
            Download <Download />
          </>
        )}
      </a> */}
    </>
  );
};

export default DownloadFile;
