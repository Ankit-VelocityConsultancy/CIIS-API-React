import { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const AssignExamination = () => {
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
    const [students, setStudents] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isViewSetExamination, setIsViewSetExamination] = useState(false);
    const [student, setStudent] = useState([]);
    const [ViewSession, setViewSession] = useState([]);
    const [ViewStudyPattern, setViewStudyPattern] = useState([]);
    const [selectedViewSemYear, setSelectedViewSemYear] = useState([]);
    const [CourseDuration, setCourseDuration] = useState([]);
    const [ViewCourseDuration, setViewCourseDuration] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [sem, setSem] = useState("");
    const [exams, setExams] = useState([]); // State for exams_data
    const [showTables, setShowTables] = useState(false);
    const navigate = useNavigate(); // Initialize navigate
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedExam, setSelectedExam] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedExams, setSelectedExams] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [isReassignModalOpen, setReassignModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [formError, setFormErrors] = useState({});
    const [reassignData, setReassignData] = useState({
      examstarttime: '',
      examendtime: '',
      examstartdate: '',
      examenddate: '',
    });
    const baseURL = useRecoilValue(baseURLAtom);

    const apiToken = localStorage.getItem("access");
  
    // Function to generate and download the empty Excel file
    const handleDownload = () => {
      // Prepare the data for the Excel file
      const dataToExport = student.map((row, index) => ({
        "Sr. No": index + 1,
        "Student Name": row.student_name,
        "Email": row.student_email,
        "Mobile": row.student_mobile,
        "Exam Start Time": row.examstarttime,
        "Exam End Time": row.examendtime,
        "Exam Start Date": row.examstartdate,
        "Exam End Date": row.examenddate,
        "Status": row.status,
      }));
    
      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    
      // Create a workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    
      // Export the workbook to an Excel file
      XLSX.writeFile(workbook, "StudentData.xlsx");
    };

    const openReassignModal = (row) => {
      setSelectedRow(row);
      setReassignModalOpen(true);
    };
    
    const closeReassignModal = () => {
      setReassignModalOpen(false);
      setReassignData({
        examstarttime: '',
        examendtime: '',
        examstartdate: '',
        examenddate: '',
      });
    };

    const handleReassignSubmit = async () => {
      try {
        const payload = {
          studentid: selectedRow.student_id,
          examid: selectedRow.exam_id,
          ...reassignData,
        };
    
        const response = await fetch(`${baseURL}api/reassign_student/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiToken}`,
          },
          body: JSON.stringify(payload),
        });
    
        if (response.ok) {
          const updatedRow = { ...selectedRow, ...reassignData };
          setStudent((prev) =>
            prev.map((item) =>
              item.student_id === updatedRow.student_id ? updatedRow : item
            )
          );
          closeReassignModal();
        } else {
          console.error('Failed to reassign student:', await response.json());
        }
      } catch (error) {
        console.error('Error during reassign action:', error);
      }
    };

      useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await axios.get(`${baseURL}api/universities/`,{
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

    useEffect(() => {
        if (selectedUniversity) {
          const fetchCourses = async () => {
            try {
              const response = await axios.get(
                `${baseURL}api/courses-with-id/?university_id=${selectedUniversity}`,{
                  headers: {
                    Authorization: `Bearer ${apiToken}`,
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
        if (selectedViewUniversity) {
          const fetchCourses = async () => {
            try {
              const response = await axios.get(
                `${baseURL}api/courses-with-id/?university_id=${selectedViewUniversity}`,{
                  headers: {
                    Authorization: `Bearer ${apiToken}`,
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
        if (selectedCourse && selectedUniversity) {
          const fetchStreams = async () => {
            try {
              const response = await axios.get(
                `${baseURL}api/streams-with-id/?course_id=${selectedCourse}&university_id=${selectedUniversity}`,{
                  headers: {
                    Authorization: `Bearer ${apiToken}`,
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
        if (selectedViewCourse && selectedViewUniversity) {
          const fetchStreams = async () => {
            try {
              const response = await axios.get(
                `${baseURL}api/streams-with-id/?course_id=${selectedViewCourse}&university_id=${selectedViewUniversity}`,{
                  headers: {
                    Authorization: `Bearer ${apiToken}`,
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
        if (selectedStream && selectedCourse && selectedUniversity) {
          const fetchSubstreams = async () => {
            try {
              const response = await axios.get(
                `${baseURL}api/substreams-with-id/?course_id=${selectedCourse}&university_id=${selectedUniversity}&stream_id=${selectedStream}`,{
                  headers: {
                    Authorization: `Bearer ${apiToken}`,
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
        if (selectedViewStream && selectedViewCourse && selectedViewUniversity) {
          const fetchSubstreams = async () => {
            try {
              const response = await axios.get(
                `${baseURL}api/substreams-with-id/?course_id=${selectedViewCourse}&university_id=${selectedViewUniversity}&stream_id=${selectedViewStream}`,{
                  headers: {
                    Authorization: `Bearer ${apiToken}`,
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
        if (selectedStream && selectedCourse && selectedUniversity) {
          const fetchSemYear = async () => {
            try {
              const response = await axios.get(
                `${baseURL}api/get_sem_year_by_stream/?course=${selectedCourse}&university=${selectedUniversity}&stream=${selectedStream}`
              ,{
                headers: {
                  Authorization: `Bearer ${apiToken}`,
                },
              });
              // Format the semester and year into a single string (e.g., "2024 - 2")
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
        if (selectedViewStream && selectedViewCourse && selectedViewUniversity) {
          const fetchSemYear = async () => {
            try {
              const response = await axios.get(
                `${baseURL}api/get_sem_year_by_stream/?course=${selectedViewCourse}&university=${selectedViewUniversity}&stream=${selectedViewStream}`
              ,{
                headers: {
                  Authorization: `Bearer ${apiToken}`,
                },
              });
              // Format the semester and year into a single string (e.g., "2024 - 2")
              const semYearData = response.data.streams.map((streamData) => ({
                yearSem: `${streamData.sem}`,
                year: streamData.year,
                sem: streamData.sem,
              }));
              setSemYearOptions(semYearData);
              console.log("Sem year",semYearData);
            } catch (err) {
              setError("Error fetching semester and year.");
            }
          };
          fetchSemYear();
        }
      }, [selectedViewStream, selectedViewCourse, selectedViewUniversity]);


      useEffect(() => {
        // Fetch data only if all required dependencies are present
        if (selectedStream && selectedCourse && selectedUniversity) {
          const fetchSem = async () => {
            setLoading(true); // Show loading spinner/message
            try {
              // Fetch semester value based on selected parameters
              const response = await axios.get(
                `${baseURL}api/get_course_duration/?stream=${selectedStream}&course=${selectedCourse}&university=${selectedUniversity}`,
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
              setCourseDuration(response.data.sem || ""); // Default to empty string if 'sem' is undefined
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


      useEffect(() => {
        if (studyPattern && CourseDuration) {
          const duration = parseInt(CourseDuration, 10); // Parse course duration as integer
          const options = [];
    
          // Populate options based on Study Pattern and Duration
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
      }, [studyPattern, CourseDuration]);

      useEffect(() => {
        // Fetch subjects if all required parameters are provided
        if (selectedViewStream && selectedViewSubstream) {
          const fetchSubjects = async () => {
            setLoading(true);
            setError(""); // Clear previous errors
            try {
              const response = await axios.get(
                `${baseURL}api/get_all_subjects/?stream=${selectedViewStream}&substream=${selectedViewSubstream}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiToken}`,
                  },
                }
              );
      
              console.log("Fetched subjects:", response.data.subjects);
              setSubjects(response.data.subjects || []); // Use empty array if no data
            } catch (err) {
              console.error("Error fetching subjects:", err);
              setError("Error fetching subjects. Please try again.");
            } finally {
              setLoading(false);
            }
          };
      
          fetchSubjects();
        }
      }, [selectedViewStream, selectedViewSubstream]);
      

      const validateForm = () => {
        let errors = {};
      
        // University & Course Validations
        if (!selectedUniversity.trim()) {
          errors.selectedUniversity = "University is required.";
        }
      
        if (!selectedCourse.trim()) {
          errors.selectedCourse = "Course is required.";
        }
      
        if (!selectedStream.trim()) {
          errors.selectedStream = "Stream is required.";
        }
      
        if (!selectedSubstream.trim()) {
          errors.selectedSubstream = "Sub Stream is required.";
        }
      
        if (!session.trim()) {
          errors.session = "Session is required.";
        }
      
        if (!studyPattern.trim()) {
          errors.studyPattern = "Study Pattern is required.";
        }
      
        if (!selectedSemYear.trim()) {
          errors.selectedSemYear = "Semester/Year is required.";
        }
      
      
        // Set Errors and Return Validation Status
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
      };
    
      const handleFetchExams = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        if (!validateForm()) return;

        const payload = {
          university: selectedUniversity,
          course: selectedCourse,
          stream: selectedStream,
          substream: selectedSubstream,
          studypattern: studyPattern,
          semyear: selectedSemYear,
          session: session
        };
      
        console.log("Payload being sent to the API:", payload);
      
        try {
          const response = await axios.post(
            `${baseURL}api/fetch_exam/`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiToken}`,
              },
            }
          );
      
          console.log("Fetched Data:", response.data);
      
          // Set the exams and students data
          setExams(response.data.exams_data || []); // Ensure exams_data is an array
          setStudents(response.data.student_data || []); // Ensure student_data is an array
          setShowTables(true);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to fetch data. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      

     // Handle input change for editable fields
  const handleInputChange = (event, index, field) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = event.target.value;
    setStudents(updatedStudents);
  };

  // Handle checkbox selection for rows
  const handleRowSelect = (state) => {
    setSelectedRows(state.selectedRows);
  };

  const handleSubjectSelection = (row) => {
    console.log("in handleSubjectSelection");
    if (selectedSubjects.some((student) => student.id === row.id)) {
      console.log("in handleSubjectSelection",selectedSubjects);
      setSelectedSubjects(selectedSubjects.filter((student) => student.id !== row.id));
    } else {
      setSelectedSubjects([...selectedSubjects, row]);
    }
  };
  
  const handleExamSelection = (row) => {
    setSelectedExams((prevSelectedExams) => {
      const isSelected = prevSelectedExams.some(
        (exam) => exam.examination_id === row.examination_id
      );
  
      if (isSelected) {
        // Remove the row if already selected
        return prevSelectedExams.filter(
          (exam) => exam.examination_id !== row.examination_id
        );
      } else {
        // Add the row if not selected
        return [...prevSelectedExams, row];
      }
    });
  };
  


  // Columns for the Exams Table
  const examColumns = [
    {
      name: "Select",
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedExams.some(
            (exam) => exam.examination_id === row.examination_id
          )}
          onChange={() => handleExamSelection(row)} // Toggle selection
        />
      ),
      allowOverflow: true,
      button: true,
    },
    {
      name: "Subject Name",
      selector: (row) => row.subject_name,
      sortable: true,
    },
    {
      name: "Exam Type",
      selector: (row) => row.examtype,
      sortable: true,
      cell: (row, index) => (
        <select
          value={row.examtype}
          onChange={(e) => handleExamChange(e, index, "examtype")}
        >
          <option value="THEORY">Theory</option>
          <option value="PRACTICAL">Practical</option>
        </select>
      ),
    },
    {
      name: "Start Date",
      selector: (row) => row.start_date,
      cell: (row, index) => (
        <input
          type="date"
          value={row.start_date}
          onChange={(e) => handleDateTimeChange(e, index, "start_date")}
        />
      ),
    },
    {
      name: "End Date",
      selector: (row) => row.end_date,
      cell: (row, index) => (
        <input
          type="date"
          value={row.end_date}
          onChange={(e) => handleDateTimeChange(e, index, "end_date")}
        />
      ),
    },
    {
      name: "Start Time",
      selector: (row) => row.start_time,
      cell: (row, index) => (
        <input
          type="time"
          value={row.start_time}
          onChange={(e) => handleDateTimeChange(e, index, "start_time")}
        />
      ),
    },
    {
      name: "End Time",
      selector: (row) => row.end_time,
      cell: (row, index) => (
        <input
          type="time"
          value={row.end_time}
          onChange={(e) => handleDateTimeChange(e, index, "end_time")}
        />
      ),
    },
    
  ];

  // Columns for the Students Table
  const studentColumns = [
    {
      name: "Select",
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedSubjects.some((student) => student.id === row.id)} // Check if this row is selected
          onChange={() => handleSubjectSelection(row)} // Toggle the selection
        />
      ),
      allowOverflow: true,
      button: true,
    },    
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
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
      name: "Enrollment Date",
      selector: (row) => row.enrollment_date,
      sortable: true,
    },
  ];

  
   // Updated Columns for DataTable
const columns1 = [
  {
    name: 'Sr.No',
    selector: (row, index) => index + 1,
    sortable: true,
    style: {
      width: '50px', // Adjusted column width
    },
  },
  {
    name: 'Student Name',
    selector: (row) => row.student_name,
    sortable: true,
    style: {
      width: '200px',
    },
  },
  {
    name: 'Email',
    selector: (row) => row.student_email,
    sortable: true,
    style: {
      width: '250px',
    },
  },
  {
    name: 'Mobile',
    selector: (row) => row.student_mobile,
    sortable: true,
    style: {
      width: '150px',
    },
  },
  {
    name: 'Exam Start Time',
    selector: (row) => row.examstarttime,
    sortable: true,
  },
  {
    name: 'Exam End Time',
    selector: (row) => row.examendtime,
    sortable: true,
  },
  {
    name: 'Exam Start Date',
    selector: (row) => row.examstartdate,
    sortable: true,
  },
  {
    name: 'Exam End Date',
    selector: (row) => row.examenddate,
    sortable: true,
  },
  {
    name: 'Status',
    selector: (row) => row.status,
    sortable: true,
  },
  {
    name: 'Actions',
    selector: (row) => null, // This is not sortable
    cell: (row) => (
      <div>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 mr-2"
          onClick={() => openReassignModal(row)}
        >
          Reassign
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 mr-2"
          onClick={() => handleDelete(row)}
        >
          Delete
        </button>
        <button
          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
          onClick={() => handleSendEmail(row)}
        >
          Send Email
        </button>
      </div>
    ),
  },
];


const handleSendEmail = async (row) => {
  try {
    // Construct the payload for the API request
    const payload = {
      studentid: row.student_id, // Assuming you have the student ID in the row
      examid: row.exam_id, // Assuming you have the exam ID in the row
      examstartdate: row.examstarttime, // Assuming you have exam start date
      examenddate: row.examenddate, // Assuming you have exam end date
      examstarttime: row.examstarttime, // Assuming you have exam start time
      examendtime: row.examendtime, // Assuming you have exam end time
    };

    // Make a POST request to the API endpoint
    const response = await fetch(`${baseURL}api/resend-email/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Setting content type to JSON
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify(payload), // Convert payload to JSON format
    });

    if (response.ok) {
      // Simulate success message
      console.log(`Email sent to: ${row.student_email}`);
      alert(`Email sent to ${row.student_email}`);
    } else {
      // Handle failure in email sending
      const error = await response.json();
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please try again.');
    }
  } catch (error) {
    console.error('Error during send email action:', error);
    alert('An error occurred while sending the email.');
  }
};


const handleDelete = async (row) => {
  try {
    const payload = {
      studentid: row.student_id,
      examid: row.exam_id,
    };

    const response = await fetch(`${baseURL}api/delete_exam_for_student/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setStudent((prev) =>
        prev.filter(
          (item) =>
            !(item.student_id === row.student_id && item.exam_id === row.exam_id)
        )
      );
      console.log(`Successfully deleted exam for student: ${row.student_id} and exam: ${row.exam_id}`);
    } else {
      const errorData = await response.json();
      console.error('Failed to delete exam:', errorData);
    }
  } catch (error) {
    console.error('Error during delete action:', error);
  }
};


const validateSearchForm = () => {
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

  if (!selectedViewSubstream.trim()) {
    errors.selectedViewSubstream = "Sub Stream is required.";
  }

  if (!selectedSubject.trim()) {
    errors.selectedSubject = "Semester/Year is required.";
  }

  // Set Errors and Return Validation Status
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

const handleSearch = async (event) => {
  event.preventDefault();
  if (!validateSearchForm()) return;
  console.log("Initiating search...");
  const semYearNumber = selectedViewSemYear ? selectedViewSemYear.split(' ')[1] : '';
      console.log("In Search====", semYearNumber);
  try {
    // Define the payload for the POST request
    const payload = {
      university: selectedViewUniversity,
      course: selectedViewCourse,
      stream: selectedViewStream,
      session: ViewSession,
      studypattern: ViewStudyPattern,
      semyear: semYearNumber,
      substream: selectedViewSubstream,
      subject: selectedSubject, // Include the selected subject
    };

    // Send POST request to the API
    const response = await fetch(`${baseURL}api/view-assigned-students/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify(payload), // Convert payload to JSON
    });

    const data = await response.json();
    console.log('Fetched data:', JSON.stringify(data, null, 2));

    // Check if students are available in the response
    if (data.students && Array.isArray(data.students)) {
      setStudent(data.students); // Update the table with the fetched students
    } else {
      console.error('Unexpected response format:', data);
      setStudent([]); // Clear the table if no data is found
    }
  } catch (error) {
    console.error('Error fetching students:', error);
  }
};


    const handleNavigate = (path) => {
      navigate(path); // Navigate to the specified URL
    };

    const handleDateTimeChange = (e, index, field) => {
      const updatedExams = [...exams];
      updatedExams[index][field] = e.target.value;
      setExams(updatedExams);
    };
  
    const handleCopyValues = () => {
      const updatedExams = exams.map((exam) => ({
        ...exam,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
      }));
      setExams(updatedExams);
    };
  
    const handleClearValues = () => {
      const updatedExams = exams.map((exam) => ({
        ...exam,
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
      }));
      setExams(updatedExams);
    };
  

    const handleSubmit = (e) => {
      e.preventDefault();
    
      // Ensure exams and students are selected
      if (selectedExams.length === 0) {
        console.error("No exams selected");
        alert("Please select at least one exam.");
        return;
      }
      if (selectedSubjects.length === 0) {
        console.error("No students selected");
        alert("Please select at least one student.");
        return;
      }
    
      // Prepare the request data
      const examsData = selectedExams.map((exam) => ({
        examination_id: exam.examination_id,
        subject_id: exam.subject_id,
        subject_name: exam.subject_name,
        examtype: exam.examtype,
        start_date: exam.start_date || startDate, // Use row-specific or global value
        end_date: exam.end_date || endDate,     // Use row-specific or global value
        start_time: exam.start_time || startTime, // Use row-specific or global value
        end_time: exam.end_time || endTime,     // Use row-specific or global value
      }));
    
      const studentData = selectedSubjects.map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        enrollment_id: student.enrollment_id,
        enrollment_date: student.enrollment_date,
      }));
    
      const requestData = {
        examsdata: examsData,
        studentdata: studentData,
      };
    
      console.log("Submitting Request Data:", requestData);
    
      // Submit data to the API
      axios
        .post(`${baseURL}api/save_exam_details/`, requestData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
        })
        .then((response) => {
          console.log("Data submitted successfully:", response.data);
          alert("Data submitted successfully!");
        })
        .catch((error) => {
          console.error("Error submitting data:", error);
          alert("Error submitting data. Please try again.");
        });
    };
    


    return (
    <div className="setexam-page">
              {/* Toggle between forms using buttons */}
          <button
            type="button"
            className="bg-[#dd3751] text-white p-4 py-2 px-4 m-4 rounded-md hover:bg-[#167fc7]"
            onClick={() => setIsViewSetExamination(false)}
          >
            Assign Student Examination
          </button>
          <button
            type="button"
            className="bg-[#dd3751] text-white p-4 py-2 px-4 m-4 rounded-md hover:bg-[#167fc7]"
            onClick={() => setIsViewSetExamination(true)}
          >
            View Assigned Student
          </button>
              {!isViewSetExamination ? (      
                 <>
                  <h2 className="font-bold text-2xl m-4">Assign Examinations</h2>
                  <form onSubmit={handleSubmit} className="m-4 p-4 border rounded-lg shadow-md">
                      <div className="flex flex-wrap mb-4">
                          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                              <label htmlFor="university" 
                              className="block text-sm font-medium text-gray-700">
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
                          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                              <label htmlFor="course" className="block text-sm font-medium text-[#838383]">Course<span className="text-red-500">*</span></label>
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
                          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                              <label htmlFor="stream" className="block text-sm font-medium text-[#838383]">Stream<span className="text-red-500">*</span></label>
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
                          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                              <label htmlFor="substream" className="block text-sm font-medium text-[#838383]">Substream<span className="text-red-500">*</span></label>
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
                              {formError.selectedSubstream && <p className="text-red-500 text-xs">{formError.selectedSubstream}</p>}
                          </div>
                          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                              <label htmlFor="session" className="block text-sm font-medium text-[#838383]">Session<span className="text-red-500">*</span></label>
                              <select
                                  id="session"
                                  value={session}
                                  onChange={(e) => {
                                    setSession(e.target.value);
                                    if (formError.session) {
                                      setFormErrors((prevErrors) => ({ ...prevErrors, session: "" }));
                                    }
                                  }}
                                  className="w-full p-2 border rounded-md bg-[#f5f5f5]"
                              >
                                  <option value="">Select Session</option>
                                  {sessions.map((session) => (
                                      <option key={session.id} value={session.name}>{session.name}</option>
                                  ))}
                              </select>
                              {formError.session && <p className="text-red-500 text-xs">{formError.session}</p>}
                          </div>
                          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                              <label htmlFor="studyPattern" className="block text-sm font-medium text-[#838383]">Study Pattern<span className="text-red-500">*</span></label>
                              <select
                                  id="studyPattern"
                                  value={studyPattern}
                                  onChange={(e) => {
                                    setStudyPattern(e.target.value);
                                    if (formError.studyPattern) {
                                      setFormErrors((prevErrors) => ({ ...prevErrors, studyPattern: "" }));
                                    }
                                  }}
                                  className="w-full p-2 border rounded-md bg-[#f5f5f5]"
                              >
                                  <option value="">Select Study Pattern</option>
                                  <option value="Semester">Semester</option>
                                  <option value="Annual">Annual</option>
                                  <option value="Full Course">Full Course</option>
                              </select>
                              {formError.studyPattern && <p className="text-red-500 text-xs">{formError.studyPattern}</p>}
                          </div>
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
                                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
                                required
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
                              <label htmlFor="courseDuration" className="block text-sm font-medium text-[#838383]">Course Duration (in years)</label>
                              <input
                                  id="courseDuration"
                                  type="number"
                                  value={CourseDuration} // Controlled by state
                                  onChange={(e) => setCourseDuration(e.target.value)} // Allow manual editing
                                  min="1"
                                  max="10" // You can adjust this range as per your needs
                                  className="w-full p-2 border rounded-md bg-[#f5f5f5]"
                                />
                          </div>
                      </div>
                      <div className="flex items-end">
                          <button
                            type="submit"
                            onClick={handleFetchExams}
                            className="bg-[#dd3751] text-white py-2 px-4 rounded-md hover:bg-[#167fc7]"
                          >
                            Fetch Exams
                          </button>
                      </div><br></br>

                   {showTables && (
                    <>
                      <div className="mt-6">
                        <h2 className="text-lg font-bold mb-2">Set Dates and Times for All Subjects</h2>
                          {/* Date & Time Inputs for All Subjects */}
                        <div className="mt-6">
                          <div className="flex gap-4">
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="border p-2 rounded-md"
                            />
                            <input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="border p-2 rounded-md"
                            />
                            <input
                              type="time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="border p-2 rounded-md"
                            />
                            <input
                              type="time"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                              className="border p-2 rounded-md"
                            />
                          </div>
                          <div className="flex justify-end gap-4">
                            <button
                              onClick={handleCopyValues}
                              className="bg-[#dd3751] text-white py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                              Copy Values
                            </button>
                            <button
                              onClick={handleClearValues}
                              className="bg-[#dd3751] text-white py-2 px-4 rounded-md hover:bg-red-600 ml-4"
                            >
                              Clear Values
                            </button>
                          </div>
                        </div>
                        {exams.length > 0 ? (
                        <DataTable columns={examColumns} data={exams} pagination />
                        ) : (
                          <p className="text-gray-500">No examinations found.</p>
                        )}

                         {/* Add Buttons Below Exams Table */}
                      <div className="mt-4 flex gap-4">
                        <button
                          onClick={() => handleNavigate("/quick-register")}
                          className="bg-[#dd3751] text-white py-2 px-4 rounded-md hover:bg-green-600"
                        >
                          Add Students
                        </button>
                        <button
                          onClick={() => handleNavigate("/bulk-data-upload")}
                          className="bg-[#dd3751] text-white py-2 px-4 rounded-md hover:bg-yellow-600"
                        >
                          Bulk-Add Students
                        </button>
                      </div>
                      </div>

                      <div className="mt-6">
                        <h2 className="text-lg font-bold mb-2">Add Student to Exam</h2>
                        {students.length > 0 ? (
                          <DataTable columns={studentColumns} data={students} pagination />
                        ) : (
                          <p className="text-gray-500">No students found.</p>
                        )}
                      </div>

                      <div className="flex items-end pt-4">
                          <button
                              type="submit"
                              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-[#167fc7]">
                              Assign Students
                          </button>
                      </div>
                      </> 
                    )}
                  </form>
                  </>
                  ) : (
                    <>
                  <h2 className="font-bold text-2xl m-4">VIEW ASSIGNED STUDENTS</h2>
                  <form onSubmit={handleSubmit} className="m-4 p-4 border rounded-lg shadow-md">
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
                              <label htmlFor="substream" className="block text-sm font-medium text-[#838383]">Substream<span className="text-red-500">*</span></label>
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
                                  }}
                                  className="w-full p-2 border rounded-md bg-[#f5f5f5]"
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
                                value={ViewCourseDuration} // Controlled by state
                                onChange={(e) => setViewCourseDuration(e.target.value)} // Allow manual editing
                                min="1"
                                max="10" // You can adjust this range as per your needs
                                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
                              />
                          </div>

                          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                            <label
                              htmlFor="subject"
                              className="block text-sm font-medium text-[#838383]"
                            >
                              Select Subject
                              <span className="text-red-500">*</span></label>
                            <select
                              id="subject"
                              value={selectedSubject}
                              onChange={(e) => {
                                setSelectedSubject(e.target.value);
                                if (formError.selectedSubject) {
                                  setFormErrors((prevErrors) => ({ ...prevErrors, selectedSubject: "" }));
                                }
                              }}
                              className="w-full p-2 border rounded-md bg-[#f5f5f5]"
                            >
                              <option value="">Select Subject</option>
                              {loading && <option>Loading...</option>}
                              {error && <option>{error}</option>}
                              {subjects.length > 0 ? (
                                subjects.map((subject) => (
                                  <option key={subject.id} value={subject.id}>
                                    {subject.name}
                                  </option>
                                ))
                              ) : (
                                !loading && <option>No subjects available</option>
                              )}
                            </select>
                            {formError.selectedSubject && <p className="text-red-500 text-xs">{formError.selectedSubject}</p>}
                          </div>
                          </div>
                      <div className="flex items-end">
                          <button
                            type="submit"
                            onClick={handleSearch}
                            className="bg-[#dd3751] text-white py-2 px-4 m-4 rounded-md hover:bg-[#167fc7]"
                          >
                            Search
                          </button>
                        
                          <button onClick={handleDownload} className="bg-[#dd3751] m-4 text-white py-2 px-4 rounded-md">
                            Download Excel
                          </button>
                      
                      </div>

                      <div className="overflow-x-auto mt-4">
                        <DataTable
                          columns={columns1}
                          data={student}
                          selectableRows
                          onSelectedRowsChange={handleRowSelect}
                          selectableRowsHighlight
                          pagination
                          subHeader
                          subHeaderComponent={<input type="text" placeholder="Search..." />}
                        />
                      </div>
                  </form>
                  </>
                  )}

{isReassignModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-lg font-bold mb-4">Reassign Exam</h2>
      <div className="mb-3">
        <label className="block text-sm font-medium">Exam Start Date</label>
        <input
          type="date"
          value={reassignData.examstartdate}
          onChange={(e) =>
            setReassignData({ ...reassignData, examstartdate: e.target.value })
          }
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Exam End Date</label>
        <input
          type="date"
          value={reassignData.examenddate}
          onChange={(e) =>
            setReassignData({ ...reassignData, examenddate: e.target.value })
          }
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Exam Start Time</label>
        <input
          type="time"
          value={reassignData.examstarttime}
          onChange={(e) =>
            setReassignData({ ...reassignData, examstarttime: e.target.value })
          }
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Exam End Time</label>
        <input
          type="time"
          value={reassignData.examendtime}
          onChange={(e) =>
            setReassignData({ ...reassignData, examendtime: e.target.value })
          }
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="flex justify-end">
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded-md mr-2"
          onClick={closeReassignModal}
        >
          Cancel
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleReassignSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}

    </div>
    )
}
export default AssignExamination;