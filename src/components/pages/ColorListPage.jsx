import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, Button, message, Modal } from "antd";
import { useRecoilValue } from "recoil";
import { baseURLAtom, accessTokenAtom } from "@/recoil/atoms";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ColorList = () => {
  const baseURL = useRecoilValue(baseURLAtom);
  const accessToken = useRecoilValue(accessTokenAtom);
  const [colors, setColors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [colorName, setColorName] = useState("");
  const [colorValue, setColorValue] = useState("#000000");
  const [colorId, setColorId] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [colorToDelete, setColorToDelete] = useState(null);

  // fetch all colors
  const fetchColors = async () => {
    try {
      const response = await axios.get(`${baseURL}api/get_all_colors/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setColors(response.data);
    } catch (err) {
      message.error("Failed to load colors");
    }
  };

  useEffect(() => {
    fetchColors();
  }, [baseURL, accessToken]);

  // Filter colors based on search
  const filteredColors = colors.filter((color) =>
    color.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: "Sr No",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Color Name",
      dataIndex: "name",
    },
    {
      title: "Color",
      dataIndex: "color",
      render: (color) => (
        <div style={{ width: "40px", height: "20px", background: color, border: "1px solid #ccc" }}></div>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditColor(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteColor(record)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const handleEditColor = (color) => {
    setColorId(color.id);
    setColorName(color.name);
    setColorValue(color.color);
    setIsModalVisible(true);
  };

  const handleDeleteColor = (color) => {
    setColorToDelete(color);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${baseURL}api/delete_color/${colorToDelete.id}/`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.status === 204) {
        message.success("Color deleted successfully");
        fetchColors();
        setIsDeleteModalVisible(false);
        setColorToDelete(null);
      }
    } catch (err) {
      message.error("Failed to delete color");
    }
  };

  const handleSaveColor = async () => {
    if (!colorName || !colorValue) {
      message.error("Color name and color value are required");
      return;
    }
    try {
      if (colorId) {
        // update
        const response = await axios.put(
          `${baseURL}api/update_color/${colorId}/`,
          { name: colorName, color: colorValue },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (response.status === 200) {
          message.success("Color updated successfully");
          fetchColors();
          resetModal();
        }
      } else {
        // create
        const response = await axios.post(
          `${baseURL}api/create_color/`,
          { name: colorName, color: colorValue },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (response.status === 201) {
          message.success("Color added successfully");
          fetchColors();
          resetModal();
        }
      }
    } catch (err) {
      message.error("Failed to save color");
    }
  };

  const resetModal = () => {
    setIsModalVisible(false);
    setColorName("");
    setColorValue("#000000");
    setColorId(null);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Colors</h1>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search colors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Add New Color
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredColors}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* Modal for add/edit color */}
      <Modal
        title={colorId ? "Edit Color" : "Add New Color"}
        open={isModalVisible}
        onOk={handleSaveColor}
        onCancel={resetModal}
      >
        <Input
          placeholder="Color Name"
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <input
          type="color"
          value={colorValue}
          onChange={(e) => setColorValue(e.target.value)}
          style={{ width: "100%", height: "40px" }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        title="Are you sure you want to delete this color?"
        open={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Deleting this color will remove it permanently. Are you sure?</p>
      </Modal>
    </div>
  );
};

export default ColorList;
