import { companyAtom } from "@/recoil/atoms";
import { BookText, Bug } from "lucide-react";
import { useRecoilValue } from "recoil";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Link } from "react-router-dom";

export const Footer = () => {
  const companyName = useRecoilValue(companyAtom);

  const currentYear = new Date().getFullYear();

  return (
    // <div className="footer-wrapper text-center p-3 border-t-[1px] fixed bottom-0 w-full backdrop-blur">

    <div className="footer-wrapper flex justify-between p-3 border-t-[1px]">
      <div className="guide-report-wrapper flex gap-2">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={"/user-guide"}>
                <BookText />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>User Guide</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={"/user-feedback"}>
                <Bug />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Report a Software Issue</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p>
        © {currentYear} {companyName}. All rights reserved.
      </p>
    </div>
  );
};
