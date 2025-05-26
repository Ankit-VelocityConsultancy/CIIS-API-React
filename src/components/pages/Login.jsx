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
  CardHeader,
} from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
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
  // Recoil setters
  const setAccessToken = useSetRecoilState(accessTokenAtom);
  const setRefreshToken = useSetRecoilState(refreshTokenAtom);
  const setUsername = useSetRecoilState(usernameAtom);
  const setUseremail = useSetRecoilState(useremailAtom);
  const setUserType = useSetRecoilState(userTypeAtom);
  const setUserId = useSetRecoilState(userIdAtom);
  const setUserVersion = useSetRecoilState(userVersion);
  const [isLoggedin, setLoggedin] = useRecoilState(isLoggedinAtom);

  const baseURL = useRecoilValue(baseURLAtom);
  const [loading, setLoading] = useState(false);
  const [wrongPass, setWrongPass] = useState(null);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({ resolver: zodResolver(loginSchema) });

  // On mount, restore Recoil state from localStorage to persist login after refresh
  useEffect(() => {
    const isLoginStored = localStorage.getItem("is_login") === "true";
    if (isLoginStored) {
      setAccessToken(localStorage.getItem("access"));
      setRefreshToken(localStorage.getItem("refresh"));
      setUsername(localStorage.getItem("username"));
      setUseremail(localStorage.getItem("useremail"));
      setUserType(localStorage.getItem("user_type"));
      setUserId(localStorage.getItem("user_id"));
      setUserVersion(localStorage.getItem("version"));
      setLoggedin(true);
    }
  }, [
    setAccessToken,
    setRefreshToken,
    setUsername,
    setUseremail,
    setUserType,
    setUserId,
    setUserVersion,
    setLoggedin,
  ]);

  // If user is logged in, redirect accordingly
  useEffect(() => {
    if (isLoggedin) {
      // Redirect students to exam page, others to dashboard
      const userType = localStorage.getItem("user_type");
      if (userType === "Student") {
        navigate("/exam");
      } else {
        navigate("/");
      }
    }
  }, [isLoggedin, navigate]);

  const loginUser = async (payload) => {
    try {
      setLoading(true);
      setWrongPass(null);
      const response = await axios.post(`${baseURL}api/login/`, payload);

      if (response.status === 200 || response.status === 201) {
        const {
          token,
          email,
          user_id,
          is_student,
          version,
          exam_details,
          examination_data,
          student_id,
          university,
          student_name,
          university_logo,
        } = response.data;

        // Set Recoil state
        setAccessToken(token.access);
        setRefreshToken(token.refresh);
        setUsername(email);
        setUseremail(email);
        setUserId(user_id || student_id); // fallback if user_id missing
        setUserType(is_student ? "Student" : "Admin");
        setUserVersion(version);
        setLoggedin(true);

        // Store in localStorage
        localStorage.setItem("access", token.access);
        localStorage.setItem("refresh", token.refresh);
        localStorage.setItem("username", email);
        localStorage.setItem("useremail", email);
        localStorage.setItem("user_type", is_student ? "Student" : "Admin");
        localStorage.setItem("user_id", user_id || student_id);
        localStorage.setItem("version", version);
        localStorage.setItem("is_login", "true");

        if (is_student) {
          localStorage.setItem("examDetails", JSON.stringify(exam_details || []));
          localStorage.setItem("examinationData", JSON.stringify(examination_data || []));
          localStorage.setItem("student_name", student_name || "");
          localStorage.setItem("student_id", student_id);
          localStorage.setItem("university_logo", university_logo || "");
          localStorage.setItem("university_id", university.id);

          localStorage.setItem("exam_progress", JSON.stringify(loginResponse.exam_progress));
          localStorage.setItem("selected_exam_id", yourSelectedExamId);
          navigate("/exam"); // student exam page
        } else {
          navigate("/"); // admin dashboard
        }
      }
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 404) {
        setWrongPass(error.response.data.error || "Invalid credentials");
        toast({ title: "Error", description: error.response.data.error || "Login failed" });
      } else {
        setWrongPass("An unexpected error occurred");
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
          {/* <img src={logo} alt="Logo" className="mx-auto h-16" /> */}
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
                      <Input
                        placeholder="Email Address"
                        type="email"
                        {...field}
                        className="p-4"
                      />
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
                      <Input
                        placeholder="Password"
                        type="password"
                        className="p-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-right">
                <Link
                  onClick={() => setShowForgotPasswordPopup(true)}
                  className="text-sm underline cursor-pointer"
                >
                  Forgot your password?
                </Link>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full p-4 bg-red-500 text-white hover:bg-red-600"
              >
                {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}{" "}
                {loading ? "Logging in..." : "Login"}
              </Button>
              {wrongPass && (
                <Alert variant="destructive" className="mt-2">
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
