import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ReloadIcon } from "@radix-ui/react-icons";
// import {
//   accessTokenAtom,
//   baseURLAtom,
//   isLoggedinAtom,
//   refreshTokenAtom,
//   userIdAtom,
//   userTypeAtom,
//   usernameAtom,
// } from "@/recoil/atoms";
// import { useRecoilValue, useSetRecoilState } from "recoil";
// import { useState } from "react";
import loginImage from "../../assets/Images/login-image.jpg";
import logo from "../../assets/Images/easytaxreturns_logo.png";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
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

} from "@/recoil/atoms";
import { useState, useEffect } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "../ui/use-toast";
import { data } from "autoprefixer";

export function SignUp() {
  document.title = "Sign Up | iPDAV";

  const setAccessToken = useSetRecoilState(accessTokenAtom);
  const setRefreshToken = useSetRecoilState(refreshTokenAtom);
  const setUsername = useSetRecoilState(usernameAtom);
  const setUseremail = useSetRecoilState(useremailAtom);
  const setUserType = useSetRecoilState(userTypeAtom);
  const setUserId = useSetRecoilState(userIdAtom);
  const setLoggedin = useSetRecoilState(isLoggedinAtom);
  const baseURL = useRecoilValue(baseURLAtom);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [taxYear, setYear] = useState("");
  const setUserVersion = useSetRecoilState(userVersion);
 



  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const signUpSchema = z
    .object({
      name: z
        .string()
        .min(3, { message: "Must be at least 3 characters" }),
      mobile: z
        .string()
        .regex(/^\d{10}$/, { message: "Enter a valid 10-digit Mobile Number" }),
      email: z.string().email({ message: "Invalid email format" }),
      password: z
        .string()
        .min(8, { message: "Must be at least 8 characters" })
        .regex(passwordRegex, {
          message:
            "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
        }),
      confirm_password: z
        .string()
        .min(8, { message: "Must be at least 8 characters" })
        .regex(passwordRegex, {
          message:
            "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
        }),
      
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords don't match",
      path: ["confirm_password"],
    });

    const signUpform = useForm({
      resolver: zodResolver(signUpSchema),
    });

 


  const signUp = async (payload) => {
    
 
      setLoading(true);
      try{
        const response = await axios.post(`${baseURL}/IPDAV/signup/`, payload);
        console.log(response)
        
        if (response.status === 200 || response.status === 201) {
          setLoading(false);
          toast({
            title: response.data.message,
            description: "Please login to access the system."
          });
         navigate("/login");
        }
       

      }
      catch (error) {
        if (error.response && error.response.status === 404) {
          const errorMessage = error.response.data.error;
          toast({
            title: "Error",
            description: errorMessage, // Display the error message returned by the API
          });
        } 
        else {
          console.log(
            "An error occurred: ",
            error.response?.status || error.message
          );
        }
        setLoading(false);
      }
     

    
  };


  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-1 h-svh">
     
      <div className="flex items-center justify-center py-12">
        <Card className="mx-auto min-w-96 max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Welcome to <span className="font-semibold">iPDAV</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...signUpform}>
              <form
                method="post"
                className="space-y-5"
                onSubmit={signUpform.handleSubmit(signUp)}
              >
                <div className="grid gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <FormField
                      control={signUpform.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <FormField
                      control={signUpform.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Mobile Number"
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
                      control={signUpform.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <FormField
                      control={signUpform.control}
                      name="password"
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
                      control={signUpform.control}
                      name="confirm_password"
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
                 
                 
                  <Button type="submit" disabled={loading}>
                  {loading && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {loading ? "Creating an account..." : "Create an account"}
                </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline">
                  Sign in
                </Link>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
