import { Download } from "lucide-react";
import { FormEvent } from "react";

const DownloadFile = () => {
  async function submitDownloadFile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <form onSubmit={submitDownloadFile}>
      <button className="bg-green-400 flex items-center gap-2 text-center p-4 py-2  rounded-md text-white font-semibold my-3">
        Download <Download />
      </button>
    </form>
  );
};

export default DownloadFile;
