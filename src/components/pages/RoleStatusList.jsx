import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, Button, message, Modal, Switch } from "antd";
import { useRecoilValue } from "recoil";
import { baseURLAtom, accessTokenAtom } from "@/recoil/atoms";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const RoleStatusList = () => {
  const baseURL = useRecoilValue(baseURLAtom);
  const accessToken = useRecoilValue(accessTokenAtom);
  const [roleStatuses, setRoleStatuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [roleStatusName, setRoleStatusName] = useState("");
  const [roleStatusStatus, setRoleStatusStatus] = useState(true); // Boolean value: true for Active, false for Inactive
  const [roleStatusId, setRoleStatusId] = useState(null); // To store role status id for editing
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // For delete confirmation modal
  const [roleStatusToDelete, setRoleStatusToDelete] = useState(null); // Store role status to delete

  useEffect(() => {
    const fetchRoleStatuses = async () => {
      try {
        const response = await axios.get(`${baseURL}api/get_all_role_status/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status === 200) {
          setRoleStatuses(response.data); // Assuming the API response has a list of role statuses
        }
      } catch (err) {
        console.error("Error fetching role statuses:", err);
        message.error("Failed to load role statuses");
      }
    };

    fetchRoleStatuses();
  }, [baseURL, accessToken]);

  const filteredRoleStatuses = roleStatuses.filter((roleStatus) =>
    roleStatus.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Sr No",
      dataIndex: "sr_no",
      key: "sr_no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Role Status Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch
          checked={status}
          onChange={(checked) => handleToggleStatus(checked, record)}
        />
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEditRoleStatus(record)}
        >
          Edit
        </Button>
      ),
    },
    {
      title: "Delete",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="danger"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteRoleStatus(record)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleToggleStatus = async (checked, roleStatus) => {
    try {
      const updatedStatus = checked;
      const response = await axios.patch(
        `${baseURL}api/update_role_status/${roleStatus.id}/`,
        { status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        message.success("RoleStatus status updated successfully");
        setRoleStatuses((prevRoleStatuses) =>
          prevRoleStatuses.map((rs) =>
            rs.id === roleStatus.id ? { ...rs, status: updatedStatus } : rs
          )
        );
      }
    } catch (err) {
      console.error("Error updating role status:", err);
      message.error("Failed to update role status");
    }
  };

  const handleEditRoleStatus = (roleStatus) => {
    setRoleStatusId(roleStatus.id); // Set role status id for editing
    setRoleStatusName(roleStatus.name); // Pre-fill role status name
    setRoleStatusStatus(roleStatus.status); // Pre-fill role status status
    setIsModalVisible(true); // Show the modal
  };

  const handleDeleteRoleStatus = (roleStatus) => {
    setRoleStatusToDelete(roleStatus); // Set role status to be deleted
    setIsDeleteModalVisible(true); // Show the delete confirmation modal
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${baseURL}api/delete_role_status/${roleStatusToDelete.id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 204) {
        message.success("RoleStatus deleted successfully");
        setRoleStatuses((prevRoleStatuses) =>
          prevRoleStatuses.filter((rs) => rs.id !== roleStatusToDelete.id)
        );
        setIsDeleteModalVisible(false); // Close the delete modal
        setRoleStatusToDelete(null); // Reset role status to be deleted
      }
    } catch (err) {
      console.error("Error deleting role status:", err);
      message.error("Failed to delete role status");
    }
  };

  const handleSaveRoleStatus = async () => {
    try {
      if (roleStatusId) {
        // If roleStatusId is set, update the existing role status
        const response = await axios.put(
          `${baseURL}api/update_role_status/${roleStatusId}/`,
          { name: roleStatusName, status: roleStatusStatus },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status === 200) {
          message.success("RoleStatus updated successfully");
          setIsModalVisible(false); // Close the modal
          setRoleStatusName(""); // Reset role status name
          setRoleStatusStatus(true); // Reset role status status to active (default)
          setRoleStatusId(null); // Reset roleStatusId after updating
          // Re-fetch role statuses after updating
          setRoleStatuses((prevRoleStatuses) =>
            prevRoleStatuses.map((rs) =>
              rs.id === roleStatusId ? { ...rs, name: roleStatusName, status: roleStatusStatus } : rs
            )
          );
        }
      } else {
        // If roleStatusId is not set, create a new role status
        const response = await axios.post(
          `${baseURL}api/create_role_status/`,
          { name: roleStatusName, status: roleStatusStatus },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status === 201) {
          message.success("RoleStatus added successfully");
          setIsModalVisible(false); // Close the modal
          setRoleStatusName(""); // Reset role status name
          setRoleStatusStatus(true); // Reset role status status to active (default)
          // Re-fetch role statuses after adding
          setRoleStatuses((prevRoleStatuses) => [
            ...prevRoleStatuses,
            { id: response.data.id, name: roleStatusName, status: roleStatusStatus },
          ]);
        }
      }
    } catch (err) {
      console.error("Error saving role status:", err);
      message.error("Failed to save role status");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Role Statuses</h1>
        <div className="flex gap-2 items-center">
          <Input
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="Search role statuses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow flex items-center"
            onClick={() => setIsModalVisible(true)}
          >
            <PlusOutlined className="mr-2" /> Add New Role Status
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredRoleStatuses}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Showing ${total} entries`,
        }}
      />

      {/* Modal for adding or editing a role status */}
      <Modal
        title={roleStatusId ? "Edit Role Status" : "Add New Role Status"}
        visible={isModalVisible}
        onOk={handleSaveRoleStatus}
        onCancel={() => setIsModalVisible(false)}
      >
        <div>
          <div className="mb-4">
            <Input
              placeholder="Role Status Name"
              value={roleStatusName}
              onChange={(e) => setRoleStatusName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <span>Status: </span>
            <Switch
              checked={roleStatusStatus}
              onChange={(checked) => setRoleStatusStatus(checked)}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Are you sure you want to delete this role status?"
        visible={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Deleting this role status will remove it permanently. Are you sure?</p>
      </Modal>
    </div>
  );
};

export default RoleStatusList;
