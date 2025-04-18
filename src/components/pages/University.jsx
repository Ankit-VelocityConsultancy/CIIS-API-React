import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { z } from "zod";
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const UniversityListPage = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [universityName, setUniversityName] = useState("");
  const [universityAddress, setUniversityAddress] = useState("");
  const [universityCity, setUniversityCity] = useState("");
  const [universityState, setUniversityState] = useState("");
  const [universityPincode, setUniversityPincode] = useState("");
  const [file, setFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [currentUniversity, setCurrentUniversity] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const baseURL = useRecoilValue(baseURLAtom);
  const apiToken = localStorage.getItem("access");
  const [universityToDelete, setUniversityToDelete] = useState(null);
  const [showUniversityDeleteConfirmModal, setShowUniversityDeleteConfirmModal] = useState(false);
  const [showUniversityMessageModal, setShowUniversityMessageModal] = useState(false);
  const [universityModalMessage, setUniversityModalMessage] = useState("");

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${baseURL}api/universities/`, {
          headers: { Authorization: `Bearer ${apiToken}` },
        });
        setUniversities(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, [baseURL, apiToken]);

  if (loading) return <div>Loading universities...</div>;
  if (error) return <div className="text-red-500">{JSON.stringify(error)}</div>;

  const universitySchema = z.object({
    universityName: z.string().min(3, "University Name is required."),
    universityAddress: z.string().min(5, "University Address is required."),
    universityCity: z.string().optional(),
    universityState: z.string().optional(),
    universityPincode: z.string().optional(),
  });

  const validateForm = (data) => {
    const result = universitySchema.safeParse(data);
    if (result.success) {
      setFormErrors({});
      return true;
    } else {
      const errors = {};
      for (const key in result.error.format()) {
        if (key !== "_errors") {
          errors[key] = result.error.format()[key]?._errors?.[0];
        }
      }
      setFormErrors(errors);
      return false;
    }
  };

  const handleFileChange = (e) => setFile(Array.from(e.target.files));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { universityName, universityAddress, universityCity, universityState, universityPincode };
    if (!validateForm(data)) return;

    const formData = new FormData();
    formData.append("university_name", universityName);
    formData.append("university_address", universityAddress);
    formData.append("university_city", universityCity);
    formData.append("university_state", universityState);
    formData.append("university_pincode", universityPincode);
    if (file?.length) file.forEach(f => formData.append("university_logo", f));

    try {
      const url = editMode
        ? `${baseURL}api/universities/${currentUniversity.id}/`
        : `${baseURL}api/universities/`;

      const method = editMode ? axios.put : axios.post;
      const response = await method(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${apiToken}`,
        },
      });

      const updatedList = editMode
        ? universities.map(u => (u.id === currentUniversity.id ? response.data : u))
        : [...universities, response.data];
      setUniversities(updatedList);
      setEditMode(false);
      setCurrentUniversity(null);
      setUniversityName("");
      setUniversityAddress("");
      setUniversityCity("");
      setUniversityState("");
      setUniversityPincode("");
      setFile(null);
      setFormErrors({});
      setSuccessMessage("University added successfully!");
      setTimeout(() => setSuccessMessage(""), 10000);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (uni) => {
    setUniversityName(uni.university_name);
    setUniversityAddress(uni.university_address);
    setUniversityCity(uni.university_city);
    setUniversityState(uni.university_state);
    setUniversityPincode(uni.university_pincode);
    setFile(null);
    setEditMode(true);
    setFormErrors({});
    setCurrentUniversity(uni);
  };

  const openUniversityDeleteConfirmModal = (row) => {
    setFormErrors({});
    setUniversityToDelete(row);
    setShowUniversityDeleteConfirmModal(true);
  };

  const cancelUniversityDelete = () => {
    setUniversityToDelete(null);
    setShowUniversityDeleteConfirmModal(false);
  };

  const confirmDeleteUniversity = async () => {
    setShowUniversityDeleteConfirmModal(false);
    try {
      const response = await axios.delete(`${baseURL}api/delete_university/${universityToDelete.id}/`, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });

      if (response.status === 204 || response.status === 200) {
        setUniversities(prev => prev.filter(uni => uni.id !== universityToDelete.id));
        setUniversityModalMessage("University deleted successfully!");
      } else {
        setUniversityModalMessage("Failed to delete university.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setUniversityModalMessage(errorMsg);
    }
    setUniversityToDelete(null);
    setShowUniversityMessageModal(true);
  };

  const columns = [
    { name: "ID", selector: row => row.id, sortable: true },
    { name: "Name", selector: row => row.university_name, sortable: true },
    { name: "Registration ID", selector: row => row.registrationID, sortable: true },
    {
      name: "Actions",
      cell: row => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row)} className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
            Edit
          </button>
          <button onClick={() => openUniversityDeleteConfirmModal(row)} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">University List</h1>

      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: "universityName", label: "University Name", value: universityName, setter: setUniversityName },
            { id: "universityAddress", label: "University Address", value: universityAddress, setter: setUniversityAddress },
            { id: "universityCity", label: "University City", value: universityCity, setter: setUniversityCity },
            { id: "universityState", label: "University State", value: universityState, setter: setUniversityState },
            { id: "universityPincode", label: "University Pincode", value: universityPincode, setter: setUniversityPincode },
          ].map(({ id, label, value, setter }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type="text"
                id={id}
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
              />
              {formErrors[id] && <p className="text-xs text-red-500">{formErrors[id]}</p>}
            </div>
          ))}

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">University Logo</label>
            <input type="file" id="file" onChange={handleFileChange} accept="image/*" className="mt-1 p-2 w-full border rounded-md" />
          </div>
        </div>
        <button type="submit" className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700">
          {editMode ? "Update University" : "Add University"}
        </button>
        {successMessage && <div className="text-green-600 font-medium mt-2">{successMessage}</div>}
      </form>

      <DataTable columns={columns} data={universities} pagination highlightOnHover />

      {showUniversityDeleteConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <p className="mb-4 font-semibold">Are you sure you want to delete this university?</p>
            <div className="flex justify-end gap-2">
              <button onClick={cancelUniversityDelete} className="bg-gray-500 text-white px-4 py-1 rounded">Cancel</button>
              <button onClick={confirmDeleteUniversity} className="bg-red-600 text-white px-4 py-1 rounded">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {showUniversityMessageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <p className="mb-4 font-semibold">{universityModalMessage}</p>
            <div className="flex justify-end">
              <button onClick={() => setShowUniversityMessageModal(false)} className="bg-blue-600 text-white px-4 py-1 rounded">OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityListPage;
