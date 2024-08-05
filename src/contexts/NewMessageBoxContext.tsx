import { createContext, useContext, useState } from 'react';
import { ChildrenType } from '../types/children-type';

interface NewMessageBoxContextType {
  newMessageBox: boolean;
  setNewMessageBox: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewMessageBoxContext = createContext<NewMessageBoxContextType>({
  newMessageBox: false,
  setNewMessageBox: () => {},
});

export const useNewMessageBoxContext = () => {
  const context = useContext(NewMessageBoxContext);
  if (context === null) {
    throw new Error(
      'useNewMessageBoxContext must be used within a NewMessageBoxContextProvider',
    );
  }
  return context;
};

export const NewMessageBoxContextProvider = ({ children }: ChildrenType) => {
  const [newMessageBox, setNewMessageBox] = useState<boolean>(false);

  return (
    <NewMessageBoxContext.Provider value={{ newMessageBox, setNewMessageBox }}>
      {children}
    </NewMessageBoxContext.Provider>
  );
};
