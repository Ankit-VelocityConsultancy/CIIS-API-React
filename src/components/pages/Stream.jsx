import { useEffect, useState } from "react";
import axios from "axios";
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const StreamListPage = () => {
  const [streams, setStreams] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [coursesByUniversity, setCoursesByUniversity] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streamName, setStreamName] = useState("");
  const [streamYear, setStreamYear] = useState("");
  const [sem, setSem] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCourseID, setSelectedCourseID] = useState("");
  const [file, setFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentStream, setCurrentStream] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUniversityCourses, setSelectedUniversityCourses] = useState([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editedStream, setEditedStream] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [formError, setFormErrors] = useState({});
  const [editedStreams, setEditedStreams] = useState({});
  const baseURL = useRecoilValue(baseURLAtom);
  const [streamToDelete, setStreamToDelete] = useState(null);
  const [showStreamDeleteConfirmModal, setShowStreamDeleteConfirmModal] = useState(false);
  const [showStreamMessageModal, setShowStreamMessageModal] = useState(false);
  const [streamModalMessage, setStreamModalMessage] = useState("");
  
  const apiToken = localStorage.getItem("access"); // Replace with your token source
  console.log("API Token=="+apiToken);

  // Fetch universities with authentication
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const apiToken = localStorage.getItem("access"); // Retrieve the token
        const response = await axios.get(`${baseURL}api/universities/`, {
          headers: {
            Authorization: `Bearer ${apiToken}`, // Add the token to the headers
          },
        });
        setUniversities(response.data);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };
    fetchUniversities();
  }, []);

  // Fetch courses for a specific university
const fetchCoursesForUniversity = async (universityName) => {
  try {
    const apiToken = localStorage.getItem("access"); // Retrieve the token
    const response = await axios.get(`${baseURL}api/courses/`, {
      params: { university: universityName },
      headers: {
        'Authorization': `Bearer ${apiToken}`, // Add token to headers
      },
    });
    setCoursesByUniversity((prevState) => ({
      ...prevState,
      [universityName]: response.data.courses,
    }));
  } catch (error) {
    setError(error.response ? error.response.data : error.message);
  }
};

