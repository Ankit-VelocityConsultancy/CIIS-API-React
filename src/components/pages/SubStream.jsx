import { useEffect, useState } from "react";
import axios from "axios";
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const StreamListPage = () => {
  const [streams, setStreams] = useState([]); // List of streams for the selected course
  const [universities, setUniversities] = useState([]);
  const [coursesByUniversity, setCoursesByUniversity] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState("");
  const [stream, setStream] = useState("");
  const [streamName, setStreamName] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showModal, setShowModal] = useState(false); // Show the modal when course is clicked
  const [modalStreams, setModalStreams] = useState([]); // List of streams to show in the modal
  const [modalStreamss, setModalStreamss] = useState([]); 
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormErrors] = useState({});
  const baseURL = useRecoilValue(baseURLAtom);
  const [selectedStream, setSelectedStream] = useState(null);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const apiToken = localStorage.getItem("access");
  const [updatedSubstreams, setUpdatedSubstreams] = useState(selectedStream?.substreams || []);
  const substreams = selectedStream?.substreams || [];  // Safe fallback if substreams is undefined
  const [substreamToDelete, setSubstreamToDelete] = useState(null);
  const [showSubstreamDeleteConfirmModal, setShowSubstreamDeleteConfirmModal] = useState(false);
  const [showSubstreamMessageModal, setShowSubstreamMessageModal] = useState(false);
  const [substreamModalMessage, setSubstreamModalMessage] = useState("");

  // Fetch universities with authentication
  useEffect(() => {
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
      }
    };
    fetchUniversities();
  }, []);

  // Fetch courses for a specific university
  const fetchCoursesForUniversity = async (universityName) => {
    try {
      const response = await axios.get(`${baseURL}api/courses/`, {
        params: { university: universityName },
        headers: {
          Authorization: `Bearer ${apiToken}`,
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

  useEffect(() => {
    if (universities.length > 0) {
      universities.forEach((university) => {
        fetchCoursesForUniversity(university.university_name);
      });
    }
  }, [universities]);

  // Fetch streams for the selected course and university
const fetchStreamsForCourse = async (courseName, universityName) => {
  try {
    const response = await axios.get(`${baseURL}api/streams/`, {
      params: { course: courseName, university: universityName },
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });
    
    // If no streams are found, set the appropriate message
    if (response.data.streams.length === 0) {
      setStreams([]); // Clear any previous streams
      setModalStreams([]); // Clear modal streams
      setError("Streams are not available for this course and university.");
    } else {
      setStreams(response.data.streams); // Set streams for dropdown
      setModalStreams(response.data.streams); // Set streams to display in modal
      setModalStreamss(response.data);
      setError(""); // Clear any error if streams are found
    }
  } catch (error) {
    setError("Error fetching streams.");
  }
};

 // Handle course click to open modal
const handleCourseClick = (courseName, universityName) => {
  setSelectedCourse(courseName);
  setShowModal(true);
  fetchStreamsForCourse(courseName, universityName); // Pass both course and university
};

  // Handle university selection
  const handleUniversityChange = (university) => {
    setSelectedUniversity(university);
    fetchCoursesForUniversity(university); // Fetch courses when a university is selected
  };

  // Handle form submission for creating a new substream
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const formData = {
      university_name: selectedUniversity,
      course_name: selectedCourse,
      stream_name: stream,
      substream_name: streamName,
    };

    try {
      const response = await axios.post(
        `${baseURL}api/create-substream/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      setStreams([...streams, response.data]); // Add new stream to the list
      setStreamName("");
      setSelectedUniversity("");
      setSelectedCourse("");
      setStream("");
      setShowModal(false); // Close modal after submission

      setSuccessMessage("SubStream added successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 10000);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  // Validate form inputs
  const validateForm = () => {
    let errors = {};

    if (!selectedUniversity.trim()) {
      errors.selectedUniversity = "University Name is required.";
    }

    if (!selectedCourse.trim()) {
      errors.selectedCourse = "Course Name is required.";
    }

    if (!stream.trim()) {
      errors.stream = "Stream Name is required.";
    }

    if (!streamName.trim()) {
      errors.streamName = "Stream Year is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

   
  // Close the second modal
  const closeStreamModal = () => {
    setShowStreamModal(false);
    setSelectedStream(null);
  };

  // Handle Stream Click
const handleStreamClick = async (stream) => {
  setSelectedStream(stream);  // Set the selected stream
  setModalStreamss(modalStreamss);
  console.log(modalStreamss.university_name);
  // Ensure selectedUniversity is passed dynamically when fetching substreams
  const substreams = await fetchSubstreamsForStream(
    stream.stream_name,
    selectedCourse,
    modalStreamss.university_name  // Pass selectedUniversity here
  );

  console.log("Substreams fetched:", substreams);
  
  // Add substreams to the selected stream
  setSelectedStream((prevStream) => ({
    ...prevStream,
    substreams: substreams, // Add substreams to the selected stream
  }));
  
  // Open the stream details modal
  setShowStreamModal(true);
};
  
  // Modified fetchSubstreamsForStream function
const fetchSubstreamsForStream = async (streamName, courseName, universityName) => {
  console.log("University Name:", universityName); // Logs the university to verify if it's set correctly
  try {
    // Ensure params are properly passed in the URL
    const response = await axios.get(
      `${baseURL}api/substreams-withid/`,  // URL for fetching substreams
      {
        params: {
          stream: streamName,   // Selected stream
          course: courseName,   // Selected course
          university: universityName,  // Correctly pass selectedUniversity here
        },
        headers: {
          Authorization: `Bearer ${apiToken}`, // Authorization header
        },
      }
    );
    console.log(response.data);
    return response.data; // This should return an array of substreams
    
  } catch (error) {
    console.error("Error fetching substreams:", error);
    return [];  // Return an empty array if an error occurs
  }
};

const handleInputChange = (id, newName) => {
  setUpdatedSubstreams(prevState =>
    prevState.map(substream =>
      substream.id === id ? { ...substream, name: newName } : substream
    )
  );
};

useEffect(() => {
  if (selectedStream && selectedStream.substreams) {
    setUpdatedSubstreams(selectedStream.substreams); // Set initial substreams to updatedSubstreams
  }
}, [selectedStream]);


const UpdateSubstream = async () => {
  try {
    const substreamsToUpdate = updatedSubstreams.map(substream => ({
      id: substream.id,
      name: substream.name,
    }));

    const response = await axios.put(
      `http://127.0.0.1:8000/api/update-substreams/${selectedStream.stream_id}/`, 
      substreamsToUpdate, 
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    console.log(response.data);
    alert("Substreams updated successfully!");

    // Update the state with the newly updated substreams
    setUpdatedSubstreams(response.data.updated_substreams);

    closeStreamModal();
  } catch (error) {
    console.error("Error updating substreams:", error);
    alert("There was an error updating the substreams.");
  }
};

// Open the deletion confirmation modal
  const openSubstreamDeleteConfirmModal = (substreamId) => {
    setSubstreamToDelete(substreamId);
    setShowSubstreamDeleteConfirmModal(true);
  };

  // Cancel deletion: close the confirmation modal
  const cancelSubstreamDelete = () => {
    setSubstreamToDelete(null);
    setShowSubstreamDeleteConfirmModal(false);
  };

  // Confirm deletion: call the API and show the result in a message modal
  const confirmDeleteSubstream = async () => {
    setShowSubstreamDeleteConfirmModal(false);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete_substream/${substreamToDelete}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
      });

      // Attempt to parse the response JSON (or default to an empty object)
      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        data = {};
      }

      // If a specific error message is returned, show that message
      if (data.message === "Cannot delete substreams as it has associated subjects.") {
        setSubstreamModalMessage(data.message);
      } else if (response.ok) {
        // No error message and response is OK: deletion succeeded
        setSubstreamModalMessage("Substream deleted successfully!");
        // Update state to remove the deleted substream
        const updatedList = updatedSubstreams.filter((s) => s.id !== substreamToDelete);
        setUpdatedSubstreams(updatedList);
      } else {
        // Any other failure
        setSubstreamModalMessage(data.message || "Failed to delete substream.");
      }
    } catch (error) {
      console.error("Error deleting substream:", error);
      setSubstreamModalMessage("Error deleting substream.");
    }
    setSubstreamToDelete(null);
    setShowSubstreamMessageModal(true);
  };

  // Close the message modal
  const closeSubstreamMessageModal = () => {
    setSubstreamModalMessage("");
    setShowSubstreamMessageModal(false);
  };


  
  return (
    <div className="stream-list-page">
      <h1 className="font-bold text-2xl mb-4">Sub Stream List</h1>

      <form onSubmit={handleSubmit} className="m-4 p-4 border rounded-lg shadow-md">
        <div className="flex gap-4">
          {/* University Dropdown */}
          <div className="flex-1">
            <label htmlFor="universityDropdown" className="block text-sm font-medium text-gray-700">
              Select University
              <span className="text-red-500">*</span>
            </label>
            <select
              id="universityDropdown"
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
            <label htmlFor="courseDropdown" className="block text-sm font-medium text-gray-700">
              Select Course
              <span className="text-red-500">*</span>
            </label>
            <select
              id="courseDropdown"
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                if (formError.selectedCourse) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, selectedCourse: "" }));
                }
                fetchStreamsForCourse(e.target.value, selectedUniversity); // Fetch streams based on course and university
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={!selectedUniversity}
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

          {/* Stream Dropdown */}
          <div className="flex-1">
            <label htmlFor="streamDropdown" className="block text-sm font-medium text-gray-700">
              Select Stream
              <span className="text-red-500">*</span>
            </label>
            <select
              id="stream"
              value={stream}
              onChange={(e) => {
                setStream(e.target.value);
                if (formError.stream) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, stream: "" }));
                }
              }}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Stream</option>
              {streams.map((streamItem) => (
                <option key={streamItem.stream_id} value={streamItem.stream_name}>
                  {streamItem.stream_name}
                </option>
              ))}
            </select>
            {formError.stream && <p className="text-red-500 text-xs">{formError.stream}</p>}
          </div>
        </div>

        {/* Stream Details Inputs */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="streamName" className="block text-sm font-medium text-gray-700">
              Sub Stream Name
              <span className="text-red-500">*</span>
            </label>
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
        </div>

        <div className="flex gap-4">
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-[#167fc7]"
            >
              Save Stream
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
                          onClick={() => handleCourseClick(course, university.university_name)} // Pass university name here
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

      {/* Modal for showing streams */}
      {showModal && (
        <div className="modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="modal-content bg-white p-4 rounded-md w-1/2">
            <h3 className="text-lg font-bold mb-4">Streams for {selectedCourse} {modalStreamss.university_name}</h3>

            {/* Check if there's an error message */}
            {error ? (
              <p className="text-red-500">{error}</p> // Show error message if no streams
            ) : (
              <ul>
                {modalStreams.map((stream) => (
                  <li
                  key={stream.stream_id}
                  className="mb-2 cursor-pointer text-blue-500"
                  onClick={() => handleStreamClick(stream)} // Open the stream modal on click
                >
                  {stream.stream_name}     
                </li>
                ))}
                
              </ul>
            )}

            <button
              onClick={() => setShowModal(false)} 
              className="bg-red-500 text-white py-2 px-4 rounded-md mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

{showStreamModal && selectedStream && (
        <div className="modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="modal-content bg-white p-4 rounded-md w-1/2">
            <h3 className="text-lg font-bold mb-4">
              Details for {selectedStream.stream_name}
            </h3>
            <div className="mt-4">
              <h4 className="text-md font-semibold">Substreams:</h4>
              {selectedStream.substreams && selectedStream.substreams.length > 0 ? (
                <ul>
                  {updatedSubstreams.map((substream, index) => (
                    <li key={substream.id} className="mb-2">
                      <div className="flex items-center">
                        <input
                          type="text"
                          id={`substream-${substream.id}`}
                          name={`substream-${substream.id}`}
                          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={substream.name}
                          onChange={(e) => handleInputChange(substream.id, e.target.value)}
                        />
                        <span className="ml-2 text-gray-500">ID: {substream.id}</span>
                        {/* Delete Button */}
                        <button
                          onClick={() => openSubstreamDeleteConfirmModal(substream.id)}
                          className="bg-red-500 text-white py-1 px-2 rounded-md ml-2"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No substreams available for this stream.</p>
              )}
            </div>
            <button
              onClick={UpdateSubstream}
              className="bg-red-500 text-white py-2 px-4 rounded-md mt-4"
            >
              Update
            </button>
            <button
              onClick={closeStreamModal}
              className="bg-red-500 text-white py-2 px-4 rounded-md mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

  {/* Substream Delete Confirmation Modal */}
  {showSubstreamDeleteConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h4 className="font-semibold text-lg mb-4">
              Are you sure you want to delete this substream?
            </h4>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelSubstreamDelete}
                className="bg-gray-500 text-white py-1 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSubstream}
                className="bg-red-500 text-white py-1 px-4 rounded-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Substream Message Modal */}
      {showSubstreamMessageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <p className="mb-4">{substreamModalMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={closeSubstreamMessageModal}
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
