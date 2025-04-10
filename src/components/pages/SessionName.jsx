import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

// Define the Zod validation schema
const sessionSchema = z.object({
  sessionName: z.string().min(1, "Session Name is required."),
  status: z.string([z.literal(1), z.literal(0)]),  // Only allow 1 or 0
});

const SessionNamesListPage = () => {
  const [sessionNames, setSessionNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // To store the ID of the session being edited
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const baseURL = useRecoilValue(baseURLAtom);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [showSessionDeleteConfirmModal, setShowSessionDeleteConfirmModal] = useState(false);
  const [showSessionMessageModal, setShowSessionMessageModal] = useState(false);
  const [sessionModalMessage, setSessionModalMessage] = useState("");
  const apiToken = localStorage.getItem("access"); // Replace with your token source
  console.log("API Token==", apiToken);

  // Use React Hook Form with Zod validation resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(sessionSchema),
  });

  // Function to fetch session names (GET request)
  useEffect(() => {
    const fetchSessionNames = async () => {
      try {
        const response = await axios.get(`${baseURL}api/session-names/`, {
          headers: {
            Authorization: `Bearer ${apiToken}`, // Include token in the Authorization header
          },
        });
        setSessionNames(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionNames();
  }, [apiToken]);

  // Function to handle form submission (POST/PUT request)
  const onSubmit = async (data) => {
    try {
      let response;
      // Ensure the status is a number (parse it if it's a string)
      const status = Number(data.status);
      
      if (editingId) {
        // If editing, send a PUT request to update the session
        response = await axios.put(
          `${baseURL}api/session-names/${editingId}/`,
          { name: data.sessionName, status: status },
          { headers: { Authorization: `Bearer ${apiToken}` } }
        );
        // Update the session in the list after editing
        setSessionNames((prevSessionNames) =>
          prevSessionNames.map((session) =>
            session.id === editingId ? { ...session, name: data.sessionName, status: status } : session
          )
        );
      } else {
        // If creating a new session, send a POST request
        response = await axios.post(
          `${baseURL}api/session-names/`,
          { name: data.sessionName, status: status },
          { headers: { Authorization: `Bearer ${apiToken}` } }
        );
        // Add the new session to the list
        setSessionNames((prevSessionNames) => [...prevSessionNames, response.data]);
      }

      // After successful form submission, reset the form
      reset();
      setSuccessMessage("Session added successfully!"); // Set the success message
      setTimeout(() => {
        setSuccessMessage(""); // Reset the success message after 10 seconds
      }, 10000);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  // Function to handle Edit action
  const handleEdit = (session) => {
    setEditingId(session.id);
    setValue("sessionName", session.name);
    setValue("status", session.status); // Ensure the status is correctly set in the form
  };

  // Open confirmation modal for a specific session
  const openSessionDeleteConfirmModal = (session) => {
    setSessionToDelete(session);
    setShowSessionDeleteConfirmModal(true);
  };

  // Cancel deletion
  const cancelSessionDelete = () => {
    setSessionToDelete(null);
    setShowSessionDeleteConfirmModal(false);
  };

  // Confirm deletion: call the API and display the result in a message modal
  const confirmDeleteSession = async () => {
    setShowSessionDeleteConfirmModal(false);
    try {
      const response = await axios.delete(`${baseURL}api/session-names/${sessionToDelete.id}/`, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      if (response.status === 204 || response.status === 200) {
        setSessionModalMessage("Session deleted successfully!");
        setSessionNames((prev) => prev.filter((session) => session.id !== sessionToDelete.id));
      } else {
        setSessionModalMessage("Failed to delete session.");
      }
    } catch (error) {
      console.error("Error deleting session:", error.response ? error.response.data : error.message);
      const errorMsg =
        error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        error.response.data.message
          ? error.response.data.message
          : typeof error.response.data === "object"
          ? JSON.stringify(error.response.data)
          : error.response.data || error.message;
      setSessionModalMessage(errorMsg);
      setError(errorMsg);
    }
    setSessionToDelete(null);
    setShowSessionMessageModal(true);
  };

  // Close the message modal
  const closeSessionMessageModal = () => {
    setSessionModalMessage("");
    setShowSessionMessageModal(false);
  };


  if (loading) {
    return <div>Loading session names...</div>;
  }

  if (error) {
    return <div>Error: {typeof error === 'object' ? JSON.stringify(error) : error}</div>;
  }

  // Define the columns for the DataTable for Session Names
  const columns = [
    {
      name: 'ID',
      selector: (row, index) => index + 1, // Generate a custom ID based on the index
      sortable: true,
    },
    {
      name: 'Session Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => (row.status == 1 ? 'Active' : 'Inactive'),
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
                  onClick={() => openSessionDeleteConfirmModal(row)}
                >
                  Delete
                </button>
        </div>
      ),
    },
  ];

  return (
    <div className="session-names-list-page">
      <h1 className="font-bold text-2xl mb-4">Session Names List</h1>

      {/* Form to submit new or edit session */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 mt-4 p-4 border rounded-lg shadow-md">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="sessionName" className="block text-sm font-medium text-gray-700">
              Session Name
            </label>
            <input
              type="text"
              id="sessionName"
              {...register("sessionName")}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.sessionName && <p className="text-red-500 text-sm mt-1">{errors.sessionName.message}</p>}
          </div>

          <div className="flex-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              {...register("status")}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">select</option>
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
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

      {/* DataTable to display session names */}
      <DataTable
        columns={columns}
        data={sessionNames}
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
              color: "white",
            },
          },
        }}
      />

      {/* Session Delete Confirmation Modal */}
      {showSessionDeleteConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h4 className="font-semibold text-lg mb-4">
              Are you sure you want to delete this session?
            </h4>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelSessionDelete}
                className="bg-gray-500 text-white py-1 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSession}
                className="bg-red-500 text-white py-1 px-4 rounded-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Message Modal */}
      {showSessionMessageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <p className="mb-4">{sessionModalMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={closeSessionMessageModal}
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

export default SessionNamesListPage;
