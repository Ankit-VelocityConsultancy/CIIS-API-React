import { MobileMenu } from "./MobileMenu";
import { useNavigate } from "react-router-dom";
import { Bell, CircleUser } from "lucide-react";
import { Button } from "../ui/button";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { showLogoutModalAtom } from "@/recoil/atoms";
import {
  accessTokenAtom,
  baseURLAtom,
  isLoggedinAtom,
  refreshTokenAtom,
  useLogOut,
  userIdAtom,
  userTypeAtom,
  usernameAtom,
} from "@/recoil/atoms";
import { Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
// import { useTheme } from "@/components/themeprovider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { Input } from "../ui/input";

export const Header = () => {
  const baseURL = useRecoilValue(baseURLAtom);
  const email = useRecoilValue(usernameAtom);  // This will store the email instead of the username
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const accessToken = useRecoilValue(accessTokenAtom);
  const setShowLogoutModal = useSetRecoilState(showLogoutModalAtom);
  const setAccessToken = useSetRecoilState(accessTokenAtom);
    const setRefreshToken = useSetRecoilState(refreshTokenAtom);
    const setUsername = useSetRecoilState(usernameAtom);
    const setUserType = useSetRecoilState(userTypeAtom);
    const userType = useRecoilValue(userTypeAtom);
    const setUserId = useSetRecoilState(userIdAtom);
    const setLoggedin = useSetRecoilState(isLoggedinAtom);
    // const user_version = useRecoilValue(userVersion);
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

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const passwordSchema = z
    .object({
      new_pass: z
        .string()
        .min(8, { message: "Must be at least 8 characters" })
        .regex(passwordRegex, {
          message:
            "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
        }),
      cnf_pass: z
        .string()
        .min(8, { message: "Must be at least 8 characters" })
        .regex(passwordRegex, {
          message:
            "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
        }),
    })
    .refine((data) => data.new_pass === data.cnf_pass, {
      message: "Passwords don't match",
      path: ["cnf_pass"],
    });

  const form = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const logOut = useLogOut();

  const changePassword = async (payload) => {
    setLoading(true);
    try {
      await axios.post(`${baseURL}change-password-api/`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setLoading(false);
      toast({
        title: `Password Changed Successfully`,
        description: "You are redirected to login page",
      });
      logOut();
    } catch (error) {
      toast({
        title: "Something went wrong",
      });
      setLoading(false);
    }
  };

  const test = true;

  return (
    <div className="header-wrapper flex justify-end items-center gap-4 md:justify-end p-3 border-b-[1px] sticky top-0 z-[5] backdrop-blur">
      <MobileMenu className="md:hidden cursor-pointer mr-auto" />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="bell-wrapper relative cursor-pointer">
            <Bell />
            {test && (
              <span className="absolute flex h-3 w-3 top-0 right-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full dark:bg-white bg-stone-800 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-stone-950 dark:bg-white"></span>
              </span>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="capitalize">
            Notification
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {test ? (
            <DropdownMenuItem>MLR</DropdownMenuItem>
          ) : (
            <DropdownMenuItem>Nothing here</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="capitalize">
            {email ? email : "Anonymous"} {/* Display email instead of username */}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Dialog>
            <DialogTrigger asChild>
              <div className="p-2 cursor-pointer text-sm">Change Password</div>
            </DialogTrigger>
            <DialogContent className="gap-8 sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Change password</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  method="post"
                  className="space-y-5"
                  onSubmit={form.handleSubmit(changePassword)}
                >
                  <div className="flex flex-col space-y-1.5">
                    <FormField
                      control={form.control}
                      name="new_pass"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <FormField
                      control={form.control}
                      name="cnf_pass"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm Password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="button-wrapper flex justify-end">
                    <Button disabled={loading} type="submit">
                      {loading && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {loading ? "Changing..." : "Change"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          {userType === "Admin" ? (
          <DropdownMenuItem
            onClick={() => logOut()}
            className="text-destructive cursor-pointer focus:text-destructive"
          >
            Logout
          </DropdownMenuItem>
        ) :  (
          <DropdownMenuItem
            onClick={() => setShowLogoutModal(true)}
            className="text-destructive cursor-pointer focus:text-destructive"
          >
            Logout
          </DropdownMenuItem>
        ) }

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
