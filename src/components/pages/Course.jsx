import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const CourseListPage = () => {
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [university, setUniversity] = useState("");
  const [file, setFile] = useState(null); // For file upload (e.g., syllabus)
  const [formError, setFormErrors] = useState({});
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]); // This will hold the courses and their years
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const baseURL = useRecoilValue(baseURLAtom);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [showCourseDeleteConfirmModal, setShowCourseDeleteConfirmModal] = useState(false);
  const [showCourseMessageModal, setShowCourseMessageModal] = useState(false);
  const [courseModalMessage, setCourseModalMessage] = useState("");

  useEffect(() => {
    const apiToken = localStorage.getItem("access");
  
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${baseURL}api/universities/`, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        });
        setUniversities(response.data);
      } catch (error) {
        console.error("Error fetching universities:", error);
        setError(error.response ? error.response.data : error.message);
      }
    };
  
    const fetchCoursesByUniversity = async () => {
      try {
        const response = await axios.get(`${baseURL}api/universities-courses/`, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        });
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError(error.response ? error.response.data : error.message);
      }
    };
  
    fetchUniversities();
    fetchCoursesByUniversity();
  }, []);
  

    // Opens the deletion confirmation modal for a given course.
  const openCourseDeleteConfirmModal = (courseId) => {
    setCourseToDelete(courseId);
    setShowCourseDeleteConfirmModal(true);
  };

  // Cancels deletion.
  const cancelCourseDelete = () => {
    setCourseToDelete(null);
    setShowCourseDeleteConfirmModal(false);
  };

  // Confirms deletion by calling the API and then shows a message modal.
  const confirmDeleteCourse = async () => {
    setShowCourseDeleteConfirmModal(false);
    const apiToken = localStorage.getItem("access");
    try {
      const response = await axios.delete(`${baseURL}api/delete_course/${courseToDelete}/`, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });
    
      if (response.status === 204) { // Successful deletion
        setCourseModalMessage("Course deleted successfully!");
        // Remove the deleted course from selectedCourses.
        setSelectedCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== courseToDelete)
        );
        // Fetch updated courses after deletion.
        const updatedResponse = await axios.get(`${baseURL}api/universities-courses/`, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        });
        setCourses(updatedResponse.data);
      } else {
        setCourseModalMessage("Failed to delete course.");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      // If error.response.data is an object, extract the message or stringify it.
      const errorMsg =
        error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        error.response.data.message
          ? error.response.data.message
          : typeof error.response.data === "object"
          ? JSON.stringify(error.response.data)
          : error.response.data || error.message;
      setCourseModalMessage(errorMsg);
    }
    
    setCourseToDelete(null);
    setShowCourseMessageModal(true);
  };

  // Closes the message modal.
  const closeCourseMessageModal = () => {
    setCourseModalMessage("");
    setShowCourseMessageModal(false);
  };


  useEffect(() => {
    if (universities.length > 0 && Object.keys(courses).length > 0) {
      setLoading(false);
    }
  }, [universities, courses]);

  if (loading) {
    return <div>Loading universities and courses...</div>;
  }

  // Error handling
  if (error) {
    return (
      <div className="error-message">
        <p>{error.detail ? error.detail : JSON.stringify(error)}</p>
      </div>
    );
  }

  // Filter out universities that do not have any courses
  const filteredData = universities
    .filter((university) => courses[university.university_name] && courses[university.university_name].length > 0)
    .map((university) => ({
      university_name: university.university_name,
      courses: courses[university.university_name].map((course) => course.name).join(", "),
    }));

  const columns = [
    {
      name: 'ID',
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "University",
      selector: (row) => row.university_name,
      sortable: true,
    },
    {
      name: "Courses",
      selector: (row) => row.courses,
      sortable: true,
      cell: (row) => {
        const courseList = row.courses.split(", ");
        return (
          <>
            {courses[row.university_name]?.map((course) => (
              <div key={course.id} className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(row.university_name, course.name)}
                  className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-700"
                >
                  {course.name}
                </button>
              </div>
            ))}
          </>
        );
      },
    },
  ];

  // Open the modal and set the selected university and courses
  const openEditModal = (universityName, courseName) => {
    setSelectedUniversity(universityName);
    setSelectedCourses(courses[universityName].map(course => ({
      ...course,
      isEditing: course.name === courseName
    })));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUniversity(null);
    setSelectedCourses([]);
  };

  const handleUpdateCourse = async (courseId, newName, newYear) => {
    if (!newName || !newYear) return;
  
    const apiToken = localStorage.getItem("access");
  
    try {
      const response = await axios.put(
        `${baseURL}api/update-course/${courseId}/`,
        { name: newName, year: newYear },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        console.log("Course updated successfully");
  
        // Fetch updated courses
        const updatedResponse = await axios.get(`${baseURL}api/universities-courses/`, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        });
  
        setCourses(updatedResponse.data);
        closeModal();
      }
    } catch (error) {
      console.error("Error updating course:", error);
      setError(error.response ? error.response.data : error.message);
    }
  };

  const apiToken = localStorage.getItem("access"); // Replace with your token source
  console.log("API Token=="+apiToken);

  const validateForm = () => {
    let errors = {};
  
    if (!university.trim()) {
      errors.university = "University Name is required.";
    } else if (university.length < 3 || university.length > 100) {
      errors.university = "University Name must be between 3 and 100 characters.";
    }
  
    if (!courseName.trim()) {
      errors.courseName = "course Name is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setFormErrors({});

    const apiToken = localStorage.getItem("access");
  
    const formData = new FormData();
    formData.append("university_name", university);
    formData.append("name", courseName);
    if (file) {
      formData.append("course_file", file);
    }
  
    try {
      await axios.post(`${baseURL}api/create-courses/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${apiToken}`,
        },
      });
  
      const response = await axios.get(`${baseURL}api/universities-courses/`, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });
  
      setCourses(response.data);
      setCourseName("");
      setUniversity("");
      setFile(null);
      setSuccessMessage("Course added successfully!"); // Set the success message
      setTimeout(() => {
        setSuccessMessage(""); // Reset the success message after 10 seconds
      }, 10000);
      
    } catch (error) {
      console.error("Error adding course:", error);
      setError(error.response ? error.response.data : error.message);
    }
  };
  
  return (
    <div className="course-list-page">
      <h1 className="font-bold text-2xl mb-4">Course List</h1>

      <form onSubmit={handleSubmit} className="m-4 p-4 border rounded-lg shadow-md">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="university" className="block text-sm font-medium text-gray-700">
              University
              <span className="text-red-500">*</span></label>
            <select
              id="university"
              value={university}
              onChange={(e) => {
                setUniversity(e.target.value);
                if (formError.university) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, university: "" }));
                }
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select University</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.university_name}>
                  {uni.university_name}
                </option>
              ))}
            </select>
            {formError.university && <p className="text-red-500 text-xs">{formError.university}</p>}
          </div>

          <div className="flex-1">
            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
              Course Name
              <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="courseName"
              value={courseName}
              onChange={(e) => {
                setCourseName(e.target.value);
                if (formError.courseName) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, courseName: "" }));
                }
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
             {formError.courseName && <p className="text-red-500 text-xs">{formError.courseName}</p>}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="courseFile" className="block text-sm font-medium text-gray-700">
              Upload Course File (Syllabus)
            </label>
            <input
              type="file"
              id="courseFile"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-[#167fc7]"
            >
              Submit Course
            </button>
          </div>
        </div>
      </form>

          {/* Show success message */}
          {successMessage && <div className="m-4 text-[#d24845]">{successMessage}</div>}

      {/* Displaying universities and their courses in a table */}
      <div className="course-table">
        <DataTable
          columns={columns}
          data={filteredData}
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
              },
            },
          }}
        />
      </div>

       {/* Modal for editing courses */}
       {showModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Edit Courses for {selectedUniversity}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {selectedCourses.map((course) => (
                  <div key={course.id} className="mb-4">
                    <div className="mb-3">
                      <label className="form-label">Course Name</label>
                      <input
                        type="text"
                        value={course.isEditing ? course.name : course.name}
                        onChange={(e) => {
                          const updatedCourses = selectedCourses.map((c) =>
                            c.id === course.id
                              ? { ...c, name: e.target.value, isEditing: true }
                              : c
                          );
                          setSelectedCourses(updatedCourses);
                        }}
                        className="form-control"
                      />
                    </div>

                    <button
                      onClick={() =>
                        handleUpdateCourse(course.id, course.name, course.year)
                      }
                      className="btn btn-success"
                    >
                      Update Course
                    </button>

                    {/* Updated Delete Button to use custom modal */}
                    <button
                      onClick={() => openCourseDeleteConfirmModal(course.id)}
                      className="btn btn-danger ml-2"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Delete Confirmation Modal */}
      {showCourseDeleteConfirmModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this course?</p>
              </div>
              <div className="modal-footer">
                <button
                  onClick={cancelCourseDelete}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteCourse}
                  className="btn btn-danger"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

     {/* Course Message Modal */}
{showCourseMessageModal && (
  <div className="modal fade show" style={{ display: 'block' }}>
    <div className="modal-dialog modal-sm">
      <div className="modal-content">
        <div className="modal-body">
          <p>{courseModalMessage}</p>
        </div>
        <div className="modal-footer">
          <button
            onClick={closeCourseMessageModal}
            className="btn btn-primary"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default CourseListPage;
