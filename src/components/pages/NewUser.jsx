import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { baseURLAtom, accessTokenAtom } from "@/recoil/atoms";
import { Input, Select, Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom"; // Use useParams to get userId

const { Option } = Select;

const NewUser = () => {
  const baseURL = useRecoilValue(baseURLAtom);
  const accessToken = useRecoilValue(accessTokenAtom);
  const navigate = useNavigate();
  const { userId } = useParams(); // Getting userId from URL

  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    mobile: "",
    role: null,
  });

  useEffect(() => {
    // Fetch roles
    axios
      .get(`${baseURL}api/get_roles/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setRoles(res.data))
      .catch(() => message.error("Failed to load roles"));

    // Fetch user data if we are in edit mode
    if (userId) {
      axios
        .get(`${baseURL}api/get_user/${userId}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => setFormData(res.data)) // Pre-fill the form with user data
        .catch(() => message.error("Failed to fetch user data"));
    }
  }, [baseURL, accessToken, userId]);

  
  const handleCancel = () => {
    // Navigate to the Users Table page
    navigate("/view-users");
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirm_password) {
      return message.error("Passwords do not match");
    }

    if (!formData.email || !formData.mobile) {
      return message.error("Email and Mobile are mandatory");
    }

    if (formData.mobile.length !== 10 || isNaN(formData.mobile)) {
      return message.error("Mobile number must be 10 digits");
    }

    try {
      const response = await axios.post(`${baseURL}api/create_or_update_user/`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201 || response.status === 200) {
        message.success("User saved successfully");
        navigate("/view-users");
      } else {
        message.error("User creation or update failed");
      }
    } catch (err) {
      console.error("Error during user creation or update:", err);
      message.error("User creation or update failed");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">{userId ? "Edit User" : "Add User"}</h2>
      <div className="grid grid-cols-3 gap-4">
        <Input
          placeholder="Enter First Name"
          value={formData.first_name}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
        />
        <Input
          placeholder="Enter Last Name"
          value={formData.last_name}
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
        />
        <Input
          placeholder="Enter Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          placeholder="Enter Mobile"
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
        />
        <Input.Password
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <Input.Password
          placeholder="Confirm Password"
          value={formData.confirm_password}
          onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
        />
        <Select
          placeholder="Select Role"
          onChange={(value) => setFormData({ ...formData, role: value })}
          value={formData.role}
        >
          {roles.map((role) => (
            <Option key={role.id} value={role.id}>
              {role.name}
            </Option>
          ))}
        </Select>
      </div>
      <div className="flex mt-6 gap-4">
        <Button type="primary" onClick={handleSubmit}>
          Save
        </Button>
        <Button danger onClick={handleCancel}>Cancel
        </Button>
      </div>
    </div>
  );
};

export default NewUser;
