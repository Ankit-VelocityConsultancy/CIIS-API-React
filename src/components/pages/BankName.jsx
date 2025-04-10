import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useForm, Controller } from "react-hook-form"; // Import the necessary hooks from react-hook-form
import * as z from "zod"; // Import zod for validation
import { zodResolver } from "@hookform/resolvers/zod"; // Zod resolver for react-hook-form
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const BankNamesListPage = () => {
  const [bankNames, setBankNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // Store the ID of the bank being edited
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const baseURL = useRecoilValue(baseURLAtom);
  const [bankToDelete, setBankToDelete] = useState(null);
  const [showBankDeleteConfirmModal, setShowBankDeleteConfirmModal] = useState(false);
  const [showBankMessageModal, setShowBankMessageModal] = useState(false);
  const [bankModalMessage, setBankModalMessage] = useState("");

  const apiToken = localStorage.getItem("access"); // Replace with your token source

  // Function to fetch bank names (GET request)
  useEffect(() => {
    const fetchBankNames = async () => {
      try {
        const response = await axios.get(`${baseURL}api/bank-names/`, {
          headers: {
            Authorization: `Bearer ${apiToken}`, // Include token in the Authorization header
          },
        });
        setBankNames(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBankNames();
  }, [apiToken]);

  // Zod validation schema
  const bankNameSchema = z.object({
    name: z.string().min(1, "Bank Name is required."),
    status: z.string().min(0, "Status is required."),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bankNameSchema), // Zod resolver for validation
  });

  // Function to handle form submission
  const handleFormSubmit = async (data) => {
    const { name, status } = data;

    try {
      let response;
      if (editingId) {
        response = await axios.put(
          `${baseURL}api/bank-names/${editingId}/`,
          { name, status },
          { headers: { Authorization: `Bearer ${apiToken}` } }
        );
        setBankNames((prevBankNames) =>
          prevBankNames.map((bank) =>
            bank.id === editingId ? { ...bank, name, status } : bank
          )
        );
      } else {
        response = await axios.post(
          `${baseURL}api/bank-names/`,
          { name, status },
          { headers: { Authorization: `Bearer ${apiToken}` } }
        );
        setBankNames((prevBankNames) => [...prevBankNames, response.data]);
      }

      setValue("name", ""); // Reset form fields
      setValue("status", 1); // Reset status
      setEditingId(null); // Reset editingId to stop editing
      setSuccessMessage("Bank added successfully!"); // Success message
      setTimeout(() => {
        setSuccessMessage(""); // Reset after 10 seconds
      }, 10000);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  // Function to handle Edit action
  const handleEdit = (bank) => {
    setEditingId(bank.id);
    setValue("name", bank.name);
    setValue("status", bank.status); // Ensure the status is correctly set in the form
  };

 // Function to open the delete confirmation modal for a specific bank name
const openBankDeleteConfirmModal = (bank) => {
  setBankToDelete(bank);
  setShowBankDeleteConfirmModal(true);
};

// Cancel deletion
const cancelBankDelete = () => {
  setBankToDelete(null);
  setShowBankDeleteConfirmModal(false);
};

// Confirm deletion: call the API and show the result in a message modal
const confirmDeleteBank = async () => {
  setShowBankDeleteConfirmModal(false);
  try {
    const response = await axios.delete(`${baseURL}api/bank-names/${bankToDelete.id}/`, {
      headers: { Authorization: `Bearer ${apiToken}` },
    });

    if (response.status === 204 || response.status === 200) {
      setBankModalMessage("Bank deleted successfully!");
      setBankNames((prev) => prev.filter((bank) => bank.id !== bankToDelete.id));
    } else {
      setBankModalMessage("Failed to delete bank.");
    }
  } catch (error) {
    console.error(
      "Error deleting bank:",
      error.response ? error.response.data : error.message
    );
    const errorMsg =
      error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      error.response.data.message
        ? error.response.data.message
        : typeof error.response.data === "object"
        ? JSON.stringify(error.response.data)
        : error.response.data || error.message;
    setBankModalMessage(errorMsg);
    setError(errorMsg);
  }
  setBankToDelete(null);
  setShowBankMessageModal(true);
};

// Close the bank message modal
const closeBankMessageModal = () => {
  setBankModalMessage("");
  setShowBankMessageModal(false);
};


  if (loading) {
    return <div>Loading bank names...</div>;
  }

  if (error) {
    return <div>Error: {typeof error === 'object' ? JSON.stringify(error) : error}</div>;
  }

  // Define the columns for the DataTable for Bank Names
  const columns = [
    {
      name: 'ID',
      selector: (row, index) => index + 1, // Generate a custom ID based on the index
      sortable: true,
    },
    {
      name: 'Bank Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status == 1 ? 'Active' : 'Inactive',
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="bg-[#167fc7] text-white py-1 px-2 rounded-md"
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white py-1 px-2 rounded-md"
            onClick={() => openBankDeleteConfirmModal(row)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bank-names-list-page">
      <h1 className="font-bold text-2xl mb-4">Bank Names List</h1>

      {/* Form to submit new or edit bank */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="mb-4 p-4 border rounded-lg shadow-md">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              )}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <select
                  {...field}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">select</option>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              )}
            />
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
          </div>

          <div className="flex items-end">
            <button type="submit" className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-[#167fc7]">
              {editingId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </form>

      {/* Show success message */}
      {successMessage && <div className="m-4 text-[#d24845]">{successMessage}</div>}

      {/* DataTable to display bank names */}
      <DataTable
        columns={columns}
        data={bankNames}
        pagination
        highlightOnHover
        striped
        responsive
        customStyles={{
          headCells: {
            style: {
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #d14744, #d34a46, #d24946, #d14643)',
              color: 'white',
            },
          },
        }}
      />

       {/* Bank Delete Confirmation Modal */}
    {showBankDeleteConfirmModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-80">
          <h4 className="font-semibold text-lg mb-4">
            Are you sure you want to delete this bank?
          </h4>
          <div className="flex justify-end gap-4">
            <button
              onClick={cancelBankDelete}
              className="bg-gray-500 text-white py-1 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteBank}
              className="bg-red-500 text-white py-1 px-4 rounded-md"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Bank Message Modal */}
    {showBankMessageModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-80">
          <p className="mb-4">{bankModalMessage}</p>
          <div className="flex justify-end">
            <button
              onClick={closeBankMessageModal}
              className="bg-blue-500 text-white py-1 px-4 rounded-md"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default BankNamesListPage;
