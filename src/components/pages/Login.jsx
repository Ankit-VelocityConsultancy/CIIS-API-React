import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../../assets/images/btulogo.png';
import loginBg from '../../assets/images/login-bg.png';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
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
  const baseURL = useRecoilValue(baseURLAtom);
  const [loading, setLoading] = useState(false);
  const [wrongPass, setWrongPass] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (localStorage.getItem("is_login") === "true") {
      navigate("/");
    }
  }, [navigate]);

  const form = useForm({ resolver: zodResolver(loginSchema) });

  const loginUser = async (payload) => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseURL}api/login/`, payload);
      if (response.status === 200 || response.status === 201) {
        const {
          token,
          name,
          user_id,
          email,
          is_student,
          version,
          exam_details,
          examination_data,
        } = response.data;
  
        setAccessToken(token.access);
        setRefreshToken(token.refresh);
        setUsername(name);
        setUserId(user_id);
        setUseremail(email);
        setUserType(is_student ? "Student" : "Admin");
        setUserVersion(version);
        setLoggedin(true);
  
        localStorage.setItem("access", token.access);
        localStorage.setItem("refresh", token.refresh);
        localStorage.setItem("username", name);
        localStorage.setItem("useremail", email);
        localStorage.setItem("user_type", is_student ? "Student" : "Admin");
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("version", version);
        localStorage.setItem("is_login", "true");
  
        console.log("user_type", is_student ? "Student" : "Admin");
  
        if (is_student) {
          // Save student-related data like in StudentExaminationLogin.jsx
          const studentIdToUse = is_student ? response.data.student_id : user_id;          
          localStorage.setItem("student_id", String(studentIdToUse));

          
          localStorage.setItem("examDetails", JSON.stringify(exam_details || []));
          localStorage.setItem("examinationData", JSON.stringify(examination_data || []));
          navigate("/exam"); // Redirect to exam page
        } else {
          navigate("/"); // Redirect to dashboard
        }
  
        setShowPopup(true);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast({ title: "Error", description: error.response.data.error });
      } else {
        console.error("Login error:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  

  const forgetPassword = async (payload) => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseURL}api/forgotpassword/`, payload);
      if (response.status === 200 || response.status === 201) {
        setShowForgotPasswordPopup(false);
        toast({ title: response.data.message });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast({ title: "Error", description: error.response.data.error });
      } else {
        console.error("Forgot password error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen grid place-items-center p-4"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Card className="w-full max-w-lg p-6 rounded-3xl shadow-xl">
        <CardHeader className="text-center">
          <img src={logo} alt="Logo" className="mx-auto h-16" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(loginUser)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email Address" type="email" {...field} className="p-4" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Password" type="password" className="p-4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-right">
                <Link onClick={() => setShowForgotPasswordPopup(true)} className="text-sm underline cursor-pointer">
                  Forgot your password?
                </Link>
              </div>
              <Button type="submit" disabled={loading} className="w-full p-4 bg-red-500 text-white hover:bg-red-600">
                {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />} {loading ? "Logging in..." : "Login"}
              </Button>
              {wrongPass && (
                <Alert variant="destructive">
                  <AlertTitle>{wrongPass}</AlertTitle>
                </Alert>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={showForgotPasswordPopup} onOpenChange={setShowForgotPasswordPopup}>
        <DialogContent className="sm:max-w-[500px]">
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
            <Button type="submit" disabled={loading} className="mt-4 w-full">
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
