import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
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

  // Fetch students when component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const apiToken = localStorage.getItem("access");
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

  const handleViewEdit = (enrollmentId) => {
    console.log("Viewing/Editing student with Enrollment ID:", enrollmentId);
    navigate(`/edit-student/${enrollmentId}`);
  };

  const openStudentDeleteConfirmModal = (student) => {
    setStudentToDelete(student);
    setShowStudentDeleteConfirmModal(true);
  };

  const cancelStudentDelete = () => {
    setStudentToDelete(null);
    setShowStudentDeleteConfirmModal(false);
  };

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

  const closeStudentMessageModal = () => {
    setStudentModalMessage("");
    setShowStudentMessageModal(false);
  };

  // Define the table columns
  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1,
      sortable: true,
      style: {
        fontSize: "16px",  // Bigger font size for table content
      },
    },
    {
      name: "Student Name",
      selector: (row) => row.name,
      sortable: true,
      style: {
        fontSize: "16px",
      },
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
      style: {
        fontSize: "16px",
      },
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      style: {
        fontSize: "16px",
      },
    },
    {
      name: "Enrollment ID",
      selector: (row) => row.enrollment_id,
      sortable: true,
      style: {
        fontSize: "16px",
      },
    },
    {
      name: "Registration ID",
      selector: (row) => row.registration_id,
      sortable: true,
      style: {
        fontSize: "16px",
      },
    },
    {
      name: "Is Enrolled",
      selector: (row) => (row.is_enrolled ? "✔" : "✘"),
      sortable: true,
      style: {
        fontSize: "16px",
      },
      cell: (row) => (row.is_enrolled ? "✔" : "✘"),
    },
    {
      name: "View/Edit",
      cell: (row) => (
        <button
          onClick={() => handleViewEdit(row.enrollment_id)}
          className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 text-sm"
          style={{ fontSize: '16px' }}  // Bigger font size for View/Edit button
        >
          View/Edit
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      style: {
        minWidth: "120px",
        fontSize: "16px",  // Adjust font size for View/Edit button
      },
    },
    {
      name: "Delete",
      cell: (row) => (
        <button
          onClick={() => openStudentDeleteConfirmModal(row)}
          className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 text-sm"
          style={{ fontSize: '16px' }}  // Bigger font size for Delete button
        >
          Delete
        </button>
      ),
      ignoreRowClick: true, 
      allowOverflow: true,
      button: true,
      style: {
        minWidth: "120px",
        fontSize: "16px", // Adjust font size for Delete button
      },
    },
  ];

  return (
    <div className="quick-student-registration-page">
      <h1 className="font-bold text-2xl mb-4" style={{ fontSize: '30px' }}>List of Quick Registered Students</h1>

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
              background: "linear-gradient(to right, #d14744, #d34a46, #d24946, #d14643)",
              color: "white",
              fontSize: "18px",  // Bigger font size for table headers
            },
          },
        }}
        searchable={true} // Enable the built-in search bar
        defaultSearch={searchText} // Default search term
      />

      {/* Student Delete Confirmation Modal */}
      {showStudentDeleteConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h4 className="font-semibold text-lg mb-4" style={{ fontSize: '18px' }}>
              Are you sure you want to delete this student?
            </h4>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelStudentDelete}
                className="bg-gray-500 text-white py-1 px-4 rounded-md"
                style={{ fontSize: '16px' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteStudent}
                className="bg-red-500 text-white py-1 px-4 rounded-md"
                style={{ fontSize: '16px' }}
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
            <p className="mb-4" style={{ fontSize: '16px' }}>{studentModalMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={closeStudentMessageModal}
                className="bg-blue-500 text-white py-1 px-4 rounded-md"
                style={{ fontSize: '16px' }}
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
