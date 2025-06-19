import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, Button, message, Modal, Switch, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRecoilValue } from "recoil";
import { baseURLAtom, accessTokenAtom } from "@/recoil/atoms";

const StatePage = () => {
  const baseURL = useRecoilValue(baseURLAtom);
  const accessToken = useRecoilValue(accessTokenAtom);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [stateName, setStateName] = useState("");
  const [stateStatus, setStateStatus] = useState(true); // Boolean value: true for Active, false for Inactive
  const [stateId, setStateId] = useState(null); // For editing state
  const [countryId, setCountryId] = useState(null); // To store selected country for state creation
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // For delete confirmation modal
  const [stateToDelete, setStateToDelete] = useState(null); // Store state to delete

  useEffect(() => {
    // Fetch countries from API
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${baseURL}api/get_all_countries/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCountries(response.data);
      } catch (err) {
        message.error("Failed to load countries");
      }
    };
    fetchCountries();
  }, [baseURL, accessToken]);

  useEffect(() => {
    if (countryId) {
      // Fetch states for the selected country
      const fetchStates = async () => {
        try {
          const response = await axios.get(`${baseURL}api/get_states_by_country/${countryId}/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setStates(response.data);
        } catch (err) {
          message.error("Failed to load states");
        }
      };
      fetchStates();
    }
  }, [baseURL, accessToken, countryId]);

  const columns = [
    {
      title: "Sr No",
      dataIndex: "sr_no",
      key: "sr_no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "State Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (country) => country.name, // Display country name
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
          onClick={() => handleEditState(record)}
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
          onClick={() => handleDeleteState(record)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleToggleStatus = async (checked, state) => {
    try {
      const updatedStatus = checked;
      const response = await axios.patch(
        `${baseURL}api/update_state/${state.id}/`,
        { status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        message.success("State status updated successfully");
        setStates((prevStates) =>
          prevStates.map((s) => (s.id === state.id ? { ...s, status: updatedStatus } : s))
        );
      }
    } catch (err) {
      message.error("Failed to update state status");
    }
  };

  const handleEditState = (state) => {
    setStateId(state.id);
    setStateName(state.name);
    setStateStatus(state.status);
    setCountryId(state.country.id);
    setIsModalVisible(true);
  };

  const handleDeleteState = (state) => {
    setStateToDelete(state);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${baseURL}api/delete_state/${stateToDelete.id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 204) {
        message.success("State deleted successfully");
        setStates((prevStates) =>
          prevStates.filter((s) => s.id !== stateToDelete.id)
        );
        setIsDeleteModalVisible(false);
        setStateToDelete(null);
      }
    } catch (err) {
      message.error("Failed to delete state");
    }
  };

  const handleSaveState = async () => {
    try {
      if (stateId) {
        const response = await axios.put(
          `${baseURL}api/update_state/${stateId}/`,
          { name: stateName, status: stateStatus, country_id: countryId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status === 200) {
          message.success("State updated successfully");
          setStates((prevStates) =>
            prevStates.map((s) =>
              s.id === stateId ? { ...s, name: stateName, status: stateStatus } : s
            )
          );
          setIsModalVisible(false);
          setStateName("");
          setStateStatus(true);
          setStateId(null);
        }
      } else {
        const response = await axios.post(
          `${baseURL}api/create_state/`,
          { name: stateName, status: stateStatus, country_id: countryId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status === 201) {
          message.success("State added successfully");
          setStates((prevStates) => [
            ...prevStates,
            { id: response.data.id, name: stateName, status: stateStatus },
          ]);
          setIsModalVisible(false);
          setStateName("");
          setStateStatus(true);
        }
      }
    } catch (err) {
      message.error("Failed to save state");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">States</h1>
        <div className="flex gap-2 items-center">
          <Input
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="Search states..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            placeholder="Select Country"
            onChange={(value) => setCountryId(value)}
            style={{ width: 200 }}
          >
            {countries.map((country) => (
              <Select.Option key={country.id} value={country.id}>
                {country.name}
              </Select.Option>
            ))}
          </Select>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow flex items-center"
            onClick={() => setIsModalVisible(true)}
          >
            <PlusOutlined className="mr-2" /> Add New State
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={states}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Showing ${total} entries`,
        }}
      />

      {/* Modal for adding or editing a state */}
      <Modal
        title={stateId ? "Edit State" : "Add New State"}
        visible={isModalVisible}
        onOk={handleSaveState}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          placeholder="State Name"
          value={stateName}
          onChange={(e) => setStateName(e.target.value)}
        />
        <Select
          placeholder="Select Country"
          value={countryId}
          onChange={(value) => setCountryId(value)}
          style={{ width: 200 }}
        >
          {countries.map((country) => (
            <Select.Option key={country.id} value={country.id}>
              {country.name}
            </Select.Option>
          ))}
        </Select>
        <Switch
          checked={stateStatus}
          onChange={(checked) => setStateStatus(checked)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Are you sure you want to delete this state?"
        visible={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Deleting this state will remove it permanently. Are you sure?</p>
      </Modal>
    </div>
  );
};

export default StatePage;
