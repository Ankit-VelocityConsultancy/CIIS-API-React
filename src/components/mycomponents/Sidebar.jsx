import { useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import {
  LayoutDashboard,
  ChevronLeftIcon,
  Hexagon,
  ArrowLeftRight,
  Link,
  HandCoins,
  FileSearch,
  DollarSign,
  LogOut,
  User,
  UserCog,
  Grid3X3,
  StickyNote,
  CalendarDays,
  NotebookPen,
  CalendarFoldIcon,
  FileText,
  Car,
  ChevronRightIcon,
  ArrowUp,
  FolderKanban,
  Proportions,
  Calculator,
  BookText,
  Bug,
  File,
  ArrowUpFromLine,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  accessTokenAtom,
  baseURLAtom,
  isLoggedinAtom,
  refreshTokenAtom,
  userIdAtom,
  userTypeAtom,
  userVersion,
  usernameAtom,
} from "@/recoil/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { University } from "lucide-react";
// import logo from "../../assets/Images/easytaxreturns_logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Separator } from "../ui/separator";
import logo from '../../assets/images/ciis.png'; // Added by tejasvi 2-12-2024
import { FaHome } from 'react-icons/fa';

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const baseURL = useRecoilValue(baseURLAtom);
  const accessToken = useRecoilValue(accessTokenAtom);
  const [taxYear, setYear] = useState("");
  const setAccessToken = useSetRecoilState(accessTokenAtom);
  const setRefreshToken = useSetRecoilState(refreshTokenAtom);
  const setUsername = useSetRecoilState(usernameAtom);
  const setUserType = useSetRecoilState(userTypeAtom);
  const userType = useRecoilValue(userTypeAtom);
  const setUserId = useSetRecoilState(userIdAtom);
  const setLoggedin = useSetRecoilState(isLoggedinAtom);
  const user_version = useRecoilValue(userVersion);
  const userName = useRecoilValue(usernameAtom);
  const navigate = useNavigate();



  const logoutUser = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUsername(null);
    setUserId(null);
    setUserType(null);
    setLoggedin(false);
    localStorage.clear();
    navigate("/login");
  };


 const university_logo = localStorage.getItem("university_logo");
 
  return (
    <div className="sidebar-wrapper relative space-y-1 scroll-t">
      <Button
        variant="outline"
        className="rounded-s-full z-10 absolute right-0 translate-y-[-100%] w-6 h-6"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {!isCollapsed ? (
          <ChevronLeftIcon className="h-4 w-4 " />
        ) : (
          <ChevronRightIcon className="h-4 w-4 " />
        )}
      </Button>
{ userType == "Admin" ? (
      <div className="logo-wrapper flex items-center gap-3 !mt-8 p-4">
        {!isCollapsed ? (
          <img src={logo} alt="CIIS" className="logo" style={{ width: '120px', height: 'auto' }}/>
        ) : (
          <Hexagon className="m-auto" />
        )}
      </div> ) : null}
       {userType === "Student" && (
         <div className="logo-wrapper flex items-center gap-3 !mt-8 p-4">
        {!isCollapsed ? (
          <img src={university_logo} alt="CIIS" className="logo" style={{ width: '120px', height: '120px' ,borderRadius: "50%"}}/>
        ) : (
          <Hexagon className="m-auto" />
        )}
      </div>
       )}
      <Separator className="my-4" />
   
    
      <div className="sidebar-menu-wrapper px-4 space-y-3 pb-4">
      
        { userType == "Admin" ? (
          <>
            <div className="admin-menu navigation-wrapper space-y-3">
               
            <Badge
              className={`user-wrapper capitalize flex gap-1 items-center p-1 text-base whitespace-nowrap overflow-hidden ${
                isCollapsed && "w-9 m-auto"
              } bg-[#d24845] text-white rounded-lg`}
            >
              <a
                href="/" // Set the link here
                className="flex items-center gap-2 p-2" // Ensuring the flex styling is applied
              >
                <FaHome className={!isCollapsed ? "mr-2" : "m-0"} />
                {!isCollapsed && <span>Dashboard</span>}
              </a>
            </Badge>

               <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger
                    className={`hover:no-underline gap-2 bg-muted rounded-md p-0 h-9 px-2 ${
                      isCollapsed && "w-12 flex- m-auto"
                    }`}
                  >
                    {!isCollapsed && (
                      <span className="flex mr-auto text-base">
                       Student management
                      </span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 space-y-1">
                    <Navigation
                      title="Student Registration"
                      link="/student-register"
                      isCollapsed={isCollapsed}
                    />
                     <Navigation
                      title="Quick Registration"
                      link="/quick-register"
                      isCollapsed={isCollapsed}
                    />
                    {/* <Navigation
                      title="Payment Status"
                      link="/payment-status"
                      isCollapsed={isCollapsed}
                    /> */}
                    {/* <Navigation
                      title="Advanced Search"
                      link="/advanced-search"
                      isCollapsed={isCollapsed}
                    /> */}
                    {/* <Navigation
                      title="Validate"
                      link="/validate"
                      isCollapsed={isCollapsed}
                    /> */}
                  </AccordionContent>
                </AccordionItem>
              </Accordion> 

              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger
                    className={`hover:no-underline gap-2 bg-muted rounded-md p-0 h-9 px-2 ${
                      isCollapsed && "w-12 flex- m-auto"
                    }`}
                  >
                    {!isCollapsed && (
                      <span className="flex mr-auto text-base">
                       View Students
                      </span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 space-y-1">
                    <Navigation
                      title="Registered Students"
                      link="/register-student-view"
                      isCollapsed={isCollapsed}
                    />
                     <Navigation
                      title="Quick Registered Student"
                      link="/quick-register-view"
                      isCollapsed={isCollapsed}
                    />
                    <Navigation
                      title="All Registered Students"
                      link="/all-registered-student"
                      isCollapsed={isCollapsed}
                    />
                      <Navigation
                      title="Cancelled Students"
                      link="/canclled-students"
                      isCollapsed={isCollapsed}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion> 

              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger
                    className={`hover:no-underline gap-2 bg-muted rounded-md p-0 h-9 px-2 ${
                      isCollapsed && "w-12 flex- m-auto"
                    }`}
                  >
                    {!isCollapsed && (
                      <span className="flex mr-auto text-base">
                       Add Course/Subjects
                      </span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 space-y-1">
                    <Navigation
                      title="Add University"
                      link="/university-list"
                      isCollapsed={isCollapsed}
                    />
                    <Navigation
                      title="Add Course"
                      link="/course-list"
                      isCollapsed={isCollapsed}
                    />
                    <Navigation
                      title="Add Stream"
                      link="/stream-list"
                      isCollapsed={isCollapsed}
                    />
                    <Navigation
                      title="Add Sub Stream"
                      link="/sub-stream-list"
                      isCollapsed={isCollapsed}
                    />
                     <Navigation
                      title="Add Subject"
                      link="/subject"
                      isCollapsed={isCollapsed}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion> 


              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger
                    className={`hover:no-underline gap-2 bg-muted rounded-md p-0 h-9 px-2 ${
                      isCollapsed && "w-12 flex- m-auto"
                    }`}
                  >
                    {!isCollapsed && (
                      <span className="flex mr-auto text-base">
                       Other Students
                      </span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 space-y-1">
                      <Navigation
                        title="Add Student"
                        link="/student-register" 
                        isCollapsed={isCollapsed}
                      />
                      <Navigation
                        title="Edit Student"
                        link="/all-registered-student"
                        isCollapsed={isCollapsed}
                      />
                    {/* <Navigation
                      title="View Students"
                      link="/view-student"
                      isCollapsed={isCollapsed}
                    /> */}
                  </AccordionContent>
                </AccordionItem>
              </Accordion> 


              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger
                    className={`hover:no-underline gap-2 bg-muted rounded-md p-0 h-9 px-2 ${
                      isCollapsed && "w-12 flex- m-auto"
                    }`}
                  >
                    {!isCollapsed && (
                      <span className="flex mr-auto text-base">
                       Miscellaneous
                      </span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 space-y-1">
                  <Navigation
                      title="User creation"
                      link="/user-list"
                      isCollapsed={isCollapsed}
                    />
                    <Navigation
                      title="Bulk Data Upload"
                      link="/bulk-data-upload"
                      isCollapsed={isCollapsed}
                    />
                    <Navigation
                      title="Change Course"
                      link="/change-course"
                      isCollapsed={isCollapsed}
                    />
                    {/* <Navigation
                      title="Print Address"
                      link="/print-address"
                      isCollapsed={isCollapsed}
                    /> */}
                    <Navigation
                      title="Change Password"
                      link="/change-password"
                      isCollapsed={isCollapsed}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion> 


              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger
                    className={`hover:no-underline gap-2 bg-muted rounded-md p-0 h-9 px-2 ${
                      isCollapsed && "w-12 flex- m-auto"
                    }`}
                  >
                    {!isCollapsed && (
                      <span className="flex mr-auto text-base">
                       Fees
                      </span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 space-y-1">
                    <Navigation
                      title="Course Fees"
                      link="/course-fees"
                      isCollapsed={isCollapsed}
                    />
                    {/* <Navigation
                      title="Student Fees"
                      link="/student-fees"
                      isCollapsed={isCollapsed}
                    /> */}
                  </AccordionContent>
                </AccordionItem>
              </Accordion> 


              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger
                    className={`hover:no-underline gap-2 bg-muted rounded-md p-0 h-9 px-2 ${
                      isCollapsed && "w-12 flex- m-auto"
                    }`}
                  >
                    {!isCollapsed && (
                      <span className="flex mr-auto text-base">
                       Examination
                      </span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 space-y-1">
                    <Navigation
                      title="Set Examination"
                      link="/setexamination"
                      isCollapsed={isCollapsed}
                    />
                     <Navigation
                      title="Assign Examinations"
                      link="/assign-exam"
                      isCollapsed={isCollapsed}
                    />
                    <Navigation
                      title="Check Result"
                      link="/check-result"
                      isCollapsed={isCollapsed}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion> 


              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger
                    className={`hover:no-underline gap-2 bg-muted rounded-md p-0 h-9 px-2 ${
                      isCollapsed && "w-12 flex- m-auto"
                    }`}
                  >
                    {!isCollapsed && (
                      <span className="flex mr-auto text-base">
                       Master Data
                      </span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 space-y-1">
                  <Navigation
                      title="Payment Modes"
                      link="/payment-modes-list"
                      isCollapsed={isCollapsed}
                    />
                    <Navigation
                      title="Fee Reciept Options"
                      link="/fee-reciept-list"
                      isCollapsed={isCollapsed}
                    />
                     <Navigation
                      title="Add Banks"
                      link="/bank-name-list"
                      isCollapsed={isCollapsed}
                    />
                     <Navigation
                      title="Add Session"
                      link="/session-list"
                      isCollapsed={isCollapsed}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion> 

            </div>
          </>
        ) : null}
       {/* Show only Logout for Student */}
        {userType === "Student" && (
          <div className="logout-wrapper p-2 font-bold text-red-500 flex gap-2 cursor-pointer" onClick={logoutUser}>
            <LogOut className="text-red-500" />
            {!isCollapsed && "Logout"}
          </div>
        )}
      </div>
    </div>
  );
};