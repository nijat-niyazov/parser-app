import { formatDate as formatDateHelper } from 'date-fns';

function formatDate(date: Date) {
  return formatDateHelper(date, 'yyyy-MM-dd');
}

export default formatDate;
