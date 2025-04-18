// Full updated CourseListPage with working Bootstrap modals and responsive layout
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const CourseListPage = () => {
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [university, setUniversity] = useState("");
  const [file, setFile] = useState(null);
  const [formError, setFormErrors] = useState({});
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const baseURL = useRecoilValue(baseURLAtom);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [showCourseDeleteConfirmModal, setShowCourseDeleteConfirmModal] = useState(false);
  const [showCourseMessageModal, setShowCourseMessageModal] = useState(false);
  const [courseModalMessage, setCourseModalMessage] = useState("");

  useEffect(() => {
    const apiToken = localStorage.getItem("access");
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${baseURL}api/universities/`, {
          headers: { Authorization: `Bearer ${apiToken}` },
        });
        setUniversities(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      }
    };

    const fetchCoursesByUniversity = async () => {
      try {
        const response = await axios.get(`${baseURL}api/universities-courses/`, {
          headers: { Authorization: `Bearer ${apiToken}` },
        });
        setCourses(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      }
    };

    fetchUniversities();
    fetchCoursesByUniversity();
  }, [baseURL]);

  useEffect(() => {
    if (universities.length > 0 && Object.keys(courses).length > 0) {
      setLoading(false);
    }
  }, [universities, courses]);

  const validateForm = () => {
    const errors = {};
    if (!university.trim()) errors.university = "University is required.";
    if (!courseName.trim()) errors.courseName = "Course name is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const apiToken = localStorage.getItem("access");
    const formData = new FormData();
    formData.append("university_name", university);
    formData.append("name", courseName);
    if (file) formData.append("course_file", file);

    try {
      await axios.post(`${baseURL}api/create-courses/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${apiToken}`,
        },
      });
      const response = await axios.get(`${baseURL}api/universities-courses/`, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      setCourses(response.data);
      setCourseName("");
      setUniversity("");
      setFile(null);
      setSuccessMessage("Course added successfully!");
      setTimeout(() => setSuccessMessage(""), 10000);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  const openEditModal = (universityName, courseName) => {
    setSelectedUniversity(universityName);
    setSelectedCourses(courses[universityName].map(course => ({ ...course, isEditing: course.name === courseName })));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUniversity(null);
    setSelectedCourses([]);
  };

  const handleUpdateCourse = async (courseId, newName, newYear) => {
    if (!newName || !newYear) return;
    const apiToken = localStorage.getItem("access");
    try {
      await axios.put(`${baseURL}api/update-course/${courseId}/`, { name: newName, year: newYear }, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      const updatedCourses = await axios.get(`${baseURL}api/universities-courses/`, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      setCourses(updatedCourses.data);
      closeModal();
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  const openCourseDeleteConfirmModal = (courseId) => {
    setCourseToDelete(courseId);
    setShowCourseDeleteConfirmModal(true);
  };

  const cancelCourseDelete = () => {
    setCourseToDelete(null);
    setShowCourseDeleteConfirmModal(false);
  };

  const confirmDeleteCourse = async () => {
    setShowCourseDeleteConfirmModal(false);
    const apiToken = localStorage.getItem("access");
    try {
      const response = await axios.delete(`${baseURL}api/delete_course/${courseToDelete}/`, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      if (response.status === 204) {
        setCourseModalMessage("Course deleted successfully!");
        setSelectedCourses(prev => prev.filter(course => course.id !== courseToDelete));
        const updatedCourses = await axios.get(`${baseURL}api/universities-courses/`, {
          headers: { Authorization: `Bearer ${apiToken}` },
        });
        setCourses(updatedCourses.data);
      } else {
        setCourseModalMessage("Failed to delete course.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setCourseModalMessage(errorMsg);
    }
    setCourseToDelete(null);
    setShowCourseMessageModal(true);
  };

  const closeCourseMessageModal = () => {
    setCourseModalMessage("");
    setShowCourseMessageModal(false);
  };

  const filteredData = universities.filter(u => courses[u.university_name]?.length).map(u => ({
    university_name: u.university_name,
    courses: courses[u.university_name].map(c => c.name).join(", ")
  }));

  const columns = [
    { name: 'ID', selector: (row, index) => index + 1, sortable: true },
    { name: 'University', selector: row => row.university_name, sortable: true },
    {
      name: 'Courses',
      selector: row => row.courses,
      sortable: true,
      cell: row => (
        <div className="flex flex-wrap gap-2">
          {courses[row.university_name]?.map(course => (
            <button key={course.id} onClick={() => openEditModal(row.university_name, course.name)} className="btn btn-outline-primary btn-sm">
              {course.name}
            </button>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="container py-4">
      <h2 className="mb-4">Course Management</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="university" className="form-label">University *</label>
            <select id="university" className="form-select" value={university} onChange={(e) => setUniversity(e.target.value)}>
              <option value="">Select University</option>
              {universities.map(u => (
                <option key={u.id} value={u.university_name}>{u.university_name}</option>
              ))}
            </select>
            {formError.university && <div className="text-danger small">{formError.university}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="courseName" className="form-label">Course Name *</label>
            <input type="text" className="form-control" id="courseName" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
            {formError.courseName && <div className="text-danger small">{formError.courseName}</div>}
          </div>
        </div>
        <div className="row g-3 mt-3">
          <div className="col-md-6">
            <label htmlFor="file" className="form-label">Upload Course File</label>
            <input type="file" className="form-control" id="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <div className="col-md-6 d-flex align-items-end">
            <button type="submit" className="btn btn-danger w-100">Submit</button>
          </div>
        </div>
      </form>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <DataTable columns={columns} data={filteredData} pagination responsive highlightOnHover striped />

      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Courses for {selectedUniversity}</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {selectedCourses.map(course => (
                  <div key={course.id} className="mb-3">
                    <input type="text" className="form-control mb-2" value={course.name} onChange={(e) => setSelectedCourses(prev => prev.map(c => c.id === course.id ? { ...c, name: e.target.value } : c))} />
                    <input type="text" className="form-control mb-2" placeholder="Year" value={course.year || ''} onChange={(e) => setSelectedCourses(prev => prev.map(c => c.id === course.id ? { ...c, year: e.target.value } : c))} />
                    <button className="btn btn-success me-2" onClick={() => handleUpdateCourse(course.id, course.name, course.year)}>Update</button>
                    <button className="btn btn-danger" onClick={() => openCourseDeleteConfirmModal(course.id)}>Delete</button>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCourseDeleteConfirmModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
              </div>
              <div className="modal-body">Are you sure you want to delete this course?</div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cancelCourseDelete}>Cancel</button>
                <button className="btn btn-danger" onClick={confirmDeleteCourse}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCourseMessageModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">{courseModalMessage}</div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={closeCourseMessageModal}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseListPage;