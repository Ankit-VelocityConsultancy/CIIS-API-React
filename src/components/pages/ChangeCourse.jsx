import { useState, useEffect } from "react";
import axios from "axios";
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const ChangeCoursePage = () => {
  const [enrollmentId, setEnrollmentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [streams, setStreams] = useState([]);
  const [substreams, setSubstreams] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedSubstream, setSelectedSubstream] = useState("");
  const [courses, setCourses] = useState([]);
  const [semYearOptions, setSemYearOptions] = useState([]);
  const [selectedSemYear, setSelectedSemYear] = useState("");
  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [studyPattern, setStudyPattern] = useState("");
  const [formError, setFormError] = useState("");
  const baseURL = useRecoilValue(baseURLAtom);

  const [courseDetails, setCourseDetails] = useState({
    university_name: "",
    course_name: "",
    stream_name: "",
    substream_name: "",
    study_pattern: "",
    session: "",
    semester: "",
    course_duration: "",
  });

  
  const validateForm = () => {
    if (!enrollmentId && !studentName) {
      setFormError("Please enter either Enrollment ID or Student Name.");
      return false;
    }
    setFormError(""); // Clear error when valid
    return true;
  };
  
 // Handle search (both by enrollment ID or name)
 const handleSearch = async () => {
  if (!validateForm()) return;

  try {
    setLoading(true);
    let response;
    if (enrollmentId) {
      // Fetching student data by enrollment ID
      const response = await axios.get(
        `${baseURL}api/search-by-enrollment-id/?enrollment_id=${enrollmentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      console.log("Enroll ID" + response.data.data);
      setStudentData(response.data.data);
      setStudentsList([]);
      // Fetch course details using the student ID (from search-by-enrollment-id response)
      const courseResponse = await axios.get(
        `${baseURL}api/get-student-course-details/${response.data.data.id}/`
      );
      setCourseDetails(courseResponse.data); // Set course details in the state
    } else if (studentName) {
      // Searching by student name (partial)
      const response = await axios.get(
        `${baseURL}api/search-by-student-name/?name=${studentName}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`, // or use your stored apiToken
          },
        }
      );
      console.log("Student Name" + response.data.data);
      setStudentsList(response.data);
      setStudentData(null); // Clear previous student data
    }
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setError(error.response ? error.response.data.detail : "An error occurred");
  }
};

useEffect(() => {
  if (enrollmentId || studentName) {
    setFormError(""); // Clear the error when any field is filled
  }
}, [enrollmentId, studentName]);
 
  const apiToken = localStorage.getItem("access"); // Replace with your token source
  console.log("API Token=="+apiToken);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${baseURL}api/universities/`);
        setUniversities(response.data);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (selectedUniversity) {
      const fetchCourses = async () => {
        try {
          const response = await axios.get(
            `${baseURL}api/courses/?university=${selectedUniversity}`
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
            `${baseURL}api/streams/?course=${selectedCourse}&university=${selectedUniversity}`
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
            `${baseURL}api/substreams/?course=${selectedCourse}&university=${selectedUniversity}&stream=${selectedStream}`
          );
          // Log to check the response
          console.log('Substreams Response:', response.data);
  
          // Set the substreams directly (assuming it is an array of strings)
          setSubstreams(response.data || []);
        } catch (error) {
          console.error("Error fetching substreams:", error);
          setSubstreams([]); // Clear substreams in case of error
        }
      };
      fetchSubstreams();
    }
  }, [selectedStream, selectedCourse, selectedUniversity]);
  

  useEffect(() => {
    if (selectedStream && selectedCourse && selectedUniversity) {
      const fetchSemYear = async () => {
        try {
          const response = await axios.get(
            `${baseURL}api/get_sem_year_by_stream_byname/?course=${selectedCourse}&university=${selectedUniversity}&stream=${selectedStream}`
          );
          const semYearData = response.data.streams.map((streamData) => ({
            yearSem: `${streamData.sem}`,
            year: streamData.year,
            sem: streamData.sem,
          }));
          setSemYearOptions(semYearData);
        } catch (err) {
          setError("Error fetching semester and year.");
        }
      };
      fetchSemYear();
    }
  }, [selectedStream, selectedCourse, selectedUniversity]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(`${baseURL}api/session-names/`, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        });
        setSessions(response.data);
      } catch (err) {
        setError("Error fetching sessions.");
      }
    };
    fetchSessions();
  }, [apiToken]);


   // Handle selecting a student from the list
   const handleSelectStudent = async (student) => {
    setStudentName(student.name);
    setEnrollmentId(student.enrollment_id);
    setStudentsList([]);
    setStudentData(student);
    console.log("Student ID======"+student.id);
    // Fetch course details when student is selected
    try {
      const response = await axios.get(
        `${baseURL}api/get-student-course-details/${student.id}/`
      );
      setCourseDetails(response.data); // Set course details in the state
    } catch (error) {
      setError("Unable to fetch course details.");
    }
  };


  // Handle updating course details
  const handleUpdateCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${baseURL}api/update-student-course-details/${studentData.id}/`,
        {
          university_name: selectedUniversity,
          course_name: selectedCourse,
          stream_name: selectedStream,
          substream_name: selectedSubstream,
          study_pattern: studyPattern,
          session: session,
          semister: selectedSemYear,
          course_duration: courseDuration,
        }
      );
      setLoading(false);
      alert("Course details updated successfully!");
    } catch (error) {
      setLoading(false);
      setError("Failed to update course details.");
    }
  };

  return (
    <div className="change-course-page">
      <h1 className="font-bold text-2xl mb-4">Change Course</h1>
      <h2 className="text-xl mb-4">Enter either Enrollment Id or Name of the student</h2>

      {/* Form for Search */}
      <div className="m-4 p-4 border rounded-lg shadow-md w-full">
        <div className="flex gap-2 mb-4 w-full">
          <div className="flex-1">
            <label htmlFor="enrollmentId" className="block text-sm font-medium text-gray-700">
              Enrollment ID
            </label>
            <input
              type="text"
              id="enrollmentId"
              value={enrollmentId}
              onChange={(e) => setEnrollmentId(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">
              Student Name
            </label>
            <input
              type="text"
              id="studentName"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end justify-start mt-4 w-full">
          <button
            type="button"
            onClick={handleSearch}
            className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-700 w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
          {/* Show error message below form */}
      {formError && (
        <div className="text-red-500 text-sm mt-2">{formError}</div>
      )}

       {/* Display list of students if partial name is entered */}
       {studentsList.length > 0 && (
        <div className="mt-4 p-4 border rounded-lg">
          <h3 className="font-bold text-lg">Students Found</h3>
          <table className="min-w-full mt-4 border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Enrollment ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {studentsList.map((student) => (
                <tr key={student.id}>
                  <td className="border p-2">{student.enrollment_id}</td>
                  <td className="border p-2">{student.name}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleSelectStudent(student)}
                      className="text-blue-500 hover:underline"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Display selected student data if found */}
      {studentData && (
       <div className="student-data mt-4 p-4 border rounded-lg">
       <div className="mt-4">
         <h4 className="font-bold text-lg">Existing Course Details</h4>
         <br />
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
           <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700">University Name</label>
             <input
               type="text"
               value={courseDetails.university_name}
               onChange={(e) => setCourseDetails({ ...courseDetails, university_name: e.target.value })}
               className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm"
             />
           </div>
     
           <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700">Course Name</label>
             <input
               type="text"
               value={courseDetails.course_name}
               onChange={(e) => setCourseDetails({ ...courseDetails, course_name: e.target.value })}
               className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm"
             />
           </div>
     
           <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700">Stream Name</label>
             <input
               type="text"
               value={courseDetails.stream_name}
               onChange={(e) => setCourseDetails({ ...courseDetails, stream_name: e.target.value })}
               className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm"
             />
           </div>
     
           <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700">Substream Name</label>
             <input
               type="text"
               value={courseDetails.substream_name}
               onChange={(e) => setCourseDetails({ ...courseDetails, substream_name: e.target.value })}
               className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm"
             />
           </div>
         </div>
     
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
           <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700">Study Pattern</label>
             <input
               type="text"
               value={courseDetails.study_pattern}
               onChange={(e) => setCourseDetails({ ...courseDetails, study_pattern: e.target.value })}
               className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm"
             />
           </div>
     
           <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700">Session</label>
             <input
               type="text"
               value={courseDetails.session}
               onChange={(e) => setCourseDetails({ ...courseDetails, session: e.target.value })}
               className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm"
             />
           </div>
     
           <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700">Semester</label>
             <input
               type="text"
               value={courseDetails.semester}
               onChange={(e) => setCourseDetails({ ...courseDetails, semester: e.target.value })}
               className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm"
             />
           </div>

           <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700">Course Duration</label>
             <input
               type="text"
               value={courseDetails.course_duration}
               onChange={(e) => setCourseDetails({ ...courseDetails, course_duration: e.target.value })}
               className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm"
             />
           </div>
         </div>
       </div>
     </div>
      )}
       {studentData && (
        <div className="student-data mt-4 p-4 border rounded-lg">
          <h4 className="font-bold text-lg">New Course Details</h4><br></br>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">University Name</label>
              <select
                id="university"
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
              >
                <option value="">Select University</option>
                {universities.map((university) => (
                  <option key={university.id} value={university.university_name}>
                    {university.university_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <select
                id="course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
                disabled={!selectedUniversity}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.course_id} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Stream</label>
              <select
                id="stream"
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
                disabled={!selectedCourse}
              >
                <option value="">Select Stream</option>
                {streams.map((stream) => (
                  <option key={stream.id} value={stream.stream_name}>
                    {stream.stream_name}
                  </option>
                ))}
              </select>
            </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Substream</label>
            <select
              id="substream"
              value={selectedSubstream}
              onChange={(e) => setSelectedSubstream(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
              disabled={!selectedStream}
            >
              <option value="">Select Substream</option>
              {substreams.length > 0 ? (
                substreams.map((substream, index) => (
                  <option key={index} value={substream}>
                    {substream}
                  </option>
                ))
              ) : (
                <option value="">No substreams available</option>
              )}
            </select>
          </div>


            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Session</label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
              >
                <option value="">Select Session</option>
                {sessions.map((sessionOption) => (
                  <option key={sessionOption.id} value={sessionOption.id}>
                    {sessionOption.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Semester Year</label>
              <select
                value={selectedSemYear}
                onChange={(e) => setSelectedSemYear(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
              >
                <option value="">Select Semester Year</option>
                {semYearOptions.map((semYear) => (
                  <option key={semYear.sem} value={semYear.sem}>
                    {semYear.yearSem}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="studyPattern" className="block text-sm font-medium text-[#838383]">Study Pattern</label>
              <select
                id="studyPattern"
                value={studyPattern}
                onChange={(e) => setStudyPattern(e.target.value)}
                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
              >
                <option value="">Select Study Pattern</option>
                <option value="Semester">Semester</option>
                <option value="Annual">Annual</option>
                <option value="Full Course">Full Course</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Course Duration</label>
              <input
                type="text"
                value={courseDuration}
                onChange={(e) => setCourseDuration(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
              />
            </div>
          </div>

          <button
            onClick={handleUpdateCourseDetails}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Course Details"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChangeCoursePage;
