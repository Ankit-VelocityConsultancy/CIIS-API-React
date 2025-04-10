import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import the navigation hook
import axios from "axios";
import DataTable from "react-data-table-component";
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const StudentRegistrationViewPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("Velocity"); // Default search term
  const navigate = useNavigate(); // Initialize the navigate function
  const baseURL = useRecoilValue(baseURLAtom);
  // States for student deletion modals
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [showStudentDeleteConfirmModal, setShowStudentDeleteConfirmModal] = useState(false);
  const [showStudentMessageModal, setShowStudentMessageModal] = useState(false);
  const [studentModalMessage, setStudentModalMessage] = useState("");
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const apiToken = localStorage.getItem("access"); // Retrieve the token
        const response = await axios.get(
          `${baseURL}api/quick-registered-students/`,
          {
            headers: {
              'Authorization': `Bearer ${apiToken}`, // Add token to headers
            }
          }
        );
        setStudents(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStudents();
  }, []);
  

  if (loading) {
    return <div>Loading students...</div>;
  }

  // Error handling: Display a meaningful error message
  if (error) {
    return (
      <div className="error-message">
        <p>{error.detail ? error.detail : JSON.stringify(error)}</p>
      </div>
    );
  }

  // Handle View/Edit button click
  const handleViewEdit = (enrollmentId) => {
    console.log("Viewing/Editing student with Enrollment ID:", enrollmentId);
    navigate(`/edit-student/${enrollmentId}`); // Navigate to the edit page with enrollment_id
  };

  // Open the confirmation modal for a specific student
  const openStudentDeleteConfirmModal = (student) => {
    setStudentToDelete(student);
    setShowStudentDeleteConfirmModal(true);
  };

  // Cancel deletion
  const cancelStudentDelete = () => {
    setStudentToDelete(null);
    setShowStudentDeleteConfirmModal(false);
  };

  // Confirm deletion: call the API and show a message modal with the result
const confirmDeleteStudent = async () => {
  setShowStudentDeleteConfirmModal(false);
  const apiToken = localStorage.getItem("access"); // Retrieve the token
  try {
    await axios.delete(`${baseURL}api/delete-student/${studentToDelete.id}/`, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });
    // Remove the deleted student from the state
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== studentToDelete.id)
    );
    setStudentModalMessage("Student deleted successfully!");
  } catch (error) {
    console.error(
      "Error deleting student:",
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
    setError(errorMsg);
    setStudentModalMessage("Error deleting student!");
  }
  setStudentToDelete(null);
  setShowStudentMessageModal(true);
};


  // Close the message modal
  const closeStudentMessageModal = () => {
    setStudentModalMessage("");
    setShowStudentMessageModal(false);
  };
  // Define the table columns
  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1, // Generate a custom ID based on the index
      sortable: true,
    },
    {
      name: "Student Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Enrollment ID",
      selector: (row) => row.enrollment_id,
      sortable: true,
    },
    {
      name: "Registration ID",
      selector: (row) => row.registration_id,
      sortable: true,
    },
    {
      name: "Is Enrolled",
      selector: (row) => (row.is_enrolled ? "✔" : "✘"),
      sortable: true,
      cell: (row) => (row.is_enrolled ? "✔" : "✘"),
    },
    {
      name: "View/Edit",
      cell: (row) => (
        <button
          onClick={() => handleViewEdit(row.enrollment_id)}
          className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 text-sm"
        >
          View/Edit
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      style: {
        minWidth: "120px",
      },
    },
    {
      name: "Delete",
      cell: (row) => (
        <button
        onClick={() => openStudentDeleteConfirmModal(row)}
          className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 text-sm"
        >
          Delete
        </button>
      ),
      ignoreRowClick: true, // Prevent row click from triggering row select when there are buttons
      allowOverflow: true,
      button: true,
      style: {
        minWidth: "120px", // Adjust the width for the Delete column
      },
    },
  ];

  return (
    <div className="quick-student-registration-page">
      <h1 className="font-bold text-2xl mb-4">List of Quick Registered Students</h1>

      {/* DataTable with built-in search */}
      <DataTable
        columns={columns}
        data={students}
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
        // Built-in search functionality
        searchable={true} // Enable the built-in search bar
        defaultSearch={searchText} // Default search term
      />


       {/* Student Delete Confirmation Modal */}
       {showStudentDeleteConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h4 className="font-semibold text-lg mb-4">
              Are you sure you want to delete this student?
            </h4>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelStudentDelete}
                className="bg-gray-500 text-white py-1 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteStudent}
                className="bg-red-500 text-white py-1 px-4 rounded-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Message Modal */}
      {showStudentMessageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <p className="mb-4">{studentModalMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={closeStudentMessageModal}
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

export default StudentRegistrationViewPage;
