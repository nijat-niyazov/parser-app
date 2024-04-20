import { FormEvent } from "react";

const DownloadFile = () => {
  async function submitDownloadFile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // const data = await downloadFle()
  }
  return (
    <form onSubmit={submitDownloadFile}>
      <button className="bg-green-400 w-40 text-center p-2  rounded-md text-white font-semibold my-3">
        Download Data
      </button>
    </form>
  );
};

export default DownloadFile;
