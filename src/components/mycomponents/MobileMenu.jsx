import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
} from "lucide-react";
import { Menu } from "lucide-react";
import { Navigation } from "./Navigation";

export function MobileMenu({className}) {
  return (
    <div className={`mobile-menu-wrapper ${className}`}>
      <Sheet>
        <SheetTrigger asChild>
          <Menu size={30}/>
        </SheetTrigger>
        <SheetContent side={"left"} className="pt-12 w-auto">
          <Navigation
            isCollapsed={false}
            links={[
              {
                title: "Dashboard",
                label: "",
                icon: LayoutDashboard,
                variant: "ghost",
                to: ""
              }
            ]}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
