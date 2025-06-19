import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, Button, message, Modal, Switch } from "antd";
import { useRecoilValue } from "recoil";
import { baseURLAtom, accessTokenAtom } from "@/recoil/atoms";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const LeadLabelTagList = () => {
  const baseURL = useRecoilValue(baseURLAtom);
  const accessToken = useRecoilValue(accessTokenAtom);
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tagName, setTagName] = useState("");
  const [tagStatus, setTagStatus] = useState(true); // Boolean value: true for Active, false for Inactive
  const [tagId, setTagId] = useState(null); // To store tag id for editing
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // For delete confirmation modal
  const [tagToDelete, setTagToDelete] = useState(null); // Store tag to delete

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${baseURL}api/get_all_lead_label_tags/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status === 200) {
          setTags(response.data); // Assuming the API response has a list of tags
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
        message.error("Failed to load tags");
      }
    };

    fetchTags();
  }, [baseURL, accessToken]);

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Sr No",
      dataIndex: "sr_no",
      key: "sr_no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tag Name",
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
          onClick={() => handleEditTag(record)}
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
          onClick={() => handleDeleteTag(record)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleToggleStatus = async (checked, tag) => {
    try {
      const updatedStatus = checked;
      const response = await axios.patch(
        `${baseURL}api/update_lead_label_tag/${tag.id}/`,
        { status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        message.success("Tag status updated successfully");
        setTags((prevTags) =>
          prevTags.map((t) =>
            t.id === tag.id ? { ...t, status: updatedStatus } : t
          )
        );
      }
    } catch (err) {
      console.error("Error updating tag status:", err);
      message.error("Failed to update tag status");
    }
  };

  const handleEditTag = (tag) => {
    setTagId(tag.id); // Set tag id for editing
    setTagName(tag.name); // Pre-fill tag name
    setTagStatus(tag.status); // Pre-fill tag status
    setIsModalVisible(true); // Show the modal
  };

  const handleDeleteTag = (tag) => {
    setTagToDelete(tag); // Set tag to be deleted
    setIsDeleteModalVisible(true); // Show the delete confirmation modal
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${baseURL}api/delete_lead_label_tag/${tagToDelete.id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 204) {
        message.success("Tag deleted successfully");
        setTags((prevTags) =>
          prevTags.filter((t) => t.id !== tagToDelete.id)
        );
        setIsDeleteModalVisible(false); // Close the delete modal
        setTagToDelete(null); // Reset tag to be deleted
      }
    } catch (err) {
      console.error("Error deleting tag:", err);
      message.error("Failed to delete tag");
    }
  };

  const handleSaveTag = async () => {
    try {
      if (tagId) {
        // If tagId is set, update the existing tag
        const response = await axios.put(
          `${baseURL}api/update_lead_label_tag/${tagId}/`,
          { name: tagName, status: tagStatus },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status === 200) {
          message.success("Tag updated successfully");
          setIsModalVisible(false); // Close the modal
          setTagName(""); // Reset tag name
          setTagStatus(true); // Reset tag status to active (default)
          setTagId(null); // Reset tagId after updating
          // Re-fetch tags after updating
          setTags((prevTags) =>
            prevTags.map((t) =>
              t.id === tagId ? { ...t, name: tagName, status: tagStatus } : t
            )
          );
        }
      } else {
        // If tagId is not set, create a new tag
        const response = await axios.post(
          `${baseURL}api/create_lead_label_tag/`,
          { name: tagName, status: tagStatus },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status === 201) {
          message.success("Tag added successfully");
          setIsModalVisible(false); // Close the modal
          setTagName(""); // Reset tag name
          setTagStatus(true); // Reset tag status to active (default)
          // Add new tag to the state without re-fetching
          setTags((prevTags) => [
            ...prevTags,
            { id: response.data.id, name: tagName, status: tagStatus },
          ]);
        }
      }
    } catch (err) {
      console.error("Error saving tag:", err);
      message.error("Failed to save tag");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Lead Label Tags</h1>
        <div className="flex gap-2 items-center">
          <Input
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="Search lead labels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow flex items-center"
            onClick={() => setIsModalVisible(true)}
          >
            <PlusOutlined className="mr-2" /> Add New Lead Label Tag
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredTags}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Showing ${total} entries`,
        }}
      />

      {/* Modal for adding or editing a tag */}
      <Modal
        title={tagId ? "Edit Lead Label Tag" : "Add New Lead Label Tag"}
        visible={isModalVisible}
        onOk={handleSaveTag}
        onCancel={() => setIsModalVisible(false)}
      >
        <div>
          <div className="mb-4">
            <Input
              placeholder="Tag Name"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <span>Status: </span>
            <Switch
              checked={tagStatus}
              onChange={(checked) => setTagStatus(checked)}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Are you sure you want to delete this tag?"
        visible={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Deleting this tag will remove it permanently. Are you sure?</p>
      </Modal>
    </div>
  );
};

export default LeadLabelTagList;
