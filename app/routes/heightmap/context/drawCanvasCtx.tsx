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
  loadingDraw? : boolean;
};
const drawContext = createContext<drawState>({} as drawState);

export function DrawContextProvider({ children }: { children: ReactNode }) {
  const [urlData, setUrlData] = useState<string>("");

  return (
    <drawContext.Provider value={{ url_data: urlData, setUrlData }}>
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
