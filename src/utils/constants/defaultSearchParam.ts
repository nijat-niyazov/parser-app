import { subMonths } from 'date-fns';
import formatDate from '../helpers/formatDate';

export const currentDate = new Date();
export const monthAgo = subMonths(currentDate, 1);

export const defaultSearchParams = {
  search: '[]',
  offset: '0',
  limit: '10',
  orderColumn: '1',
  orderDirection: 'DESC',
  // timezone: '+04:00',
  fromDate: formatDate(monthAgo),
  toDate: formatDate(currentDate),
};
