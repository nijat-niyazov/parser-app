import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { generateLinks } from '@/services-test/api/endpoints';
import { cn } from '@/utils';
import { Pencil } from 'lucide-react';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';

type Item = {
  link: string;
  id: number;
};

const AddLink = () => {
  const [links, setLinks] = useState<Item[]>([]);
  const [link, setLink] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<null | Item>(null);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setLink(e.target.value);
  }

  const ref = useRef<HTMLInputElement>(null);

  function addLinkToList() {
    if (!editItem) {
      const newLink = { id: link.trim().length + 1, link };
      setLinks((prev) => [...prev, newLink]);
    } else {
      setLinks((prev) => prev.map((item) => (item.id === editItem.id ? { ...item, link } : item)));
      setEditItem(null);
    }
    setLink('');
    ref.current?.focus();
  }

  function removeFromList(id: number) {
    setLinks((prev) => prev.filter((link) => link.id !== id));
  }

  function setEditMode(item: Item) {
    setEditItem(item);
    setLink(item.link);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsChecking(true);
    const onyLinks = links.map(({ link }) => link);

    const res = (await generateLinks(onyLinks)) as any;

    if (res?.status === 201) {
      setLink('');
      setLinks([]);
    } else {
      setSuccess(false);
    }
    setShowModal(true);
    setIsChecking(false);
  }

  function handleChange() {
    setShowModal(!showModal);
    setSuccess(true);
  }

  return (
    <div className="bg-main ">
      {/* <div className="h-full w-full bg-main  brightness-50" /> */}

      <Dialog open={showModal} onOpenChange={handleChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{success ? 'Links succesfully sent ✔' : 'Something went wrong. Please try again'} </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"></div>
          </div>
          <DialogFooter>
            <button onClick={handleChange} className="px-4 py-2 rounded-lg text-xl bg-slate-500 text-white">
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="max-w-[600px] mx-auto z-10">
        <form onSubmit={onSubmit} className="flex items-center justify-center gap-2 py-10 ">
          <input
            ref={ref}
            type="text"
            value={link}
            onChange={onChange}
            className="rounded-full px-3 py-2 border-2 border-black/3 grow"
            placeholder="Add your Link here..."
            autoFocus
          />
          <button
            disabled={!link.trim().length}
            // onClick={!editItem ? addLinkToList : updateListItem}
            onClick={addLinkToList}
            type="button"
            className="p-2 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            ➕
          </button>
          <button
            type="submit"
            disabled={links.length === 0 || isChecking || link.trim().length !== 0}
            className="p-2 bg-green-400 rounded-lg font-semibold disabled:opacity-50"
          >
            Generate Links
          </button>
        </form>

        <button
          onClick={() => {
            setLinks([]);
            setEditItem(null);
          }}
          className={cn('my-10 w-full py-2 text-center bg-gray-500 rounded-lg text-white', {
            'opacity-0 pointer-events-none': !links.length,
          })}
        >
          Clear All
        </button>
        <ul className="grid gap-3">
          {links.map(({ link, id }, i) => (
            <li key={i} className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-400 overflow-hidden">
              <p className="grow truncate ">{link}</p>
              <button onClick={() => removeFromList(id)}>❌</button>
              <button onClick={() => setEditMode({ link, id })}>
                <Pencil className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddLink;
