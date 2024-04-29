import { Input } from '@/components/ui/input';
import { cn } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { Spinner } from '../report/sections/top-section/formulas';
import ActionMessage from './ActionMessage';

type Item = {
  link: string;
  id: number;
};

const HomePage = () => {
  const [links, setLinks] = useState<Item[]>([]);

  // const [success, setSuccess] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<null | Item>(null);

  const ref = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState<string>(editItem?.link || '');

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setLink(e.target.value);
  }

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

  const [showModal, setShowModal] = useState<boolean>(false);
  const { data, error, isPending, isSuccess, mutate, reset } = useMutation({
    mutationFn: async (links: string[]) =>
      await new Promise<{ status: number; data: { code: number; message: string } }>((resolve, reject) =>
        // setTimeout(() => resolve({ status: 201, data: { code: 200, message: 'Links succesfully sent ✔' } }), 2000)
        setTimeout(() => reject({ status: 400, data: { code: 400, message: 'Something went wrong ' } }), 2000)
      ),
    // generateLinks(links),
    onSuccess: (comingData) => {
      if (comingData.data.code === 200) {
        setShowModal(true);
      }
    },
    onError: (comingError) => {
      console.log({ comingError });

      // if (comingError?.data.code === 400) {
      //   setShowModal(true);
      // }
    },
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const onlyLinks = links.map(({ link }) => link);

    mutate(onlyLinks);
  }

  function handleChange() {
    setShowModal(!showModal);
    // setSuccess(true);
  }

  return (
    <div className="bg-main h-full">
      <ActionMessage handleChange={handleChange} success={isSuccess} showModal={showModal} />

      <div className="max-w-[700px] mx-auto z-10">
        <form onSubmit={onSubmit} className="flex items-center justify-center gap-2 py-10 ">
          <Input
            ref={ref}
            type="text"
            value={link}
            onChange={onChange}
            className="px-3 py-2 flex-1 text-base"
            placeholder="Add your Link here..."
            autoFocus
          />
          <button
            disabled={!link.trim().length}
            // onClick={!editItem ? addLinkToList : updateListItem}
            onClick={addLinkToList}
            type="button"
            className="p-2 bg-sky-600 rounded-md disabled:opacity-50"
          >
            <Plus className="text-white" />
          </button>
          <button
            type="submit"
            disabled={links.length === 0 || isPending || link.trim().length !== 0}
            className="p-2 bg-green-600 text-white rounded-md font-semibold disabled:opacity-50 min-w-32"
          >
            {!isPending ? 'Generate Links' : <Spinner />}
          </button>
        </form>

        <ul className="grid gap-3">
          {links.map(({ link, id }, i) => (
            <li
              key={i}
              className={cn('flex items-center gap-2 px-3 py-1 rounded-md bg-white shadow-lg drop-shadow-2xl overflow-hidden  ', {
                'brightness-50 pointer-events-none': editItem?.id === id,
              })}
            >
              <p className="grow truncate ">{link}</p>
              <button className="bg-red-600 hover:bg-red-800 rounded-md p-1" onClick={() => removeFromList(id)}>
                <Trash2 className="text-white" />
              </button>
              <button className="bg-lime-600 hover:bg-lime-800 rounded-md p-1" onClick={() => setEditItem({ link, id })}>
                <Pencil className="text-white" />
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => {
            setLinks([]);
            setEditItem(null);
          }}
          className={cn('mt-5 w-full py-2 text-center bg-red-600 hover:bg-red-500 font-bold uppercase rounded-lg text-white', {
            'opacity-0 pointer-events-none': !links.length,
          })}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default HomePage;
