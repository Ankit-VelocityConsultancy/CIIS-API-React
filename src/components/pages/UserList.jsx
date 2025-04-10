import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [formError, setFormErrors] = useState({});
  const baseURL = useRecoilValue(baseURLAtom);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userPrivilege, setUserPrivilege] = useState(""); // Default value
  const [isVerified, setIsVerified] = useState(false); // Default for "is_verified"

  const apiToken = localStorage.getItem("access"); // Replace with your token source
  console.log("API Token=="+apiToken);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseURL}api/create-user/`, {
          headers: {
            Authorization: `Bearer ${apiToken}`, // Include token in the Authorization header
          },
        });
        setUsers(response.data);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "An error occurred.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [apiToken]);

  const validateForm = () => {
    let errors = {};
  
    if (!email.trim()) {
      errors.email = "Email is required.";
    }
  
    if (!password.trim()) {
      errors.password = "Password is required.";
    }
  
    if (!userPrivilege.trim()) {
      errors.userPrivilege = "User Privilege is required.";
    }
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      // Post request to create new user
      const response = await axios.post(
        `${baseURL}api/create-user/`, 
        {
          email,
          password,
          is_verified: isVerified,
          is_student: false, // Default value for now
          is_data_entry: userPrivilege === "data_entry", // Set privilege based on selected value
          is_fee_clerk: userPrivilege === "fee_counter", // Set fee clerk privilege
        },
        { headers: { Authorization: `Bearer ${apiToken}` } }
      );

      // Add the newly created user to the list
      setUsers([...users, response.data]);

      // Reset form after submission
      setEmail("");
      setPassword("");
      setUserPrivilege("");
      setIsVerified(false);

      setSuccessMessage("User added successfully!"); // Set the success message
      setTimeout(() => {
        setSuccessMessage(""); // Reset the success message after 10 seconds
      }, 10000);
    } catch (error) {
      // Handle specific error for email already existing
      if (error.response?.data?.email) {
        setFormErrors({ ...formError, email: error.response.data.email[0] }); // Show email error message
      } else {
        setError(error.response ? error.response.data : error.message); // Handle other errors
      }
    }
  };

  // Define columns for the DataTable
  const columns = [
    {
      name: 'ID',
      selector: (row, index) => index + 1, // Generate a custom ID based on the index
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'User Privilege',
      selector: row => row.is_data_entry ? "Data Entry" : "Fee Counter", // Show the user privilege
      sortable: true,
    },
  ];

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }

  return (
    <div className="user-list-page">
      <h1 className="font-bold text-2xl mb-4">User List</h1>

      {/* Form to submit new user */}
      <form onSubmit={handleSubmit} className="mb-4 mt-2 p-4 border rounded-lg shadow-md">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email<span className="text-red-500">*</span></label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formError.email) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, email: "" }));
                }
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formError.email && <p className="text-red-500 text-xs">{formError.email}</p>}
          </div>

          <div className="flex-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password<span className="text-red-500">*</span></label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (formError.password) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, password: "" }));
                }
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formError.password && <p className="text-red-500 text-xs">{formError.password}</p>}
          </div>

          <div className="flex-1">
            <label htmlFor="userPrivilege" className="block text-sm font-medium text-gray-700">User Privilege<span className="text-red-500">*</span></label>
            <select
              id="userPrivilege"
              value={userPrivilege}
              onChange={(e) => {
                setUserPrivilege(e.target.value);
                if (formError.userPrivilege) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, userPrivilege: "" }));
                }
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option>Select</option>
              <option value="data_entry">Data Entry</option>
              <option value="fee_counter">Fee Counter</option>
            </select>
            {formError.userPrivilege && <p className="text-red-500 text-xs">{formError.userPrivilege}</p>}
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-[#167fc7]"
            >
              Save User
            </button>
          </div>
        </div>
      </form>

      {/* Show success message */}
      {successMessage && <div className="m-4 text-[#d24845]">{successMessage}</div>}

      {/* DataTable to display users */}
      <DataTable
        columns={columns}
        data={users}
        pagination
        highlightOnHover
        striped
        responsive
        customStyles={{
          headCells: {
            style: {
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #d14744, #d34a46, #d24946, #d14643)',
              color: 'white', // Optional: change the text color for better contrast
            },
          },
        }}
      />
    </div>
  );
};

export default UserListPage;
