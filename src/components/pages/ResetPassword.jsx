import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ReloadIcon } from "@radix-ui/react-icons";

import {  useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
import {
 
  baseURLAtom,
  
} from "../../recoil/atoms";
import { Alert, AlertTitle } from "../ui/alert";
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const resetSchema = z.object({
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

export function ResetPassword() {
  // document.title = "Login | ETR";

  const { uid, token } = useParams(); 
  const baseURL = useRecoilValue(baseURLAtom);
  const [loading, setLoading] = useState(false);
  const [wrongPass, setWrongPass] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
   
  }, []);

  const form = useForm({
    resolver: zodResolver(resetSchema),
  });
 

  const resetPassword = async (data) => {

  
   try {
      setLoading(true);
      const payload = {
        uid,
        token,
        password: data.new_pass,
      };
      console.log(payload);
      const response = await axios.post(`${baseURL}/IPDAV/password_reset/`, payload);
      console.log(response.data);
      if (response.status === 200 || response.status === 201){
        setLoading(false);
        toast({
          title: response.data.message,
          description: "Please login to access the system."
        });
        navigate("/login");
      }
     
   } catch (error) {
    if (error.response && error.response.status === 404) {
      const errorMessage = error.response.data.error;
      toast({
        title: "Error",
        description: errorMessage, // Display the error message returned by the API
      });
    } else {
      console.log(
        "An error occurred: ",
        error.response?.status || error.message
      );
    }
    setLoading(false);
  };
}

  


  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-1 h-svh">
      
      <div className="flex items-center justify-center py-12">
        <Card className="mx-auto min-w-96 max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              Welcome to <span className="font-semibold">iPDAV</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="grid gap-4 space-y-4"
                method="post"
                onSubmit={form.handleSubmit(resetPassword)}
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
                <Button type="submit" disabled={loading}>
                  {loading && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {loading ? "Resetting the password..." : "Reset Password"}
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

   
    </div>
  );
}
