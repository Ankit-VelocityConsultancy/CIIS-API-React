import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, Button, message, Modal, Switch } from "antd";
import { useRecoilValue } from "recoil";
import { baseURLAtom, accessTokenAtom } from "@/recoil/atoms";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CategoryList = () => {
  const baseURL = useRecoilValue(baseURLAtom);
  const accessToken = useRecoilValue(accessTokenAtom);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryStatus, setCategoryStatus] = useState(true); // Boolean value: true for Active, false for Inactive
  const [categoryId, setCategoryId] = useState(null); // To store category id for editing
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // For delete confirmation modal
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Store category to delete
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseURL}api/get_all_categories/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status === 200) {
          setCategories(response.data); // Assuming the API response has a list of categories
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        message.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, [baseURL, accessToken]);

  // Filter categories based on the search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      render: (text) => text || "N/A", // Display "N/A" if name is empty
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
        <div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditCategory(record)}
            style={{ marginRight: "8px" }}
          >
            Edit
          </Button>
        </div>
      ),
    },
    {
      title: "Delete",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCategory(record)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Toggle status
  const handleToggleStatus = async (checked, category) => {
    try {
      const updatedStatus = checked;
      const response = await axios.patch(
        `${baseURL}api/update_category_status/`, // Your API endpoint to update category status
        { id: category.id, status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        message.success("Category status updated successfully");
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat.id === category.id ? { ...cat, status: updatedStatus } : cat
          )
        );
      }
    } catch (err) {
      console.error("Error updating category status:", err);
      message.error("Failed to update category status");
    }
  };

  // Open modal to edit category
  const handleEditCategory = (category) => {
    setCategoryId(category.id); // Set category id for editing
    setCategoryName(category.name); // Pre-fill category name
    setCategoryStatus(category.status); // Pre-fill category status
    setIsModalVisible(true); // Show the modal
  };

  // Open delete confirmation modal
  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category); // Set category to be deleted
    setIsDeleteModalVisible(true); // Show the delete confirmation modal
  };

  // Delete category
  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${baseURL}api/delete_category/${categoryToDelete.id}/`, // Your API endpoint for deleting
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 204) {
        message.success("Category deleted successfully");
        setCategories((prevCategories) =>
          prevCategories.filter((cat) => cat.id !== categoryToDelete.id)
        );
        setIsDeleteModalVisible(false); // Close the delete modal
        setCategoryToDelete(null); // Reset category to be deleted
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      message.error("Failed to delete category");
    }
  };

  // Save the updated category or create a new one
  const handleSaveCategory = async () => {
    try {
      if (categoryId) {
        // If categoryId is set, update the existing category
        const response = await axios.put(
          `${baseURL}api/update_category/${categoryId}/`, // Your API endpoint for editing
          {
            name: categoryName,
            status: categoryStatus, // Send the boolean value directly
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 200) {
          message.success("Category updated successfully");
          setIsModalVisible(false); // Close the modal
          setCategoryName(""); // Reset category name
          setCategoryStatus(true); // Reset category status to active (default)
          setCategoryId(null); // Reset categoryId after updating
          // Refetch categories after updating
          const result = await axios.get(`${baseURL}api/get_all_categories/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setCategories(result.data); // Update the categories list
        }
      } else {
        // If categoryId is not set, create a new category
        const response = await axios.post(
          `${baseURL}api/create_category/`, // Your API endpoint for adding
          {
            name: categoryName,
            status: categoryStatus, // Send the boolean value directly
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 201) {
          message.success("Category added successfully");
          setIsModalVisible(false); // Close the modal
          setCategoryName(""); // Reset category name
          setCategoryStatus(true); // Reset category status to active (default)
          // Refetch categories after adding
          const result = await axios.get(`${baseURL}api/get_all_categories/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setCategories(result.data); // Update the categories list
        }
      }
    } catch (err) {
      console.error("Error saving category:", err);
      message.error("Failed to save category");
    }
  };

  // Add new category modal
  const handleAddCategory = () => {
    setCategoryId(null); // Reset category id for new category
    setIsModalVisible(true); // Open the modal
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Categories</h1>
        <div className="flex gap-2 items-center">
          <Input
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow flex items-center"
            onClick={handleAddCategory}
          >
            <PlusOutlined className="mr-2" /> Add New Category
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredCategories}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Showing ${total} entries`,
        }}
      />

      {/* Modal for adding or editing a category */}
      <Modal
        title={categoryId ? "Edit Category" : "Add New Category"}
        visible={isModalVisible}
        onOk={handleSaveCategory}
        onCancel={() => setIsModalVisible(false)}
      >
        <div>
          <div className="mb-4">
            <Input
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <span>Status: </span>
            <Switch
              checked={categoryStatus}
              onChange={(checked) => setCategoryStatus(checked)}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Are you sure you want to delete this category?"
        visible={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Deleting this category will remove it permanently. Are you sure?</p>
      </Modal>
    </div>
  );
};

export default CategoryList;
