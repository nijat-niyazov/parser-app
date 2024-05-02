import { ReactNode, createContext, useContext, useState } from 'react';

export type GlobalContent = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
};

const MyGlobalContext = createContext<GlobalContent>({
  enabled: false,
  setEnabled: () => {},
  editMode: false,
  setEditMode: () => {},
});

const GlobaProvider = ({ children }: { children: ReactNode }) => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  const data = { enabled, setEnabled, editMode, setEditMode };

  return <MyGlobalContext.Provider value={data}>{children}</MyGlobalContext.Provider>;
};

export const useGenerateReport = () => useContext(MyGlobalContext) as GlobalContent;

export default GlobaProvider;
