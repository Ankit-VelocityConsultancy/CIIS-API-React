import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, Button, message, Modal ,Select  } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRecoilValue } from "recoil";
import { baseURLAtom, accessTokenAtom } from "@/recoil/atoms";

const StatePage = () => {
  const baseURL = useRecoilValue(baseURLAtom);
  const accessToken = useRecoilValue(accessTokenAtom);

  const [states, setStates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [stateName, setStateName] = useState("");
  const [stateId, setStateId] = useState(null); // editing
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [stateToDelete, setStateToDelete] = useState(null);
  const [countryId, setCountryId] = useState(null);  // <-- add this
  const [countries, setCountries] = useState([]); // <-- add this

  // fetch all states on load
  const fetchCountries = async () => {
  try {
    const res = await axios.get(`${baseURL}api/get_all_countries/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setCountries(res.data);
  } catch (err) {
    message.error("Failed to load countries");
  }
};

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${baseURL}api/states_new/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setStates(response.data);
    } catch (err) {
      message.error("Failed to load states");
    }
  };

  useEffect(() => {
    fetchStates();
    fetchCountries();

  }, [baseURL, accessToken]);

  const handleSaveState = async () => {
    if (!stateName || !countryId) {
      message.error("State name is required");
      return;
    }
    try {
      if (stateId) {
        // update
        const response = await axios.put(
          `${baseURL}api/states_new/${stateId}/update/`,
          { name: stateName, country: countryId },   // <-- use selected countryId
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status === 200) {
          message.success("State updated");
          fetchStates();
          resetModal();
        }
      } else {
        // create
        const response = await axios.post(
          `${baseURL}api/states_new/create/`,
          { name: stateName, country: countryId },   // <-- use selected countryId
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status === 201) {
          message.success("State created");
          fetchStates();
          resetModal();
        }
      }
    } catch (err) {
      message.error("Failed to save state");
    }
  };

  const resetModal = () => {
    setIsModalVisible(false);
    setStateId(null);
    setStateName("");
  };

  const handleEditState = (state) => {
    setStateId(state.id);
    setStateName(state.name);
    setIsModalVisible(true);
  };

  const handleDeleteState = (state) => {
    setStateToDelete(state);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${baseURL}api/states_new/${stateToDelete.id}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      message.success("State deleted");
      fetchStates();
      setIsDeleteModalVisible(false);
      setStateToDelete(null);
    } catch (err) {
      message.error("Failed to delete state");
    }
  };

  const filteredStates = states.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Sr No",
      render: (_, __, index) => index + 1,
    },
    {
      title: "State Name",
      dataIndex: "name",
    },
    {
      title: "Country",
      dataIndex: "country_name", // coming from serializer
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditState(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteState(record)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">States</h1>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search states..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Add New State
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredStates}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title={stateId ? "Edit State" : "Add State"}
        open={isModalVisible}
        onOk={handleSaveState}
        onCancel={resetModal}
      >
        <Input
          placeholder="State name"
          value={stateName}
          onChange={(e) => setStateName(e.target.value)}
          style={{ marginBottom: 10 }}
        />

        <Select
          placeholder="Select country"
          value={countryId}
          onChange={(value) => setCountryId(value)}
          style={{ width: "100%" }}
        >
          {countries.map((country) => (
            <Select.Option key={country.id} value={country.id}>
              {country.name}
            </Select.Option>
          ))}
        </Select>
      </Modal>



      {/* delete confirmation */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this state?</p>
      </Modal>
    </div>
  );
};

export default StatePage;
