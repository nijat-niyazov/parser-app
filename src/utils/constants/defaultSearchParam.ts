import { subMonths } from 'date-fns';
import formatDate from '../helpers/formatDate';

const currentDate = new Date();
const monthAgo = subMonths(currentDate, 1);

export const defaultSearchParams = {
  search: '[]',
  offset: '0',
  limit: '10',
  orderColumn: '3',
  orderDirection: 'DESC',
  timezone: '+04:00',
  fromDate: formatDate(monthAgo),
  toDate: formatDate(currentDate),
};
