import { useState, useEffect, useRef} from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const BulkdataUpload = () => {
  const [universities, setUniversities] = useState([]);
  const [university, setUniversity] = useState("");
  const [studentFile, setStudentFile] = useState(null);
  const [examFile, setExamFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessagee, setSuccessMessagee] = useState("");
  const [errorMessagee, setErrorMessagee] = useState("");
  const baseURL = useRecoilValue(baseURLAtom);
  const apiToken = localStorage.getItem("access");
  const examFileRef = useRef(null);
  const studentFileRef = useRef(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${baseURL}api/universities/`, {
          headers: { Authorization: `Bearer ${apiToken}` },
        });
        setUniversities(response.data);
      } catch (error) {
        console.error("Error fetching universities:", error);
        setErrorMessage(error.message);
      }
    };
    fetchUniversities();
  }, []);

  const handleStudentSubmit = async (event) => {
    event.preventDefault();
    if (!studentFile) return alert("Please select a file to upload.");
    const formData = new FormData();
    formData.append("upload_file", studentFile);

    try {
      const response = await axios.post(`${baseURL}api/bulk-student-upload/`, formData, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.errors?.length) {
        const formattedErrors = response.data.errors.join("<br />");
        setErrorMessagee(formattedErrors);
      } else {
        setErrorMessagee("");
      }

      if (response.data.success?.length) {
        const formattedSuccess = response.data.success.join("<br />");
        setSuccessMessagee(formattedSuccess);
      } else {
        setSuccessMessagee("");
      }
      setStudentFile(null);
      if (studentFileRef.current) studentFileRef.current.value = "";
      setTimeout(() => {
        setSuccessMessagee("");
        setErrorMessagee("");
      }, 10000);
    } catch (error) {
      setErrorMessagee(error.message);
      setSuccessMessagee("");
      setTimeout(() => setErrorMessagee(""), 10000);
    }
  };

  const handleExamSubmit = async (event) => {
    event.preventDefault();
    if (!university || !examFile) return alert("Select university and upload a file.");

    const formData = new FormData();
    formData.append("university", university);
    formData.append("file", examFile);

    try {
      const response = await axios.post(`${baseURL}api/exams-bulk-upload/`, formData, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success") {
        const { message, success_logs = [], error_logs = [] } = response.data;

        let formattedSuccess = [message, ...success_logs].join("<br/>");
        let formattedErrors = error_logs.join("<br/>");

        setSuccessMessage(formattedSuccess);
        setErrorMessage(formattedErrors);
        setUniversity("");
        setExamFile(null);
        if (examFileRef.current) examFileRef.current.value = "";
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 10000);
     
      } else {
        setErrorMessage(response.data.message);
        setTimeout(() => setErrorMessage(""), 10000);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 10000);
    }
  };

  return (
    <div className="Bulk-page px-4 py-4 text-[15px]">
      {/* Student Upload */}
      <form onSubmit={handleStudentSubmit} className="mb-8 p-4 border rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-xl">Upload Bulk Student Data</h1>
          <a
            href="/templates/BulkStudentUploadTemplate.xlsx"
            download="student-template.xlsx"
            className="text-red-500 text-sm underline hover:text-red-700"
          >
            DOWNLOAD TEMPLATE
          </a>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="studentFile" className="block font-medium text-gray-700 mb-1">
              Upload File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="studentFile"
              ref={studentFileRef}
              onChange={(e) => setStudentFile(e.target.files[0])}
              className="p-2 block w-full border border-gray-300 rounded-md bg-[#f9f9f9]"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Save
            </button>
          </div>
        </div>

        {errorMessagee && (
          <div
            className="mt-4 p-4 bg-red-600 text-white rounded whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: errorMessagee }}
          />
        )}
        {successMessagee && (
          <div
            className="mt-4 p-4 bg-green-600 text-white rounded whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: successMessagee }}
          />
        )}
      </form>

      {/* Exam Upload */}
      <form onSubmit={handleExamSubmit} className="p-4 border rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-xl">Upload Bulk Exam Data</h1>
          <a
            href="/templates/BulkExamDataUploadTemplate.xlsx"
            download="exam-template.xlsx"
            className="text-red-500 text-sm underline hover:text-red-700"
          >
            DOWNLOAD TEMPLATE
          </a>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="university" className="block font-medium text-gray-700 mb-1">
              University <span className="text-red-500">*</span>
            </label>
            <select
              id="university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="p-2 block w-full border border-gray-300 rounded-md bg-[#f9f9f9]"
            >
              <option value="">Select University</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.university_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="examFile" className="block font-medium text-gray-700 mb-1">
              Upload File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="examFile"
              ref={examFileRef} 
              onChange={(e) => setExamFile(e.target.files[0])}
              className="p-2 block w-full border border-gray-300 rounded-md bg-[#f9f9f9]"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Save
            </button>
          </div>
        </div>

        {errorMessage && (
          <div
            className="mt-4 p-4 bg-red-600 text-white rounded whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: errorMessage }}
          />
        )}
        {successMessage && (
          <div
            className="mt-4 p-4 bg-green-600 text-white rounded whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: successMessage }}
          />
        )}
      </form>
    </div>
  );
};

export default BulkdataUpload;
