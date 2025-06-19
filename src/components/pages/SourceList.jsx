import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, Button, message, Modal, Switch } from "antd";
import { useRecoilValue } from "recoil";
import { baseURLAtom, accessTokenAtom } from "@/recoil/atoms";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const SourceList = () => {
  const baseURL = useRecoilValue(baseURLAtom);
  const accessToken = useRecoilValue(accessTokenAtom);
  const [sources, setSources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sourceName, setSourceName] = useState("");
  const [sourceStatus, setSourceStatus] = useState(true); // Boolean value: true for Active, false for Inactive
  const [sourceId, setSourceId] = useState(null); // To store source id for editing
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // For delete confirmation modal
  const [sourceToDelete, setSourceToDelete] = useState(null); // Store source to delete
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await axios.get(`${baseURL}api/get_all_sources/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status === 200) {
          setSources(response.data); // Assuming the API response has a list of sources
        }
      } catch (err) {
        console.error("Error fetching sources:", err);
        message.error("Failed to load sources");
      }
    };

    fetchSources();
  }, [baseURL, accessToken]);

  // Filter sources based on the search term
  const filteredSources = sources.filter((source) =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Columns configuration for the table
  const columns = [
    {
      title: "Sr No",
      dataIndex: "sr_no",
      key: "sr_no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Source Name",
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
          onClick={() => handleEditSource(record)}
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
          onClick={() => handleDeleteSource(record)}
        >
          Delete
        </Button>
      ),
    },
  ];

  // Toggle status
  const handleToggleStatus = async (checked, source) => {
    try {
      const updatedStatus = checked;
      const response = await axios.patch(
        `${baseURL}api/update_source/${source.id}/`,
        { status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        message.success("Source status updated successfully");
        // Update local state immediately to reflect the status change
        setSources((prevSources) =>
          prevSources.map((src) =>
            src.id === source.id ? { ...src, status: updatedStatus } : src
          )
        );
      }
    } catch (err) {
      console.error("Error updating source status:", err);
      message.error("Failed to update source status");
    }
  };

  // Open modal to edit source
  const handleEditSource = (source) => {
    setSourceId(source.id); // Set source id for editing
    setSourceName(source.name); // Pre-fill source name
    setSourceStatus(source.status); // Pre-fill source status
    setIsModalVisible(true); // Show the modal
  };

  // Open delete confirmation modal
  const handleDeleteSource = (source) => {
    setSourceToDelete(source); // Set source to be deleted
    setIsDeleteModalVisible(true); // Show the delete confirmation modal
  };

  // Delete source
  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${baseURL}api/delete_source/${sourceToDelete.id}/`, // Your API endpoint for deleting
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 204) {
        message.success("Source deleted successfully");
        // Update local state to reflect the source deletion
        setSources((prevSources) =>
          prevSources.filter((src) => src.id !== sourceToDelete.id)
        );
        setIsDeleteModalVisible(false); // Close the delete modal
        setSourceToDelete(null); // Reset source to be deleted
      }
    } catch (err) {
      console.error("Error deleting source:", err);
      message.error("Failed to delete source");
    }
  };

  // Save the updated source or create a new one
  const handleSaveSource = async () => {
    try {
      if (sourceId) {
        // If sourceId is set, update the existing source
        const response = await axios.put(
          `${baseURL}api/update_source/${sourceId}/`, // Your API endpoint for editing
          {
            name: sourceName,
            status: sourceStatus, // Send the boolean value directly
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status === 200) {
          message.success("Source updated successfully");
          // Update local state immediately to reflect the changes
          setSources((prevSources) =>
            prevSources.map((src) =>
              src.id === sourceId ? { ...src, name: sourceName, status: sourceStatus } : src
            )
          );
          setIsModalVisible(false); // Close the modal
          setSourceName(""); // Reset source name
          setSourceStatus(true); // Reset source status to active (default)
          setSourceId(null); // Reset sourceId after updating
        }
      } else {
        // If sourceId is not set, create a new source
        const response = await axios.post(
          `${baseURL}api/create_source/`, // Your API endpoint for adding
          {
            name: sourceName,
            status: sourceStatus, // Send the boolean value directly
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status === 201) {
          message.success("Source added successfully");
          // Add the newly created source to local state
          setSources((prevSources) => [
            ...prevSources,
            { ...response.data, id: response.data.id },
          ]);
          setIsModalVisible(false); // Close the modal
          setSourceName(""); // Reset source name
          setSourceStatus(true); // Reset source status to active (default)
        }
      }
    } catch (err) {
      console.error("Error saving source:", err);
      message.error("Failed to save source");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Sources</h1>
        <div className="flex gap-2 items-center">
          <Input
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="Search sources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow flex items-center"
            onClick={() => setIsModalVisible(true)}
          >
            <PlusOutlined className="mr-2" /> Add New Source
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredSources}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Showing ${total} entries`,
        }}
      />

      {/* Modal for adding or editing a source */}
      <Modal
        title={sourceId ? "Edit Source" : "Add New Source"}
        visible={isModalVisible}
        onOk={handleSaveSource}
        onCancel={() => setIsModalVisible(false)}
      >
        <div>
          <div className="mb-4">
            <Input
              placeholder="Source Name"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <span>Status: </span>
            <Switch
              checked={sourceStatus}
              onChange={(checked) => setSourceStatus(checked)}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Are you sure you want to delete this source?"
        visible={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Deleting this source will remove it permanently. Are you sure?</p>
      </Modal>
    </div>
  );
};

export default SourceList;
