import { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import DataTable from 'react-data-table-component';
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const CheckResults = () => {
    const [universities, setUniversities] = useState([]);
    const [university, setUniversity] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedViewCourse, setSelectedViewCourse] = useState("");
    const [courses, setCourses] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState("");
    const [selectedViewUniversity, setSelectedViewUniversity] = useState("");
    const [selectedStream, setSelectedStream] = useState("");
    const [selectedViewStream, setSelectedViewStream] = useState("");
    const [streams, setStreams] = useState([]);
    const [selectedSubstream, setSelectedSubstream] = useState("");
    const [selectedViewSubstream, setSelectedViewSubstream] = useState("");
    const [substreams, setSubstreams] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [session, setSession] = useState("");
    const [studyPattern, setStudyPattern] = useState("");
    const [semYearOptions, setSemYearOptions] = useState([]);
    const [selectedSemYear, setSelectedSemYear] = useState("");
    const [courseDuration, setCourseDuration] = useState("");
    const [students, setStudents] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isViewSetExamination, setIsViewSetExamination] = useState(false);
    const [student, setStudent] = useState([]);
    const [ViewSession, setViewSession] = useState([]);
    const [ViewStudyPattern, setViewStudyPattern] = useState([]);
    const [selectedViewSemYear, setSelectedViewSemYear] = useState([]);
    const [ViewCourseDuration, setViewCourseDuration] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [studentDetails, setStudentDetails] = useState([]);
    const [formError, setFormErrors] = useState({});
    const baseURL = useRecoilValue(baseURLAtom);

    const apiToken = localStorage.getItem("access");

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await axios.get(`${baseURL}api/universities/`, {
                  headers: {
                    Authorization: `Bearer ${apiToken}`, // Include token in the Authorization header
                  },
                });
                setUniversities(response.data);
            } catch (error) {
                console.error("Error fetching universities:", error);
            }
        };
        fetchUniversities();
    }, []);

    useEffect(() => {
        if (selectedViewUniversity) {
          const fetchCourses = async () => {
            try {
              const response = await axios.get(
                `${baseURL}api/courses-with-id/?university_id=${selectedViewUniversity}`, {
                  headers: {
                    Authorization: `Bearer ${apiToken}`, // Include token in the Authorization header
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
      }, [selectedViewUniversity]);

      useEffect(() => {
        if (selectedViewCourse && selectedViewUniversity) {
          const fetchStreams = async () => {
            try {
              const response = await axios.get(
                `${baseURL}api/streams-with-id/?course_id=${selectedViewCourse}&university_id=${selectedViewUniversity}`, {
                  headers: {
                    Authorization: `Bearer ${apiToken}`, // Include token in the Authorization header
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
      }, [selectedViewCourse, selectedViewUniversity]);

      useEffect(() => {
        if (selectedViewStream && selectedViewCourse && selectedViewUniversity) {
          const fetchSubstreams = async () => {
            try {
              const response = await axios.get(
                `${baseURL}api/substreams-with-id/?course_id=${selectedViewCourse}&university_id=${selectedViewUniversity}&stream_id=${selectedViewStream}`, {
                  headers: {
                    Authorization: `Bearer ${apiToken}`, // Include token in the Authorization header
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
      }, [selectedViewStream, selectedViewCourse, selectedViewUniversity]);

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
      
      useEffect(() => {
        // Fetch data only if all required dependencies are present
        if (selectedViewStream && selectedViewCourse && selectedViewUniversity) {
          const fetchSem = async () => {
            setLoading(true); // Show loading spinner/message
            try {
              // Fetch semester value based on selected parameters
              const response = await axios.get(
                `${baseURL}api/get_course_duration/?stream=${selectedViewStream}&course=${selectedViewCourse}&university=${selectedViewUniversity}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiToken}`,
                  },
                }
              );
    
              // Log the API response for debugging
              console.log("Fetched data:", JSON.stringify(response.data, null, 2));
    
              // Update the input field with the 'sem' value from the API
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
      }, [selectedViewStream, selectedViewCourse, selectedViewUniversity]);

      useEffect(() => {
        if (ViewStudyPattern && ViewCourseDuration) {
          const duration = parseInt(ViewCourseDuration, 10); // Parse course duration as integer
          const options = [];
    
          // Populate options based on Study Pattern and Duration
          if (ViewStudyPattern === "Semester") {
            for (let i = 1; i <= duration * 2; i++) {
              options.push({ yearSem: `Semester ${i}`, value: `${i}` });
            }
          } else if (ViewStudyPattern === "Annual") {
            for (let i = 1; i <= duration; i++) {
              options.push({ yearSem: `Year ${i}`, value: `${i}` });
            }
          }
    
          setSemYearOptions(options); // Update the dropdown options
          setSelectedSemYear(""); // Reset selected value when options change
        }
      }, [ViewStudyPattern, ViewCourseDuration]);

      const validateViewForm = () => {
        let errors = {};
      
        // University & Course Validations
        if (!selectedViewUniversity.trim()) {
          errors.selectedViewUniversity = "University is required.";
        }
      
        if (!selectedViewCourse.trim()) {
          errors.selectedViewCourse = "Course is required.";
        }
      
        if (!selectedViewStream.trim()) {
          errors.selectedViewStream = "Stream is required.";
        }
      
        // if (!selectedViewSubstream.trim()) {
        //   errors.selectedViewSubstream = "Sub Stream is required.";
        // }
      
        // if (!ViewSession.trim()) {
        //   errors.ViewSession = "Session is required.";
        // }
      
        // if (!ViewStudyPattern.trim()) {
        //   errors.ViewStudyPattern = "Study Pattern is required.";
        // }
      
        // if (!selectedViewSemYear.trim()) {
        //   errors.selectedViewSemYear = "Semester/Year is required.";
        // }
      
      
        // Set Errors and Return Validation Status
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
      };
    

      const handleSearch = async (event) => {
        event.preventDefault();
        if (!validateViewForm()) return;
        console.log("In Search");
        const semYearNumber = selectedViewSemYear ? selectedViewSemYear.split(' ')[1] : '';
        console.log("In Search====", semYearNumber);
      
        try {
          // Prepare query parameters
          const queryParams = new URLSearchParams({
            university: selectedViewUniversity,
            course: selectedViewCourse,
            stream: selectedViewStream,
            session: ViewSession,
            studypattern: ViewStudyPattern,
            semyear: semYearNumber,
            substream: selectedViewSubstream,
          });
      
          console.log("Query Parameters:", queryParams.toString());
      
          // Fetch data from the API
          const response = await fetch(`${baseURL}api/examinations/?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiToken}`,
            },
          });
      
          const data = await response.json();
          console.log("Fetched data", JSON.stringify(data, null, 2));
      
          // If the response is an array, set the state
          if (Array.isArray(data)) {
            setStudent(data); // Update table data
          } else {
            console.error("Fetched data is not an array:", data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      
  // Columns for DataTable
const columns1 = [
  {
    name: 'Sr.No',
    selector: (row, index) => index + 1,
    sortable: true,
    style: { width: '50px' }, // Adjusted width
  },
  {
    name: 'Subject Name',
    selector: row => row.subject_name,
    sortable: true,
    style: { width: '200px' }, // Adjusted width
  },
  {
    name: 'Exam Start Date',
    selector: row => row.exam_start_date || 'N/A', // Handle null values
    sortable: true,
    style: { width: '150px' },
  },
  {
    name: 'Exam End Date',
    selector: row => row.exam_end_date || 'N/A', // Handle null values
    sortable: true,
    style: { width: '150px' },
  },
  {
    name: 'Total Questions',
    selector: row => row.total_questions,
    sortable: true,
    style: { width: '150px' },
  },
  {
    name: 'Total Marks',
    selector: row => row.total_marks,
    sortable: true,
    style: { width: '150px' },
  },
  {
    name: 'Actions',
    cell: (row) => (
      <button
        onClick={(event) => {
          event.preventDefault(); // Prevent default behavior
          handleShowStudentDetails(row); // Call the function to fetch and show the table
        }}
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
      >
        Show
      </button>
    ),
    sortable: false,
    style: { width: '150px' },
  },
];

const handleShowStudentDetails = async (row) => {
  console.log("Selected Row:", row);
  setSelectedRow(row);
  
  // Extract the student id dynamically from the row's student_ids array.
  const studentId = row.student_ids && row.student_ids.length > 0 ? row.student_ids[0] : null;
  
  if (!studentId) {
    console.error("No student id found in the selected row.");
    return;
  }

  try {
    // Retrieve the API token from localStorage
    const apiToken = localStorage.getItem("access");
    
    // Fetch student details based on the selected row's ID and dynamic student id
    const response = await fetch(
      `${baseURL}api/show-result/?exam_id=${row.id}&student_id=${studentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );
    
    const result = await response.json();
    console.log("Student Details Data:", result);
    
    // Extract the inner data and wrap it in an array if needed
    const details = result.data;
    if (details) {
      // If details is not an array, wrap it in one
      const detailsArray = Array.isArray(details) ? details : [details];
      setStudentDetails(detailsArray);
    } else {
      console.error("No student details found in the response:", result);
    }
  } catch (error) {
    console.error("Error fetching student details:", error);
  }
};




// Columns for the Student Details Table
const studentDetailsColumns = [
  {
    name: 'Sr. No',
    selector: (row, index) => index + 1,
    sortable: true,
    style: { width: '50px' },
  },
  {
    name: 'Student Name',
    selector: row => row.student_name,
    sortable: true,
    style: { width: '200px' },
  },
  {
    name: 'Student Email',
    // Updated to use the property returned from the API
    selector: row => row.email,
    sortable: true,
    style: { width: '200px' },
  },
  {
    name: 'Enrollment ID',
    selector: row => row.enrollment_id,
    sortable: true,
    style: { width: '150px' },
  },
  {
    name: 'Exam ID',
    selector: row => row.exam_id,
    sortable: true,
    style: { width: '150px' },
  },
  {
    name: 'Total Questions',
    selector: row => row.total_questions,
    sortable: true,
    style: { width: '150px' },
  },
  {
    name: 'Total Marks',
    selector: row => row.total_marks,
    sortable: true,
    style: { width: '150px' },
  },
  {
    name: 'Marks Obtained',
    // Updated to use the API's `score` field
    selector: row => row.score,
    sortable: true,
    style: { width: '150px' },
  },
  {
    name: 'Result & Percentage',
    // Updated to use `result_status` for result and `percentage` for percentage
    selector: row => `${row.result_status} (${row.percentage}%)`,
    sortable: true,
    style: { width: '200px' },
  },
];


      return (
        <div className="setexam-page">
              <h2 className="font-bold text-2xl m-4">Check Results</h2>

                  <form className="m-4 p-4 border rounded-lg shadow-md">
                      <div className="flex flex-wrap mb-4">
                          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                              <label htmlFor="university" 
                              className="block text-sm font-medium text-gray-700">
                                  University
                                  <span className="text-red-500">*</span></label>
                              <select
                                  id="university"
                                  value={selectedViewUniversity}
                                  onChange={(e) => {
                                    setSelectedViewUniversity(e.target.value);
                                    if (formError.selectedViewUniversity) {
                                      setFormErrors((prevErrors) => ({ ...prevErrors, selectedViewUniversity: "" }));
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
                              {formError.selectedViewUniversity && <p className="text-red-500 text-xs">{formError.selectedViewUniversity}</p>}
                          </div>
                          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                              <label htmlFor="course" className="block text-sm font-medium text-[#838383]">Course<span className="text-red-500">*</span></label>
                              <select
                                  id="course"
                                  value={selectedViewCourse}
                                  onChange={(e) => {
                                    setSelectedViewCourse(e.target.value);
                                    if (formError.selectedViewCourse) {
                                      setFormErrors((prevErrors) => ({ ...prevErrors, selectedViewCourse: "" }));
                                    }
                                  }}
                                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
                                  disabled={!selectedViewUniversity}
                              >
                                  <option value="">Select Course</option>
                                  {courses.map((course) => (
                                      <option key={course.course_id} value={course.course_id}>
                                          {course.name}
                                      </option>
                                  ))}
                              </select>
                              {formError.selectedViewCourse && <p className="text-red-500 text-xs">{formError.selectedViewCourse}</p>}
                          </div>
                          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                              <label htmlFor="stream" className="block text-sm font-medium text-[#838383]">Stream<span className="text-red-500">*</span></label>
                              <select
                                  id="stream"
                                  value={selectedViewStream}
                                  onChange={(e) => {
                                    setSelectedViewStream(e.target.value);
                                    if (formError.selectedViewStream) {
                                      setFormErrors((prevErrors) => ({ ...prevErrors, selectedViewStream: "" }));
                                    }
                                  }}
                                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
                                  disabled={!selectedViewCourse}
                              >
                                  <option value="">Select Stream</option>
                                  {streams.map((stream) => (
                                      <option key={stream.stream_id} value={stream.stream_id}>
                                          {stream.stream_name}
                                      </option>
                                  ))}
                              </select>
                              {formError.selectedViewStream && <p className="text-red-500 text-xs">{formError.selectedViewStream}</p>}
                          </div>
                          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                              <label htmlFor="substream" className="block text-sm font-medium text-[#838383]">Substream
                                {/* <span className="text-red-500">*</span> */}
                              </label>
                              <select
                                  id="substream"
                                  value={selectedViewSubstream}
                                  onChange={(e) => {
                                    setSelectedViewSubstream(e.target.value);
                                    if (formError.selectedViewSubstream) {
                                      setFormErrors((prevErrors) => ({ ...prevErrors, selectedViewSubstream: "" }));
                                    }
                                  }}
                                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
                                  disabled={!selectedViewStream}
                              >
                                  <option value="">Select Substream</option>
                                  {substreams.map((substream) => (
                                      <option key={substream.substream_id} value={substream.substream_id}>
                                          {substream.substream_name}
                                      </option>
                                  ))}
                              </select>
                              {formError.selectedViewSubstream && <p className="text-red-500 text-xs">{formError.selectedViewSubstream}</p>}
                          </div>
                          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                              <label htmlFor="session" className="block text-sm font-medium text-[#838383]">Session<span className="text-red-500">*</span></label>
                              <select
                                  id="session"
                                  value={ViewSession}
                                  onChange={(e) => {
                                    setViewSession(e.target.value);
                                    if (formError.ViewSession) {
                                      setFormErrors((prevErrors) => ({ ...prevErrors, ViewSession: "" }));
                                    }
                                  }}
                                  className="w-full p-2 border rounded-md bg-[#f5f5f5]"
                              >
                                  <option value="">Select Session</option>
                                  {sessions.map((session) => (
                                      <option key={session.id} value={session.name}>{session.name}</option>
                                  ))}
                              </select>
                              {formError.ViewSession && <p className="text-red-500 text-xs">{formError.ViewSession}</p>}
                          </div>
                          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                              <label htmlFor="studyPattern" className="block text-sm font-medium text-[#838383]">Study Pattern<span className="text-red-500">*</span></label>
                              <select
                                  id="studyPattern"
                                  value={ViewStudyPattern}
                                  onChange={(e) => {
                                    setViewStudyPattern(e.target.value);
                                    if (formError.ViewStudyPattern) {
                                      setFormErrors((prevErrors) => ({ ...prevErrors, ViewStudyPattern: "" }));
                                    }
                                  }}                                  className="w-full p-2 border rounded-md bg-[#f5f5f5]"
                              >
                                  <option value="">Select Study Pattern</option>
                                  <option value="Semester">Semester</option>
                                  <option value="Annual">Annual</option>
                                  <option value="Full Course">Full Course</option>
                              </select>
                              {formError.ViewStudyPattern && <p className="text-red-500 text-xs">{formError.ViewStudyPattern}</p>}
                          </div>
                          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                              <label htmlFor="semesterYear" className="block text-sm font-medium text-[#838383]">Semester/Year<span className="text-red-500">*</span></label>
                              <select
                                  id="semYear"
                                  value={selectedViewSemYear}
                                  onChange={(e) => {
                                    setSelectedViewSemYear(e.target.value);
                                    if (formError.selectedViewSemYear) {
                                      setFormErrors((prevErrors) => ({ ...prevErrors, selectedViewSemYear: "" }));
                                    }
                                  }}
                                  className="w-full p-2 border rounded-md bg-[#f5f5f5]"
                              >
                                  <option value="">Select Semester & Year</option>
                                  {semYearOptions.map((option) => (
                                      <option key={option.yearSem} value={option.yearSem}>
                                          {option.yearSem}
                                      </option>
                                  ))}
                              </select>
                              {formError.selectedViewSemYear && <p className="text-red-500 text-xs">{formError.selectedViewSemYear}</p>}
                          </div>
                        
                          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                              <label htmlFor="courseDuration" className="block text-sm font-medium text-[#838383]">Course Duration (in years)</label>
                              <input
                                  id="courseDuration"
                                  type="number"
                                  value={ViewCourseDuration}
                                  onChange={(e) => setViewCourseDuration(e.target.value)}
                                  min="1"
                                  max="10" // You can adjust this range as per your needs
                                  required
                                  className="w-full p-2 border rounded-md bg-[#f5f5f5]"
                              />
                          </div>
                      </div>
                      <div className="flex items-end">
                          <button
                            type="submit"
                            onClick={handleSearch}
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-[#167fc7]"
                          >
                            Search
                          </button>
                      </div>

                      <div className="overflow-x-auto mt-4">
                        <DataTable
                          columns={columns1}
                          data={student}
                          selectableRows
                          selectableRowsHighlight
                          pagination
                          subHeader
                          subHeaderComponent={<input type="text" placeholder="Search..." />}
                        />
                      </div>

                      {/* Conditional rendering of the Student Details Table */}
                        {selectedRow && studentDetails && (
                          <div className="mt-4">
                            <h2 className="text-lg font-bold">
                              Student Details for Exam: {selectedRow.subject_name}
                            </h2>
                            <DataTable
                              title="Student Details"
                              columns={studentDetailsColumns}
                              data={studentDetails}
                              pagination
                            />
                          </div>
                        )}


                
                  </form>
        </div>
      )

}
export default CheckResults;