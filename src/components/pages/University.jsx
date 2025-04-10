import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { z } from "zod"; // Import Zod for validation
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const UniversityListPage = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [universityName, setUniversityName] = useState("");
  const [universityAddress, setUniversityAddress] = useState("");
  const [universityCity, setUniversityCity] = useState("");
  const [universityState, setUniversityState] = useState("");
  const [universityPincode, setUniversityPincode] = useState(""); // Added pincode state
  const [file, setFile] = useState(null); // For file upload
  const [formErrors, setFormErrors] = useState({}); // Form error state
  const [editMode, setEditMode] = useState(false); // To toggle between add and edit mode
  const [currentUniversity, setCurrentUniversity] = useState(null); // Store the university being edited
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const baseURL = useRecoilValue(baseURLAtom);
  const apiToken = localStorage.getItem("access");
// States for university deletion modals:
const [universityToDelete, setUniversityToDelete] = useState(null);
const [showUniversityDeleteConfirmModal, setShowUniversityDeleteConfirmModal] = useState(false);
const [showUniversityMessageModal, setShowUniversityMessageModal] = useState(false);
const [universityModalMessage, setUniversityModalMessage] = useState("");

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${baseURL}api/universities/`, {
          headers: { Authorization: `Bearer ${apiToken}` },
        });
        setUniversities(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, [baseURL, apiToken]); // Make sure to include baseURL in the dependency array


  if (loading) {
    return <div>Loading universities...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error.detail ? error.detail : JSON.stringify(error)}</p>
      </div>
    );
  }

  // Define Zod schema for validation
  const universitySchema = z.object({
    universityName: z
      .string()
      .min(3, "University Name must be between 3 and 100 characters.")
      .max(100, "University Name must be between 3 and 100 characters."),
    universityAddress: z
      .string()
      .min(5, "University Address must be at least 5 characters long."),
    universityCity: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, "University City must contain only letters."),
    universityState: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, "University State must contain only letters."),
    universityPincode: z
      .string()
      .regex(/^\d{6}$/, "University Pincode must be a 6-digit number."),
  });

  const validateForm = (data) => {
    const result = universitySchema.safeParse(data); // Zod validation
    if (result.success) {
      setFormErrors({});
      return true;
    } else {
      const errors = result.error.format(); // Get errors in a structured format
      const formattedErrors = {}; // Format errors to display
      for (const key in errors) {
        if (errors[key]._errors) {
          formattedErrors[key] = errors[key]._errors[0]; // Take the first error message
        }
      }
      setFormErrors(formattedErrors); // Set formatted errors for each field
      return false;
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);  // Ensure we convert the FileList to an array
    setFile(files);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = {
      universityName,
      universityAddress,
      universityCity,
      universityState,
      universityPincode,
    };
  
    // Validate form using Zod
    if (!validateForm(formData)) return;
  
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("university_name", universityName);
    formDataToSubmit.append("university_address", universityAddress);
    formDataToSubmit.append("university_city", universityCity);
    formDataToSubmit.append("university_state", universityState);
    formDataToSubmit.append("university_pincode", universityPincode);
  
    // Ensure 'file' exists and is an array before appending it
    if (file && Array.isArray(file) && file.length > 0) {
      file.forEach((f) => formDataToSubmit.append("university_logo", f));
    }
  
    try {
      if (editMode) {
        const response = await axios.put(
          `${baseURL}api/universities/${currentUniversity.id}/`,
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${apiToken}`,
            },
          }
        );
        setUniversities((prev) =>
          prev.map((uni) =>
            uni.id === currentUniversity.id ? response.data : uni
          )
        );
      } else {
        const response = await axios.post(
          `${baseURL}api/universities/`,
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${apiToken}`,
            },
          }
        );
        setUniversities([...universities, response.data]);
      }
  
      // Reset form and state
      setUniversityName("");
      setUniversityAddress("");
      setUniversityCity("");
      setUniversityState("");
      setUniversityPincode("");
      setFile(null);
      setEditMode(false);
      setCurrentUniversity(null);
      setSuccessMessage("University added successfully!");
      setTimeout(() => {
        setSuccessMessage(""); // Reset success message
      }, 10000);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };
  

  const handleEdit = (university) => {
    setUniversityName(university.university_name);
    setUniversityAddress(university.university_address);
    setUniversityCity(university.university_city);
    setUniversityState(university.university_state);
    setUniversityPincode(university.university_pincode);
    setFile(null);
    setEditMode(true);
    setCurrentUniversity(university);
  };

 // Open confirmation modal when delete button is clicked
const openUniversityDeleteConfirmModal = (row) => {
  setUniversityToDelete(row);
  setShowUniversityDeleteConfirmModal(true);
};

// Cancel deletion
const cancelUniversityDelete = () => {
  setUniversityToDelete(null);
  setShowUniversityDeleteConfirmModal(false);
};

// Confirm deletion: call the API and then show the result message in a modal
const confirmDeleteUniversity = async () => {
  setShowUniversityDeleteConfirmModal(false);
  try {
    const response = await axios.delete(`${baseURL}api/delete_university/${universityToDelete.id}/`, {
      headers: { Authorization: `Bearer ${apiToken}` },
    });
    // Check for success status (204 No Content or 200 OK)
    if (response.status === 204 || response.status === 200) {
      setUniversityModalMessage("University deleted successfully!");
      setUniversities((prev) => prev.filter((uni) => uni.id !== universityToDelete.id));
    } else {
      setUniversityModalMessage("Failed to delete university.");
    }
  } catch (error) {
    console.error("Error deleting university:", error.response ? error.response.data : error.message);
    const errorMsg =
      error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      error.response.data.message
        ? error.response.data.message
        : error.response.data || error.message;
    setUniversityModalMessage(errorMsg);
  }
  setUniversityToDelete(null);
  setShowUniversityMessageModal(true);
};

const closeUniversityMessageModal = () => {
  setUniversityModalMessage("");
  setShowUniversityMessageModal(false);
};

 // Your columns definition:
const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "Name",
    selector: (row) => row.university_name,
    sortable: true,
  },
  {
    name: "Registration ID",
    selector: (row) => row.registrationID,
    sortable: true,
  },
  {
    name: "Actions",
    cell: (row) => (
      <button
        onClick={() => handleEdit(row)}
        className="bg-[#167fc7] text-white py-2 px-4 rounded-md hover:bg-yellow-600"
      >
        Edit
      </button>
    ),
  },
  {
    name: "Actions",
    cell: (row) => (
      <button
        // Instead of directly calling handleDelete, open the custom modal:
        onClick={() => openUniversityDeleteConfirmModal(row)}
        className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
      >
        Delete
      </button>
    ),
  },
];

  return (
    <div className="university-list-page">
      <h1 className="font-bold text-2xl mb-4">University List</h1>

      <form onSubmit={handleSubmit} className="m-4 p-4 border rounded-lg shadow-md">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="universityName" className="block text-sm font-medium text-gray-700">
              University Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="universityName"
              value={universityName}
              onChange={(e) => {
                setUniversityName(e.target.value);
                setFormErrors((prevErrors) => ({
                  ...prevErrors,
                  universityName: "", // Clear the error when typing
                }));
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            />
            {formErrors.universityName && (
              <p className="text-red-500 text-xs">{formErrors.universityName}</p>
            )}
          </div>

          <div className="flex-1">
            <label htmlFor="universityAddress" className="block text-sm font-medium text-gray-700">
              University Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="universityAddress"
              value={universityAddress}
              onChange={(e) => {
                setUniversityAddress(e.target.value);
                setFormErrors((prevErrors) => ({
                  ...prevErrors,
                  universityAddress: "", // Clear the error when typing
                }));
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            />
            {formErrors.universityAddress && (
              <p className="text-red-500 text-xs">{formErrors.universityAddress}</p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="universityCity" className="block text-sm font-medium text-gray-700">
              University City
            </label>
            <input
              type="text"
              id="universityCity"
              value={universityCity}
              onChange={(e) => {
                setUniversityCity(e.target.value);
                setFormErrors((prevErrors) => ({
                  ...prevErrors,
                  universityCity: "", // Clear the error when typing
                }));
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            />
            {formErrors.universityCity && (
              <p className="text-red-500 text-xs">{formErrors.universityCity}</p>
            )}
          </div>

          <div className="flex-1">
            <label htmlFor="universityState" className="block text-sm font-medium text-gray-700">
              University State
            </label>
            <input
              type="text"
              id="universityState"
              value={universityState}
              onChange={(e) => {
                setUniversityState(e.target.value);
                setFormErrors((prevErrors) => ({
                  ...prevErrors,
                  universityState: "", // Clear the error when typing
                }));
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            />
            {formErrors.universityState && (
              <p className="text-red-500 text-xs">{formErrors.universityState}</p>
            )}
          </div>

          <div className="flex-1">
            <label htmlFor="universityPincode" className="block text-sm font-medium text-gray-700">
              University Pincode
            </label>
            <input
              type="text"
              id="universityPincode"
              value={universityPincode}
              onChange={(e) => {
                setUniversityPincode(e.target.value);
                setFormErrors((prevErrors) => ({
                  ...prevErrors,
                  universityPincode: "", // Clear the error when typing
                }));
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            />
            {formErrors.universityPincode && (
              <p className="text-red-500 text-xs">{formErrors.universityPincode}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            University Logo
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            accept="image/*"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          {editMode ? "Update University" : "Add University"}
        </button>
      </form>

      {successMessage && (
        <div className="bg-green-500 text-white p-4 mt-4 rounded-md">{successMessage}</div>
      )}


      <DataTable
        columns={columns}
        data={universities}
        pagination
        highlightOnHover
      />



       {/* University Delete Confirmation Modal */}
    {showUniversityDeleteConfirmModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-80">
          <h4 className="font-semibold text-lg mb-4">
            Are you sure you want to delete this university?
          </h4>
          <div className="flex justify-end gap-4">
            <button
              onClick={cancelUniversityDelete}
              className="bg-gray-500 text-white py-1 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteUniversity}
              className="bg-red-500 text-white py-1 px-4 rounded-md"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    )}

    {/* University Message Modal */}
    {showUniversityMessageModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-80">
          <p className="mb-4">{universityModalMessage}</p>
          <div className="flex justify-end">
            <button
              onClick={closeUniversityMessageModal}
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

export default UniversityListPage;
