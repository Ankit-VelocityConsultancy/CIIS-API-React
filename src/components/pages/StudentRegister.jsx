import { useState, useEffect } from "react";
import { useRef } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "./QualificationTable.css";
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const StudentRegistrationPage = () => {
  const [university, setUniversity] = useState("");
  const [studentName, setStudentName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dateOfBirth, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [counselorName, setCounselorName] = useState("");
  const [universityEnrollmentNumber, setUniversityEnrollmentNumber] = useState("");
  const [studentRemarks, setStudentRemarks] = useState("");
  const [course, setCourse] = useState("");
  const [stream, setStream] = useState("");
  const [session, setSession] = useState("");
  const [studyPattern, setStudyPattern] = useState("");
  const [admissionType, setAdmissionType] = useState("");
  const [semesterYear, setSemesterYear] = useState("");
  const [feesReceiptType, setFeesReceiptType] = useState("");
  const [totalFees, setTotalFees] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [chequeNo, setChequeNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [streams, setStreams] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [banks, setBanks] = useState([]);
  const [feeReceiptOptions, setFeeReceiptOptions] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [semYearOptions, setSemYearOptions] = useState([]);
  const [selectedSemYear, setSelectedSemYear] = useState("");
  const [selectedBank, setSelectedBank] = useState(""); // State to hold selected bank value
  const [feeReceipt, setFeeReceipt] = useState('');
  const [substreams, setSubstreams] = useState([]);
  const [substream, setSubstream] = useState('');
  const [loadingSubstreams, setLoadingSubstreams] = useState(false);
  const [showAltMobile, setShowAltMobile] = useState(false);
  const [showAltEmail, setShowAltEmail] = useState(false);
  const [altMobileNumber, setAltMobileNumber] = useState("");
  const [altEmail, setAltEmail] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedSubstream, setSelectedSubstream] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");  // Added this state for selected city
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [address, setCurrentAddress] = useState("");
  const [alternateAddress, setAlternateAddress] = useState("");
  const [nationality, setNationality] = useState("");
  const [pincode, setPincode] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [studentFile, setStudentFile] = useState(null); // Initializes state for the file
  const [errors, setErrors] = useState({});
  const [ViewCourseDuration, setViewCourseDuration] = useState([]);
  const [formError, setFormErrors] = useState({});
  const [StudFile, setStudFile] = useState({});
  const [feesData, setFeesData] = useState([]);
const studentFileRef = useRef(null);

  const resetForm = () => {
    setStudentName("");
    setFatherName("");
    setDob("");
    setMobileNumber("");
    setEmail("");
    setAltMobileNumber("");
    setAltEmail("");
    setGender("");
    setCategory("");
    setCurrentAddress("");
    setAlternateAddress("");
    setNationality("");
    setPincode("");
    setRegistrationNumber("");
    setReferenceName("");
    setUniversityEnrollmentNumber("");
    setSelectedUniversity("");
    setSelectedCourse("");
    setSelectedStream("");
    setSelectedSubstream("");
    setStudyPattern("");
    setStudentRemarks("");
    setSession("");
    setAdmissionType("");
    setSelectedSemYear("");
    setViewCourseDuration("");
    setCounselorName("");
    setFeeReceipt("");
    setTransactionDate("");
    setPaymentMode("");
    setSelectedBank("");
    setChequeNo("");
    setAmount("");
    setRemarks("");
    setSelectedCountry("");
    setSelectedState("");
    setSelectedCity("");
    setStudFile(null);
    setErrors({});
    setFormErrors({});
    setShowAltMobile(false);
    setShowAltEmail(false);
    setRows([
      { exam: "Secondary/High School", year: "", board: "", percentage: "", document: null },
      { exam: "Sr. Secondary", year: "", board: "", percentage: "", document: null },
      { exam: "Under Graduation", year: "", board: "", percentage: "", document: null },
      { exam: "Post Graduation", year: "", board: "", percentage: "", document: null },
      { exam: "Eng. Diploma / ITI", year: "", board: "", percentage: "", document: null },
      { exam: "Others", year: "", board: "", percentage: "", document: null },
    ]);
    
    setTotalFees("");
    if (studentFileRef.current) {
      studentFileRef.current.value = null;
    }

    setDocuments([
      {
        documentType: "",
        nameAsOnDocument: "",
        idNumber: "",
        uploadFront: null,
        uploadBack: null,
      },
    ]);
  };
 // Store fetched fees data
  const baseURL = useRecoilValue(baseURLAtom);

  const [rows, setRows] = useState([
    { exam: "Secondary/High School", year: "", board: "", percentage: "", document: null },
    { exam: "Sr. Secondary", year: "", board: "", percentage: "", document: null },
    { exam: "Under Graduation", year: "", board: "", percentage: "", document: null },
    { exam: "Post Graduation", year: "", board: "", percentage: "", document: null },
    { exam: "Eng. Diploma / ITI", year: "", board: "", percentage: "", document: null },
    { exam: "Others", year: "", board: "", percentage: "", document: null },
  ]);

  const addRow = () => {
    setRows([...rows, { exam: "", year: "", board: "", percentage: "", document: null }]);
  };

  const apiToken = localStorage.getItem("access"); // Replace with your token source

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

  // Fetch courses for the selected university with authentication
  useEffect(() => {
    if (selectedUniversity) {
      const fetchCourses = async () => {
        try {
          const apiToken = localStorage.getItem("access"); // Retrieve the token
          const response = await axios.get(
            `${baseURL}api/courses-with-id/?university_id=${selectedUniversity}`,
            {
              headers: {
                Authorization: `Bearer ${apiToken}`, // Add the token to the headers
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

  // Fetch streams for the selected course and university with authentication
  useEffect(() => {
    if (selectedCourse && selectedUniversity) {
      const fetchStreams = async () => {
        try {
          const apiToken = localStorage.getItem("access"); // Retrieve the token
          const response = await axios.get(
            `${baseURL}api/streams-with-id/?course_id=${selectedCourse}&university_id=${selectedUniversity}`,
            {
              headers: {
                Authorization: `Bearer ${apiToken}`, // Add the token to the headers
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

  // Fetch substreams for the selected stream, course, and university with authentication
  useEffect(() => {
    if (selectedStream && selectedCourse && selectedUniversity) {
      const fetchSubstreams = async () => {
        try {
          const apiToken = localStorage.getItem("access"); // Retrieve the token
          const response = await axios.get(
            `${baseURL}api/substreams-with-id/?course_id=${selectedCourse}&university_id=${selectedUniversity}&stream_id=${selectedStream}`,
            {
              headers: {
                Authorization: `Bearer ${apiToken}`, // Add the token to the headers
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
    const fetchBanks = async () => {
      try {
        const apiToken = localStorage.getItem("access"); // Retrieve the token
        const response = await fetch(`${baseURL}api/bank_names/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${apiToken}`, // Add the token to the headers
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        // Filter out inactive banks (status: true)
        const activeBanks = data.filter(bank => bank.status);
        setBanks(activeBanks);
      } catch (error) {
        console.error("Error fetching bank names:", error);
      }
    };
  
    fetchBanks();
  }, []);
  
  

  // Fetch fee receipt options on component mount
  useEffect(() => {
    const fetchFeeReceiptOptions = async () => {
      try {
        const response = await fetch(`${baseURL}api/fee-receipt-options/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${apiToken}`, // Include token here
            "Content-Type": "application/json",
          },
        });

        // Check if response is successful
        if (!response.ok) {
          throw new Error("Unauthorized or failed to fetch");
        }

        const data = await response.json();

        // Log the raw response for debugging
        console.log('Raw Fee Receipt Options:', data);

        // Set all the options (no filtering)
        setFeeReceiptOptions(data);
      } catch (error) {
        console.error("Error fetching fee receipt options:", error);
        setError(error.message); // Set the error message
      }
    };

    fetchFeeReceiptOptions();
  }, [apiToken]);

  useEffect(() => {
    // Fetch payment modes from API with authentication
    const fetchPaymentModes = async () => {
      try {
        const apiToken = localStorage.getItem("access"); // Retrieve the token
        const response = await fetch(`${baseURL}api/payment_modes/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiToken}`, // Add the token to the headers
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        // Log the raw API response
        console.log('Raw API response:', data);
  
        // Set the payment modes state with all the data (no filtering)
        setPaymentModes(data);
      } catch (error) {
        console.error('Error fetching payment modes:', error);
      }
    };
  
    fetchPaymentModes();
  }, []);
  

      useEffect(() => {
        // Fetch data only if all required dependencies are present
        if (selectedStream && selectedCourse && selectedUniversity) {
          const fetchSem = async () => {
            setLoading(true); // Show loading spinner/message
            try {
              // Fetch semester value based on selected parameters
              const response = await axios.get(
                `${baseURL}api/get_course_duration/?course=${selectedCourse}&university=${selectedUniversity}&stream=${selectedStream}`,
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
      }, [selectedStream, selectedCourse, selectedUniversity]);


      useEffect(() => {
        if (studyPattern && ViewCourseDuration) {
          const duration = parseInt(ViewCourseDuration, 10); // Parse course duration as integer
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
      }, [studyPattern, ViewCourseDuration]);
    

 // Fetch countries data
useEffect(() => {
  const fetchCountries = async () => {
    try {
      const apiToken = localStorage.getItem("access"); // Retrieve the token
      const response = await fetch(`${baseURL}api/countries/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`, // Add token to headers
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  fetchCountries();
}, []);

// Fetch states based on selected country
useEffect(() => {
  if (selectedCountry) {
    const fetchStates = async () => {
      try {
        const apiToken = localStorage.getItem("access"); // Retrieve the token
        const response = await fetch(`${baseURL}api/states/?country_id=${selectedCountry}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiToken}`, // Add token to headers
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }
}, [selectedCountry]);

// Fetch cities based on selected state
useEffect(() => {
  if (selectedState) {
    const fetchCities = async () => {
      try {
        const apiToken = localStorage.getItem("access"); // Retrieve the token
        const response = await fetch(`${baseURL}api/cities/?state_id=${selectedState}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiToken}`, // Add token to headers
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }
}, [selectedState]);



 const [documents, setDocuments] = useState([
    {
      documentType: "",
      nameAsOnDocument: "",
      idNumber: "",
      uploadFront: null,
      uploadBack: null,
    },
  ]);

  const documentTypes = ["Aadhar Card", "Pancard", "Passport", "Voter ID", "Driving License", "Other"];

  // Add a new row to the documents list
  const handleAddRow = () => {
    
    setTotalFees("");
    if (studentFileRef.current) {
      studentFileRef.current.value = null;
    }

    setDocuments([
      ...documents,
      {
        documentType: "",
        nameAsOnDocument: "",
        idNumber: "",
        uploadFront: null,
        uploadBack: null,
      },
    ]);
  };

  
  const handlestudFileChange = (e) => {
    if (!e?.target?.files?.length) return;
    const files = Array.from(e.target.files);
    console.log("Files selected:", files); // Log the files to check
    setStudFile(files); // Store files as an array directly
  };



const handleFileChange = (event, index, fieldName) => {
  const file = event.target.files[0];
  if (file) {
    const updatedDocuments = [...documents];
    updatedDocuments[index] = { ...updatedDocuments[index], [fieldName]: file };
    setDocuments(updatedDocuments);

    // Remove error when file is selected
    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[`${fieldName}_${index}`];
      return newErrors;
    });
  }
};


const handleQualificationFileChange = (e, index) => {
  const file = e.target.files[0];
  setRows((prevRows) =>
    prevRows.map((row, i) =>
      i === index ? { ...row, document: file } : row
    )
  );
};

const handleChange = (index, event) => {
  const { name, value } = event.target;
  const updatedDocuments = [...documents];
  updatedDocuments[index] = { ...updatedDocuments[index], [name]: value };
  setDocuments(updatedDocuments);

  // Remove error if the user enters a valid value
  setFormErrors((prevErrors) => {
    const newErrors = { ...prevErrors };
    delete newErrors[`${name}_${index}`];
    return newErrors;
  });
};

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };
  
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
  
    // Student Details Validations
    if (!studentName.trim()) {
      errors.studentName = "Student Name is required.";
    } else if (!/^[a-zA-Z ]+$/.test(studentName)) {
      errors.studentName = "Name can only contain letters and spaces.";
    }
  
    if (!dateOfBirth.trim()) {
      errors.dateOfBirth = "Date of Birth is required.";
    } else {
      let dob = new Date(dateOfBirth);
      let today = new Date();
      if (dob >= today) {
        errors.dateOfBirth = "Date of Birth cannot be today or in the future.";
      }
    }
  
    if (!mobileNumber.trim()) {
      errors.mobileNumber = "Mobile Number is required.";
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      errors.mobileNumber = "Mobile Number must be 10 digits.";
    }
  
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format.";
    }
  
    if (!selectedCountry.trim()) {
      errors.selectedCountry = "Country is required.";
    }
  
    if (!selectedState.trim()) {
      errors.selectedState = "State is required.";
    }
  
    if (!session.trim()) {
      errors.session = "Session is required.";
    }
  
    if (!studyPattern.trim()) {
      errors.studyPattern = "Study Pattern is required.";
    }
  
    if (!admissionType.trim()) {
      errors.admissionType = "Admission Type is required.";
    }
  
    if (!selectedSemYear.trim()) {
      errors.selectedSemYear = "Semester/Year is required.";
    }
  
    // Fee & Payment Validations
    if (!feeReceipt) {
      errors.feeReceipt = "Fee Receipt is required.";
    } 
  
    if (!amount.trim()) {
      errors.amount = "Amount is required.";
    }
  
    if (!transactionDate.trim()) {
      errors.transactionDate = "Transaction Date is required.";
    }

    if (!paymentMode.trim()) {
      errors.paymentMode = "Payment Mode is required.";
    }
  
    if (!remarks.trim()) {
      errors.remarks = "Remarks are required.";
    }
  
    // Personal Documents Validation
    documents.forEach((doc, index) => {
      if (!doc.documentType.trim()) {
        errors[`documentType_${index}`] = "Document Type is required.";
      }
      if (!doc.nameAsOnDocument.trim()) {
        errors[`nameAsOnDocument_${index}`] = "Name as on document is required.";
      }
      if (!doc.idNumber.trim()) {
        errors[`idNumber_${index}`] = "ID Number is required.";
      }
      if (!doc.uploadFront) {
        errors[`uploadFront_${index}`] = "Front document is required.";
      } 
      if (!doc.uploadBack) {
        errors[`uploadBack_${index}`] = "Back document is required.";
      }
    });
  
   
    // Set Errors and Return Validation Status
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handles text input changes for qualifications
const handlequalificationInputChange = (index, field, value) => {
  setRows((prevRows) =>
    prevRows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    )
  );
};



const submitForm = async (event) => {
  event.preventDefault();
  setLoading(true);

  if (!validateForm()) {
    setLoading(false);
    return;
  }

  try {
    const formData = new FormData();

    // Append student details
    formData.append("name", studentName);
    formData.append("father_name", fatherName);
    formData.append("dob", dateOfBirth);
    formData.append("mobile_number", mobileNumber);
    formData.append("email", email);
    formData.append("gender", gender);
    formData.append("category", category);
    formData.append("address", address);
    formData.append("course", selectedCourse);
    formData.append("stream", selectedStream);
    formData.append("substream", selectedSubstream);
    formData.append("studypattern", studyPattern);
    formData.append("session", session);
    formData.append("entry_mode", admissionType);
    formData.append("semyear", selectedSemYear);
    formData.append("registration_number", registrationNumber);
    formData.append("university", selectedUniversity);
    formData.append("counselor_name", counselorName);
    formData.append("reference_name", referenceName);
    formData.append("fee_reciept_type", feeReceipt);
    formData.append("transaction_date", transactionDate);
    formData.append("payment_mode", paymentMode);
    formData.append("bank_name", selectedBank);
    formData.append("cheque_no", chequeNo);
    formData.append("paidamount", amount);
    formData.append("remarks", remarks);
    formData.append("country", selectedCountry);
    formData.append("state", selectedState);
    formData.append("city", selectedCity);
    formData.append("alternateaddress", alternateAddress);
    formData.append("nationality", nationality);
    formData.append("pincode", pincode);

    // Append othersQualifications (rows starting from index 5)
    const othersQualifications = rows.slice(5);
    othersQualifications.forEach((row, index) => {
      if (row.document) {
        formData.append(`qualifications[others][${index}][file]`, row.document);
        formData.append(`qualifications[others][${index}][year]`, row.year);
        formData.append(`qualifications[others][${index}][board]`, row.board);
        formData.append(`qualifications[others][${index}][doctype]`, row.doctype);
      }
    });
    
    // Append qualifications for first 5 rows
    const qualifications = rows.slice(0, 5);
    qualifications.forEach((row) => {
      if (row.exam === "Secondary/High School") {
        formData.append("qualifications[secondary_year]", row.year);
        formData.append("qualifications[secondary_board]", row.board);
        formData.append("qualifications[secondary_percentage]", row.percentage);
      } else if (row.exam === "Sr. Secondary") {
        formData.append("qualifications[sr_year]", row.year);
        formData.append("qualifications[sr_board]", row.board);
        formData.append("qualifications[sr_percentage]", row.percentage);
      } else if (row.exam === "Under Graduation") {
        formData.append("qualifications[under_year]", row.year);
        formData.append("qualifications[under_board]", row.board);
        formData.append("qualifications[under_percentage]", row.percentage);
      } else if (row.exam === "Post Graduation") {
        formData.append("qualifications[post_year]", row.year);
        formData.append("qualifications[post_board]", row.board);
        formData.append("qualifications[post_percentage]", row.percentage);
      } else if (row.exam === "Eng. Diploma / ITI") {
        formData.append("qualifications[mphil_year]", row.year);
        formData.append("qualifications[mphil_board]", row.board);
        formData.append("qualifications[mphil_percentage]", row.percentage);
      }
    });
    
    // Append qualification documents for first 5 rows
    rows.slice(0, 5).forEach((row) => {
      if (row.document) {
        switch (row.exam) {
          case "Secondary/High School":
            formData.append("qualifications[secondary_document]", row.document);
            break;
          case "Sr. Secondary":
            formData.append("qualifications[sr_document]", row.document);
            break;
          case "Under Graduation":
            formData.append("qualifications[under_document]", row.document);
            break;
          case "Post Graduation":
            formData.append("qualifications[post_document]", row.document);
            break;
          case "Eng. Diploma / ITI":
            formData.append("qualifications[mphil_document]", row.document);
            break;
          default:
            break;
        }
      }
    });

    // Append student photo
    if (StudFile && StudFile.length > 0) {
      StudFile.forEach((f) => formData.append("image", f));
    }

    // Append additional documents
    documents.forEach((doc, index) => {
      formData.append(`documents[${index}][document]`, doc.documentType);
      formData.append(`documents[${index}][document_name]`, doc.nameAsOnDocument);
      formData.append(`documents[${index}][document_ID_no]`, doc.idNumber);
      if (doc.uploadFront) {
        formData.append(`documents[${index}][document_image_front]`, doc.uploadFront);
      }
      if (doc.uploadBack) {
        formData.append(`documents[${index}][document_image_back]`, doc.uploadBack);
      }
    });

    // API call
    const response = await axios.post(
      `${baseURL}api/student-registration/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // If submission is successful, clear any previous error message
    if (response.status >= 200 && response.status < 300) {
      setError(null);
      resetForm();
      setStudentName("");
      setFatherName("");
      setDob("");
      setMobileNumber("");
      setEmail("");
      setGender("");
      setCategory("");
      setCurrentAddress("");
      setAlternateAddress("");
      setUniversityEnrollmentNumber("");
      setSelectedCourse("");
      setSelectedStream("");
      setSelectedSubstream("");
      setStudyPattern("");
      setStudentRemarks("");
      setSession("");
      setAdmissionType("");
      setSelectedSemYear("");
      setRegistrationNumber("");
      setSelectedUniversity("");
      setCounselorName("");
      setReferenceName("");
      setFeeReceipt("");
      setTransactionDate("");
      setPaymentMode("");
      setSelectedBank("");
      setChequeNo("");
      setAmount("");
      setRemarks("");
      setSelectedCountry("");
      setSelectedState("");
      setSelectedCity("");
      setStudFile(null);
      setPincode("");
                                                                            } else {
      setError("An error occurred during registration.");
    }
    setSuccessMessage("Student registered successfully!");
  } catch (error) {
    console.error("Submit error:", error);
    const errorMsg =
      error.response?.data?.message ||
      (typeof error.response?.data === "object"
        ? JSON.stringify(error.response.data)
        : error.response?.data) ||
      "An error occurred during registration.";
    setError(errorMsg);
  } finally {
    setLoading(false);
  }
};


  const personaldoccolumns = [
    {
      name: 'Document Type',
      selector: (row, index) => (
        <div>
          <select
            name="documentType"
            value={row.documentType}
            onChange={(e) => handleChange(index, e)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          >
            <option value="">Select</option>
            {documentTypes.map((type, i) => (
              <option key={i} value={type}>
                {type}
              </option>
            ))}
          </select>
          {formError[`documentType_${index}`] && (
            <p className="text-red-500 text-xs">{formError[`documentType_${index}`]}</p>
          )
          }
        </div>
      ),
    },
    {
      name: 'Name as on Document',
      selector: (row, index) => (
        <div>
          <input
            type="text"
            name="nameAsOnDocument"
            value={row.nameAsOnDocument}
            onChange={(e) => handleChange(index, e)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          />
          {formError[`nameAsOnDocument_${index}`] && (
            <p className="text-red-500 text-xs">{formError[`nameAsOnDocument_${index}`]}</p>
          )}
        </div>
      ),
    },
    {
      name: 'ID Number',
      selector: (row, index) => (
        <div>
          <input
            type="text"
            name="idNumber"
            value={row.idNumber}
            onChange={(e) => handleChange(index, e)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          />
          {formError[`idNumber_${index}`] && (
            <p className="text-red-500 text-xs">{formError[`idNumber_${index}`]}</p>
          )}
        </div>
      ),
    },
    {
      name: 'Upload Front',
      selector: (row, index) => (
        <div>
          <input
            type="file"
            name="uploadFront"
            accept=".jpg, .jpeg, .png, .pdf"
            onChange={(e) => handleFileChange(e, index, "uploadFront")}
            className="w-full p-2 border rounded-md"
          />
          {formError[`uploadFront_${index}`] && (
            <p className="text-red-500 text-xs">{formError[`uploadFront_${index}`]}</p>
          )}
        </div>
      ),
    },
    {
      name: 'Upload Back',
      selector: (row, index) => (
        <div>
          <input
            type="file"
            name="uploadBack"
            accept=".jpg, .jpeg, .png, .pdf"
            onChange={(e) => handleFileChange(e, index, "uploadBack")}
            className="w-full p-2 border rounded-md"
          />
          {formError[`uploadBack_${index}`] && (
            <p className="text-red-500 text-xs">{formError[`uploadBack_${index}`]}</p>
          )}
        </div>
      ),
    },
  ];
  



  // Qualification Columns
  const newcolumns = [
    {
      name: "Exam",
      selector: (row, index) => (
        <div>
          <input
            type="text"
            value={row.exam}
            placeholder="Exam"
            onChange={(e) => handlequalificationInputChange(index, "exam", e.target.value)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          />
          {formError[`exam_${index}`] && (
            <p className="text-red-500 text-xs">{formError[`exam_${index}`]}</p>
          )}
        </div>
      ),
    },
    {
      name: "Year of Passing",
      selector: (row, index) => (
        <div>
          <input
            type="text"
            value={row.year}
            placeholder="Year"
            onChange={(e) => handlequalificationInputChange(index, "year", e.target.value)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          />
          {formError[`year_${index}`] && (
            <p className="text-red-500 text-xs">{formError[`year_${index}`]}</p>
          )}
        </div>
      ),
    },
    {
      name: "Board/University",
      selector: (row, index) => (
        <div>
          <input
            type="text"
            value={row.board}
            placeholder="Board/University"
            onChange={(e) => handlequalificationInputChange(index, "board", e.target.value)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          />
          {formError[`board_${index}`] && (
            <p className="text-red-500 text-xs">{formError[`board_${index}`]}</p>
          )}
        </div>
      ),
    },
    {
      name: "Percentage(%)",
      selector: (row, index) => (
        <div>
          <input
            type="text"
            value={row.percentage}
            placeholder="Percentage"
            onChange={(e) => handlequalificationInputChange(index, "percentage", e.target.value)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          />
          {formError[`percentage_${index}`] && (
            <p className="text-red-500 text-xs">{formError[`percentage_${index}`]}</p>
          )}
        </div>
      ),
    },
    {
      name: "Upload Document",
      selector: (row, index) => (
        <div>
          <input
            type="file"
            accept=".pdf, .jpg"
            onChange={(e) => handleQualificationFileChange(e, index)}
            className="w-full p-2 border rounded-md"
          />
          {formError[`document_${index}`] && (
            <p className="text-red-500 text-xs">{formError[`document_${index}`]}</p>
          )}
        </div>
      ),
    },
  ];
  
// Fetch Fees Data when Stream & Substream are selected
useEffect(() => {
  if (selectedStream && selectedSubstream) {
    const fetchFees = async () => {
      try {
        let apiUrl = "";
        if (studyPattern === "Semester") {
          apiUrl = `${baseURL}api/get-sem-fees/?stream_id=${selectedStream}&substream_id=${selectedSubstream}`;
        } else if (studyPattern === "Annual") {
          apiUrl = `${baseURL}api/get-year-fees/?stream_id=${selectedStream}&substream_id=${selectedSubstream}`;
        }

        if (apiUrl) {
          const response = await axios.get(apiUrl, {
            headers: {
              Authorization: `Bearer ${apiToken}`, // Pass token in Authorization header
            },
          });
          setFeesData(response.data);
        }
      } catch (error) {
        console.error("Error fetching fees data:", error);
      }
    };

    fetchFees();
  }
}, [selectedStream, selectedSubstream, studyPattern]);

// Update Total Fees when selected Semester/Year changes
useEffect(() => {
  if (selectedSemYear && feesData.length > 0) {
    const selectedFee = feesData.find(
      (item) => item.year === selectedSemYear || item.sem === selectedSemYear
    );
    setTotalFees(selectedFee ? selectedFee.fees_details.totalfees : "");  // Ensure the correct field is accessed here
  }
}, [selectedSemYear, feesData]);

  return (
    <div className="quick-registration-page">
      <h1 className="font-bold text-2xl mb-4">STUDENT REGISTRATION</h1>

      <form onSubmit={submitForm} enctype="multipart/form-data">
        {/* Personal Details Section */}
        <div className="personal-details m-4 p-4 border rounded-lg shadow-md w-full">
      <h1 className="font-semibold text-lg mb-1">PERSONAL DETAILS</h1>
      <p className="font-semibold text-lg mb-4 text-[#888]">A task is accomplished by a set deadline, and must contribute toward work-related objectives.</p>

      <div className="flex flex-wrap mb-4">
        {/* University and File Input */}
        <div className="w-full sm:w-1/2 lg:w-1/2 mb-4 sm:mb-0 pr-2">
          <label htmlFor="university" className="block text-sm font-medium text-[#838383]">University<span className="text-red-500">*</span></label>
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
        <div className="w-full sm:w-1/2 lg:w-1/2 mb-4 sm:mb-0 pr-2">
          <label htmlFor="studentFile" className="block text-sm font-medium text-[#838383]">Student File<span className="text-red-500">*</span></label>
          <input
                type="file"
                id="studentFile"
                ref={studentFileRef}
                name="image"
                onChange={handlestudFileChange}
                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          />
        </div>
      </div>

      {/* Name, Father/Husband Name, Date of Birth */}
      <div className="flex flex-wrap mb-4">
         <div className="w-full sm:w-1/3 lg:w-1/3 mb-4 sm:mb-0 pr-2">
            <label htmlFor="studentName" className="block text-sm font-medium text-[#838383]">
              Name <span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                id="studentName"
                value={studentName}
                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (formError.studentName) {
                    setFormErrors((prevErrors) => ({ ...prevErrors, studentName: "" }));
                  }
                }}
              />
             {formError.studentName && <p className="text-red-500 text-xs">{formError.studentName}</p>}
          </div>
        <div className="w-full sm:w-1/3 lg:w-1/3 mb-4 sm:mb-0 pr-2">
          <label htmlFor="fatherName" className="block text-sm font-medium text-[#838383]">Father/Husband Name</label>
          <input
            type="text"
            id="fatherName"
            value={fatherName}
            onChange={(e) => {setFatherName(e.target.value);}}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          />
        </div>
        <div className="w-full sm:w-1/3 lg:w-1/3 mb-4 sm:mb-0 pr-2">
          <label htmlFor="dob" className="block text-sm font-medium text-[#838383]">Date of Birth<span className="text-red-500">*</span></label>
          <input
            type="date"
            id="dob"
            value={dateOfBirth}
            onChange={(e) => {
              setDob(e.target.value);
              if (formError.dateOfBirth) {
                setFormErrors((prevErrors) => ({ ...prevErrors, dateOfBirth: "" }));
              }
            }}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          />
          {formError.dateOfBirth && <p className="text-red-500 text-xs">{formError.dateOfBirth}</p>}
        </div>
      </div>

      {/* Mobile Number and Email Fields */}
      <div className="flex flex-wrap mb-4">
        <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-[#838383]">Mobile Number<span className="text-red-500">*</span></label>
          <div className="flex items-center">
            <input
              type="text"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => {
                setMobileNumber(e.target.value);
                if (formError.mobileNumber) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, mobileNumber: "" }));
                }
              }}
              className="w-full p-2 border rounded-md bg-[#f5f5f5]"
            />
            {formError.mobileNumber && <p className="text-red-500 text-xs">{formError.mobileNumber}</p>}
            <button
              type="button"
              onClick={() => setShowAltMobile(!showAltMobile)}
              className="ml-2 text-red-800 border border-red-800 rounded px-1 py-1"
            >
              +
            </button>
          </div>
        </div>
        
        {showAltMobile && (
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
            <label htmlFor="altMobileNumber" className="block text-sm font-medium text-[#838383]">Alternative Mobile Number</label>
            <input
              type="text"
              id="altMobileNumber"
              value={altMobileNumber}
              onChange={(e) => setAltMobileNumber(e.target.value)}
              className="w-full p-2 border rounded-md bg-[#f5f5f5]"
            />
          </div>
        )}

        <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
          <label htmlFor="email" className="block text-sm font-medium text-[#838383]">Email Address<span className="text-red-500">*</span></label>
          <div className="flex items-center">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formError.email) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, email: "" }));
                }
              }}
              className="w-full p-2 border rounded-md bg-[#f5f5f5]"
            />
            {formError.email && <p className="text-red-500 text-xs">{formError.email}</p>}
            <button
              type="button"
              onClick={() => setShowAltEmail(!showAltEmail)}
              className="ml-2 text-red-800 border border-red-800 rounded px-1 py-1"
            >
              +
            </button>
          </div>
        </div>
        
        {showAltEmail && (
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
            <label htmlFor="altEmail" className="block text-sm font-medium text-[#838383]">Alternative Email Address</label>
            <input
              type="email"
              id="altEmail"
              value={altEmail}
              onChange={(e) => setAltEmail(e.target.value)}
              className="w-full p-2 border rounded-md bg-[#f5f5f5]"
            />
          </div>
        )}
      </div>

      {/* University Enrollment Number and Counselor Name */}
      <div className="flex flex-wrap mb-4">
        <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
          <label htmlFor="universityEnrollmentNumber" className="block text-sm font-medium text-[#838383]">University Enrollment Number</label>
          <input
                type="text"
                id="universityEnrollmentNumber"
                value={universityEnrollmentNumber}
                onChange={(e) => setUniversityEnrollmentNumber(e.target.value)}
                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
              />
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
          <label htmlFor="counselorName" className="block text-sm font-medium text-[#838383]">Counselor Name</label>
          <input
                type="text"
                id="counselorName"
                value={counselorName}
                onChange={(e) => setCounselorName(e.target.value)}
                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
              />
        </div>
      </div>

      {/* Remarks */}
      <div className="mb-4">
        <label htmlFor="studentRemarks" className="block text-sm font-medium text-[#838383]">Remarks</label>
        <textarea
              id="studentRemarks"
              value={studentRemarks}
              onChange={(e) => setStudentRemarks(e.target.value)}
              className="w-[40%] p-4 border rounded-md bg-[#f5f5f5]"
            />
      </div>

        {/* Country, State, City Selection */}
        <div className="flex flex-wrap mb-4">
        <div className="w-full sm:w-1/3 lg:w-1/3 mb-4 sm:mb-0 pr-2">
          <label htmlFor="country" className="block text-sm font-medium text-[#838383]">Country<span className="text-red-500">*</span></label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              if (formError.selectedCountry) {
                setFormErrors((prevErrors) => ({ ...prevErrors, selectedCountry: "" }));
              }
            }}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>{country.name}</option>
            ))}
          </select>
          {formError.selectedCountry && <p className="text-red-500 text-xs">{formError.selectedCountry}</p>}
        </div>

        <div className="w-full sm:w-1/3 lg:w-1/3 mb-4 sm:mb-0 pr-2">
          <label htmlFor="state" className="block text-sm font-medium text-[#838383]">State<span className="text-red-500">*</span></label>
          <select
            id="state"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              if (formError.selectedState) {
                setFormErrors((prevErrors) => ({ ...prevErrors, selectedState: "" }));
              }
            }}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
            disabled={!selectedCountry}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
          {formError.selectedState && <p className="text-red-500 text-xs">{formError.selectedState}</p>}
        </div>

        <div className="w-full sm:w-1/3 lg:w-1/3 mb-4 sm:mb-0 pr-2">
          <label htmlFor="city" className="block text-sm font-medium text-[#838383]">City<span className="text-red-500">*</span></label>
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              if (formError.selectedCity) {
                setFormErrors((prevErrors) => ({ ...prevErrors, selectedCity: "" }));
              }
            }}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
            disabled={!selectedState}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
          {formError.selectedCity && <p className="text-red-500 text-xs">{formError.selectedCity}</p>}
        </div>

  {/* Gender, Category, and New Fields */}
      
        <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
          <label htmlFor="currentAddress" className="block text-sm font-medium text-[#838383]">Current Address</label>
          <textarea
            id="currentAddress"
            value={address}
            onChange={(e) => setCurrentAddress(e.target.value)}
            className="w-[100%] p-2 border rounded-md bg-[#f5f5f5]"
            rows="4"
          />
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
          <label htmlFor="alternateAddress" className="block text-sm font-medium text-[#838383]">Alternate Address</label>
          <textarea
            id="alternateAddress"
            value={alternateAddress}
            onChange={(e) => setAlternateAddress(e.target.value)}
            className="w-[100%] p-2 border rounded-md bg-[#f5f5f5]"
            rows="4"
          />
        </div>
     
        <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
          <label htmlFor="gender" className="block text-sm font-medium text-[#838383]">Gender</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Rather Not Say">Rather Not Say</option>
          </select>
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
          <label htmlFor="category" className="block text-sm font-medium text-[#838383]">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          >
            <option value="">Select Category</option>
            <option value="Open">Open</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>
        </div>

        
        <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
          <label htmlFor="nationality" className="block text-sm font-medium text-[#838383]">Nationality</label>
          <input
            type="text"
            id="nationality"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          />
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
          <label htmlFor="pincode" className="block text-sm font-medium text-[#838383]">Pincode</label>
          <input
            type="text"
            id="pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          />
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
          <label htmlFor="registrationNumber" className="block text-sm font-medium text-[#838383]">Registration Number</label>
          <input
            type="text"
            id="registrationNumber"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          />
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
          <label htmlFor="referenceName" className="block text-sm font-medium text-[#838383]">Reference Name</label>
          <input
            type="text"
            id="referenceName"
            value={referenceName}
            onChange={(e) => setReferenceName(e.target.value)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          />
        </div>


      </div>
       </div>

        {/* personal-documents Details */}
       <div className="personal-documents-section m-4 p-4 border rounded-lg shadow-md w-full">
        <h2 className="font-semibold text-lg mb-4">PERSONAL DOCUMENTS</h2>

        {/* Table with document fields */}
        <div className="document-table mb-4">
          <DataTable
            columns={personaldoccolumns}
            data={documents}
            noHeader
            pagination
            highlightOnHover
          />
        </div>

          {/* Add Row Button */}
          <div className="mb-4">
            <button
              className="p-2 bg-[#d24845] text-white rounded-md"
              onClick={(e) => {
                e.preventDefault(); // Prevents any default behavior that causes the scroll
                handleAddRow();
              }}
            >
              Add new row
            </button>
          </div>
        </div>

        {/* qualification Details */}
       <div className="qualification-table personal-qualification-section m-4 p-4 border rounded-lg shadow-md w-full">
          <h3 className="font-semibold text-lg mb-1">QUALIFICATION DOCUMENTS</h3>
          <DataTable
            columns={newcolumns}
            data={rows}
            noHeader
            pagination
            highlightOnHover
          />
          <button
            className="add-row-btn bg-[#d24845]"
            onClick={(e) => {
              e.preventDefault(); // Prevents any default behavior that causes the scroll
              addRow();
            }}
          >
            Add new row
          </button>
        </div>

        {/* Course Details */}
        <div className="course-details m-4 p-4 border rounded-lg shadow-md w-full">
          <h2 className="font-semibold text-lg mb-4">COURSE/PROGRAM DETAILS </h2>

          <div className="flex flex-wrap mb-4">
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

            {/* Substream dropdown */}
            {/* {streams && substreams.length > 0 && ( */}
              <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                <label htmlFor="substream" className="block text-sm font-medium text-[#838383]">Substream</label>
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
         
            {/* Optional: Show loading indicator while fetching substreams */}
            {loadingSubstreams && <div>Loading substreams...</div>}

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
          </div>

          {/* Other Course-related Inputs */}
          <div className="flex flex-wrap mb-4">
          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
              <label htmlFor="studyPattern" className="block text-sm font-medium text-[#838383]">Study Pattern<span className="text-red-500">*</span></label>
              <select
                id="studyPattern"
                value={studyPattern}
                onChange={(e) => {
                  setStudyPattern(e.target.value);
                  setSelectedSemYear(""); // Reset selected semester/year when study pattern changes
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
              <label htmlFor="admissionType" className="block text-sm font-medium text-[#838383]">Admission Type<span className="text-red-500">*</span></label>
              <select
                id="admissionType"
                value={admissionType}
                onChange={(e) => {
                  setAdmissionType(e.target.value);
                  if (formError.admissionType) {
                    setFormErrors((prevErrors) => ({ ...prevErrors, admissionType: "" }));
                  }
                }}
                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
              >
                <option value="">Select Admission Type</option>
                <option value="regular">Regular</option>
                <option value="lateral">Distance</option>
                <option value="lateral">Lateral Entry</option>
                <option value="lateral">Credit Transfer</option>
              </select>
              {formError.admissionType && <p className="text-red-500 text-xs">{formError.admissionType}</p>}
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                              <label htmlFor="semesterYear" className="block text-sm font-medium text-[#838383]">Semester/Year</label>
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
                                value={ViewCourseDuration} // Controlled by state
                                onChange={(e) => {setViewCourseDuration(e.target.value)}}
                                min="1"
                                max="10" // You can adjust this range as per your needs
                                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
                              />
                          </div>

          </div>
        </div>

        {/* Fees Payment Section */}
        <div className="fees-payment m-4 p-4 border rounded-lg shadow-md w-full">
          <h2 className="font-semibold text-lg mb-4">PAYMENT DETAILS</h2>

          <div className="flex flex-wrap mb-4">
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
            <label htmlFor="FeesReceipt" className="block text-sm font-medium text-[#838383]">Fees Receipt<span className="text-red-500">*</span></label>
            <select
                id="FeesReceipt"
                value={feeReceipt}
                onChange={(e) => {
                  setFeeReceipt(e.target.value);
                  if (formError.feeReceipt) {
                    setFormErrors((prevErrors) => ({ ...prevErrors, feeReceipt: "" }));
                  }
                }}
                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
            >
                <option value="">Select</option>
                {/* Dynamically add fee receipt options */}
                {feeReceiptOptions.map((option) => (
                    <option key={option.id} value={option.name}>
                        {option.name}
                    </option>
                ))}
            </select>
            {formError.feeReceipt && <p className="text-red-500 text-xs">{formError.feeReceipt}</p>}
            </div>
              {/* Total Fees (Readonly Input Field) */}
              <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                <label htmlFor="totalFees" className="block text-sm font-medium text-[#838383]">Total Fees</label>
                <input
                    type="text"
                    id="totalFees"
                    value={totalFees} // Set this to a state variable or calculate dynamically
                    readOnly
                    className="w-full p-2 border rounded-md bg-[#f5f5f5]"
                />
              </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0">
              <label htmlFor="amount" className="block text-sm font-medium text-[#838383]">Amount Paid<span className="text-red-500">*</span></label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (formError.amount) {
                    setFormErrors((prevErrors) => ({ ...prevErrors, amount: "" }));
                  }
                }}
                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
              />
              {formError.amount && <p className="text-red-500 text-xs">{formError.amount}</p>}
            </div>
          </div>

          <div className="flex flex-wrap mb-4">
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
              <label htmlFor="transactionDate" className="block text-sm font-medium text-[#838383]">Transaction Date<span className="text-red-500">*</span></label>
              <input
                type="date"
                id="transactionDate"
                value={transactionDate}
                onChange={(e) => {
                  setTransactionDate(e.target.value);
                  if (formError.transactionDate) {
                    setFormErrors((prevErrors) => ({ ...prevErrors, transactionDate: "" }));
                  }
                }}
                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
              />
              {formError.transactionDate && <p className="text-red-500 text-xs">{formError.transactionDate}</p>}
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
              <label htmlFor="paymentMode" className="block text-sm font-medium text-[#838383]">Payment Mode<span className="text-red-500">*</span></label>
              <select
                id="paymentMode"
                value={paymentMode}
                onChange={(e) => {
                  setPaymentMode(e.target.value);
                  if (formError.paymentMode) {
                    setFormErrors((prevErrors) => ({ ...prevErrors, paymentMode: "" }));
                  }
                }}
                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
                >
                <option value="">Select</option>
                {paymentModes.length > 0 ? (
                    paymentModes.map((data) => (
                    <option key={data.id} value={data.name}>
                        {data.name}
                    </option>
                    ))
                ) : (
                    <option disabled>No payment modes available</option>
                )}
                </select>
                {formError.paymentMode && <p className="text-red-500 text-xs">{formError.paymentMode}</p>}
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
              <label htmlFor="chequeNo" className="block text-sm font-medium text-[#838383]">Cheque No</label>
              <input
                type="text"
                id="chequeNo"
                value={chequeNo}
                onChange={(e) => setChequeNo(e.target.value)}
                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
              />
            </div>
          </div>

          <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                <label htmlFor="bankname" className="block text-sm font-medium text-[#838383]">Bank Name</label>
                <select
                    id="selectedBank"
                    value={selectedBank} // Set the value to selectedBank state
                    name="bank_name"
                    onChange={(e) => setSelectedBank(e.target.value)} // Update selectedBank when user selects a bank
                    className="w-full p-2 border rounded-md bg-[#f5f5f5]"
                >
                    <option value="">Select</option>
                    {/* Dynamically add bank options */}
                    {banks.map((bank) => (
                    <option key={bank.id} value={bank.name}>
                        {bank.name}
                    </option>
                    ))}
                </select>
            </div>

          <div className="mb-4">
            <label htmlFor="remarks" className="block text-sm font-medium text-[#838383]">Additional Remarks<span className="text-red-500">*</span></label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value);
                if (formError.remarks) {
                  setFormErrors((prevErrors) => ({ ...prevErrors, remarks: "" }));
                }
              }}
              className="w-[40%] p-1 border rounded-md bg-[#f5f5f5]"
            />
            {formError.remarks && <p className="text-red-500 text-xs">{formError.remarks}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {error && <div className="text-red-600 mt-4">{error}</div>}
       {successMessage && <div className="text-green-600 mt-4">{successMessage}</div>}

      </form>
    </div>
  );
};

export default StudentRegistrationPage;