import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormErrors] = useState({});
  const baseURL = useRecoilValue(baseURLAtom);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userPrivilege, setUserPrivilege] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const apiToken = localStorage.getItem("access");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseURL}api/create-user/`, {
          headers: { Authorization: `Bearer ${apiToken}` },
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
    if (!email.trim()) errors.email = "Email is required.";
    if (!password.trim()) errors.password = "Password is required.";
    if (!userPrivilege.trim()) errors.userPrivilege = "User Privilege is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `${baseURL}api/create-user/`,
        {
          email,
          password,
          is_verified: isVerified,
          is_student: false,
          is_data_entry: userPrivilege === "data_entry",
          is_fee_clerk: userPrivilege === "fee_counter",
        },
        { headers: { Authorization: `Bearer ${apiToken}` } }
      );

      setUsers([...users, response.data]);
      setEmail("");
      setPassword("");
      setUserPrivilege("");
      setIsVerified(false);

      setSuccessMessage("User added successfully!");
      setTimeout(() => setSuccessMessage(""), 10000);
    } catch (error) {
      if (error.response?.data?.email) {
        setFormErrors({ ...formError, email: error.response.data.email[0] });
      } else {
        setError(error.response ? error.response.data : error.message);
      }
    }
  };

  const columns = [
    {
      name: 'ID',
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'User Privilege',
      selector: row => row.is_data_entry ? "Data Entry" : "Fee Counter",
      sortable: true,
    },
  ];

  if (loading) return <div className="text-lg p-4">Loading users...</div>;
  if (error) return <div className="text-lg p-4 text-red-600">Error: {String(error)}</div>;

  return (
    <div className="user-list-page p-4">
      <h1 className="font-bold text-3xl mb-4">User List</h1>

      <form onSubmit={handleSubmit} className="mb-4 mt-2 p-4 border rounded-lg shadow-md text-base">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[220px]">
            <label htmlFor="email" className="block text-base font-medium text-gray-700">Email<span className="text-red-500">*</span></label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (formError.email) setFormErrors((prev) => ({ ...prev, email: "" })); }}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
            />
            {formError.email && <p className="text-red-500 text-sm">{formError.email}</p>}
          </div>

          <div className="flex-1 min-w-[220px]">
            <label htmlFor="password" className="block text-base font-medium text-gray-700">Password<span className="text-red-500">*</span></label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (formError.password) setFormErrors((prev) => ({ ...prev, password: "" })); }}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
            />
            {formError.password && <p className="text-red-500 text-sm">{formError.password}</p>}
          </div>

          <div className="flex-1 min-w-[220px]">
            <label htmlFor="userPrivilege" className="block text-base font-medium text-gray-700">User Privilege<span className="text-red-500">*</span></label>
            <select
              id="userPrivilege"
              value={userPrivilege}
              onChange={(e) => { setUserPrivilege(e.target.value); if (formError.userPrivilege) setFormErrors((prev) => ({ ...prev, userPrivilege: "" })); }}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select</option>
              <option value="data_entry">Data Entry</option>
              <option value="fee_counter">Fee Counter</option>
            </select>
            {formError.userPrivilege && <p className="text-red-500 text-sm">{formError.userPrivilege}</p>}
          </div>

          <div className="flex items-end">
            <button type="submit" className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-[#167fc7]">
              Save User
            </button>
          </div>
        </div>
      </form>

      {successMessage && <div className="m-4 text-[#d24845] text-base">{successMessage}</div>}

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
              fontSize: '1rem',
              background: 'linear-gradient(to right, #d14744, #d34a46, #d24946, #d14643)',
              color: 'white'
            }
          },
          rows: {
            style: {
              fontSize: '0.95rem'
            }
          }
        }}
      />
    </div>
  );
};

export default UserListPage;