const validateForm = () => {
  let errors = {};

  if (!selectedUniversity.trim()) {
    errors.selectedUniversity = "University Name is required.";
  }

  if (!selectedCourse.trim()) {
    errors.selectedCourse = "Course Name is required.";
  }

  if (!streamName.trim()) {
    errors.streamName = "Stream Name is required.";
  }

  if (!streamYear.trim()) {
    errors.streamYear = "Stream Year is required.";
  }

  if (!sem.trim()) {
    errors.sem = "Course Duration is required.";
  }

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

  // Handle stream form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const formData = {
      university_name: selectedUniversity,
      course_name: selectedCourse,
      stream_name: streamName,
      year: streamYear,
      sem: sem,
    };
    console.log("Formdata of Stream===");
    console.log(formData);

    try {

      if (editMode) {
        const response = await axios.put(
          `${baseURL}api/updatee-streams/${currentStream.id}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${apiToken}`,
            },
          }
        );
        const updatedStreams = streams.map((stream) =>
          stream.id === currentStream.id ? response.data : stream
        );
        setStreams(updatedStreams);
      } else {
        const response = await axios.post(
          `${baseURL}api/create-stream/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${apiToken}`,
            },
          }
        );
        setStreams([...streams, response.data]);
      }

      setStreamName("");
      setStreamYear("");
      setSem("");
      setSelectedUniversity("");
      setSelectedCourse("");
      setFile(null);
      setEditMode(false);
      setCurrentStream(null);
      setSuccessMessage("Stream added successfully!"); // Set the success message
      setTimeout(() => {
        setSuccessMessage(""); // Reset the success message after 10 seconds
      }, 10000);

    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  // Handle stream edit
  const handleEdit = (stream) => {
    setStreamName(stream.stream_name);
    setStreamYear(stream.year);
    setSem(stream.sem);
    setSelectedUniversity(stream.university_name);
    setSelectedCourse(stream.course_name);
    setFile(null);
    setEditMode(true);
    setCurrentStream(stream);
  };

  // Fetch courses for all universities when universities data is available
  useEffect(() => {
    if (universities.length > 0) {
      universities.forEach((university) => {
        fetchCoursesForUniversity(university.university_name);
      });
    }
  }, [universities]);

  const handleCourseClick = (universityName) => {
    setSelectedUniversity(universityName); // Ensure the university is set before opening the modal
    setSelectedUniversityCourses(coursesByUniversity[universityName]);
    setShowModal(true);
  };
  

  // Modal close handler
  const closeModal = () => {
    setShowModal(false);
  };
  // Function to open the modal showing courses for a university
  const openModal = (university) => {
    setSelectedUniversity(university); // Set the selected university
    setSelectedUniversityCourses(coursesByUniversity[university]); // Fetch courses dynamically
    setShowModal(true);
  };
  
  const openCourseModal = (course, course_id) => {
    console.log('Course passed to modal:', course_id);  // Ensure this is the full object
    setSelectedCourse(course);  // Set the full course object here
    setShowCourseModal(true);  // Open the course modal
    fetchStreamsForCourse(course, selectedUniversity);  // Pass both course and university
    setSelectedCourseID(course_id);
};

  
  // Function to close the second modal
  const closeCourseModal = () => {
    setShowCourseModal(false);
    setSelectedCourse(null); // Reset the selected course
  };

  const fetchStreamsForCourse = async (course, university) => {
    try {
      setLoading(true);
      const apiToken = localStorage.getItem("access"); // Retrieve the token
      const response = await axios.get(`${baseURL}api/streams/`, {
        params: { course: course, university: university },
        headers: {
          'Authorization': `Bearer ${apiToken}`, // Add token to headers
        },
      });
  
      console.log(response.data); // Debugging
  
      if (response.data) {
        // Set the course ID from the response
        setSelectedCourseID(response.data.course_id);
  
        if (Array.isArray(response.data.streams)) {
          setStreams(response.data.streams); // Set the streams array correctly
          console.log(response.data.streams);
        } else {
          setStreams([]); // Default to empty array if no streams are found
        }
      }
      setLoading(false);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };
  
  
  const handleStreamInputChange = (e, stream_id, field) => {
    const { value } = e.target;
  
    setEditedStreams((prevState) => ({
      ...prevState,
      [stream_id]: {
        ...prevState[stream_id], 
        [field]: value, 
      },
    }));
  };
  
  
  const handleUpdateStreams = async () => {
    const updatedStreams = streams.map((stream) => {
      const updatedStream = editedStreams[stream.stream_id] || {};
      return {
        id: stream.stream_id,
        name: updatedStream.stream_name || stream.stream_name,
        year: updatedStream.year || stream.year,
      };
    });
  
    const payload = updatedStreams;
  
    try {
      const response = await fetch(`${baseURL}api/update-streams/${selectedCourseID}/`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorDetail = await response.json();
        throw new Error('Failed to update streams');
      }
  
      const updatedData = await response.json();
  
      setStreams(updatedData.updated_streams);
  
      setSuccessMessage('Streams updated successfully.');
  
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
  
      setEditedStreams({});
  
    } catch (error) {
      setError({ message: error.message });
    }
  };
  
   // Open the deletion confirmation modal for a stream
   const openStreamDeleteConfirmModal = (streamId) => {
    setStreamToDelete(streamId);
    setShowStreamDeleteConfirmModal(true);
  };

  // Cancel deletion: close the confirmation modal
  const cancelStreamDelete = () => {
    setStreamToDelete(null);
    setShowStreamDeleteConfirmModal(false);
  };

  // Confirm deletion: call the API and display the result in a message modal
  const confirmDeleteStream = async () => {
    setShowStreamDeleteConfirmModal(false);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete_stream/${streamToDelete}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
      });

      // Attempt to parse the response JSON. If empty, default to an empty object.
      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        data = {};
      }

      // If the API returns a message (e.g., an error), show that message.
      if (data.message) {
        setStreamModalMessage(data.message);
      } else if (response.ok) {
        // If no message is returned and response is ok, assume deletion was successful.
        setStreamModalMessage("Stream deleted successfully!");
        // Update the streams state to remove the deleted stream.
        const updatedList = streams.filter((s) => s.stream_id !== streamToDelete);
        setStreams(updatedList);
      } else {
        setStreamModalMessage("Failed to delete stream.");
      }
    } catch (error) {
      console.error("Error deleting stream:", error);
      setStreamModalMessage("Error deleting stream.");
    }
    setStreamToDelete(null);
    setShowStreamMessageModal(true);
  };

  // Close the stream message modal
  const closeStreamMessageModal = () => {
    setStreamModalMessage("");
    setShowStreamMessageModal(false);
  };
  

  return (
    <div className="stream-list-page">
      <h1 className="font-bold text-2xl mb-4">Stream List</h1>

      <form onSubmit={handleSubmit} className="m-4 p-4 border rounded-lg shadow-md">
        <div className="flex gap-4">
          {/* University Dropdown */}
          <div className="flex-1">
            <label
              htmlFor="universityDropdown"
              className="block text-sm font-medium text-gray-700"
            >
              Select University
              <span className="text-red-500">*</span></label>
               <select
              id="university"
              value={selectedUniversity}
              onChange={(e) => {
                setSelectedUniversity(e.target.value);
                if (formError.selectedUniversity) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, selectedUniversity: "" }));
                }
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a university</option>
              {universities.map((university) => (
                <option key={university.id} value={university.university_name}>
                  {university.university_name}
                </option>
              ))}
            </select>
            {formError.selectedUniversity && <p className="text-red-500 text-xs">{formError.selectedUniversity}</p>}
          </div>

          {/* Course Dropdown */}
          <div className="flex-1">
            <label
              htmlFor="courseDropdown"
              className="block text-sm font-medium text-gray-700"
            >
              Select Course
              <span className="text-red-500">*</span></label>
            <select
              id="courseDropdown"
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                if (formError.selectedCourse) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, selectedCourse: "" }));
                }
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={!selectedUniversity} // Disable if no university is selected
            >
              <option value="">Select a course</option>
              {coursesByUniversity[selectedUniversity]?.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
            {formError.selectedCourse && <p className="text-red-500 text-xs">{formError.selectedCourse}</p>}
          </div>
        </div>

        {/* Stream Details Inputs */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="streamName"
              className="block text-sm font-medium text-gray-700"
            >
              Stream Name
              <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="streamName"
              value={streamName}
              onChange={(e) => {
                setStreamName(e.target.value);
                if (formError.streamName) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, streamName: "" }));
                }
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formError.streamName && <p className="text-red-500 text-xs">{formError.streamName}</p>}
          </div>

          <div className="flex-1">
            <label
              htmlFor="streamYear"
              className="block text-sm font-medium text-gray-700"
            >
              Stream Year
            </label>
            <input
              type="number"
              id="streamYear"
              value={streamYear}
              onChange={(e) => {
                setStreamYear(e.target.value);
                if (formError.streamYear) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, streamYear: "" }));
                }
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formError.streamYear && <p className="text-red-500 text-xs">{formError.streamYear}</p>}
          </div>

          <div className="flex-1">
            <label
              htmlFor="sem"
              className="block text-sm font-medium text-gray-700"
            >
              Course Duration
              <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="sem"
              value={sem}
              onChange={(e) => {
                setSem(e.target.value);
                if (formError.sem) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, sem: "" }));
                }
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formError.sem && <p className="text-red-500 text-xs">{formError.sem}</p>}
          </div>
        </div>

        {/* File Upload */}
        <div className="flex gap-4">
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-[#167fc7]"
            >
              {editMode ? "Update Stream" : "Save Stream"}
            </button>
          </div>
        </div>
      </form>
       {/* Show success message */}
       {successMessage && <div className="m-4 text-[#d24845]">{successMessage}</div>}

      <h2 className="font-bold text-xl mt-6">Existing Streams</h2>

      <div className="stream-list mt-4">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">University</th>
              <th className="p-2 border">Courses</th>
            </tr>
          </thead>
          <tbody>
            {universities.map((university, index) => (
              <tr key={university.id}>
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{university.university_name}</td>
                <td className="p-2 border">
                  {coursesByUniversity[university.university_name]
                    ? coursesByUniversity[university.university_name].map((course, i) => (
                        <button
                          key={i}
                          onClick={() => handleCourseClick(university.university_name)}
                          className="bg-[#d3eaff] text-[#3577b1] p-1 rounded-md mr-2"
                        >
                          {course}
                        </button>
                      ))
                    : "Loading..."}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for showing all courses of a university */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="font-bold text-xl mb-4">Courses for {selectedUniversity}</h3>
            <ul>
              {selectedUniversityCourses.map((course, i) => (
                <li
                  key={i}
                  className="bg-[#d3eaff] text-[#3577b1] p-2 rounded-md mb-2 cursor-pointer"
                  onClick={() => openCourseModal(course)} // Open course modal when a course is clicked
                >
                  {course}
                </li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-[#167fc7]"
            >
              Close
            </button>
          </div>
        </div>
      )}

{showCourseModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="font-bold text-xl mb-4">
              Streams for {selectedCourse} = {selectedCourseID} = {selectedUniversity}
            </h3>

            {loading ? (
              <p>Loading streams...</p>
            ) : (
              Array.isArray(streams) && streams.length > 0 ? (
                streams.map((stream) => (
                  <div key={stream.stream_id} className="mb-4">
                    <h4 className="font-semibold">{stream.stream_name}</h4>
                    <div className="flex gap-4 items-center">
                      <div className="flex-1">
                        <input
                          type="text"
                          name="stream_name"
                          value={
                            editedStreams[stream.stream_id]?.stream_name ||
                            stream.stream_name
                          }
                          onChange={(e) =>
                            handleStreamInputChange(e, stream.stream_id, 'stream_name')
                          }
                          className="mt-2 p-2 border rounded-md w-full"
                          placeholder="Stream Name"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          name="year"
                          value={
                            editedStreams[stream.stream_id]?.year || stream.year
                          }
                          onChange={(e) =>
                            handleStreamInputChange(e, stream.stream_id, 'year')
                          }
                          className="mt-2 p-2 border rounded-md w-full"
                          placeholder="Year"
                        />
                      </div>
                      {/* Delete Button for stream */}
                      <button
                        onClick={() => openStreamDeleteConfirmModal(stream.stream_id)}
                        className="bg-red-500 text-white py-1 px-2 rounded-md mt-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No streams available</p>
              )
            )}

            <button
              onClick={handleUpdateStreams}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Update Streams
            </button>

            {successMessage && (
              <p className="mt-2 text-green-500">{successMessage}</p>
            )}

            {error && (
              <div className="text-red-500 mt-4">
                <p>{error.detail || error.message || 'An error occurred'}</p>
              </div>
            )}

            <button
              onClick={closeCourseModal}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Stream Delete Confirmation Modal */}
      {showStreamDeleteConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h4 className="font-semibold text-lg mb-4">
              Are you sure you want to delete this stream?
            </h4>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelStreamDelete}
                className="bg-gray-500 text-white py-1 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteStream}
                className="bg-red-500 text-white py-1 px-4 rounded-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stream Message Modal */}
      {showStreamMessageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <p className="mb-4">{streamModalMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={closeStreamMessageModal}
                className="bg-blue-500 text-white py-1 px-4 rounded-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}


      {error && (
        <div className="error-message text-red-500 mt-4">
          <p>{error.detail ? error.detail : JSON.stringify(error)}</p>
        </div>
      )}
    </div>
  );
};
export default StreamListPage;
