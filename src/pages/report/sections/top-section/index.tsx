import { FormulaType } from '@/services/api/endpoints';
import DownloadFile from './download';
import Formulas from './formulas';

const TopSection = ({ formulas }: { formulas: FormulaType[] }) => {
  return (
    <section className="flex items-center gap-4">
      <Formulas formulas={formulas} />
      <DownloadFile />
    </section>
  );
};

export default TopSection;

// import DownloadFile from './download';
// import Formulas from './formulas';

// const TopSection = () => {
//   return (
//     <section className="flex items-center gap-4">
//       <Formulas />
//       <DownloadFile />
//     </section>
//   );
// };

// export default TopSection;
