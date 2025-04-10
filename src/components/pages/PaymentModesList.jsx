import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod"; // Zod schema validation
import { zodResolver } from "@hookform/resolvers/zod"; // Zod resolver for react-hook-form
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const PaymentModesListPage = () => {
  const [paymentModes, setPaymentModes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // To track the record being edited
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const baseURL = useRecoilValue(baseURLAtom);
  const [modeToDelete, setModeToDelete] = useState(null);
  const [showModeDeleteConfirmModal, setShowModeDeleteConfirmModal] = useState(false);
  const [showModeMessageModal, setShowModeMessageModal] = useState(false);
  const [modeModalMessage, setModeModalMessage] = useState("");
  const apiToken = localStorage.getItem("access"); // Replace with your token source
  console.log("API Token==" + apiToken);

  useEffect(() => {
    const fetchPaymentModes = async () => {
      try {
        const response = await axios.get(`${baseURL}api/payment-modes/`, {
          headers: {
            Authorization: `Bearer ${apiToken}`, // Include token in the Authorization header
          },
        });
        setPaymentModes(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentModes();
  }, []);

  // Zod validation schema
  const paymentModeSchema = z.object({
    name: z.string().min(1, "Payment Mode Name is required."), // Ensure name is provided
    status: z.string().min(0, "Status is required.") // Ensure status is selected
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentModeSchema), // Zod resolver for validation
  });

  // Handle form submission
  const handleFormSubmit = async (data) => {
    const { name, status } = data;

    try {
      let response;
      if (editingId) {
        // Edit existing payment mode
        response = await axios.put(
          `${baseURL}api/payment-modes/${editingId}/`,
          { name, status },
          { headers: { Authorization: `Bearer ${apiToken}` } }
        );
        setPaymentModes(
          paymentModes.map((mode) =>
            mode.id === editingId ? { ...mode, name, status } : mode
          )
        );
      } else {
        // Create new payment mode
        response = await axios.post(
          `${baseURL}api/payment-modes/`,
          { name, status },
          { headers: { Authorization: `Bearer ${apiToken}` } }
        );
        setPaymentModes([...paymentModes, response.data]);
      }

      setValue("name", ""); // Reset form fields
      setValue("status", 1);
      setEditingId(null);
      setSuccessMessage("Payment Mode added successfully!"); // Success message
      setTimeout(() => {
        setSuccessMessage(""); // Reset after 10 seconds
      }, 10000);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  // Handle edit action for a specific record
  const handleEdit = (mode) => {
    setEditingId(mode.id);
    setValue("name", mode.name);
    setValue("status", mode.status);
  };

   // Open confirmation modal for a specific payment mode.
   const openModeDeleteConfirmModal = (mode) => {
    setModeToDelete(mode);
    setShowModeDeleteConfirmModal(true);
  };

  // Cancel deletion.
  const cancelModeDelete = () => {
    setModeToDelete(null);
    setShowModeDeleteConfirmModal(false);
  };

  // Confirm deletion and call the API.
  const confirmDeleteMode = async () => {
    setShowModeDeleteConfirmModal(false);
    try {
      const response = await axios.delete(`${baseURL}api/payment-modes/${modeToDelete.id}/`, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });

      if (response.status === 204 || response.status === 200) {
        setModeModalMessage("Payment mode deleted successfully!");
        setPaymentModes((prev) => prev.filter((mode) => mode.id !== modeToDelete.id));
      } else {
        setModeModalMessage("Failed to delete payment mode.");
      }
    } catch (error) {
      console.error("Error deleting payment mode:", error.response ? error.response.data : error.message);
      const errorMsg =
        error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        error.response.data.message
          ? error.response.data.message
          : typeof error.response.data === "object"
          ? JSON.stringify(error.response.data)
          : error.response.data || error.message;
      setModeModalMessage(errorMsg);
      setError(errorMsg);
    }
    setModeToDelete(null);
    setShowModeMessageModal(true);
  };

  // Close the message modal.
  const closeModeMessageModal = () => {
    setModeModalMessage("");
    setShowModeMessageModal(false);
  };

  if (loading) {
    return <div>Loading payment modes...</div>;
  }

  if (error) {
    return <div>Error: {typeof error === "object" ? JSON.stringify(error) : error}</div>;
  }

  // Define the columns for the DataTable
  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1, // Generate a custom ID based on the index
      sortable: true,
    },
    {
      name: "Payment Mode Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (row.status == 1 ? "Active" : "Inactive"),
      sortable: true,
    },
    {
      name: "Actions",
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
            onClick={() => openModeDeleteConfirmModal(row)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="payment-modes-list-page">
      <h1 className="font-bold text-2xl mb-4">Payment Modes List</h1>

      {/* Form to submit new or edit payment mode */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="mb-4 p-4 border rounded-lg shadow-md">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Mode Name</label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md shadow-sm"
                />
              )}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <select {...field} className="mt-1 p-2 w-full border rounded-md shadow-sm">
                  <option value="">select</option>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              )}
            />
            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
          </div>

          <button
            type="submit"
            className="bg-red-500 w-[130px] text-white py-2 px-4 rounded-md hover:bg-[#167fc7]"
          >
            {editingId ? "Update" : "Save"}
          </button>
        </div>
      </form>

      {/* Show success message */}
      {successMessage && <div className="m-4 text-[#d24845]">{successMessage}</div>}

      {/* DataTable to display payment modes */}
      <DataTable
        columns={columns}
        data={paymentModes}
        pagination
        highlightOnHover
        striped
        responsive
        customStyles={{
          headCells: {
            style: {
              fontWeight: "bold",
              background:
                "linear-gradient(to right, #d14744, #d34a46, #d24946, #d14643)",
              color: "white", // Optional: change the text color for better contrast
            },
          },
        }}
      />



       {/* Payment Mode Delete Confirmation Modal */}
       {showModeDeleteConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h4 className="font-semibold text-lg mb-4">
              Are you sure you want to delete this payment mode?
            </h4>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelModeDelete}
                className="bg-gray-500 text-white py-1 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteMode}
                className="bg-red-500 text-white py-1 px-4 rounded-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Mode Message Modal */}
      {showModeMessageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <p className="mb-4">{modeModalMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={closeModeMessageModal}
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

export default PaymentModesListPage;
