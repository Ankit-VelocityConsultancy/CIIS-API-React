import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  accessTokenAtom,
  baseURLAtom,
  userTypeAtom,
} from "@/recoil/atoms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import * as XLSX from "xlsx";
import {
  CircleCheck,
  Copy,
  RotateCcw,
  SquarePen,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Download,
  Upload,
  FilePenLine
} from "lucide-react";
import { DataTable } from "../mycomponents/DataTable";
import { Button } from "../ui/button";
import { DotsHorizontalIcon, ReloadIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "../ui/use-toast";
import FileSaver from "file-saver";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  document.title = "Dashboard";

  const columns = [
    {
      accessorKey: "user_name",
      meta: "Name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize w-[280px] whitespace-nowrap">
          {row.getValue("user_name")}
        </div>
      ),
    },
    {
      accessorKey: "user_email",
      header: "E-Mail",
      meta: "E-Mail",

      cell: ({ row }) => (
        <div className="w-[280px] whitespace-nowrap">
          {row.getValue("user_email")}
        </div>
      ),
    },
    {
      accessorKey: "user_signup",
      meta: "Signup Date",
      header: "Signup Date",
      cell: ({ row }) => (
        <div className="capitalize w-[180px] whitespace-nowrap">
          {row.getValue("user_signup")}
        </div>
      ),
    },
    {
      accessorKey: "user_status",
      meta: "Status",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize w-[150px] whitespace-nowrap">
          <Badge>
            {row.getValue("user_status") === 1
              ? "Trial"
              : row.getValue("user_status") === 3
              ? "DIY"
              : row.getValue("user_status") === 4
              ? "DIY Assisted"
              : row.getValue("user_status") === 5
              ? "Accountant Plus"
              : "Expired"}
          </Badge>
        </div>
      ),
    },
    {
      header: "Action",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="capitalize w-[100px] whitespace-nowrap">
            <div className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <DotsHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      navigator.clipboard.writeText(user.user_name)
                    }
                    className="gap-4"
                  >
                    Copy Name
                    <Copy />
                  </DropdownMenuItem>

                  {row.getValue("user_status") === 1 ? (
                    <Dialog>
                      <DialogTrigger className="w-full">
                        <p className="relative flex cursor-pointer select-none rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-5 gap-3 justify-between">
                          Upgrade <ThumbsUp />
                        </p>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Version</DialogTitle>
                        </DialogHeader>
                        <form
                          method="post"
                          onSubmit={(e) => versionChange(e, user.user_id)}
                          className="flex items-center gap-4 py-4"
                        >
                          <Select name="selected_version">
                            <SelectTrigger>
                              <SelectValue placeholder="Select Version" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="3">DIY</SelectItem>
                                <SelectItem value="4">DIY Assisted</SelectItem>
                                <SelectItem value="5">
                                  Accountant Plus
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>

                          <Button type="submit" disabled={loading}>
                            {loading && (
                              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {loading ? "Saving..." : "Save"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <DropdownMenuItem
                      className="gap-4 flex justify-between"
                      onClick={() => downgradeUser(user.user_id)}
                    >
                      Downgrade <ThumbsDown />
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    className="gap-4 flex justify-between"
                    onClick={() =>
                      selectUser(
                        user.user_id,
                        user.user_name,
                        user.user_email,
                        user.user_status
                      )
                    }
                  >
                    Select <CircleCheck />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-4 flex justify-between"
                    onClick={() => resetDate(user.user_id)}
                  >
                    Reset <RotateCcw />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Dialog>
                    <DialogTrigger className="w-full">
                      <p className="relative flex cursor-pointer select-none rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-5 gap-3 justify-between">
                        Change <SquarePen />
                      </p>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Version</DialogTitle>
                      </DialogHeader>
                      <form
                        method="post"
                        onSubmit={(e) => versionChange(e, user.user_id)}
                        className="flex items-center gap-4 py-4"
                      >
                        <Select name="selected_version">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Version" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="3">DIY</SelectItem>
                              <SelectItem value="4">DIY Assisted</SelectItem>
                              <SelectItem value="5">Accountant Plus</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>

                        <Button type="submit" disabled={loading}>
                          {loading && (
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {loading ? "Saving..." : "Save"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <p className="relative flex cursor-pointer select-none rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-800 justify-between">
                        Delete <Trash2 />
                      </p>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete user and remove data from servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteUser(user.user_id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      },
    },
  ];

  const baseURL = useRecoilValue(baseURLAtom);
  const accessToken = useRecoilValue(accessTokenAtom);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const userType = useRecoilValue(userTypeAtom);
  const navigate = useNavigate();

  const { toast } = useToast();

  const exportSchema = z.object({
    start_date: z
      .date()
      .transform((date) => date.toISOString().split("T")[0])
      .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
        message: "Invalid date format(YYYY-MM-DD)",
      })
      .nullable(),
    end_date: z
      .date()
      .transform((date) => date.toISOString().split("T")[0])
      .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
        message: "Invalid date format(YYYY-MM-DD)",
      })
      .nullable(),
  });

  const form = useForm({
    resolver: zodResolver(exportSchema),
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${baseURL}all-users-api/?year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setTableLoading(false);
    }
  };

  const resetDate = async (user_id) => {
    try {
      const response = await axios.post(
        `${baseURL}reset-user-start-date-api/?user_id=${user_id}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast({
        title: `Reset Date Successfully`,
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Something went wrong",
      });
    }
  };

  const exportUser = async (payload) => {
    const modifiedPayload = payload;
    modifiedPayload.year = year;
    modifiedPayload.version = 1;
    modifiedPayload.all_time = "current";

    try {
      const response = await axios.post(
        `${baseURL}export-users-api/`,
        modifiedPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast({
        title: `Users Exported`,
      });
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";
      const ws = XLSX.utils.json_to_sheet(response.data.user_list);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, "User Details" + fileExtension);
      setOpen(false);
    } catch (error) {
      toast({
        title: error,
      });
    }
  };

  const selectUser = async (user_id, user_name, user_email, user_status) => {
    setSelectedUser({ user_id, user_name, user_email, user_status });
    localStorage.setItem(
      "edit_user",
      JSON.stringify({ user_id, user_name, user_email, user_status })
    );
  };

  const versionChange = async (e, user_id) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await axios.post(
        `${baseURL}versionchange-api/?year=${year}&user_id=${user_id}`,
        {
          selected_version: e.target.selected_version.value,
        }
      );
      toast({
        title: "Version Changed",
      });
      setLoading(false);
      fetchData();
    } catch {
      toast({
        title: "Something Went Wrong",
      });
      setLoading(false);
    }
  };

  const downgradeUser = async (user_id) => {
    try {
      const response = await axios.post(
        `${baseURL}downgrade-user-api/?user_id=${user_id}&year=${year}`,
        {
          user_id,
          year,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast({
        title: `User Downgraded Successfully`,
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Something Went Wrong",
      });
    }
  };

  const deleteUser = async (user_id) => {
    try {
      const response = await axios.post(
        `${baseURL}delete-user-api/?user_id=${user_id}&year=${year}`,
        {
          user_id,
          year,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast({
        title: "User Deleted Successfully",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Something Went Wrong",
      });
    }
  };

  useEffect(() => {
 
  }, []);

  return (
  <>
    {userType === "Admin" && (
      <div className="flex flex-col gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Action Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center justify-start action-wrapper">
                <ThumbsUp /> = Upgrade User to Paid
              </div>
              <div className="flex items-center justify-start action-wrapper">
                <Trash2 /> = Delete User
              </div>
              <div className="flex items-center justify-start action-wrapper">
                <CircleCheck /> = Select User
              </div>
              <div className="flex items-center justify-start action-wrapper">
                <ThumbsDown /> = Downgrade User to Trial
              </div>
              <div className="flex items-center justify-start action-wrapper">
                <RotateCcw /> = Reset Signup Date
              </div>
              <div className="flex items-center justify-start action-wrapper">
                <SquarePen /> = Change Paid User
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="user-type-wrapper flex flex-row items-center">
          <div className="export-button">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Export Users</Button>
              </DialogTrigger>
              <DialogContent className="gap-8 sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Export Users</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    method="post"
                    className="space-y-5"
                    onSubmit={form.handleSubmit(exportUser)}
                  >
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                      {/* Start Date */}
                      <div className="flex flex-col space-y-1.5">
                        <FormField
                          control={form.control}
                          name="start_date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Start Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value
                                        ? format(field.value, "yyyy-MM-dd")
                                        : "Start Date"}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* End Date */}
                      <div className="flex flex-col space-y-1.5">
                        <FormField
                          control={form.control}
                          name="end_date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>End Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value
                                        ? format(field.value, "yyyy-MM-dd")
                                        : "End Date"}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="button-wrapper flex justify-end">
                      <Button disabled={loading} type="submit">
                        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? "Exporting..." : "Export"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    )}
  </>
);
}