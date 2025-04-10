import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "./QualificationTable.css";
import { useParams } from 'react-router-dom';
import React from 'react';
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const StudentRegistrationPage = ({}) => {
  const { enrollmentId } = useParams(); 
  React.useEffect(() => {
    console.log('Enrollment ID:', enrollmentId);
  }, [enrollmentId]);
  const [qualifications, setQualifications] = useState([]);
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
  const [selectedUniversityID, setselectedUniversityID] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedStreamId, setSelectedStreamId] = useState("");
  const [selectedSubstream, setSelectedSubstream] = useState("");
  const [selectedSubstreamId, setSelectedSubstreamId] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");  // Added this state for selected city
  const [selectedCityId, setSelectedCityId] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [address, setCurrentAddress] = useState("");
  const [alternateAddress, setAlternateAddress] = useState("");
  const [nationality, setNationality] = useState("");
  const [pincode, setPincode] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [studentData, setStudentData] = useState({});
  const [studentFile, setStudentFile] = useState(null);
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
  setRows([
    ...rows,
    { exam: "", year: "", board: "", percentage: "", document: null },
  ]);
};


  useEffect(() => {
    const apiToken = localStorage.getItem("access"); // Replace with your token source
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${baseURL}api/universities/`, {
          headers: {
            Authorization: `Bearer ${apiToken}`, // Add the token to the headers
          },
        });
        setUniversities(response.data);
      } catch (err) {
        setError("Error fetching universities.");
      }
    };
    fetchUniversities();
  }, []);

   useEffect(() => {
    const apiToken = localStorage.getItem("access"); // Replace with your token source
    if (university) {
      const fetchCourses = async () => {
        try {
          const response = await axios.get(`${baseURL}api/courses/?university=${university}`, {
            headers: {
              Authorization: `Bearer ${apiToken}`, // Add the token to the headers
            },
          });
          setCourses(response.data.courses); // Set courses data
        } catch (err) {
          setError("Error fetching courses.");
        }
      };
      fetchCourses();
    }
  }, [university]);

  
  useEffect(() => {
    const apiToken = localStorage.getItem("access"); // Replace with your token source
    if (course && university) {
      const fetchStreams = async () => {
        try {
          const response = await axios.get(`${baseURL}api/streams/?course=${course}&university=${university}`, {
            headers: {
              Authorization: `Bearer ${apiToken}`, // Add the token to the headers
            },
          });
          setStreams(response.data.streams); // Access the streams array correctly
        } catch (err) {
          setError("Error fetching streams.");
        }
      };
      fetchStreams();
    }
  }, [course, university]);


  useEffect(() => {
    const apiToken = localStorage.getItem("access"); // Replace with your token source
    if (university && course && stream) {
      setLoadingSubstreams(true);  // Set loading to true when fetching
      const fetchSubstreams = async () => {
        try {
          const response = await axios.get(`${baseURL}api/substreams/`, {
            params: {
              stream: stream,
              course: course,
              university: university
            }, 
            headers: {
              Authorization: `Bearer ${apiToken}`, // Add the token to the headers
            },
          });
  
          console.log("Fetched substreams:", response.data);  // Debug log
  
          if (Array.isArray(response.data) && response.data.length > 0) {
            setSubstreams(response.data);
          } else {
            setSubstreams([]);  // Clear substreams if none are available
          }
        } catch (err) {
          console.error("Error fetching substreams:", err);
          setError("Error fetching substreams.");
        } finally {
          setLoadingSubstreams(false);  // Set loading to false after fetching
        }
      };
      fetchSubstreams();
    } else {
      setSubstreams([]);  // Reset substreams if any required field is missing
    }
  }, [stream, course, university]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const apiToken = localStorage.getItem("access");
  
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
  }, []);
  
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const apiToken = localStorage.getItem("access");
        const response = await fetch(`${baseURL}api/bank_names/`, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
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
  

  const apiToken = localStorage.getItem("access"); // Replace with your token source
  console.log("API Token=="+apiToken);
  useEffect(() => {
    const fetchFeeReceiptOptions = async () => {
      try {
        const response = await fetch(`${baseURL}api/fee-receipt-options/`, {
          headers: {
            "Authorization": `Bearer ${apiToken}`, // Include token here
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Unauthorized or failed to fetch");
        }

        const data = await response.json();
        console.log('Raw Fee Receipt Options:', data);
        setFeeReceiptOptions(data);
      } catch (error) {
        console.error("Error fetching fee receipt options:", error);
        setError(error.message); // Set the error message
      }
    };

    fetchFeeReceiptOptions();
  }, [apiToken]);

    useEffect(() => {
      const apiToken = localStorage.getItem("access");
        fetch(`${baseURL}api/payment_modes/`, {
          headers: {
            "Authorization": `Bearer ${apiToken}`, // Include token here
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Raw API response:', data);
            setPaymentModes(data);
          })
          .catch((error) => {
            console.error('Error fetching payment modes:', error);
          });
      }, []);


 useEffect(() => {
  const apiToken = localStorage.getItem("access");
   fetch(`${baseURL}api/countries/`, {
    headers: {
      "Authorization": `Bearer ${apiToken}`, // Include token here
      "Content-Type": "application/json",
    },
  })
     .then((response) => response.json())
     .then((data) => setCountries(data))
     .catch((error) => console.error("Error fetching countries:", error));
 }, []);

 // Fetch states based on selected country
 useEffect(() => {
  const apiToken = localStorage.getItem("access");
   if (selectedCountry) {
     fetch(`${baseURL}api/states/?country_id=${selectedCountry}`, {
      headers: {
        "Authorization": `Bearer ${apiToken}`, // Include token here
        "Content-Type": "application/json",
      },
    })
       .then((response) => response.json())
       .then((data) => setStates(data))
       .catch((error) => console.error("Error fetching states:", error));
   }
 }, [selectedCountry]);

 // Fetch cities based on selected state
 useEffect(() => {
  const apiToken = localStorage.getItem("access");
   if (selectedState) {
     fetch(`${baseURL}api/cities/?state_id=${selectedState}`, {
      headers: {
        "Authorization": `Bearer ${apiToken}`, // Include token here
        "Content-Type": "application/json",
      },
    })
       .then((response) => response.json())
       .then((data) => setCities(data))
       .catch((error) => console.error("Error fetching cities:", error));
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

  // Handle text input field change
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDocuments = [...documents];
    updatedDocuments[index][name] = value;
    setDocuments(updatedDocuments);
  };


  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  // Handle file upload field change
  const handleFileChange = (index, e) => {
    const { name, files } = e.target;
    const updatedDocuments = [...documents];
    updatedDocuments[index][name] = files[0];
    setDocuments(updatedDocuments);
  };


  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const apiToken = localStorage.getItem("access");
        const response = await axios.get(`${baseURL}api/get-student/${enrollmentId}`, {
          headers: {
            "Authorization": `Bearer ${apiToken}`, // Include token here
            "Content-Type": "application/json",
          },
        });
        const data = response.data;
       console.log("All Get student data",data);
        setSelectedUniversity(data.university || "");
        setselectedUniversityID(data.university_id || "");
        setSelectedCountryId(data.country_id || "");
        setSelectedStateId(data.state_id || "");
        setSelectedCityId(data.city_id || "");
        setSelectedCourseId(data.course_id || "");
        setSelectedStreamId(data.stream_id || "");
        setSelectedCourse(data.course || "");
        setSelectedStream(data.stream || "");
        setSelectedSubstream(data.substream || "");
        setSelectedSubstreamId(data.substream_id || "");
        setStudentName(data.name || "");
        setFatherName(data.father_name || "");
        setDob(data.dateofbirth || "");
        setMobileNumber(data.mobile || "");
        setEmail(data.email || "");
        setUniversityEnrollmentNumber(data.enrollment_id || "");
        setCounselorName(data.counselor_name || "");
        setReferenceName(data.reference_name || "");
        setStudentRemarks(data.student_remarks || "");
        setCurrentAddress(data.address || "");
        setAlternateAddress(data.alternateaddress || "");
        setRegistrationNumber(data.registration_id || "");
        setStudyPattern(data.studypattern || "");
        setSession(data.session || "");
        setAdmissionType(data.entry_mode || "");
        setSelectedSemYear(data.total_semyear || "");
        setGender(data.gender || "");
        setCategory(data.category || "");
        setNationality(data.nationality || "");
        setPincode(data.pincode || "");
        setSelectedCountry(data.country || "");
        setSelectedState(data.state || "");
        setSelectedCity(data.city || "");
        setFeeReceipt(data.payment_details.document || ""); // Set from the payment details if available
        setTotalFees(data.payment_details.total_fees || "");
        setAmount(data.payment_details.paidamount || "");
        setTransactionDate(data.payment_details.transaction_date || "");
        setChequeNo(data.payment_details.cheque_no || "");
        setSelectedBank(data.payment_details.bank_name || "");
        setPaymentMode(data.payment_details.paymentmode || "");
        setRemarks(data.payment_details.remarks || "");
        setFeeReceipt(data.payment_details.Exam_Fee || "");
        const documentsData = data.documents.map(doc => ({
          documentType: doc.document || "",
          nameAsOnDocument: doc.document_name || "",
          idNumber: doc.document_ID_no || "",
          uploadFront: doc.document_image_front || "",
          uploadBack: doc.document_image_back || ""
        }));
        setDocuments(documentsData);
  
        const qualifications = data.qualifications || {};
        setRows([{
          exam: "Secondary/High School",
          year: qualifications.secondary_year || "",
          board: qualifications.secondary_board || "",
          percentage: qualifications.secondary_percentage || "",
          document: qualifications.secondary_document || null,
        }, {
          exam: "Sr. Secondary",
          year: qualifications.sr_year || "",
          board: qualifications.sr_board || "",
          percentage: qualifications.sr_percentage || "",
          document: qualifications.sr_document || null,
        }, {
          exam: "Under Graduation",
          year: qualifications.under_year || "",
          board: qualifications.under_board || "",
          percentage: qualifications.under_percentage || "",
          document: qualifications.under_document || null,
        }, {
          exam: "Post Graduation",
          year: qualifications.post_year || "",
          board: qualifications.post_board || "",
          percentage: qualifications.post_percentage || "",
          document: qualifications.post_document || null,
        }, {
          exam: "Eng. Diploma / ITI",
          year: qualifications.mphil_year || "",
          board: qualifications.mphil_board || "",
          percentage: qualifications.mphil_percentage || "",
          document: qualifications.mphil_document || null,
        }, ...(qualifications.others || []).map((other) => ({
          exam: "Others",
          year: other.year || "",
          board: other.board || "",
          percentage: other.percentage || "",
          document: other.file_path || null,
        }))]);
        
  
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
  
    fetchStudentData();
  }, [enrollmentId]);
  

  const updateStudentData = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior
    setLoading(true);  // Set loading to true during the update
    try {
      const formattedQualifications = {
        secondary_year: rows.find((row) => row.exam === "Secondary/High School")?.year || "",
        secondary_board: rows.find((row) => row.exam === "Secondary/High School")?.board || "",
        secondary_percentage: rows.find((row) => row.exam === "Secondary/High School")?.percentage || "",
        sr_year: rows.find((row) => row.exam === "Sr. Secondary")?.year || "",
        sr_board: rows.find((row) => row.exam === "Sr. Secondary")?.board || "",
        sr_percentage: rows.find((row) => row.exam === "Sr. Secondary")?.percentage || "",
        under_year: rows.find((row) => row.exam === "Under Graduation")?.year || "",
        under_board: rows.find((row) => row.exam === "Under Graduation")?.board || "",
        under_percentage: rows.find((row) => row.exam === "Under Graduation")?.percentage || "",
        post_year: rows.find((row) => row.exam === "Post Graduation")?.year || "",
        post_board: rows.find((row) => row.exam === "Post Graduation")?.board || "",
        post_percentage: rows.find((row) => row.exam === "Post Graduation")?.percentage || "",
        others: rows
          .filter((row) => row.exam === "Others")
          .map((row) => ({
            year: row.year,
            board: row.board,
            doctype: row.exam,
            file_path: row.document ? row.document.name : null,
            percentage: row.percentage,
          })),
      };
  
      const formattedDocuments = documents.map((row) => ({
        document: row.documentType || "",
        document_name: row.nameAsOnDocument || "",
        document_ID_no: row.idNumber || "",
      }));
  
      const payload = {
        name: studentName,
        father_name: fatherName,
        dateofbirth: dateOfBirth,
        mobile_number: mobileNumber,
        email : email,
        gender : gender,
        category : category,
        address : address,
        course: selectedCourseId,
        stream: selectedStreamId,
        substream: selectedSubstreamId,
        studypattern: studyPattern,
        session : session,
        entry_mode: admissionType,
        semyear: selectedSemYear,
        registration_id: registrationNumber,
        university: selectedUniversityID,
        counselor_name: counselorName,
        reference_name: referenceName,
        documents: formattedDocuments, // Mapped document data
        qualifications: formattedQualifications, // Mapped qualifications
        fee_reciept_type: feeReceipt,
        transaction_date: transactionDate,
        payment_mode: paymentMode,
        bank_name: selectedBank,
        cheque_no: chequeNo,
        amount, // Assuming 'fees' is the amount paid
        remarks,
        country :selectedCountryId,
        state : selectedStateId,
        city : selectedCityId,
      };

      console.log("Form payload:", payload); // Debugging log

      const response = await axios.put(
        `${baseURL}api/update-student/${enrollmentId}`,
        payload,
         {
          headers: {
            "Authorization": `Bearer ${apiToken}`, // Include token here
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update Successful:", response.data);
      alert("Student data updated successfully!");
    } catch (error) {
      console.error("Error updating student data:", error);
      alert("Failed to update student data. Please try again.");
    } finally {
      setLoading(false);  // Reset loading to false
    }
  };


const personaldoccolumns = [
  {
    name: 'Document Type',
    selector: (row, index) => (
      <select
        name="documentType"
        value={row.documentType || ""}
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
    ),
  },
  {
    name: 'Name as on Document',
    selector: (row, index) => (
      <input
        type="text"
        name="nameAsOnDocument"
        value={row.nameAsOnDocument || ""}
        onChange={(e) => handleChange(index, e)}
        className="w-full p-2 border rounded-md bg-[#f5f5f5]"
      />
    ),
  },
  {
    name: 'ID Number',
    selector: (row, index) => (
      <input
        type="text"
        name="idNumber"
        value={row.idNumber || ""}
        onChange={(e) => handleChange(index, e)}
        className="w-full p-2 border rounded-md bg-[#f5f5f5]"
      />
    ),
  },
  {
    name: 'Upload Front',
    selector: (row, index) => (
      <input
        type="file"
        name="uploadFront"
        accept=".jpg, .jpeg, .png, .pdf"
        onChange={(e) => handleFileChange(index, e)}
        className="w-full p-2 border rounded-md"
      />
    ),
  },
  {
    name: 'Upload Back',
    selector: (row, index) => (
      <input
        type="file"
        name="uploadBack"
        accept=".jpg, .jpeg, .png, .pdf"
        onChange={(e) => handleFileChange(index, e)}
        className="w-full p-2 border rounded-md"
      />
    ),
  },
];


// Qualification Columns
const newcolumns = [
  {
    name: "Exam",
    selector: (row, index) => (
      <input
        type="text"
        value={row.exam || ""}
        placeholder="Others"
        onChange={(e) => handleInputChange(index, "exam", e.target.value)}
      />
    ),
  },
  {
    name: "Year of Passing",
    selector: (row, index) => (
      <input
        type="text"
        value={row.year || ""}
        placeholder="Year"
        onChange={(e) => handleInputChange(index, "year", e.target.value)}
      />
    ),
  },
  {
    name: "Board/University",
    selector: (row, index) => (
      <input
        type="text"
        value={row.board || ""}
        placeholder="Board/University"
        onChange={(e) => handleInputChange(index, "board", e.target.value)}
      />
    ),
  },
  {
    name: "Percentage(%)",
    selector: (row, index) => (
      <input
        type="text"
        value={row.percentage || ""}
        placeholder="Percentage"
        onChange={(e) => handleInputChange(index, "percentage", e.target.value)}
      />
    ),
  },
  {
    name: "Upload Document",
    selector: (row, index) => (
      <input
        type="file"
        accept=".pdf, .jpg"
        onChange={(e) => handleInputChange(index, "document", e.target.files[0])}
      />
    ),
  },
];


  return (
    <div className="quick-registration-page">
      <h1 className="font-bold text-2xl mb-4">STUDENT REGISTRATION</h1>

      <form onSubmit={updateStudentData}>
        {/* Personal Details Section */}
        <div className="personal-details m-4 p-4 border rounded-lg shadow-md w-full">
          <h1 className="font-semibold text-lg mb-1">PERSONAL DETAILS</h1>

          <div className="flex flex-wrap mb-4">
            {/* University and File Input */}
            <div className="w-full sm:w-1/2 lg:w-1/2 mb-4 sm:mb-0 pr-2">
              <label htmlFor="university" className="block text-sm font-medium text-[#838383]">University</label>
              <select
                id="university"
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
              >

            <option value={selectedUniversityID}>{selectedUniversity}</option>
            {/* Add university options dynamically if available */}
          </select>
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/2 mb-4 sm:mb-0 pr-2">
          <label htmlFor="studentFile" className="block text-sm font-medium text-[#838383]">Student File</label>
          <input
                type="file"
                id="studentFile"
                onChange={(e) => setStudentFile(e.target.files[0])}
                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
              />
        </div>
      </div>

      {/* Name, Father/Husband Name, Date of Birth */}
      <div className="flex flex-wrap mb-4">
        <div className="w-full sm:w-1/3 lg:w-1/3 mb-4 sm:mb-0 pr-2">
          <label htmlFor="studentName" className="block text-sm font-medium text-[#838383]">Name</label>
          <input
            type="text"
            id="studentName"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
            required
          />
        </div>
        <div className="w-full sm:w-1/3 lg:w-1/3 mb-4 sm:mb-0 pr-2">
          <label htmlFor="fatherName" className="block text-sm font-medium text-[#838383]">Father/Husband Name</label>
          <input
            type="text"
            id="fatherName"
            value={fatherName}
            onChange={(e) => setFatherName(e.target.value)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          />
        </div>
        <div className="w-full sm:w-1/3 lg:w-1/3 mb-4 sm:mb-0 pr-2">
          <label htmlFor="dob" className="block text-sm font-medium text-[#838383]">Date of Birth</label>
          <input
            type="date"
            id="dob"
            value={dateOfBirth}
            onChange={(e) => setDob(e.target.value)}
            required
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          />
        </div>
      </div>

      {/* Mobile Number and Email Fields */}
      <div className="flex flex-wrap mb-4">
        <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-[#838383]">Mobile Number</label>
          <div className="flex items-center">
            <input
              type="text"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              className="w-full p-2 border rounded-md bg-[#f5f5f5]"
            />
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
          <label htmlFor="email" className="block text-sm font-medium text-[#838383]">Email Address</label>
          <div className="flex items-center">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md bg-[#f5f5f5]"
            />
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
          <label htmlFor="country" className="block text-sm font-medium text-[#838383]">Country</label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
          >
              <option value="">Select Country</option>
              {countries.map((country) => ( 
              <option value={selectedCountry}>{selectedCountry}</option>
               ))} 
          </select>
        </div>

        <div className="w-full sm:w-1/3 lg:w-1/3 mb-4 sm:mb-0 pr-2">
          <label htmlFor="state" className="block text-sm font-medium text-[#838383]">State</label>
          <select
            id="state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
            disabled={!selectedCountry}
          >
            <option value="">Select State</option>
             {/* {states.map((state) => (  */}
              <option key="" value={selectedState}>{selectedState}</option>
             {/* ))}  */}
          </select>
        </div>

        <div className="w-full sm:w-1/3 lg:w-1/3 mb-4 sm:mb-0 pr-2">
          <label htmlFor="city" className="block text-sm font-medium text-[#838383]">City</label>
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full p-2 border rounded-md bg-[#f5f5f5]"
            disabled={!selectedState}
          >
            <option value="">Select City</option>
           {/* {cities.map((city) => (  */}
              <option key="" value={selectedCity}>{selectedCity}</option>
           {/* ))}  */}
          </select>
        </div>

  {/* Gender, Category, and New Fields */}
      
        <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
          <label htmlFor="currentAddress" className="block text-sm font-medium text-[#838383]">Current Address</label>
          <textarea
            id="currentAddress"
            value={address}
            onChange={(e) => setCurrentAddress(e.target.value)}
            className="w-[100%] p-2 border rounded-md bg-[#f5f5f5]"
            required
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
            required
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
            required
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
            required
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
            required
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
              <label htmlFor="course" className="block text-sm font-medium text-[#838383]">Course</label>
              <select
                  id="course"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
               >
              <option value={selectedCourseId}>{selectedCourse}</option>
              {/* Add university options dynamically if available */}
            </select>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
              <label htmlFor="stream" className="block text-sm font-medium text-[#838383]">Stream</label>
              <select
                  id="stream"
                  value={selectedStream}
                  onChange={(e) => setSelectedStream(e.target.value)}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
               >
              <option value={selectedStreamId}>{selectedStream}</option>
              {/* Add university options dynamically if available */}
            </select>
            </div>

            {/* Substream dropdown */}
            {/* {streams && substreams.length > 0 && ( */}
              <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                <label htmlFor="substream" className="block text-sm font-medium text-[#838383]">Substream</label>
                <select
                    id="substream"
                    value={selectedSubstream}
                    onChange={(e) => setSelectedSubstream(e.target.value)}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
                    disabled={!selectedStream}
                    >
                    <option value="">Select Substream</option>
                    <option value={selectedSubstream}>
                      {selectedSubstream}
                    </option>
                </select>
              </div>
            {/* )} */}

            {/* Optional: Show loading indicator while fetching substreams */}
            {loadingSubstreams && <div>Loading substreams...</div>}

            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
              <label htmlFor="session" className="block text-sm font-medium text-[#838383]">Session</label>
              <select
                id="session"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                required
                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
              >
                <option value="">Select Session</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.name}>{session.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Other Course-related Inputs */}
          <div className="flex flex-wrap mb-4">
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
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
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
              <label htmlFor="admissionType" className="block text-sm font-medium text-[#838383]">Admission Type</label>
              <select
                id="admissionType"
                value={admissionType}
                onChange={(e) => setAdmissionType(e.target.value)}
                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
              >
                <option value="">Select Admission Type</option>
                <option value="regular">Regular</option>
                <option value="lateral">Distance</option>
                <option value="lateral">Lateral Entry</option>
                <option value="lateral">Credit Transfer</option>
              </select>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
              <label htmlFor="semesterYear" className="block text-sm font-medium text-[#838383]">Semester/Year</label>
              <select
                    id="semYear"
                    value={selectedSemYear}
                    onChange={(e) => setSelectedSemYear(e.target.value)}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-[#f5f5f5]"
                    disabled={!selectedStream}
                    >
                  <option value="">Select Substream</option>
                  <option value={selectedSemYear}>
                    {selectedSemYear}
                  </option>
              </select>
              </div>

            {/* <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
            <label htmlFor="courseDuration" className="block text-sm font-medium text-[#838383]">Course Duration (in years)</label>
            <input
                id="courseDuration"
                type="number"
                value={courseDuration}
                onChange={(e) => setCourseDuration(e.target.value)}
                min="1"
                max="10" // You can adjust this range as per your needs
                required
                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
            />
            </div> */}
          </div>
        </div>

        {/* Fees Payment Section */}
        <div className="fees-payment m-4 p-4 border rounded-lg shadow-md w-full">
          <h2 className="font-semibold text-lg mb-4">PAYMENT DETAILS</h2>

          <div className="flex flex-wrap mb-4">
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
            <label htmlFor="FeesReceipt" className="block text-sm font-medium text-[#838383]">Fees Receipt</label>
            <select
                id="FeesReceipt"
                value={feeReceipt}
                onChange={(e) => setFeeReceipt(e.target.value)}
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
            </div>
              {/* Total Fees (Readonly Input Field) */}
                <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
                <label htmlFor="totalFees" className="block text-sm font-medium text-[#838383]">Total Fees</label>
                <input
                    type="text"
                    id="totalFees"
                    value={totalFees} // Set this to a state variable or calculate dynamically
                    onChange={(e) => setTotalFees(e.target.value)}
                    readOnly
                    className="w-full p-2 border rounded-md bg-[#f5f5f5]"
                />
                </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0">
              <label htmlFor="amount" className="block text-sm font-medium text-[#838383]">Amount Paid</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
              />
            </div>
          </div>

          <div className="flex flex-wrap mb-4">
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
              <label htmlFor="transactionDate" className="block text-sm font-medium text-[#838383]">Transaction Date</label>
              <input
                type="date"
                id="transactionDate"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                required
                className="w-full p-2 border rounded-md bg-[#f5f5f5]"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-4 sm:mb-0 pr-2">
              <label htmlFor="paymentMode" className="block text-sm font-medium text-[#838383]">Payment Mode</label>
              <select
                id="paymentMode"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
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
            <label htmlFor="remarks" className="block text-sm font-medium text-[#838383]">Additional Remarks</label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-[40%] p-1 border rounded-md bg-[#f5f5f5]"
            />
          </div>
        </div>

        {/* Submit Button */}
          <button
            type="submit"
            className="w-[15%] text-white bg-[#d24845] p-2 rounded-full m-4"
            onClick={updateStudentData}
            disabled={loading}
            style={{ borderRadius: '50px' }}  // If you need custom radius beyond Tailwind's built-in options
            >
            {loading ? "Submitting..." : "Add Student"}
          </button>


        {error && <div className="text-red-600 mt-4">{error}</div>}
        {successMessage && <div className="text-green-600 mt-4">{successMessage}</div>}
      </form>
    </div>
  );
};

export default StudentRegistrationPage;