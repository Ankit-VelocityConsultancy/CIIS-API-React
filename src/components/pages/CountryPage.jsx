import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, Button, message, Modal } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRecoilValue } from "recoil";
import { baseURLAtom, accessTokenAtom } from "@/recoil/atoms";

const CountryPage = () => {
  const baseURL = useRecoilValue(baseURLAtom);
  const accessToken = useRecoilValue(accessTokenAtom);
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");  // Initialize searchTerm state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [countryName, setCountryName] = useState("");
  const [shortname, setShortname] = useState("");  // New state for shortname
  const [countryId, setCountryId] = useState(null); // For editing
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${baseURL}api/get_all_countries/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCountries(response.data);
      } catch (err) {
        console.error("Error fetching countries:", err);
        message.error("Failed to load countries");
      }
    };

    fetchCountries();
  }, [baseURL, accessToken]);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Sr No",
      dataIndex: "sr_no",
      key: "sr_no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Country Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Shortname",
      dataIndex: "shortname",  // Display shortname in the table
      key: "shortname",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEditCountry(record)}
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
          onClick={() => handleDeleteCountry(record)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleEditCountry = (country) => {
    setCountryId(country.id);
    setCountryName(country.name);
    setShortname(country.shortname);  // Set shortname for editing
    setIsModalVisible(true);
  };

  const handleDeleteCountry = (country) => {
    setCountryToDelete(country);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${baseURL}api/delete_country/${countryToDelete.id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 204) {
        message.success("Country deleted successfully");
        setCountries((prevCountries) =>
          prevCountries.filter((country) => country.id !== countryToDelete.id)
        );
        setIsDeleteModalVisible(false);
      }
    } catch (err) {
      console.error("Error deleting country:", err);
      message.error("Failed to delete country");
    }
  };

  const handleSaveCountry = async () => {
    try {
      if (countryId) {
        const response = await axios.put(
          `${baseURL}api/update_country/${countryId}/`,
          { name: countryName, shortname },  // Send shortname as well
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status === 200) {
          message.success("Country updated successfully");
          setCountries((prevCountries) =>
            prevCountries.map((country) =>
              country.id === countryId ? { ...country, name: countryName, shortname } : country
            )
          );
          setIsModalVisible(false);
          setCountryName("");
          setShortname("");  // Reset shortname
          setCountryId(null);
        }
      } else {
        const response = await axios.post(
          `${baseURL}api/create_country/`,
          { name: countryName, shortname },  // Send shortname while creating
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status === 201) {
          message.success("Country added successfully");
          setCountries((prevCountries) => [
            ...prevCountries,
            { id: response.data.id, name: countryName, shortname },
          ]);
          setIsModalVisible(false);
          setCountryName("");
          setShortname("");  // Reset shortname
        }
      }
    } catch (err) {
      console.error("Error saving country:", err);
      message.error("Failed to save country");
    }
  };

  return (
    <div>
      <h1>Countries</h1>
      <Input
        placeholder="Search countries"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}  // Bind searchTerm here
      />
      <Button onClick={() => setIsModalVisible(true)}>
        <PlusOutlined /> Add New Country
      </Button>
      <Table columns={columns} dataSource={filteredCountries} rowKey="id" />
      <Modal
        title={countryId ? "Edit Country" : "Add New Country"}
        visible={isModalVisible}
        onOk={handleSaveCountry}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          placeholder="Country Name"
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
        />
        <Input
          placeholder="Shortname"
          value={shortname}
          onChange={(e) => setShortname(e.target.value)}  // Add shortname input field
        />
      </Modal>
      <Modal
        title="Are you sure?"
        visible={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      >
        <p>Are you sure you want to delete this country?</p>
      </Modal>
    </div>
  );
};

export default CountryPage;
