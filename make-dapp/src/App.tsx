import { ConnectButton } from "@mysten/dapp-kit";
import { EditorLayout } from "./components/editor-layout";
import { Versions } from "./components/versions";
import "./index.css";

function App() {
  return (
    <>
      <div className="flex w-screen h-screen justify-start">
        <Versions className="hidden md:flex" />
        <EditorLayout />
      </div>
    </>
  );
}

export default App;
