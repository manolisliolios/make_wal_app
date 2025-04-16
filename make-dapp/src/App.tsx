import { ConnectButton } from "@mysten/dapp-kit";
import { EditorLayout } from "./components/editor-layout";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import "./index.css";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <NavigationMenu className="border-b">
        <NavigationMenuList className="px-4 py-2">
          <NavigationMenuItem>
            <NavigationMenuLink>Link</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <ConnectButton />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <EditorLayout className="flex-grow" />
    </div>
  );
}

export default App;
