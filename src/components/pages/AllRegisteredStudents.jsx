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
  const [NewEnrollUniversitymodalOpen, setNewEnrollUniversityModalOpen] = useState(false);
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
  
      await axios.post("http://127.0.0.1:8000/api/create_university_reregistration/", reregisterFormData);
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
        `http://127.0.0.1:8000/api/get_university_reregistration/?student_id=${studentId}`
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
          `http://127.0.0.1:8000/api/get_additional_fees/?student_id=${studentId}`
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

    useEffect(() => {
      const fetchStudents = async () => {
        try {
          const apiToken = localStorage.getItem("access");
          const response = await axios.get(
            `${baseURL}api/list_of_all_registered_student/`,
            { headers: { Authorization: `Bearer ${apiToken}` } }
          );
          // console.log("Students:", response.data.data); // Debugging
          setStudents(response.data.data);
        } catch (error) {
          setError(error.response ? error.response.data : error.message);
        } finally {
          setLoading(false);
        }
      };
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


  const handleEnrollConfirmation = () => {
    if (window.confirm("Enroll to Next Semester / Year?")) {
      setSuccessModal(true);
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
      .post("http://127.0.0.1:8000/api/create_additional_fees/", postData, {
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
    selector: (row, index) => index + 1, // Adding serial number
    sortable: true,
  },
  {
    name: "Current Semester/Year",
    selector: (row) => row.current_semyear,
    sortable: true,
  },
  {
    name: "Enrollment ID",
    selector: (row) => row.enrollment_id,
    sortable: true,
  },
  {
    name: "Student Name",
    selector: (row) => row.student_name,
    sortable: true,
  },
  {
    name: "Source",
    selector: (row) => row.source,
    sortable: true,
  },
  {
    name: "Study Pattern / Mode",
    selector: (row) => row.study_pattern_mode,
    sortable: true,
  },
  {
    name: "Enrollment Date",
    selector: (row) => row.enrollment_date,
    sortable: true,
  },
  {
    name: "Action",
    cell: (row) => (
      <div className="flex gap-2">
        {/* Eye Icon for Viewing */}
        <button
          onClick={() => handleView(row.enrollment_id)}
          className="bg-[#d3eaff] text-[#4259A6] p-2 rounded-md"
        >
          <FaEye />
        </button>
        
        {/* Pen Icon for Editing */}
        <button
          onClick={() => handleEdit(row.enrollment_id)}
          className="bg-[#d3eaff] text-[#4259A6] p-2 rounded-md"
        >
          <FaPen />
        </button>
        
        {/* Print Icon */}
        <button
          onClick={() => handlePrint(row.enrollment_id)}
          className="bg-[#d3eaff] text-[#4259A6] p-2 rounded-md"
        >
          <FaPrint />
        </button>        
      </div>
    ),
    ignoreRowClick: true,
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
      .post("http://127.0.0.1:8000/api/create_result_uploaded/", postData, {
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

    await axios.put("http://127.0.0.1:8000/api/update_additional_fees/", updateData);
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

    const response = await axios.get(`http://127.0.0.1:8000/api/result_uploaded_view/?student_id=${studentId}`);
    
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
      `http://127.0.0.1:8000/api/update_result_uploaded/${selectedResult.id}/`,
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
    const response = await axios.get(`http://127.0.0.1:8000/api/get_paid_fees/?student_id=${studentId}`);
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
    <h1 className="font-bold text-3xl mb-4 text-center">List of Registered Students</h1>
    <DataTable
      columns={columns}
      data={students}
      customStyles={customTableStyles} // 🔥 Add this line
      pagination
      highlightOnHover
      striped
      responsive
      noDataComponent="No students found"
      expandableRows
      expandableRowExpanded={(row) => !!expandedRows[row.enrollment_id]}
      expandOnRowClicked={false}
      expandableIcon={false} // Removes default arrow icon
      expandableRowsComponent={({ data }) =>
        expandedRows[data.enrollment_id] ? (
          <div className="p-4 bg-gray-100 border border-gray-300 rounded-md">
            {/* Account Section */}
            <div className="mb-4">
              <p><strong>Account:</strong></p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => openFeesModal("Fees")} className="bg-[#d3eaff] px-4 py-2 text-[#4259A6] rounded mb-2 md:mb-0">Fees</button>
                <button onClick={() => openAddFeesModal(data.id)} className="bg-[#d3eaff] px-4 py-2 text-[#4259A6] rounded mb-2 md:mb-0">Additional Fees</button>
                <button onClick={() => openIDCardModal(data.id)} className="bg-[#d3eaff] px-4 py-2 text-[#4259A6] rounded mb-2 md:mb-0">ID Card</button>
                <button onClick={() => ResultUpload(data.id)} className="bg-[#d3eaff] px-4 py-2 text-[#4259A6] rounded mb-2 md:mb-0">Result Uploaded</button>
                <button onClick={() => openUniRegisterModal(data.id)} className="bg-[#d3eaff] px-4 py-2 text-[#4259A6] rounded mb-2 md:mb-0">University Re-Registration</button>
              </div>
            </div>

            {/* Extra Section */}
            <div className="mb-4">
              <p><strong>Extra:</strong></p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => openNewUniversityEnrollModal(data.id)} className="bg-[#d3eaff] px-4 py-2 text-[#4259A6] rounded mb-2 md:mb-0">New University Enrollment Number</button>
                <button onClick={() => openOldUniversityEnrollModal(data.id)} className="bg-[#d3eaff] px-4 py-2 text-[#4259A6] rounded mb-2 md:mb-0">Old University Enrollment Number</button>
                <button onClick={() => openModal("Send Reminder")} className="bg-[#d3eaff] px-4 py-2 text-[#4259A6] rounded mb-2 md:mb-0">Send Reminder</button>
                <button onClick={() => OpenUpdatePaymentModal(data.id)} className="bg-[#d3eaff] px-4 py-2 text-[#4259A6] rounded mb-2 md:mb-0">Update Payment</button>
              </div>
            </div>

            {/* Action Section */}
            <div className="mb-4">
              <p><strong>Action:</strong></p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => openEnrollModals(data.id)} className="bg-[#d3eaff] text-[#4259A6] px-4 py-2 rounded mb-2 md:mb-0">
                  Enroll To Next Semester / Year
                </button>
                <button onClick={() => openStudEnrollModal(data.id)} className="bg-[#d3eaff] text-[#4259A6] px-4 py-2 rounded mb-2 md:mb-0">Cancel Student Enrollment</button>
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
              src={`http://127.0.0.1:8000${studentData.university_logo}`}
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

    {/* Add Fee Modal */}
    {AddFeemodalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[700px]">
          <h2 className="text-lg font-bold mb-4">{selectedAddFeeAction}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <option key={num + 1} value={num + 1}>{num + 1}</option>
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
  </div>
);

};

export default StudentRegistrationViewPage;
