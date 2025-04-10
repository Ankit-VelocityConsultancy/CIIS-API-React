import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { NavLink } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import "./Navigation.css";

export function Navigation({ link, isCollapsed, title, icon, props }) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 data-[collapsed=true]"
    >
      <nav className="grid gap-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]">
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to={link}
                  className={cn(
                    buttonVariants({
                      size: "icon",
                    }),
                    "h-9 w-9 navigation-links dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                >
                  <div className="icon-wrapper">{icon}</div>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {title}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <NavLink
            to={link}
            {...props}
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-9 navigation-links bg-muted text-black hover:text-white dark:hover:bg-muted dark:text-white overflow-hidden shadow-none justify-start text-base px-2 space-y-2"
            )}
          >
            <div className="icon-wrapper">{icon}</div>
            {title}
          </NavLink>
        )}
      </nav>
    </div>
  );
}
