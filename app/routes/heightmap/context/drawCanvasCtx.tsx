import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type drawState = {
  url_data: string;
  setUrlData: Dispatch<SetStateAction<string>>;
  restoreOriginalTerrain: boolean;
  setRestoreOriginalTerrain: Dispatch<SetStateAction<boolean>>;
};
const drawContext = createContext<drawState>({
  restoreOriginalTerrain: false,
  url_data: "",
} as drawState);

export function DrawContextProvider({ children }: { children: ReactNode }) {
  const [urlData, setUrlData] = useState<string>("");
  const [restoreOriginalTerrain, setRestoreOriginalTerrain] = useState(false);
  return (
    <drawContext.Provider
      value={{
        url_data: urlData,
        setUrlData,
        restoreOriginalTerrain,
        setRestoreOriginalTerrain,
      }}
    >
      {children}
    </drawContext.Provider>
  );
}

export function useDrawContext() {
  const state = useContext(drawContext);
  if (!state)
    throw new Error("useDrawContext hook should be used inside provider.");

  return state;
}
