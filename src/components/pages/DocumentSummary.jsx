import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";  // For modal to view images

Modal.setAppElement("#root");  // Important for accessibility

const DocumentSummary = () => {
  const { enrollment_id } = useParams();  // Get the student enrollment_id from the URL
  const [studentData, setStudentData] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // Fetch student documents and details based on enrollment_id
    const fetchStudentDocuments = async () => {
      try {
        const apiToken = localStorage.getItem("access");
        const response = await axios.get(
          `http://localhost:8000/api/document-management/${enrollment_id}/`,
          { headers: { Authorization: `Bearer ${apiToken}` } }
        );
        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching student documents:", error);
      }
    };

    fetchStudentDocuments();
  }, [enrollment_id]);

  const handleViewDocument = (docUrl) => {
    setImageUrl(docUrl);  // Set the document URL for modal view
    setModalIsOpen(true);  // Open the modal
  };

  const closeModal = () => {
    setModalIsOpen(false);  // Close the modal
  };

  return (
    <div className="document-summary-page">
      <h1 className="font-bold text-3xl mb-4 text-center">
        DOCUMENTS SUMMARY INFORMATION
      </h1>

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-red-200 text-center">
            <th className="border border-gray-300 p-2">Document Type</th>
            <th className="border border-gray-300 p-2">View/Replace</th>
          </tr>
        </thead>
        <tbody>
          {studentData ? (
            studentData.qualifications &&
            Object.keys(studentData.qualifications).map((docType, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 p-2">{docType}</td>
                <td className="border border-gray-300 p-2">
                  {studentData.qualifications[docType] ? (
                    <button
                      onClick={() =>
                        handleViewDocument(studentData.qualifications[docType])
                      }
                      className="text-blue-600 underline"
                    >
                      View
                    </button>
                  ) : (
                    "No Document Uploaded"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center p-4">
                Loading...
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for viewing the document */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="View Document"
      >
        <div className="modal-content">
          <img
            src={`http://localhost:8000${imageUrl}`}
            alt="Document"
            className="w-full h-auto max-w-lg mx-auto"
          />
          <button
            onClick={closeModal}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentSummary;
