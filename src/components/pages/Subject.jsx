import { useEffect, useState } from "react";
import axios from "axios";
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";
const Subject = () => {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [universities, setUniversities] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedSubstream, setSelectedSubstream] = useState("");
  const [streams, setStreams] = useState([]);
  const [substreams, setSubstreams] = useState([]);
  const [studyPattern, setStudyPattern] = useState("");
  const [selectedSemYear, setSelectedSemYear] = useState("");
  const [semYearOptions, setSemYearOptions] = useState([]);
  const [subjectname, setSubjectName] = useState("");
  const [subjectcode, setSubjectCode] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coursesByUniversity, setCoursesByUniversity] = useState({});
  const [selectedUniversityCourses, setSelectedUniversityCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourseID, setSelectedCourseID] = useState("");
  const [error, setError] = useState(null);
  const [ViewCourseDuration, setViewCourseDuration] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [formError, setFormErrors] = useState({});
  const baseURL = useRecoilValue(baseURLAtom);
  const [modalStreamss, setModalStreamss] = useState([]); 
  const [modalStreams, setModalStreams] = useState([]); // List of streams to show in the modal
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [updatedSubstreams, setUpdatedSubstreams] = useState(selectedStream?.substreams || []);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  
  useEffect(() => {
    
  
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${baseURL}api/universities/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        setUniversities(response.data);
      } catch (error) {
        console.error("Error fetching universities:", error);
        setError(error.response ? error.response.data : error.message);
      }
    };
  
    fetchUniversities();
  }, []);
  useEffect(() => {
    if (selectedUniversity) {
      const fetchCourses = async () => {
        try {
  
          const response = await axios.get(
            `${baseURL}api/courses-with-id/?university_id=${selectedUniversity}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access')}`, // Add the token to the headers
              },
            }
          );
          setCourses(response.data.courses);
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      };
      fetchCourses();
    }
  }, [selectedUniversity]);
  

  useEffect(() => {
    if (selectedCourse && selectedUniversity) {
      const fetchStreams = async () => {
        try {
  
          const response = await axios.get(
            `${baseURL}api/streams-with-id/?course_id=${selectedCourse}&university_id=${selectedUniversity}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access')}`, // Add the token to the headers
              },
            }
          );
          setStreams(response.data.streams);
        } catch (error) {
          console.error("Error fetching streams:", error);
        }
      };
      fetchStreams();
    }
  }, [selectedCourse, selectedUniversity]);
  useEffect(() => {
    if (selectedStream && selectedCourse && selectedUniversity) {
      const fetchSubstreams = async () => {
        try {
  
          const response = await axios.get(
            `${baseURL}api/substreams-with-id/?course_id=${selectedCourse}&university_id=${selectedUniversity}&stream_id=${selectedStream}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access')}`, // Add the token to the headers
              },
            }
          );
          setSubstreams(response.data.substreams);
        } catch (error) {
          console.error("Error fetching substreams:", error);
        }
      };
      fetchSubstreams();
    }
  }, [selectedStream, selectedCourse, selectedUniversity]);
  



   useEffect(() => {
    if (universities.length > 0) {
      universities.forEach((university) => {
        fetchCoursesForUniversity(university.university_name);
      });
    }
  }, [universities]);
   const closeCourseModal = () => {
    setShowCourseModal(false);
    setSelectedCourse(null); // Reset the selected course
  };
 const handleCourseClick = (courseName, universityName) => {
  setSelectedCourse(courseName);
  setShowModal(true);
  fetchStreamsForCourse(courseName, universityName); // Pass both course and university
};
  
   const closeModal = () => {
    setShowModal(false);
  };

  const handleUpdateStream = async () => {
    console.log('selectedCourseID in handleUpdateStream:', selectedCourseID);
  
    const updatedStreams = streams.map((stream) => {
      if (editedStream && editedStream.id === stream.stream_id) {
        return {
          ...stream,
          stream_name: editedStream.stream_name,
          year: editedStream.year,
        };
      }
      return stream;
    });
  
    try {
      const response = await fetch(`${baseURL}api/update-streams/${selectedCourseID}/`, {
        method: 'PUT',
        body: JSON.stringify({
          course_id: selectedCourseID, // Add course_id here
          streams: updatedStreams, // Send the updated streams array
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to update streams');
      }
  
      const updatedData = await response.json();
      setStreams(updatedData.streams);
    } catch (error) {
      setError({ message: error.message });
    }
  };
  const openCourseModal = (course, course_id) => {
    console.log('Course passed to modal:', course);  // Ensure this is the full object
    setSelectedCourse(course);  // Set the full course object here
    setShowCourseModal(true);  // Open the course modal
    fetchStreamsForCourse(course, selectedUniversity);  // Pass both course and university
    setSelectedCourseID(course_id);
   };
const fetchCoursesForUniversity = async (universityName) => {
  try {

    const response = await axios.get(`${baseURL}api/courses/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`, // Add the token to the headers
      },
      params: { university: universityName },
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
    if (selectedStream && selectedCourse && selectedUniversity) {
      const fetchSem = async () => {
        setLoading(true); // Show loading spinner/message
        try {
          const response = await axios.get(
            `${baseURL}api/get_course_duration/?course=${selectedCourse}&university=${selectedUniversity}&stream=${selectedStream}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('access')}`,
              },
            }
          );
          console.log("Fetched data:", JSON.stringify(response.data, null, 2));
          setViewCourseDuration(response.data.sem || ""); // Default to empty string if 'sem' is undefined
        } catch (err) {
          setError("Error fetching semester data");
          console.error("Error fetching data:", err);
        } finally {
          setLoading(false); // Hide loading spinner/message
        }
      };
      fetchSem();
    }
  }, [selectedStream, selectedCourse, selectedUniversity]);

  useEffect(() => {
    if (studyPattern && ViewCourseDuration) {
      const duration = parseInt(ViewCourseDuration, 10); // Parse course duration as integer
      const options = [];
      if (studyPattern === "Semester") {
        for (let i = 1; i <= duration * 2; i++) {
          options.push({ yearSem: `Semester ${i}`, value: `${i}` });
        }
      } else if (studyPattern === "Annual") {
        for (let i = 1; i <= duration; i++) {
          options.push({ yearSem: `Year ${i}`, value: `${i}` });
        }
      }

      setSemYearOptions(options); // Update the dropdown options
      setSelectedSemYear(""); // Reset selected value when options change
    }
  }, [studyPattern, ViewCourseDuration]);
  const validateForm = () => {
    let errors = {};
    if (!selectedUniversity.trim()) {
      errors.selectedUniversity = "University Name is required.";
    }
  
    if (!selectedCourse.trim()) {
      errors.selectedCourse = "Course Name is required.";
    }
    if (!selectedStream.trim()) {
      errors.selectedStream = "Stream Name is required.";
    }
    
    if (!subjectname.trim()) {
      errors.subjectname = "Subject Name is required.";
    }
  
    if (!subjectcode.trim()) {
      errors.subjectcode = "Subject Code is required.";
    }
  
    if (!studyPattern.trim()) {
      errors.studyPattern = "Study Pattern is required.";
    }
  
    if (!selectedSemYear.trim()) {
      errors.selectedSemYear = "Semester/Year is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const submitForm = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (!validateForm()) return;
    const payload = {
      stream_id: selectedStream, // ID of the Stream
      name : subjectname, // Subject Name
      code : subjectcode, // Subject Code
      studypattern: studyPattern, // Study Pattern
      semyear: selectedSemYear, // Semester/Year
      substream_id: selectedSubstream || null, // Substream ID (optional)
    };
    console.log(payload);
  
    try {
  
      const response = await axios.post(
        `${baseURL}api/create-subject/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`, // Add the token to the headers
          },
        }
      );
  
      console.log("Subject created:", response.data);
      alert("Subject created successfully!");
  
      setSubjectName("");
      setSubjectCode("");
      setStudyPattern("");
      setSelectedSemYear("");
      setSelectedStream("");
      setSelectedSubstream("");
      setLoading(false);
      setSuccessMessage("Subject added successfully!"); // Set the success message
      setTimeout(() => {
        setSuccessMessage(""); // Reset the success message after 10 seconds
      }, 10000);
    } catch (error) {
      setLoading(false);
      setError("Error creating subject");
      console.error("Error creating subject:", error);
    }
  };
  
 const fetchStreamsForCourse = async (courseName, universityName) => {
  try {
    const response = await axios.get(`${baseURL}api/streams/`, {
      params: { course: courseName, university: universityName },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    });
    
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

const handleStreamClick = async (stream) => {
  setSelectedStream(stream);
  setModalStreamss(modalStreamss);
  const subjects = await fetchSubjectsByStream(stream.stream_id);
  console.log("Subjects fetched:", subjects);
  setSelectedStream((prevStream) => ({
    ...prevStream,
    subjects: subjects, // Store subjects in state
  }));
  setShowStreamModal(true);
};
const fetchSubjectsByStream = async (streamId) => {
  try {
    const response = await axios.get(`${baseURL}api/get_subjects_by_stream/${streamId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    });
    
    if (response.data.status === "success") {
      return response.data.data; // Return the subjects array
    } else {
      console.error("Error: Unexpected response format", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
};

const handleSubjectChange = (index, field, value) => {
  setSelectedStream((prevStream) => {
    const updatedSubjects = prevStream.subjects.map((subject, i) =>
      i === index ? { ...subject, [field]: value } : subject
    );
    return { ...prevStream, subjects: updatedSubjects };
  });
};

useEffect(() => {
  if (selectedStream && selectedStream.substreams) {
    setUpdatedSubstreams(selectedStream.substreams); // Set initial substreams to updatedSubstreams
  }
}, [selectedStream]);

const UpdateSubject = async () => {
  try {
    const subjectsToUpdate = selectedStream.subjects.map(subject => ({
      id: subject.id,
      name: subject.name,
      code: subject.code,
      studypattern: subject.studypattern,
      semyear: subject.semyear,
    }));
    const response = await axios.put(
      `${baseURL}api/update-multiple-subjects/`,
      { subjects: subjectsToUpdate },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    alert("Subjects updated successfully!");
    setSelectedStream((prevStream) => ({
      ...prevStream,
      subjects: prevStream.subjects.map((subject) => {
        const updatedSubject = response.data.updated_subjects.find(
          (updated) => updated.id === subject.id
        );
        return updatedSubject ? { ...subject, ...updatedSubject } : subject;
      }),
    }));
    closeStreamModal();
  } catch (error) {
    console.error("Error updating subjects:", error);
    alert("There was an error updating the subjects.");
  }
};

 const closeStreamModal = () => {
  setShowStreamModal(false);
  setSelectedStream(null);
};
 const openDeleteConfirmModal = (subjectId) => {
  setSubjectToDelete(subjectId);
  setShowDeleteConfirmModal(true);
};
const cancelDelete = () => {
  setSubjectToDelete(null);
  setShowDeleteConfirmModal(false);
};
const confirmDeleteSubject = async () => {
  setShowDeleteConfirmModal(false);
  try {
    const response = await fetch(`${baseURL}api/delete_subject/${subjectToDelete}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    });
    let data = {};
    try {
      data = await response.json();
    } catch (e) {
      data = {};
    }

    if (data.message) {
      setModalMessage(data.message);
    } else if (response.ok) {
      setModalMessage("Subject deleted successfully!");
      const updatedSubjects = selectedStream.subjects.filter((subject) => subject.id !== subjectToDelete);
      setSelectedStream({ ...selectedStream, subjects: updatedSubjects });
    } else {
      setModalMessage("Failed to delete subject.");
    }
  } catch (error) {
    console.error("Error deleting subject:", error);
    setModalMessage("Error deleting subject.");
  }
  setSubjectToDelete(null);
  setShowMessageModal(true);
};
const closeMessageModal = () => {
  setModalMessage("");
  setShowMessageModal(false);
};

  return (
    <div className="quick-registration-page">
      <h1 className="font-bold text-2xl mb-4">Add Subject</h1>

      <form onSubmit={submitForm}>
        <div className="flex flex-wrap mb-4">
          {/* University Dropdown */}
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
            <label htmlFor="university" className="block text-sm font-medium text-[#838383]">
              University
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
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
            >
              <option value="">Select University</option>
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.university_name}
                </option>
              ))}
            </select>
            {formError.selectedUniversity && <p className="text-red-500 text-xs">{formError.selectedUniversity}</p>}
          </div>

          {/* Course Dropdown */}
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
            <label htmlFor="course" className="block text-sm font-medium text-[#838383]">
              Course
              <span className="text-red-500">*</span></label>
            <select
              id="course"
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                if (formError.selectedCourse) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, selectedCourse: "" }));
                }
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
              disabled={!selectedUniversity}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.name}
                </option>
              ))}
            </select>
            {formError.selectedCourse && <p className="text-red-500 text-xs">{formError.selectedCourse}</p>}
          </div>

          {/* Stream Dropdown */}
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
            <label htmlFor="stream" className="block text-sm font-medium text-[#838383]">
              Stream
              <span className="text-red-500">*</span></label>
            <select
              id="stream"
              value={selectedStream}
              onChange={(e) => {
                setSelectedStream(e.target.value);
                if (formError.selectedStream) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, selectedStream: "" }));
                }
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
              disabled={!selectedCourse}
            >
              <option value="">Select Stream</option>
              {streams.map((stream) => (
                <option key={stream.stream_id} value={stream.stream_id}>
                  {stream.stream_name}
                </option>
              ))}
            </select>
            {formError.selectedStream && <p className="text-red-500 text-xs">{formError.selectedStream}</p>}
          </div>

          {/* Substream Dropdown */}
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
            <label htmlFor="substream" className="block text-sm font-medium text-[#838383]">
              Substream
              {/* <span className="text-red-500">*</span> */}
              </label>
            <select
              id="substream"
              value={selectedSubstream}
              onChange={(e) => {
                setSelectedSubstream(e.target.value);
                if (formError.selectedSubstream) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, selectedSubstream: "" }));
                }
              }}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
              disabled={!selectedStream}
            >
              <option value="">Select Substream</option>
              {substreams.map((substream) => (
                <option key={substream.substream_id} value={substream.substream_id}>
                  {substream.substream_name}
                </option>
              ))}
            </select>
            {/* {formError.selectedSubstream && <p className="text-red-500 text-xs">{formError.selectedSubstream}</p>} */}
          </div>

          {/* Study Pattern Dropdown */}
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
            <label htmlFor="studyPattern" className="block text-sm font-medium text-[#838383]">
              Study Pattern
              <span className="text-red-500">*</span></label>
            <select
              id="studyPattern"
              value={studyPattern}
              onChange={(e) => {
                setStudyPattern(e.target.value);
                if (formError.studyPattern) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, studyPattern: "" }));
                }
              }}
              className="w-full p-2 border rounded-md bg-[#f5f5f5] text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Study Pattern</option>
              <option value="Semester">Semester</option>
              <option value="Annual">Annual</option>
              <option value="Full Course">Full Course</option>
            </select>
            {formError.studyPattern && <p className="text-red-500 text-xs">{formError.studyPattern}</p>}
          </div>

          {/* Semester/Year Dropdown */}
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                 <label htmlFor="semesterYear" className="block text-sm font-medium text-[#838383]">Semester/Year<span className="text-red-500">*</span></label>
                              <select
                                id="semYear"
                                value={selectedSemYear}
                                onChange={(e) => {
                                  setSelectedSemYear(e.target.value);
                                  if (formError.selectedSemYear) {
                                    setFormErrors((prevErrors) => ({ ...prevErrors, selectedSemYear: "" }));
                                  }
                                }}
                                className="w-full p-2 border rounded-md bg-[#f5f5f5] text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                              >
                                <option value="">Select Semester & Year</option>
                                {semYearOptions.map((option, index) => (
                                  <option key={index} value={option.value}>
                                    {option.yearSem}
                                  </option>
                                ))}
                              </select>
                              {formError.selectedSemYear && <p className="text-red-500 text-xs">{formError.selectedSemYear}</p>}
                          </div>

          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                              <label htmlFor="courseDuration" className="block text-sm font-medium text-[#838383]">Course Duration (in years)<span className="text-red-500">*</span></label>
                              <input
                                id="courseDuration"
                                type="number"
                                value={ViewCourseDuration} // Controlled by state
                                onChange={(e) => {
                                  setViewCourseDuration(e.target.value);
                                  if (formError.ViewCourseDuration) {
                                    setFormErrors((prevErrors) => ({ ...prevErrors, ViewCourseDuration: "" }));
                                  }
                                }}
                                min="1"
                                max="10" // You can adjust this range as per your needs
                                className="w-full p-2 border rounded-md bg-[#f5f5f5] text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                              />
                               {formError.ViewCourseDuration && <p className="text-red-500 text-xs">{formError.ViewCourseDuration}</p>}
                          </div>

          {/* Subject Name Input */}
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
            <label htmlFor="subject" className="block text-sm font-medium text-[#838383]">
              Subject
              <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="subjectname"
              value={subjectname}
              onChange={(e) => {
                setSubjectName(e.target.value);
                if (formError.subjectname) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, subjectname: "" }));
                }
              }}
              className="w-full p-2 border rounded-md bg-[#f5f5f5] text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
             {formError.subjectname && <p className="text-red-500 text-xs">{formError.subjectname}</p>}
          </div>

          {/* Subject Code Input */}
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
            <label htmlFor="subjectcode" className="block text-sm font-medium text-[#838383]">
              Subject Code
              <span className="text-red-500">*</span> </label>
            <input
              type="text"
              id="subjectcode"
              value={subjectcode}
              onChange={(e) => {
                setSubjectCode(e.target.value);
                if (formError.subjectcode) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, subjectcode: "" }));
                }
              }}
              className="w-full p-2 border rounded-md bg-[#f5f5f5] text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
             {formError.subjectcode && <p className="text-red-500 text-xs">{formError.subjectcode}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-[#167fc7]"
              disabled={loading}
            >
              {loading ? "Saving..." : editMode ? "Update Subject" : "Save Subject"}
            </button>
          </div>
        </div>
      </form>
      {/* Show success message */}
      {successMessage && <div className="m-4 text-[#d24845]">{successMessage}</div>}

      <h2 className="font-bold text-xl mt-6">Existing Subjects</h2>

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
                            onClick={() => handleCourseClick(course, university.university_name)}
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

            {/* Subjects Section */}
            <div className="mt-4">
              <h4 className="text-md font-semibold">Subjects:</h4>
              {selectedStream.subjects && selectedStream.subjects.length > 0 ? (
                <ul>
                  {selectedStream.subjects.map((subject, index) => (
                    <li key={index} className="mb-2">
                      <div className="grid grid-cols-6 gap-2 items-center">
                        <span>{index + 1}</span>
                        <input
                          type="text"
                          value={subject.name}
                          onChange={(e) => handleSubjectChange(index, "name", e.target.value)}
                          className="p-2 border rounded-md"
                          placeholder="Subject Name"
                        />
                        <input
                          type="text"
                          value={subject.code}
                          onChange={(e) => handleSubjectChange(index, "code", e.target.value)}
                          className="p-2 border rounded-md"
                          placeholder="Code"
                        />
                        <input
                          type="text"
                          value={subject.studypattern}
                          onChange={(e) => handleSubjectChange(index, "studypattern", e.target.value)}
                          className="p-2 border rounded-md"
                          placeholder="Study Pattern"
                        />
                        <input
                          type="text"
                          value={subject.semyear}
                          onChange={(e) => handleSubjectChange(index, "semyear", e.target.value)}
                          className="p-2 border rounded-md"
                          placeholder="Semester/Year"
                        />

                        {/* Delete Button */}
                        <button
                          onClick={() => openDeleteConfirmModal(subject.id)}
                          className="bg-red-500 text-white py-1 px-2 rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No subjects available for this stream.</p>
              )}
            </div>

            <button
              onClick={UpdateSubject}
              className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
            >
              Update
            </button>
            <button
              onClick={closeStreamModal}
              className="bg-gray-500 text-white py-2 px-4 rounded-md mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}


  {/* Delete Confirmation Modal */}
  {showDeleteConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h4 className="font-semibold text-lg mb-4">
              Are you sure you want to delete this subject?
            </h4>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-500 text-white py-1 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSubject}
                className="bg-red-500 text-white py-1 px-4 rounded-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}


{/* Message Modal */}
{showMessageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <p className="mb-4">{modalMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={closeMessageModal}
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
export default Subject;