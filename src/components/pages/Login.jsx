import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../../assets/images/btulogo.png'; // Added by tejasvi 2-12-2024
import loginBg from '../../assets/images/login-bg.png'; // Added by tejasvi 2-12-2024
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  accessTokenAtom,
  baseURLAtom,
  isLoggedinAtom,
  refreshTokenAtom,
  userIdAtom,
  userTypeAtom,
  userVersion,
  useremailAtom,
  usernameAtom,
} from "../../recoil/atoms";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { OtpInput } from "../ui/otpinput";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Alert, AlertTitle } from "../ui/alert";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export function Login() {
  const setAccessToken = useSetRecoilState(accessTokenAtom);
  const setRefreshToken = useSetRecoilState(refreshTokenAtom);
  const setUsername = useSetRecoilState(usernameAtom);
  const setUseremail = useSetRecoilState(useremailAtom);
  const setUserType = useSetRecoilState(userTypeAtom);
  const setUserId = useSetRecoilState(userIdAtom);
  const setUserVersion = useSetRecoilState(userVersion);
  const setLoggedin = useSetRecoilState(isLoggedinAtom);
  const accessToken = useRecoilValue(accessTokenAtom);
  const refreshToken = useRecoilValue(refreshTokenAtom);
  const name = useRecoilValue(usernameAtom);
  const email = useRecoilValue(useremailAtom);
  const version = useRecoilValue(userVersion);
  const usertype = useRecoilValue(userTypeAtom);
  const userid = useRecoilValue(userIdAtom);
  const baseURL = useRecoilValue(baseURLAtom);
  const [loading, setLoading] = useState(false);
  const [wrongPass, setWrongPass] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (localStorage.getItem("is_login") === "true") {
      navigate("/"); // Redirect to home page if the user is already logged in
    }
  }, [navigate]);

  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const showForgotPassword = () => {
    setShowForgotPasswordPopup(true);
  };

  const loginUser = async (payload) => {
    try {
      setLoading(true);
  
      // Make API request
      const response = await axios.post(`${baseURL}api/login/`, payload);
  
      if (response.status === 200 || response.status === 201) {
        setLoading(false);
        const { token, name, user_id, email, is_user, version } = response.data;
  
        // Save to Recoil and localStorage
        setAccessToken(token.access);
        setRefreshToken(token.refresh);
        setUsername(name);
        setUserId(user_id);
        setUseremail(email);
        setUserType(is_user ? "User" : "Admin");
        setUserVersion(version);
        setLoggedin(true);
  
        // Save data to localStorage
        localStorage.setItem("access", token.access); // Save token directly as string
        localStorage.setItem("refresh", token.refresh); // Save token directly as string
        localStorage.setItem("username", name); // Store name as string
        localStorage.setItem("useremail", email); // Store email as string
        localStorage.setItem("user_type", is_user ? "User" : "Admin"); // Store user type as string
        localStorage.setItem("user_id", user_id); // Store user id as string
        localStorage.setItem("version", version); // Store version as string
        localStorage.setItem("is_login", "true");
  
        setShowPopup(true);
        navigate("/"); // Redirect after login
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        const errorMessage = error.response.data.error;
        toast({
          title: "Error",
          description: errorMessage,
        });
      } else {
        console.log("An error occurred: ", error.response?.status || error.message);
      }
    }
  };
  

  const forgetPassword = async (payload) => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseURL}api/forgotpassword/`, payload);
      if (response.status === 200 || response.status === 201) {
        setLoading(false);
        setShowForgotPasswordPopup(false);
        toast({
          title: response.data.message,
        });
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        const errorMessage = error.response.data.error;
        toast({
          title: "Error",
          description: errorMessage,
        });
      } else {
        console.log("An error occurred: ", error.response?.status || error.message);
      }
    }
  };

  return (
    <div
      className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-1 h-svh"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex items-center justify-center py-12">
        <Card className="mx-auto min-w-[550px] max-w-lg p-6 rounded-3xl">
          <CardHeader>
            <div className="d-flex justify-content-center mb-3">
              <img src={logo} alt="Logo" className="logo" />
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="grid gap-2 space-y-4"
                method="post"
                onSubmit={form.handleSubmit(loginUser)}
              >
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Email Address"
                            type="email"
                            {...field}
                            className="p-4" // Add padding to the input
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Password"
                            className="bg-white dark:bg-transparent p-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center">
                    <Link
                      className="ml-auto inline-block text-sm underline cursor-pointer"
                      onClick={showForgotPassword}
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300 p-4"
                >
                  {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Logging in..." : "Login"}
                </Button>
                {wrongPass ? (
                  <Alert variant="destructive">
                    <AlertTitle className="mb-0">{wrongPass}</AlertTitle>
                  </Alert>
                ) : null}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Forgot Password Popup */}
      <Dialog open={showForgotPasswordPopup} onOpenChange={setShowForgotPasswordPopup}>
        <DialogContent className="gap-8 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogDescription>
              Enter your email address to receive a password reset link.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(forgetPassword)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email Address" {...field} className="p-4" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="mt-4">
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
