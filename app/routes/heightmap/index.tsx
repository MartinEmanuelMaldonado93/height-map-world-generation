import { useEffect } from "react";
import { Game } from "./game";

export default function Index() {
  useEffect(() => {
    new Game();
  }, []);
  return (
    <div>
      <h1>Height map route</h1>
      <div id="target"></div>
    </div>
  );
}
