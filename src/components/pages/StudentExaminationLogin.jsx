import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/images/btulogo.png"; // Added by tejasvi 2-12-2024
import loginBg from "../../assets/images/login-bg.png"; // Added by tejasvi 2-12-2024
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

const StudentExaminationLogin = () => {
  const [wrongPass, setWrongPass] = useState(false);
  const navigate = useNavigate();
  const baseURL = useRecoilValue(baseURLAtom);
  const setUserId = useSetRecoilState(userIdAtom);
  const setIsLoggedin = useSetRecoilState(isLoggedinAtom);
  const setAccessToken = useSetRecoilState(accessTokenAtom);
  const setRefreshToken = useSetRecoilState(refreshTokenAtom);

  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  // On mount, check if tokens exist in localStorage and redirect if they do
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (storedAccessToken && storedRefreshToken) {
      setIsLoggedin(true);
      navigate("/exam"); // Redirect to exam page if already logged in
    }
  }, [navigate, setIsLoggedin]);

  const loginUser = async (data) => {
    try {
      // Using POST method to send form data
      const response = await axios.post(`${baseURL}api/student_login/`, {
        email: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        const {
          token,
          student_id,
          exam_details,
          examination_data,
        } = response.data;

        // Extract access and refresh tokens from the response
        const accessToken = token.access;
        const refreshToken = token.refresh;

        // Save student ID in Recoil state and set login state
        setUserId(student_id);
        setIsLoggedin(true);

        // Save tokens in both Recoil state and localStorage
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        student_id
        // Store exam details and examination data in localStorage if needed
        localStorage.setItem("student_id", JSON.stringify(student_id));
        localStorage.setItem("examDetails", JSON.stringify(exam_details));
        localStorage.setItem("examinationData", JSON.stringify(examination_data));

        // Redirect to exam page
        navigate("/exam");
      }
    } catch (error) {
      setWrongPass("Invalid email or password. Please try again.");
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
                <h1 className="d-flex justify-content-center font-bold text-2xl">
                  Examination Login
                </h1>
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
                            className="p-4"
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
                </div>
                <Button
                  type="submit"
                  className="bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300 p-4"
                >
                  Student Login
                </Button>
                {wrongPass && (
                  <Alert variant="destructive">
                    <AlertTitle className="mb-0">{wrongPass}</AlertTitle>
                  </Alert>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentExaminationLogin;
