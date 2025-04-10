import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod"; 
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const FeeReceiptsListPage = () => {
  const [feeReceipts, setFeeReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); 
  const baseURL = useRecoilValue(baseURLAtom);
  const [receiptToDelete, setReceiptToDelete] = useState(null);
  const [showReceiptDeleteConfirmModal, setShowReceiptDeleteConfirmModal] = useState(false);
  const [showReceiptMessageModal, setShowReceiptMessageModal] = useState(false);
  const [receiptModalMessage, setReceiptModalMessage] = useState("");

  const apiToken = localStorage.getItem("access");
  console.log("API Token==" + apiToken);

  useEffect(() => {
    const fetchFeeReceipts = async () => {
      try {
        const response = await axios.get(`${baseURL}api/fee-receipt-options/`, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        });
        setFeeReceipts(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeeReceipts();
  }, []);

  // Zod validation schema
  const feeReceiptSchema = z.object({
    name: z.string().min(1, "Fee Receipt Name is required."),
    status: z.string().min(1, "Status is required."), // Ensure status is selected correctly
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(feeReceiptSchema),
  });

  const handleFormSubmit = async (data) => {
    const { name, status } = data;

    try {
      let response;
      if (editingId) {
        response = await axios.put(
          `${baseURL}api/fee-receipt-options/${editingId}/`,
          { name, status },
          { headers: { Authorization: `Bearer ${apiToken}` } }
        );
        setFeeReceipts(feeReceipts.map((receipt) =>
          receipt.id === editingId ? { ...receipt, name, status } : receipt
        ));
      } else {
        response = await axios.post(
          `${baseURL}api/fee-receipt-options/`,
          { name, status },
          { headers: { Authorization: `Bearer ${apiToken}` } }
        );
        setFeeReceipts([...feeReceipts, response.data]);
      }

      setValue("name", ""); // Reset form fields
      setValue("status", "1"); // Reset status to "Active"
      setEditingId(null); // Reset editingId to stop editing
      setSuccessMessage("Fee Receipt added successfully!"); 
      setTimeout(() => {
        setSuccessMessage(""); 
      }, 10000);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (receipt) => {
    setEditingId(receipt.id);
    setValue("name", receipt.name);
    setValue("status", String(receipt.status)); // Ensure status is set as a string
  };

   // Open confirmation modal for a specific fee receipt.
  const openReceiptDeleteConfirmModal = (receipt) => {
    setReceiptToDelete(receipt);
    setShowReceiptDeleteConfirmModal(true);
  };

  // Cancel deletion.
  const cancelReceiptDelete = () => {
    setReceiptToDelete(null);
    setShowReceiptDeleteConfirmModal(false);
  };

  // Confirm deletion and call the API.
  const confirmDeleteReceipt = async () => {
    setShowReceiptDeleteConfirmModal(false);
    try {
      const response = await axios.delete(
        `${baseURL}api/fee-receipt-options/${receiptToDelete.id}/`,
        { headers: { Authorization: `Bearer ${apiToken}` } }
      );

      if (response.status === 204 || response.status === 200) {
        setReceiptModalMessage("Fee receipt option deleted successfully!");
        setFeeReceipts((prev) => prev.filter((receipt) => receipt.id !== receiptToDelete.id));
      } else {
        setReceiptModalMessage("Failed to delete fee receipt option.");
      }
    } catch (error) {
      console.error("Error deleting fee receipt option:", error.response ? error.response.data : error.message);
      const errorMsg =
        error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        error.response.data.message
          ? error.response.data.message
          : typeof error.response.data === "object"
          ? JSON.stringify(error.response.data)
          : error.response.data || error.message;
      setReceiptModalMessage(errorMsg);
      setError(errorMsg);
    }
    setReceiptToDelete(null);
    setShowReceiptMessageModal(true);
  };

  // Close the message modal.
  const closeReceiptMessageModal = () => {
    setReceiptModalMessage("");
    setShowReceiptMessageModal(false);
  };

  if (loading) {
    return <div>Loading fee receipts...</div>;
  }

  if (error) {
    return <div>Error: {typeof error === 'object' ? JSON.stringify(error) : error}</div>;
  }

  const columns = [
    { name: 'ID', selector: (row, index) => index + 1, sortable: true },
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Status', selector: row => row.status == 1 ? 'Active' : 'Inactive', sortable: true },
    { name: 'Actions', cell: (row) => (
        <div className="flex gap-2">
          <button className="bg-[#167fc7] text-white py-1 px-2 rounded-md" onClick={() => handleEdit(row)}>Edit</button>
          <button
                  className="bg-red-500 text-white py-1 px-2 rounded-md"
                  onClick={() => openReceiptDeleteConfirmModal(row)}
                >
                  Delete
                </button>
        </div>
      ),
    },
  ];

  return (
    <div className="fee-receipts-list-page">
      <h1 className="font-bold text-2xl mb-4">Fee Receipts List</h1>
      
      {/* Form to submit new or edit fee receipt */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="mb-4 mt-4 p-4 border rounded-lg shadow-md">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Fee Receipt Name</label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="name"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              )}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div className="flex-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <select
                  {...field}
                  id="status"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
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

      {/* DataTable to display fee receipts */}
      <DataTable columns={columns} data={feeReceipts} pagination highlightOnHover striped responsive />


        {/* Fee Receipt Delete Confirmation Modal */}
        {showReceiptDeleteConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h4 className="font-semibold text-lg mb-4">
              Are you sure you want to delete this fee receipt option?
            </h4>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelReceiptDelete}
                className="bg-gray-500 text-white py-1 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteReceipt}
                className="bg-red-500 text-white py-1 px-4 rounded-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fee Receipt Message Modal */}
      {showReceiptMessageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <p className="mb-4">{receiptModalMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={closeReceiptMessageModal}
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

export default FeeReceiptsListPage;
