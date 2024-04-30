import DownloadFile from './download';
import Formulas from './formulas';

const TopSection = () => {
  return (
    <section className="flex items-center gap-4">
      <Formulas />
      <DownloadFile />
    </section>
  );
};

export default TopSection;
