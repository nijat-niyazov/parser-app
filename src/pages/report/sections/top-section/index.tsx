import { FormulaType } from '@/services/api/endpoints';
import DownloadFile from './download';
import Formulas from './formulas';

const TopSection = ({ formulas, refetchFormulas }: { refetchFormulas: any; formulas: FormulaType[] }) => {
  return (
    <section className="flex items-center gap-4">
      <Formulas refetchFormulas={refetchFormulas} formulas={formulas} />
      <DownloadFile />
    </section>
  );
};

export default TopSection;
