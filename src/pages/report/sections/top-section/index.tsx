import { DownloadFile, Formulas } from '../../components';

const TopSection = () => {
  return (
    <section className="flex items-center gap-4">
      <Formulas />
      <DownloadFile />
    </section>
  );
};

export default TopSection;
