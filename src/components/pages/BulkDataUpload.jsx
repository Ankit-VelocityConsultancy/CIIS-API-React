import { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const BulkdataUpload = () => {
    const [universities, setUniversities] = useState([]);
    const [university, setUniversity] = useState("");
    const [studentFile, setStudentFile] = useState(null); // State for student file
    const [examFile, setExamFile] = useState(null); // State for exam file
    const [successMessage, setSuccessMessage] = useState(""); // State for success message
    const [errorMessage, setErrorMessage] = useState(""); // State for error message
    const [successMessagee, setSuccessMessagee] = useState(""); // State for success message (student)
    const [errorMessagee, setErrorMessagee] = useState(""); // State for error message (student)
    const baseURL = useRecoilValue(baseURLAtom);

    const apiToken = localStorage.getItem("access");

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await axios.get(`${baseURL}api/universities/`, {
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                    },
                });
                setUniversities(response.data);
            } catch (error) {
                console.error("Error fetching universities:", error);
                setErrorMessage(error.response ? error.response.data : error.message); // Show error if fetching universities fails
            }
        };

        fetchUniversities();
    }, []);

    // Handle student data form submission
    const handleStudentSubmit = async (event) => {
        event.preventDefault();

        if (!studentFile) {
            alert("Please select a file for the student upload.");
            return;
        }

        const formData = new FormData();
        formData.append("upload_file", studentFile);

        try {
            const response = await axios.post(`${baseURL}api/bulk-student-upload/`, formData, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            // Check if there are any errors in the response
            if (response.data.errors && response.data.errors.length > 0) {
                // Separate duplicate entry errors from other errors
                const duplicateErrors = response.data.errors
                    .filter(error => error.includes('Duplicate entry'))  // Only include duplicate entry errors
                    .map(error => error.split('"')[1]); // Extract the email from the error message

                const otherErrors = response.data.errors
                    .filter(error => !error.includes('Duplicate entry')) // For non-duplicate errors

                // Set errors to be displayed
                if (duplicateErrors.length > 0) {
                    setErrorMessagee(duplicateErrors.join("<br />")); // Display duplicate errors
                } else {
                    setErrorMessagee(otherErrors.join("<br />")); // Display other errors
                }

                setTimeout(() => {
                    setErrorMessagee(""); // Reset the error message after 10 seconds
                }, 10000);
            } else {
                // Handle success
                const successMessages = response.data.success.join(", "); // Combine success messages into one string
                setSuccessMessagee(successMessages); // Set the success message
                setErrorMessage(""); // Reset error message if upload is successful
                setTimeout(() => {
                    setSuccessMessagee(""); // Reset the success message after 10 seconds
                }, 10000);
            }

            console.log("Student data uploaded successfully:", response.data);
        } catch (error) {
            console.error("Error uploading student data:", error);
            setErrorMessagee(error.response ? error.response.data.message : error.message); // Show error message
            setTimeout(() => {
                setErrorMessagee(""); // Reset the error message after 10 seconds
            }, 10000);
        }
    };

    // Handle exam data form submission
    const handleExamSubmit = async (event) => {
        event.preventDefault();

        if (!university || !examFile) {
            alert("Please select a university and upload the course file.");
            return;
        }

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

            // Handle the success or error message for the exam data
            if (response.data.status === "success") {
                setSuccessMessage(response.data.message); // Show success message
                setErrorMessage(""); // Reset error message if upload is successful
                setTimeout(() => {
                    setSuccessMessage(""); // Reset the success message after 10 seconds
                }, 10000);
            } else {
                setErrorMessage(response.data.message); // Show error message
                setTimeout(() => {
                    setErrorMessage(""); // Reset the error message after 10 seconds
                }, 10000);
            }

            console.log("Exam data uploaded successfully:", response.data);
        } catch (error) {
            console.error("Error uploading exam data:", error);
            setErrorMessage(error.response ? error.response.data.message : error.message); // Show error message
            setTimeout(() => {
                setErrorMessage(""); // Reset the error message after 10 seconds
            }, 10000);
        }
    };

    return (
        <div className="Bulk-page">
            {/* Student Data Form */}
            <form onSubmit={handleStudentSubmit} className="m-4 p-4 border rounded-lg shadow-md">
                <h1 className="font-bold text-2xl mb-4">Upload Bulk Student Data</h1>
                <div className="flex">
                    <div className="flex-1">
                        <label htmlFor="studentFile" className="block text-sm font-medium p-2 text-gray-700">
                            Upload Student Data File (Excel)
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            id="studentFile"
                            onChange={(e) => setStudentFile(e.target.files[0])}
                            className="mt-1 p-2 block w-[90%] border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex-1 items-end p-10">
                        <button
                            type="submit"
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-[#167fc7]"
                        >
                            Save
                        </button>
                    </div>
                </div>
                {/* Show success message if no error */}
                {successMessagee && !errorMessagee && <div className="m-4 text-[#167fc7]">{successMessagee}</div>}
                {/* Show error message with line breaks */}
                {errorMessagee && !successMessagee && <div className="m-4 text-[#d24845]" dangerouslySetInnerHTML={{ __html: errorMessagee }} />}
            </form>

            {/* Exam Data Form */}
            <form onSubmit={handleExamSubmit} className="m-4 p-4 border rounded-lg shadow-md">
                <h1 className="font-bold text-2xl mb-4">Upload Bulk Exam Data</h1>
                <div className="flex">
                    <div className="flex-1">
                        <label htmlFor="university" className="block text-sm font-medium p-2 text-gray-700">
                            University
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="university"
                            value={university}
                            onChange={(e) => setUniversity(e.target.value)}
                            className="mt-1 p-2 block w-[95%] border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                        <label htmlFor="examFile" className="block text-sm p-2 font-medium text-gray-700">
                            Upload Exam Data File (Excel)
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            id="examFile"
                            onChange={(e) => setExamFile(e.target.files[0])}
                            className="mt-1 p-2 block w-[95%] border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-[#167fc7]"
                        >
                            Save
                        </button>
                    </div>
                </div>
                {/* Show success message */}
                {successMessage && !errorMessage && <div className="m-4 text-[#167fc7]">{successMessage}</div>}
                {/* Show error message */}
                {errorMessage && !successMessage && <div className="m-4 text-[#d24845]">{errorMessage}</div>}
            </form>
        </div>
    );
};

export default BulkdataUpload;
