import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { FaEye, FaPen, FaPrint, FaDollarSign } from 'react-icons/fa';

const StudentRegistrationViewPage = () => {
  const [students, setStudents] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const baseURL = useRecoilValue(baseURLAtom);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [AddFeemodalOpen, setAddFeeModalOpen] = useState(false);
  const [selectedAddFeeAction, setSelectedAddFeeAction] = useState("");
  const [openEnrollModal, setOpenEnrollModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [StudEnrollmodalOpen, setStudEnrollModalOpen] = useState(false); // ✅ Fix: This should be boolean
  const [successModal, setSuccessModal] = useState(false);
  const [studentData, setStudentData] = useState({});
  const [cancelStatus, setCancelStatus] = useState(""); // State for dropdown
  const [updating, setUpdating] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrollmentId, setEnrollmentId] = useState("");
  const [NewEnrollUniversitymodalOpen, setNewEnrollUniversityModalOpen] = useState(false); // ✅ Fix: This should be boolean
  const [newEnrollmentModal, setnewEnrollmentModal] = useState(false); // ✅ Fix: This should be boolean
  const [oldUniversityEnrollModalOpen, setOldUniversityEnrollModalOpen] = useState(false);
  const [oldEnrollmentFormModalOpen, setOldEnrollmentFormModalOpen] = useState(false);
  const [oldEnrollments, setOldEnrollments] = useState([]);
  const [loadingOldEnrollments, setLoadingOldEnrollments] = useState(false);
  const [paymentFor, setPaymentFor] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [yearSemester, setYearSemester] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [chequeNumber, setChequeNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [ResultUploadModal, setResultUploadModal] = useState(false); 
  const [CreateResultUploadModal, setCreateResultUploadModal] = useState(false); 
  const [UpdatePaymentModal, setUpdatePaymentModal] = useState(false); 
  const [feesData, setFeesData] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [UniRegisterModal, setUniRegisterModal] = useState(false);
  const [registrationData, setRegistrationData] = useState([]);
  const [isAddUniModalOpen, setisAddUniModalOpen] = useState(false);
  const [resultData, setResultData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [idCardModalOpen, setIdCardModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [reregisterFormData, setReregisterFormData] = useState({
    student_id: "", 
    type: "Re-registration",
    amount: "",  // Corrected from 'reregister_amount'
    date: "",  // Corrected from 'reregister_date'
    examination: "",  // Corrected from 'reregister_examination'
    semyear: "",  // Corrected from 'reregister_semyear'
    paymentmode: "",  // Corrected from 'reregister_paymentmode'
    remarks: "",  // Corrected from 'reregister_remarks'
  });
  
  const [formData, setFormData] = useState({
    course: "",
    stream: "",
    total_semyear: "",
    current_semyear: "",
    next_semyear: "",
  });

  const [formDataa, setFormDataa] = useState({
    student_id: '',
    date: '',
    examination: '',
    semyear: '',
    uploaded: 'Yes',
    remarks: ''
  });

  useEffect(() => {
    console.log("Updated resultData:", resultData);
  }, [resultData]);
  
 // Ensure form updates when student selection changes
useEffect(() => {
  setReregisterFormData((prevData) => ({
    ...prevData,
    student_id: selectedStudentId || "",
  }));
}, [selectedStudentId]);
  
  
  const handleReregisterInputChange = (e) => {
    setReregisterFormData({ ...reregisterFormData, [e.target.name]: e.target.value });
  };

  const handleSaveReregister = async () => {
    try {
      console.log("Sending data:", reregisterFormData);
  
      if (!reregisterFormData.student_id) {
        alert("Error: Student ID is missing!");
        return;
      }
  
      await axios.post(`${baseURL}api/create_university_reregistration/`, reregisterFormData);
      alert("University re-registration added successfully!");
      closeModal();
      fetchRegistrationData(selectedStudentId);
    } catch (error) {
      console.error("Error saving registration:", error);
      alert("Failed to save registration.");
    }
  };

  
  
  useEffect(() => {
    if (UniRegisterModal && selectedStudentId) {
      fetchRegistrationData(selectedStudentId);
    }
  }, [UniRegisterModal, selectedStudentId]);
  

  const fetchRegistrationData = async (studentId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}api/get_university_reregistration/?student_id=${studentId}`
      );
      setRegistrationData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching registration data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDataa((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
    // Get API token from local storage
    const apiToken = localStorage.getItem("access");

    const handleStatusChange = (feesId, value) => {
      setStatusMap((prev) => ({ ...prev, [feesId]: value }));
    };

    useEffect(() => {
      if (selectedStudentId) {
        fetchData(selectedStudentId);
      }
    }, [selectedStudentId]);
    
    const OpenUpdatePaymentModal = (studentId) => {
      setSelectedStudentId(studentId);
      setUpdatePaymentModal(true);
      fetchData(studentId); // ✅ Fetch data immediately
    };

    const fetchData = async (studentId) => {
      if (!studentId) return; // ✅ Avoid API call if studentId is null
    
      console.log("Fetching data for studentId:", studentId);
      try {
        const response = await axios.get(
          `${baseURL}api/get_additional_fees/?student_id=${studentId}`
        );
        setFeesData(response.data || []); // ✅ Ensure response is an array
      } catch (error) {
        console.error("Error fetching fees data:", error);
        setFeesData([]); // ✅ Set to empty array on error to avoid null issues
      }
    };
    

    // Fetch universities on component mount
    useEffect(() => {
      axios
        .get(`${baseURL}api/universities/`, {
          headers: { Authorization: `Bearer ${apiToken}` }, // Add token to request headers
        })
        .then((response) => {
          setUniversities(response.data);
        })
        .catch((error) => console.error("Error fetching universities:", error));
    }, [apiToken]);
  
    // Fetch courses when university is selected
    useEffect(() => {
      if (selectedUniversity) {
        axios
          .get(`${baseURL}api/courses-with-id/?university_id=${selectedUniversity}`, {
            headers: { Authorization: `Bearer ${apiToken}` },
          })
          .then((response) => {
            setCourses(response.data.courses);
          })
          .catch((error) => console.error("Error fetching courses:", error));
      } else {
        setCourses([]);
      }
    }, [selectedUniversity, apiToken]);

const fetchStudents = async () => {
  setLoading(true);
  try {
    const apiToken = localStorage.getItem("access");
    const response = await axios.get(
      `${baseURL}api/list_of_all_registered_student/`,
      { headers: { Authorization: `Bearer ${apiToken}` } }
    );
    setStudents(response.data.data);
  } catch (error) {
    setError(error.response ? error.response.data : error.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchStudents();
}, [baseURL]);

    


  useEffect(() => {
    if (openEnrollModal && selectedStudentId) {
      setLoading(true);
      const apiToken = localStorage.getItem("access"); // Get token from storage
      axios
        .get(`${baseURL}api/get_student_enroll_to_next_year/${selectedStudentId}/`, {
          headers: {
            Authorization: `Bearer ${apiToken}`, // 🔥 Include token
          },
        })
        .then((response) => {
          if (response.data.status === "success") {
            setFormData(response.data.data);
          } else {
            setError("Failed to fetch data");
          }
        })
        .catch(() => setError("Error fetching data"))
        .finally(() => setLoading(false));
    }
  }, [openEnrollModal, selectedStudentId, baseURL]); // ✅ Fix: Added `baseURL` as a dependency

  useEffect(() => {
    if (StudEnrollmodalOpen) {
      setLoading(true);
      const apiToken = localStorage.getItem("access");
  
      axios
        .get(`${baseURL}api/student-cancel/${selectedStudentId}/`, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        })
        .then((response) => {
          if (response.data.status === "success") {
            setStudentData(response.data.data);
          } else {
            setError("Failed to fetch student data.");
          }
        })
        .catch(() => setError("Error fetching student data."))
        .finally(() => setLoading(false));
    }
  }, [StudEnrollmodalOpen, selectedStudentId, baseURL]);

  const handleUpdate = () => {
    if (!cancelStatus) {
      alert("Please select a status.");
      return;
    }
  
    setUpdating(true);
    const apiToken = localStorage.getItem("access");
  
    axios
      .post(`${baseURL}api/student-cancel/${studentData.id}/`, { cancel_status: cancelStatus }, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          alert("Student enrollment canceled successfully!");
          closeModal(); // Close modal after success
        } else {
          alert("Failed to update status.");
        }
      })
      .catch(() => alert("Error updating status."))
      .finally(() => setUpdating(false));
  };
  

  if (loading) return <div>Loading students...</div>;

  if (error) return <div className="error-message">Error: {JSON.stringify(error)}</div>;

  // ✅ Hook-safe Modal Handlers
  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openFeesModal = (action,studentId) => {
    setSelectedAction(action);
    setModalOpen(true);
    setSelectedStudentId(studentId);
    console.log("studentId=", studentId);
  };

  const openAddFeesModal = (studentId) => {
    setAddFeeModalOpen(true);
    setSelectedStudentId(studentId);
    console.log("studentId=", studentId); // ✅ Should log correct studentId
  };

  const openEnrollModals = (studentId) => {
    setSelectedStudentId(studentId);
    setOpenEnrollModal(true);
  };

  const openStudEnrollModal = (studentId) => {
    setStudEnrollModalOpen(true);
    setSelectedStudentId(studentId);
    console.log("studentId=",studentId);
  };

  const openNewUniversityEnrollModal = (studentId) => {
    setNewEnrollUniversityModalOpen(true);
    setSelectedStudentId(studentId);
    console.log("studentId=", studentId);

    // Fetch new enrollments
    setLoading(true);
    axios.get(`${baseURL}api/register-enrollment-new/?student_id=${studentId}`, {
        headers: { Authorization: `Bearer ${apiToken}` },
    })
    .then((response) => {
        console.log("Fetched Data:", response.data);
        setTableData(response.data.data);  // ✅ FIXED
    })
    .catch((error) => {
        console.error("Error fetching new enrollments:", error);
    })
    .finally(() => {
        setLoading(false);
    });
};


  const openNewEnrollmentModal = (studentId) => {
    setnewEnrollmentModal(true);
    setSelectedStudentId(studentId);
    console.log("studentId=", studentId);
  };

  const ResultUpload = (studentId) => {
    setSelectedStudentId(studentId); // ✅ Ensure studentId is stored before opening modal
    setResultUploadModal(true);
    console.log("ResultUpload studentId=", studentId);
    fetchResults(studentId);
};

  const openCreateResultModal = (studentId) => {
    console.log("Before setting: selectedStudentId=", selectedStudentId);
    setSelectedStudentId(studentId);  // ✅ Set the correct studentId
    setCreateResultUploadModal(true);
    console.log("After setting: selectedStudentId=", studentId);
};

const openEditModal = (result) => {
  setSelectedResult(result);  // Set selected row data
  setEditModalOpen(true);     // Open the modal
};

const openUniRegisterModal = (studentId) => {
  console.log("Before setting: selectedStudentId openUniRegisterModal=", studentId);
  setSelectedStudentId(studentId); 
  setReregisterFormData((prevData) => ({
    ...prevData,
    student_id: studentId,  // Directly set student_id
  }));

  setUniRegisterModal(true);
};

const handleOpenAddModal = (studentId) => {
  if (!studentId) {
    console.error("Error: Student ID is missing in handleOpenAddModal.");
    alert("Error: Please select a student before adding a university.");
    return;
  }
  console.log("Before setting: selectedStudentId handleOpenAddModal=", studentId);
  setSelectedStudentId(studentId); 
  setReregisterFormData((prevData) => ({
    ...prevData,
    student_id: studentId,
  }));

  setisAddUniModalOpen(true);
};

  
  const openOldEnrollmentFormModal = () => {
   setOldEnrollmentFormModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setAddFeeModalOpen(false);
    setOpenEnrollModal(false);
    setStudEnrollModalOpen(false);
    setSelectedAction("");
    setSelectedAddFeeAction("");
    setNewEnrollUniversityModalOpen(false);
    setnewEnrollmentModal(false);
    setOldUniversityEnrollModalOpen(false);
    setOldEnrollmentFormModalOpen(false);
    resetForm();
    setResultUploadModal(false);
    setCreateResultUploadModal(false);
    setUpdatePaymentModal(false);
    setUniRegisterModal(false);
    setisAddUniModalOpen(false);
    setIdCardModalOpen(false);
  };

  const openOldUniversityEnrollModal = (studentId) => {
    setOldUniversityEnrollModalOpen(true);
    setSelectedStudentId(studentId);
    console.log(studentId);

    // Fetch old enrollments
    setLoadingOldEnrollments(true);
    axios.get(`${baseURL}api/register-enrollment-old/?student_id=${studentId}`, {
      headers: { Authorization: `Bearer ${apiToken}` },
    })
    .then((response) => {
        console.log(response.data);
        setOldEnrollments(response.data.data);  // ✅ FIXED
    })
    .catch((error) => {
        console.error("Error fetching old enrollments:", error);
    })
    .finally(() => {
        setLoadingOldEnrollments(false);
    });
};

const handleEnrollConfirmation = async () => {
  if (!selectedStudentId) {
    alert("Student ID is missing!");
    return;
  }

  if (window.confirm("Enroll to Next Semester / Year?")) {
    try {
      setLoading(true);
      const apiToken = localStorage.getItem("access");
      const response = await axios.post(
        `${baseURL}api/get_student_enroll_to_next_year/${selectedStudentId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      if (response.data.status === "success") {
        setSuccessModal(true);
        setFormData(response.data.data);
        await fetchStudents();  // <-- Refresh student list here
      } else {
        alert(response.data.message || "Failed to enroll student.");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Something went wrong while enrolling the student."
      );
    } finally {
      setLoading(false);
    }
  }
};

  
  const closeSuccessModal = () => {
    setSuccessModal(false);
    closeModal(); // Close main modal after success
  };

  const handleViewEdit = (enrollmentId) => {
    navigate(`/edit-student/${enrollmentId}`);
  };

  const handleSubmit = (selectedStudentId) => {
    const postData = {
      student_id: selectedStudentId,
      course_id: selectedCourse,
      enrollment_id: enrollmentId,
      type: "new",
    };
  
    console.log("Submitting Data:", postData); 
    axios
      .post(`${baseURL}api/register-enrollment-new/`, postData, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        alert("Enrollment added successfully!");
        closeModal();
      })
      .catch((error) => {
        console.error("Error submitting enrollment:", error);
        alert("Failed to add enrollment. Please try again.");
      });
  };
  
  
  const handleOldEnrollSubmit = (selectedStudentId) => {
    const postData = {
      student_id: selectedStudentId,
      course_id: selectedCourse,
      enrollment_id: enrollmentId,
      type: "new", // "old"
    };
  
    console.log("Submitting Data:", postData);
    axios
      .post(`${baseURL}api/register-enrollment-old/`, postData, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        alert("Old Enrollment added successfully!");
        setOldEnrollmentFormModalOpen(false);
        openOldUniversityEnrollModal(selectedStudentId); // Refresh table
      })
      .catch((error) => {
        console.error("Error submitting enrollment:", error);
        alert("Failed to add enrollment. Please try again.");
      });
  };

  const resetForm = () => {
    setPaymentFor("");
    setAmount("");
    setPaymentType("");
    setYearSemester("");
    setTransactionDate("");
    setPaymentMode("");
    setChequeNumber("");
    setBankName("");
    setRemarks("");
  };
  
  const handleAdditionalFeeSubmit = () => {
    if (!selectedStudentId || !paymentFor || !amount || !paymentType || !yearSemester || !transactionDate || !paymentMode) {
      alert("Please fill all required fields.");
      return;
    }
  
    const postData = {
      student_id: selectedStudentId, // ✅ Ensure this is correctly set
      extrafees_feesfor: paymentFor,
      extrafees_amount: amount,
      extrafees_feestype: paymentType,
      extrafees_semyear: yearSemester,
      extrafees_transactiondate: transactionDate,
      extrafees_paymentmode: paymentMode,
      extrafees_chequeno: chequeNumber,
      extrafees_bankname: bankName,
      extrafees_remarks: remarks,
    };
    console.log("Submitting Data:", postData);
    axios
      .post(`${baseURL}api/create_additional_fees/`, postData, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        alert("Additional fee added successfully!");
        closeModal();
      })
      .catch((error) => {
        console.error("Error submitting additional fee:", error);
        alert("Failed to add fee. Please try again.");
      });
  };
  
  const customTableStyles = {
    headRow: {
      style: {
        backgroundColor: '#d24845',
        fontSize: '16px',
        borderRadius: '7px',
        marginBottom: '6px',
        color: 'white',
      },
    },
    headCells: {
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'white',
      },
    },
    rows: {
      style: {
        fontSize: '16px',
      },
    },
    cells: {
      style: {
        fontSize: '16px',
      },
    },
  };

  const columns = [
    {
      name: "Sr. No",
      cell: (row, index) => (
        <button onClick={() => toggleRow(row.enrollment_id)} className="text-xl">
          {expandedRows[row.enrollment_id] ? (
            <FaMinusCircle className="text-red-500" />
          ) : (
            <FaPlusCircle className="text-green-500" />
          )}
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    { name: "Current Semester/Year", cell: (row) => <span className="font-bold">{row.current_semyear}</span>, sortable: true },
    { name: "Enrollment ID", cell: (row) => <span className="font-bold">{row.enrollment_id}</span>, sortable: true },
    { name: "Student Name", cell: (row) => <span className="font-bold">{row.student_name}</span>, sortable: true },
    { name: "University Name", cell: (row) => <span className="font-bold">{row.university_name}</span>, sortable: true },
    { name: "Source", cell: (row) => <span className="font-bold">{row.source}</span>, sortable: true },
    { name: "Study Pattern / Mode", cell: (row) => <span className="font-bold">{row.study_pattern_mode}</span>, sortable: true },
    { name: "Entry Mode", cell: (row) => <span className="font-bold">{row.entry_mode}</span>, sortable: true },
    { name: "Enrollment Date", cell: (row) => <span className="font-bold">{row.enrollment_date}</span>, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => handleViewEdit(row.enrollment_id)}
          className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 text-sm"
        >
          View/Edit
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  


  const handleCheckResultSubmit = (event) => {
    event.preventDefault(); // ✅ Prevents page reload

    if (!selectedStudentId || !formDataa.date || !formDataa.examination || !formDataa.semyear || !formDataa.uploaded || !formDataa.remarks) {
      alert("Please fill all required fields.");
      return;
    }
  
    const postData = {
      student_id: selectedStudentId, // ✅ Use state value
      date: formDataa.date,
      examination: formDataa.examination,
      semyear: formDataa.semyear,
      uploaded: formDataa.uploaded,
      remarks: formDataa.remarks,
    };
  
    console.log("Submitting Data:", postData);
  
    axios
      .post(`${baseURL}api/create_result_uploaded/`, postData, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        alert("Result uploaded successfully!");
        setCreateResultUploadModal(false); 
  
        // Reset form
        setFormData({
          student_id: "",
          date: "",
          examination: "",
          semyear: "",
          uploaded: "Yes",
          remarks: "",
        });
      })
      .catch((error) => {
        console.error("Error submitting result:", error);
        alert("Failed to upload result. Please try again.");
      });
};


const handleUpdatePayment = async (fee) => {
  setLoading(true);
  try {
    const updateData = {
      fees_id: fee.fees_id,
      student_id: fee.student_id,
      payment_for: fee.payment_for,
      payment_type: fee.payment_type,
      transaction_date: fee.transaction_date,
      cheque_no: fee.cheque_no || "",
      bank_name: "XYZ Bank", // You may want to dynamically set this
      paidamount: fee.paidamount,
      pendingamount: fee.pendingamount,
      paymentmode: fee.paymentmode,
      remarks: "Payment updated",
      semyear: fee.semyear,
      status: statusMap[fee.fees_id] || "Not Realised", // Pass selected status dynamically
    };

    await axios.put(`${baseURL}api/update_additional_fees/`, updateData);
    alert("Payment updated successfully!");

    // Refresh the table data
    closeModal();
  } catch (error) {
    console.error("Error updating payment:", error);
    alert("Failed to update payment.");
  } finally {
    setLoading(false);
  }
};

const fetchResults = async (studentId) => {
  try {
    setLoading(true);
    console.log("Fetching results for student ID:", studentId);

    const response = await axios.get(`${baseURL}api/result_uploaded_view/?student_id=${studentId}`);
    
    console.log("API Response:", response); // Log full response
    console.log("Data:", response.data); // Log only data

    if (response.status === 200) {
      setResultData(response.data);
    } else {
      console.error("Unexpected response status:", response.status);
    }
  } catch (error) {
    console.error("Error fetching results:", error.response || error);
  } finally {
    setLoading(false);
  }
};

const handleUploadUpdate = async (e) => {
  e.preventDefault();

  if (!selectedResult || !selectedResult.id) {
    alert("Error: No result selected for update.");
    return;
  }

  try {
    const updatedData = {
      date: selectedResult.date,
      examination: selectedResult.examination,
      semyear: selectedResult.semyear,
      uploaded: selectedResult.uploaded,
      remarks: selectedResult.remarks,
    };

    console.log("Sending updated data:", updatedData);

    const response = await axios.put(
      `${baseURL}api/update_result_uploaded/${selectedResult.id}/`,
      updatedData,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Response:", response); // Debugging response

    if (response.status === 200) {
      alert("Result updated successfully!");
      setEditModalOpen(false); // Close the modal
      fetchResults(selectedStudentId); // Refresh data
    } else {
      alert("Failed to update result. Server responded with status: " + response.status);
    }
  } catch (error) {
    console.error("Error updating result:", error);

    // Handle possible error types
    if (error.response) {
      console.error("Server responded with:", error.response.data);
      alert("Update failed: " + (error.response.data?.message || "Server error"));
    } else if (error.request) {
      console.error("No response received:", error.request);
      alert("Update failed: No response from server.");
    } else {
      console.error("Request error:", error.message);
      alert("Update failed: " + error.message);
    }
  }
};

const openIDCardModal = async (studentId) => {
  setLoading(true);
  try {
    const response = await axios.get(`${baseURL}api/get_paid_fees/?student_id=${studentId}`);
    setStudentData(response.data);
    setIdCardModalOpen(true);
  } catch (error) {
    console.error("Error fetching ID Card data:", error);
    alert("Failed to fetch student details.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="quick-student-registration-page">
      <h1 className="font-bold text-2xl mb-4">List of Registered Students</h1>
      <DataTable
        columns={columns}
        data={students}
        pagination
        customStyles={customTableStyles} 
        highlightOnHover
        striped
        responsive
        noDataComponent="No students found"
        expandableRows
        expandableRowExpanded={(row) => !!expandedRows[row.enrollment_id]}
        expandOnRowClicked={false}
        expandableIcon={false} // ✅ Removes default arrow icon
        expandableRowsComponent={({ data }) =>
          expandedRows[data.enrollment_id] ? (
            <div className="p-4 bg-gray-100 border rounded-md">
              {/* Account Section */}
              <div className="mb-4">
                <p><strong>Account:</strong></p>
                <div className="flex gap-2">
                  <button onClick={() => openFeesModal("Fees")} className="bg-[#d3eaff] px-2 py-1 text-[#4259A6] rounded">Fees</button>
                  <button onClick={() => openAddFeesModal(data.id)} className="bg-[#d3eaff] px-2 py-1 text-[#4259A6] rounded">Additional Fees</button>
                  <button onClick={() => openIDCardModal(data.id)} className="bg-[#d3eaff] px-2 py-1 text-[#4259A6] rounded">ID Card</button>
                  <button onClick={() => ResultUpload(data.id)} className="bg-[#d3eaff] px-2 py-1 text-[#4259A6] rounded">Result Uploaded</button>
                  <button onClick={() => openUniRegisterModal(data.id)} className="bg-[#d3eaff] px-2 py-1 text-[#4259A6] rounded">University Re-Registration</button>
                </div>
              </div>

              {/* Extra Section */}
              <div className="mb-4">
                <p><strong>Extra:</strong></p>
                <div className="flex gap-2">
                  <button onClick={() => openNewUniversityEnrollModal(data.id)} className="bg-[#d3eaff] px-2 py-1 text-[#4259A6] rounded">New University Enrollment Number</button>
                  <button onClick={() => openOldUniversityEnrollModal(data.id)} className="bg-[#d3eaff] px-2 py-1 text-[#4259A6] rounded">Old University Enrollment Number</button>
                  <button onClick={() => openModal("Send Reminder")} className="bg-[#d3eaff] px-2 py-1 text-[#4259A6] rounded">Send Reminder</button>
                  <button onClick={() => OpenUpdatePaymentModal(data.id)} className="bg-[#d3eaff] px-2 py-1 text-[#4259A6] rounded">Update Payment</button>
                </div>
              </div>

              {/* Action Section */}
              <div className="mb-4">
                <p><strong>Action:</strong></p>
                <div className="flex gap-2">
                <button onClick={() => openEnrollModals(data.id)} className="bg-[#d3eaff] text-[#4259A6] px-2 py-1 rounded">
                  Enroll To Next Semester / Year
                </button>
                  <button onClick={() => openStudEnrollModal(data.id)} className="bg-[#d3eaff] text-[#4259A6] px-2 py-1 rounded">Cancel Student Enrollment</button>
                </div>
              </div>
            </div>
          ) : null
        }
      />

       {/* ID Card Modal */}
       {idCardModalOpen && studentData && (
         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
         <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center border-2 border-gray-300">
           
           {/* University Logo */}
           {studentData.university_logo && (
             <img
             src={`${baseURL}${studentData.university_logo}`}
             alt="University Logo"
               className="w-24 h-24 mx-auto mb-4 rounded-full border border-gray-300 object-cover"
             />
           )}
   
           {/* Enrollment ID & Name */}
           <h2 className="text-lg font-bold">{studentData.name}</h2>
           <p className="text-gray-700 font-medium mb-3">Enrollment ID: {studentData.enrollment_id}</p>
   
           {/* Divider */}
           <hr className="border-gray-400 my-3" />
   
           {/* University Information */}
           <div className="text-left text-sm mb-3">
             <p><strong>University Name:</strong> {studentData.university_name}</p>
             <p><strong>University Address:</strong> {studentData.university_address}, {studentData.university_city}, {studentData.university_state}, {studentData.university_pincode}, {studentData.country}</p>
           </div>
   
           {/* Divider */}
           <hr className="border-gray-400 my-3" />
   
           {/* Student Address */}
           <div className="text-left text-sm mb-3">
             <p><strong>Address:</strong> {studentData.address}</p>
             <p>{studentData.city}, {studentData.state}, {studentData.country}, {studentData.pincode}</p>
           </div>
   
           {/* Contact Information */}
           <div className="text-sm">
             <p><strong>Ph:</strong> {studentData.mobile} | <strong>Email:</strong> {studentData.email}</p>
           </div>
   
           {/* Close Button */}
           <div className="mt-4">
             <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded-md">
               Close
             </button>
           </div>
         </div>
       </div>
      )}


     
      {AddFeemodalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[700px]">
            <h2 className="text-lg font-bold mb-4">{selectedAddFeeAction}</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Payment For</label>
                <select className="w-full p-2 border rounded-md" value={paymentFor} onChange={(e) => setPaymentFor(e.target.value)}>
                  <option value="">Select</option>
                  <option value="Library Fees">Library Fees</option>
                  <option value="Lab Fees">Lab Fees</option>
                  <option value="Exam Fees">Exam Fees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input type="number" className="w-full p-2 border rounded-md" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Payment Type</label>
                <select className="w-full p-2 border rounded-md" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                  <option value="">Select</option>
                  <option value="One-time">One-time</option>
                  <option value="Recurring">Recurring</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Year / Semester</label>
                <select className="w-full p-2 border rounded-md" value={yearSemester} onChange={(e) => setYearSemester(e.target.value)}>
                  <option value="">Select</option>
                  {[...Array(8).keys()].map((num) => (
                    <option key={num + 1} value={num + 1}>
                      {num + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Transaction Date</label>
                <input type="date" className="w-full p-2 border rounded-md" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} />
              </div>
            
              <div>
                <label className="block text-sm font-medium mb-1">Payment Mode</label>
                <select className="w-full p-2 border rounded-md" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                  <option value="">Select</option>
                  <option value="Online">Online</option>
                  <option value="Cheque">Cheque</option>
                  <option value="DD">Demand Draft (DD)</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>

              {paymentMode !== "Online" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Cheque/DD/CC Number</label>
                  <input type="text" className="w-full p-2 border rounded-md" value={chequeNumber} onChange={(e) => setChequeNumber(e.target.value)} />
                </div>
              )}

                {paymentMode !== "Online" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Bank Name</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    >
                      <option value="">Select Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                      <option value="Union Bank of India">Union Bank of India</option>
                    </select>
                  </div>
                )}


              <div className="col-span-3">
                <label className="block text-sm font-medium mb-1">Remarks</label>
                <textarea className="w-full p-2 border rounded-md" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
              </div>
            </div>

            <div className="mt-6 text-right">
              <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2">
                Cancel
              </button>
              <button onClick={handleAdditionalFeeSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Save
              </button>
            </div>
          </div>
        </div>
      )}


    {oldUniversityEnrollModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-5 rounded-lg shadow-lg w-[600px]">
          <h2 className="text-lg font-bold mb-4">Old Enrollment Records</h2>

          {/* Button to open the form modal */}
          <button
            onClick={openOldEnrollmentFormModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
          >
            Add Old Enrollment ID
          </button>

          {/* Show Table of Old Enrollments */}
        
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Sr.No</th>
                  <th className="border p-2">Course Name</th>
                  <th className="border p-2">Enrollment ID</th>
                </tr>
              </thead>
              {loadingOldEnrollments ? (
            <p>Loading...</p>
          ) : oldEnrollments.length > 0 ? (
              <tbody>
                {oldEnrollments.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{item.course_name}</td>
                    <td className="border p-2">{item.enrollment_id}</td>
                  </tr>
                ))}
              </tbody>
                 ) : (
                  <p>No old enrollments found.</p>
                )}
            </table>
       

          <div className="text-right mt-4">
            <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded-md">
              Close
            </button>
          </div>
        </div>
      </div>
    )}


    {oldEnrollmentFormModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-5 rounded-lg shadow-lg w-[500px]">
          <h2 className="text-lg font-bold mb-4">Add Old Enrollment</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">University Name</label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
            >
              <option value="">Select University</option>
              {universities.map((univ) => (
                <option key={univ.id} value={univ.id}>
                  {univ.university_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Course Name</label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              disabled={!selectedUniversity}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Enrollment ID</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={enrollmentId}
              onChange={(e) => setEnrollmentId(e.target.value)}
            />
          </div>

          <div className="text-right">
            <button
              onClick={() => setOldEnrollmentFormModalOpen(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2"
            >
              Back
            </button>
            <button
              onClick={() => handleOldEnrollSubmit(selectedStudentId, "old")}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )}


{NewEnrollUniversitymodalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-5 rounded-lg shadow-lg w-[800px]">
      <h2 className="text-lg font-bold mb-4">Enrollment Numbers</h2>
      <button onClick={() => openNewEnrollmentModal(selectedStudentId)} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">
        Add New Enrollment ID
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Sr.No</th>
              <th className="border p-2">Course Name</th>
              <th className="border p-2">Enrollment ID</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((item, index) => (
                <tr key={item.id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{item.course_name}</td>
                  <td className="border p-2">{item.enrollment_id}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="border p-2 text-center">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="text-right mt-4">
        <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded-md">
          Close
        </button>
      </div>
    </div>
  </div>
)}

    {newEnrollmentModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-5 rounded-lg shadow-lg w-[500px]">
          <h2 className="text-lg font-bold mb-4">New University Enrollment ID</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">University Name</label>
            <select
            className="w-full p-2 border rounded-md"
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
          >
            <option value="">Select University</option>
            {universities.map((univ) => (
              <option key={univ.id} value={univ.id}>
                {univ.university_name}
              </option>
            ))}
          </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Course Name</label>
            <select
            className="w-full p-2 border rounded-md"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            disabled={!selectedUniversity}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.course_id} value={course.course_id}>
                {course.name}
              </option>
            ))}
          </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Enrollment ID</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={enrollmentId}
              onChange={(e) => setEnrollmentId(e.target.value)}
            />
          </div>

          <div className="text-right">
            <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2">Cancel</button>
            <button onClick={() => handleSubmit(selectedStudentId)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Submit
            </button>
          </div>
        </div>
      </div>
    )}


        {/* Modal Component */}
        {ResultUploadModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-200">
         
            <h2 className="text-lg font-bold mb-4">Result Uploads</h2>
            <button onClick={() => openCreateResultModal(selectedStudentId)} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">
              Create New Result
            </button>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 mb-4">
                  <thead>
                    <tr className="bg-gray-200 text-center">
                      <th className="border p-2">Student ID</th>
                      <th className="border p-2">Date</th>
                      <th className="border p-2">Examination</th>
                      <th className="border p-2">Semester Year</th>
                      <th className="border p-2">Uploaded</th>
                      <th className="border p-2">Remarks</th>
                      <th className="border p-2">Action</th>
                    </tr>
                  </thead>
                  {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
                 ) : resultData.length > 0 ? (
                  <tbody>
                    {resultData.map((item) => (
                      <tr key={item.id} className="text-center">
                        <td className="border p-2">{item.student}</td>
                        <td className="border p-2">{item.date}</td>
                        <td className="border p-2">{item.examination}</td>
                        <td className="border p-2">{item.semyear}</td>
                        <td className="border p-2">{item.uploaded}</td>
                        <td className="border p-2">{item.remarks}</td>
                        <td className="border p-2">
                        <button
                          onClick={() => {
                            setSelectedResult(item); // Set the clicked row's data
                            setEditModalOpen(true); // Open the modal
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                        >
                          Edit
                        </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                    ) : (
                      <p className="text-center text-gray-500">No results found.</p>
                    )}
                </table>
            </div>

            <div className="mt-4 text-right">
              <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2">Close</button>
            </div>
          </div>
        </div>
      )}


{CreateResultUploadModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-5 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Create Result Upload</h2>
            <form onSubmit={handleCheckResultSubmit}> {/* ✅ Fixed */}
                <input
                    type="date"
                    name="date"
                    value={formDataa.date}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded mb-2"
                    required
                />
                <input
                    type="text"
                    name="examination"
                    placeholder="Examination"
                    value={formDataa.examination}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded mb-2"
                    required
                />
                <input
                    type="text"
                    name="semyear"
                    placeholder="Semester Year"
                    value={formDataa.semyear}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded mb-2"
                    required
                />
                <select
                    name="uploaded"
                    value={formDataa.uploaded}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded mb-2"
                    required
                >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
                <input
                    type="text"
                    name="remarks"
                    placeholder="Remarks"
                    value={formDataa.remarks}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded mb-2"
                    required
                />
               
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Submit
                </button>
                <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2">
                    Cancel
                </button>
            </form>
        </div>
    </div>
)}



        {/* Modal Component */}
        {UpdatePaymentModal && (
           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
           <div className="bg-white p-6 rounded-lg shadow-lg w-[900px] max-h-[80vh] overflow-y-auto">
             <h2 className="text-xl font-semibold mb-4">Update Payment</h2>
             <p className="text-gray-600">Payment details for Student ID: {selectedStudentId}</p>
   
            {feesData && feesData.length > 0 ? (
              <table className="w-full mt-4 border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-200 text-center">
                    <th className="border p-2">Sr.No</th>
                    <th className="border p-2">Year/Sem</th>
                    <th className="border p-2">Transaction Date</th>
                    <th className="border p-2">Mode</th>
                    <th className="border p-2">No</th>
                    <th className="border p-2">Total Fees</th>
                    <th className="border p-2">Paid Amount</th>
                    <th className="border p-2">Advance Amount</th>
                    <th className="border p-2">Pending Amount</th>
                    <th className="border p-2">Payment Status</th>
                    <th className="border p-2">Change Payment Status</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {feesData.map((fee, index) => (
                    <tr key={fee.fees_id} className="text-center">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{fee.semyear}</td>
                      <td className="border p-2">{fee.transaction_date}</td>
                      <td className="border p-2">{fee.paymentmode}</td>
                      <td className="border p-2">{fee.cheque_no || "-"}</td>
                      <td className="border p-2">
                        {parseFloat(fee.paidamount) + parseFloat(fee.pendingamount)}
                      </td>
                      <td className="border p-2">{fee.paidamount}</td>
                      <td className="border p-2">0</td>
                      <td className="border p-2">{fee.pendingamount}</td>
                      <td className="border p-2">{statusMap[fee.fees_id] || "Not Realised"}</td>
                      <td className="border p-2">
                        <select
                          className="border rounded p-1"
                          value={statusMap[fee.fees_id] || "Not Realised"}
                          onChange={(e) => handleStatusChange(fee.fees_id, e.target.value)}
                        >
                          <option value="Realised">Realised</option>
                          <option value="Not Realised">Not Realised</option>
                        </select>
                      </td>
                      <td className="border p-2">
                        <button
                          onClick={() => handleUpdatePayment(fee)}
                          className={`bg-blue-500 text-white px-3 py-1 rounded-md ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={loading}
                        >
                          {loading ? "Updating..." : "Update"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mt-4 text-gray-600">No additional fees found.</p>
            )}

   
             {/* Buttons */}
             <div className="mt-4 text-right">
               <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2">
                 Close
               </button>
             </div>
           </div>
         </div>
      )}


{editModalOpen && selectedResult && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-5 rounded-lg shadow-lg w-96">
      <h2 className="text-lg font-bold mb-4">Edit Result</h2>
      
      <form onSubmit={handleUploadUpdate}>
        <label className="block mb-2">
          Date:
          <input
            type="date"
            className="border p-2 w-full"
            value={selectedResult.date}
            onChange={(e) => setSelectedResult({ ...selectedResult, date: e.target.value })}
          />
        </label>

        <label className="block mb-2">
          Examination:
          <input
            type="text"
            className="border p-2 w-full"
            value={selectedResult.examination}
            onChange={(e) => setSelectedResult({ ...selectedResult, examination: e.target.value })}
          />
        </label>

        <label className="block mb-2">
          Semester Year:
          <input
            type="text"
            className="border p-2 w-full"
            value={selectedResult.semyear}
            onChange={(e) => setSelectedResult({ ...selectedResult, semyear: e.target.value })}
          />
        </label>

        <label className="block mb-2">
          Uploaded:
          <select
            className="border p-2 w-full"
            value={selectedResult.uploaded}
            onChange={(e) => setSelectedResult({ ...selectedResult, uploaded: e.target.value })}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>

        <label className="block mb-4">
          Remarks:
          <input
            type="text"
            className="border p-2 w-full"
            value={selectedResult.remarks}
            onChange={(e) => setSelectedResult({ ...selectedResult, remarks: e.target.value })}
          />
        </label>

        <div className="flex justify-end">
          <button type="button" onClick={() => setEditModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2">
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
)}


     
    {openEnrollModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-5 rounded-lg shadow-lg w-[600px]">
          <h2 className="text-lg font-bold mb-4">Enroll to Next Year</h2>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <form onSubmit={(e) => e.preventDefault()}>
              {/* First Row */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Course</label>
                  <input type="text" className="w-full p-2 border rounded-md" value={formData.course} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stream</label>
                  <input type="text" className="w-full p-2 border rounded-md" value={formData.stream} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Total Semester/Year</label>
                  <input type="text" className="w-full p-2 border rounded-md" value={formData.total_semyear} readOnly />
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Semester/Year</label>
                  <input type="text" className="w-full p-2 border rounded-md" value={formData.current_semyear} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Next Semester/Year</label>
                  <input type="text" className="w-full p-2 border rounded-md bg-gray-100" value={formData.next_semyear} readOnly />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={handleEnrollConfirmation}
                  >
                    Enroll
                  </button>
                </div>
              </div>

              {/* Cancel Button */}
              <div className="text-right">
                <button onClick={closeModal} type="button" className="bg-gray-400 text-white px-4 py-2 rounded-md">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )}

    {successModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-5 rounded-lg shadow-lg w-[400px] text-center">
          <h2 className="text-lg font-bold mb-4">Success</h2>
          <p>Student Enrolled successfully</p>
          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={closeSuccessModal}
          >
            OK
          </button>
        </div>
      </div>
    )}


     {UniRegisterModal && (
       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
       <div className="bg-white p-5 rounded-lg shadow-lg w-[800px] max-h-[80vh] overflow-y-auto">

         <h2 className="text-lg font-bold mb-4 text-center">University Re-Registration Details</h2>
          {/* Add New University Button */}
          <div className="text-right mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => handleOpenAddModal(selectedStudentId)}
          >
            Add New University
          </button>
          </div>
           <table className="w-[700px] border-collapse border border-gray-300 text-sm">
             <thead>
               <tr className="bg-gray-200 text-center">
                 <th className="border p-2">ID</th>
                 <th className="border p-2">Type</th>
                 <th className="border p-2">Amount</th>
                 <th className="border p-2">Date</th>
                 <th className="border p-2">Examination</th>
                 <th className="border p-2">Sem/Year</th>
                 <th className="border p-2">Payment Mode</th>
                 <th className="border p-2">Remarks</th>
               </tr>
             </thead>
             {loading ? (
             <p className="text-center text-gray-500">Loading...</p>
              ) : registrationData.length > 0 ? (
             <tbody>
               {registrationData.map((item) => (
                 <tr key={item.id} className="text-center">
                   <td className="border p-2">{item.id}</td>
                   <td className="border p-2">{item.type}</td>
                   <td className="border p-2">{item.amount}</td>
                   <td className="border p-2">{item.date}</td>
                   <td className="border p-2">{item.examination}</td>
                   <td className="border p-2">{item.semyear}</td>
                   <td className="border p-2">{item.paymentmode}</td>
                   <td className="border p-2">{item.remarks}</td>
                 </tr>
               ))}
             </tbody>
              ) : (
                <p className="text-center text-gray-500">No registration data found.</p>
              )}
           </table>
         <div className="mt-4 text-center">
           <button
             className="bg-green-500 text-white px-4 py-2 rounded-md"
             onClick={closeSuccessModal}
           >
             OK
           </button>
         </div>
       </div>
     </div>
    )}


      {/* Add New University Registration Modal */}
      {isAddUniModalOpen && (
           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
           <div className="bg-white p-5 rounded-lg shadow-lg w-[500px] max-h-[80vh] overflow-y-auto">
             <h2 className="text-lg font-bold mb-4 text-center">Add University Registration</h2>
   
             <div className="space-y-3">
               <input
                 type="text"
                 name="amount"
                 placeholder="Amount"
                 className="border p-2 w-full rounded"
                 value={reregisterFormData.amount}
                 onChange={handleReregisterInputChange}
               />
               <input
                 type="date"
                 name="date"
                 className="border p-2 w-full rounded"
                 value={reregisterFormData.date}
                 onChange={handleReregisterInputChange}
               />
               <input
                 type="text"
                 name="examination"
                 placeholder="Examination"
                 className="border p-2 w-full rounded"
                 value={reregisterFormData.examination}
                 onChange={handleReregisterInputChange}
               />
               <input
                 type="text"
                 name="semyear"
                 placeholder="Sem/Year"
                 className="border p-2 w-full rounded"
                 value={reregisterFormData.semyear}
                 onChange={handleReregisterInputChange}
               />
               <select
                 name="paymentmode"
                 className="border p-2 w-full rounded"
                 value={reregisterFormData.paymentmode}
                 onChange={handleReregisterInputChange}
               >
                 <option value="">Select Payment Mode</option>
                 <option value="Online">Online</option>
                 <option value="NEFT">NEFT</option>
                 <option value="Cheque">Cheque</option>
               </select>
               <input
                 type="text"
                 name="remarks"
                 placeholder="Remarks"
                 className="border p-2 w-full rounded"
                 value={reregisterFormData.remarks}
                 onChange={handleReregisterInputChange}
               />
             </div>
   
             <div className="mt-4 flex justify-end space-x-2">
               <button className="bg-gray-400 text-white px-4 py-2 rounded-md" onClick={closeModal}>
                 Close
               </button>
               <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleSaveReregister}>
                 Save
               </button>
             </div>
           </div>
         </div>
        )}


      {StudEnrollmodalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-[800px]">
            <h2 className="text-lg font-bold mb-4">Cancel Student Enrollment</h2>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                {/* Student Info Table */}
                <table className="w-full border-collapse border border-gray-300 mb-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Mobile</th>
                      <th className="border p-2">Email</th>
                      <th className="border p-2">Enrolled</th>
                      <th className="border p-2">Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">{studentData.name}</td>
                      <td className="border p-2">{studentData.mobile}</td>
                      <td className="border p-2">{studentData.email}</td>
                      <td className="border p-2">{studentData.enrolled ? "Yes" : "No"}</td>
                      <td className="border p-2">{studentData.active ? "Yes" : "No"}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Student ID & Status Dropdown */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Student ID</label>
                  <input type="text" className="w-full p-2 border rounded-md bg-gray-100" value={studentData.id} readOnly />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={cancelStatus}
                    onChange={(e) => setCancelStatus(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="in-active">In-Active</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="text-right">
                  <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2">Cancel</button>
                  <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    {updating ? "Updating..." : "Update"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}




    </div>
  );
};

export default StudentRegistrationViewPage;
