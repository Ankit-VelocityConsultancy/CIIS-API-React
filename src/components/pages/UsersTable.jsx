import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Input, Select, Switch } from "antd";
import { useRecoilValue } from "recoil";
import { baseURLAtom, accessTokenAtom } from "@/recoil/atoms";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";  // Importing useNavigate for navigation

const { Option } = Select;

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);

  const baseURL = useRecoilValue(baseURLAtom);
  const accessToken =   (accessTokenAtom);
  const navigate = useNavigate();  // useNavigate hook to navigate between pages

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseURL}api/get_role_user/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          setError("No users found.");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [baseURL, accessToken]);

  const filteredUsers = users
    .filter(
      (user) =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => {
      if (!statusFilter) return true;
      return user.status === statusFilter;
    });

  const handleEditUser = (id) => {
    // Navigate to the "NewUser.jsx" page with the userId
    navigate(`/users/new/${id}`);
  };

  const columns = [
    {
      title: "Sr No",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      render: (text) => text || "N/A", // Display "N/A" if first_name is empty
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      render: (text) => text || "N/A", // Display "N/A" if last_name is empty
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => text || "N/A", // Display "N/A" if email is empty
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      render: (text) => text || "N/A", // Display "N/A" if mobile is empty
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => role || "N/A", // Display "N/A" if role is empty
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Switch checked={status === "active"} onChange={() => {}} />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => handleEditUser(record.id)} // Pass the user id on click
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Users</h1>
        <div className="flex gap-2 items-center">
          <Input
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            className="border border-gray-300"
            placeholder="Select Status"
            onChange={(value) => setStatusFilter(value)}
            allowClear
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow flex items-center"
            onClick={() => navigate("/users/new")} // Navigate to "New User" form
          >
            <PlusOutlined className="mr-2" /> New User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Showing ${total} entries`,
        }}
      />
    </div>
  );
};

export default UsersTable;
