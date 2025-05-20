import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

export const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="dashboard-container">
      <div className="flex">
        <div
          className={`sidebar-container border-r-[1px] hidden md:block min-h-svh sticky top-0 self-start z-10 transition-all ${
            isCollapsed ? "w-[80px]" : "w-[15%]"
          }`}
        >
          <div className="h-svh overflow-auto">
            <Sidebar
              className="mr-auto"
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          </div>
        </div>

        <div
          className={`header-footer-content-wrapper transition-all ${
            isCollapsed ? "w-[calc(100%-80px)]" : "w-100 md:w-[85%]"
          } relative`}
        >
            <Header />
            <div className="content-wrapper md:!p-8 p-3">
              <Outlet />
            </div>
            <Footer />
        </div>
      </div>
    </div>
  );
};
