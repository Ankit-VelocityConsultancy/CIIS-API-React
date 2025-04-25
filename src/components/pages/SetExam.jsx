import { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const SetExamination = () => {
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
    const [formError, setFormErrors] = useState({});
    const baseURL = useRecoilValue(baseURLAtom);

    const apiToken = localStorage.getItem("access");
  
    const columns2 = [
      { label: "Question", key: "question" },
      { label: "Question Type", key: "Question Type" },
      { label: "Marks", key: "marks" },
      { label: "Difficulty Level", key: "difficultyLevel" },
      { label: "Option 1", key: "option1" },
      { label: "Option 2", key: "option2" },
      { label: "Option 3", key: "option3" },
      { label: "Option 4", key: "option4" },
      { label: "Answer", key: "answer" }
    ];
    // Function to generate and download the empty Excel file
    const handleDownload = () => {
      // Create an empty array with the column headers
      const emptyData = [
        {
          Question: "",
          Question_Type: "",
          Marks: "",
          Difficulty_Level: "",
          Option1: "",
          Option2: "",
          Option3: "",
          Option4: "",
          Answer: ""
        }
      ];
  
      // Create a worksheet from the empty data
      const worksheet = XLSX.utils.json_to_sheet(emptyData);
  
      // Create a workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");
  
      // Download the Excel file
      XLSX.writeFile(workbook, "questions_template.xlsx");
    };

      useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await axios.get(`${baseURL}api/universities/`,{
                  headers: {
                    Authorization: `Bearer ${apiToken}`, // Ensure token is included
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
                `${baseURL}api/courses-with-id/?university_id=${selectedUniversity}`
              ,{
                headers: {
                  Authorization: `Bearer ${apiToken}`, // Ensure token is included
                },
              });
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
                `${baseURL}api/courses-with-id/?university_id=${selectedViewUniversity}`
              ,{
                headers: {
                  Authorization: `Bearer ${apiToken}`, // Ensure token is included
                },
              });
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
                `${baseURL}api/streams-with-id/?course_id=${selectedCourse}&university_id=${selectedUniversity}`
              ,{
                headers: {
                  Authorization: `Bearer ${apiToken}`, // Ensure token is included
                },
              });
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
                `${baseURL}api/streams-with-id/?course_id=${selectedViewCourse}&university_id=${selectedViewUniversity}`
              ,{
                headers: {
                  Authorization: `Bearer ${apiToken}`, // Ensure token is included
                },
              });
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
                `${baseURL}api/substreams-with-id/?course_id=${selectedCourse}&university_id=${selectedUniversity}&stream_id=${selectedStream}`
              ,{
                headers: {
                  Authorization: `Bearer ${apiToken}`, // Ensure token is included
                },
              });
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
                `${baseURL}api/substreams-with-id/?course_id=${selectedViewCourse}&university_id=${selectedViewUniversity}&stream_id=${selectedViewStream}`
              ,{
                headers: {
                  Authorization: `Bearer ${apiToken}`, // Ensure token is included
                },
              });
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
  
    // if (!selectedSubstream.trim()) {
    //   errors.selectedSubstream = "Sub Stream is required.";
    // }
  
    if (!session.trim()) {
      errors.session = "Session is required.";
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

  const handleFetchStudents = async (event) => {
    event.preventDefault();
    console.log("In Fetch");
    if (!validateForm()) return;
  
    try {
      const response = await fetch(
        `${baseURL}api/fetch-subject/?stream=${selectedStream}&substream=${selectedSubstream}&study_pattern=${studyPattern}&semyear=${selectedSemYear}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
  
      const data = await response.json();
      console.log("Fetched data", JSON.stringify(data, null, 2));
  
      // ✅ Ensure default fields like examtype are added
      const enrichedSubjects = data.data.map((row) => ({
        ...row,
        examtype: row.examtype || "THEORY",     // Set default
        exam_duration: row.exam_duration || "", // Optional
        max_marks: row.max_marks || "",
        min_marks: row.min_marks || "",
        file: null,
      }));
  
      setStudents(enrichedSubjects);
    } catch (error) {
      console.error("Error fetching data:", error);
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


  const handleFileChange = (e, index) => {
    const updatedRows = [...students];
    updatedRows[index].file = e.target.files[0]; // Store the selected file
    setStudents(updatedRows);
  };
  
  const handleCheckboxChange = (row) => {
    if (selectedRows.includes(row)) {
      setSelectedRows(selectedRows.filter((r) => r !== row));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };
  

  // Set Examination
     const columns = [
    {
      name: 'Select',
      cell: row => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row)}
          onChange={() => handleCheckboxChange(row)}
        />
      ),
      allowOverflow: true,
      button: true,
    },
    {
      name: 'Subject',
      selector: 'name',
      sortable: true,
      cell: (row, index) => (
        <input
          type="text"
          value={row.name}
          onChange={(e) => handleInputChange(e, index, 'name')}
        />
      )
    },
    {
      name: 'Subject Code',
      selector: 'code',
      sortable: true,
      cell: (row, index) => (
        <input
          type="text"
          value={row.code}
          onChange={(e) => handleInputChange(e, index, 'code')}
        />
      ),
    },
    {
      name: 'Exam Type',
      selector: 'exam_type',
      sortable: true,
      cell: (row, index) => (
        <select
          value={row.examtype}
          onChange={(e) => handleInputChange(e, index, 'examtype')}
        >
          <option value="THEORY">Theory</option>
          <option value="PRACTICAL">Practical</option>
        </select>
      ),
    },
    {
      name: 'Upload File',
      cell: (row, index) => (
        <input
          type="file"
          onChange={(e) => handleFileChange(e, index)}
        />
      ),
    },
    {
      name: 'Exam Duration',
      selector: 'exam_duration',
      cell: (row, index) => (
        <input
          type="text"
          value={row.exam_duration}
          placeholder="Enter duration"
          onChange={(e) => handleInputChange(e, index, 'exam_duration')}
        />
      ),
    },
    {
      name: 'Max. Marks',
      selector: 'max_marks',
      cell: (row, index) => (
        <input
          type="number"
          value={row.max_marks}
          placeholder="Enter max marks"
          onChange={(e) => handleInputChange(e, index, 'max_marks')}
        />
      ),
    },
    {
      name: 'Min. Marks',
      selector: 'min_marks',
      cell: (row, index) => (
        <input
          type="number"
          value={row.min_marks}
          placeholder="Enter min marks"
          onChange={(e) => handleInputChange(e, index, 'min_marks')}
        />
      ),
    },
  ];

 
    // Columns for DataTable
    const columns1 = [
      {
        name: 'Sr.No',
        selector: (row, index) => index + 1,
        sortable: true,
        style: {
          width: '0px'  // Adjust the width for the column
        }
      },
      {
        name: 'Session',
        selector: row => row.session,
        sortable: true,
        style: {
          width: '200px'  // Adjust the width for the column
        }
      },
      {
        name: 'Study Pattern',
        selector: row => row.studypattern,
        sortable: true,
        style: {
          width: '200px'  // Adjust the width for the column
        }
      },
      {
        name: 'Semester/Year',
        selector: row => row.semyear,
        sortable: true,
        style: {
          width: '200px'  // Adjust the width for the column
        }
      },
      {
        name: 'Subject',
        selector: row => row.subject,
        sortable: true
      },
      {
        name: 'Exam Type',
        selector: row => row.examtype,
        sortable: true
      },
      {
        name: 'Total Marks',
        selector: row => row.totalmarks,
        sortable: true
      },
      {
        name: 'Passing Marks',
        selector: row => row.passingmarks,
        sortable: true
      },
      {
        name: 'Number of Questions',
        selector: row => row.totalquestions,
        sortable: true
      },
      {
        name: 'Exam Duration',
        selector: row => row.examduration,
        sortable: true
      }
    ];

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
      const semYearNumber = selectedViewSemYear ? selectedViewSemYear.split(' ')[1] : '';
      console.log("In Search====", semYearNumber);

      try {
        // Fetch data from the API with query parameters
        const response = await fetch(`${baseURL}api/view_set_examination/?university=${selectedViewUniversity}&course=${selectedViewCourse}&stream=${selectedViewStream}&substream=${selectedViewSubstream}&session=${ViewSession}&studypattern=${ViewStudyPattern}&semyear=${semYearNumber}`, {
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
        });
        
        const data = await response.json();
        console.log("Fetched data", JSON.stringify(data, null, 2));
    
        // If the response is an array, set the state
        if (Array.isArray(data)) {
          setStudent(data);
        } else {
          console.error("Fetched data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

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
      if (studyPattern && courseDuration) {
        const duration = parseInt(courseDuration, 10); // Parse course duration as integer
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
    }, [studyPattern, courseDuration]);


    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent form reload
      
      try {
        if (!selectedUniversity || !selectedCourse || !selectedStream || !session || !studyPattern || !selectedSemYear) {
          // alert("Please fill out all the required fields.");
          // return;
        }
    
        if (selectedRows.length === 0) {
          // alert("Please select at least one subject from the table.");
          // return;
        }
    
        // Iterate over selected rows to prepare data for API
        for (const row of selectedRows) {
          const formData = new FormData();
          formData.append("university", selectedUniversity);
          formData.append("course", selectedCourse);
          formData.append("stream", selectedStream);
          formData.append("substream", selectedSubstream);
          formData.append("subject", row.id);
          formData.append("examtype", row.examtype);
          formData.append("examduration", row.exam_duration);
          formData.append("session", session);
          formData.append("studypattern", studyPattern);
          formData.append("semyear", selectedSemYear);
          formData.append("totalmarks", row.max_marks);
          formData.append("passingmarks", row.min_marks);
    
          if (row.file) {
            formData.append("file", row.file);
          }
    
          // API call to save the data
          const response = await fetch(`${baseURL}api/set_exam_for_subject/`, {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${apiToken}`, // Replace with your actual token if required
            },
          });
    
          if (response.ok) {
            console.log(`Exam set successfully for subject: ${row.name}`);
          } else {
            const error = await response.json();
            console.error(`Failed to set exam for subject: ${row.name}`, error);
          }
        }
    
        // alert("All selected subjects have been saved successfully.");
      } catch (error) {
        console.error("Error saving exam data:", error);
        alert("An error occurred while saving data. Please try again.");
      }
    };
    
    return (
    <div className="setexam-page">
              {/* Toggle between forms using buttons */}
          <button
            type="button"
            className="bg-red-500 text-white p-4 py-2 px-4 m-4 rounded-md hover:bg-[#167fc7]"
            onClick={() => setIsViewSetExamination(false)}
          >
            Set Examination
          </button>
          <button
            type="button"
            className="bg-red-500 text-white p-4 py-2 px-4 m-4 rounded-md hover:bg-[#167fc7]"
            onClick={() => setIsViewSetExamination(true)}
          >
            View Set Examination
          </button>

              {!isViewSetExamination ? (      
                 <>
                  <h2 className="font-bold text-2xl m-4">ADD EXAMINATION DETAILS</h2>
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
                              <label htmlFor="substream" className="block text-sm font-medium text-[#838383]">Substream<span className="text-red-500"></span></label>
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
                                  value={courseDuration} // Controlled by state
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
                            onClick={handleFetchStudents}
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-[#167fc7]"
                          >
                            Fetch Subject
                          </button>
                      </div><br></br>
                      <div className="flex items-end">
                          <button onClick={handleDownload} className="bg-blue-500 text-white py-2 px-4 rounded-md">
                          Download Template
                          </button>
                      </div>

                      <div className="overflow-x-auto mt-4">
                        <DataTable
                          columns={columns}
                          data={students}
                          selectableRows
                          onSelectedRowsChange={handleRowSelect}
                          selectableRowsHighlight
                          pagination
                          subHeader
                          subHeaderComponent={<input type="text" placeholder="Search..." />}
                        />
                      </div>

                      <div className="flex items-end pt-4">
                          <button
                              type="submit"
                              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-[#167fc7]">
                              Save
                          </button>
                      </div>
                  </form>
                  </>
                  ) : (
                    <>
                  <h2 className="font-bold text-2xl m-4">VIEW EXAMINATION</h2>
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
                              <label htmlFor="substream" className="block text-sm font-medium text-[#838383]">Substream</label>
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
                              <label htmlFor="session" className="block text-sm font-medium text-[#838383]">Session</label>
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
                              <label htmlFor="studyPattern" className="block text-sm font-medium text-[#838383]">Study Pattern</label>
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
                              <label htmlFor="semesterYear" className="block text-sm font-medium text-[#838383]">Semester/Year</label>
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
    </div>
    )
}
export default SetExamination;