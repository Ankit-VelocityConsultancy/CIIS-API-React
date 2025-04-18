// Updated SubStream management UI with working stream click
import { useEffect, useState } from "react";
import axios from "axios";
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const StreamListPage = () => {
  const [streams, setStreams] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [coursesByUniversity, setCoursesByUniversity] = useState({});
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [stream, setStream] = useState("");
  const [streamName, setStreamName] = useState("");
  const [modalStreams, setModalStreams] = useState([]);
  const [modalUniversity, setModalUniversity] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [updatedSubstreams, setUpdatedSubstreams] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);
  const [formError, setFormErrors] = useState({});
  const baseURL = useRecoilValue(baseURLAtom);
  const apiToken = localStorage.getItem("access");

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${baseURL}api/universities/`, {
          headers: { Authorization: `Bearer ${apiToken}` },
        });
        setUniversities(response.data);
      } catch (err) {
        setError("Error fetching universities.");
      }
    };
    fetchUniversities();
  }, [baseURL, apiToken]);

  useEffect(() => {
    universities.forEach((uni) => fetchCoursesForUniversity(uni.university_name));
  }, [universities]);

  const fetchCoursesForUniversity = async (universityName) => {
    try {
      const response = await axios.get(`${baseURL}api/courses/`, {
        params: { university: universityName },
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      setCoursesByUniversity((prev) => ({ ...prev, [universityName]: response.data.courses }));
    } catch (err) {
      setError("Error fetching courses.");
    }
  };

  const fetchStreamsForCourse = async (courseName, universityName) => {
    try {
      const response = await axios.get(`${baseURL}api/streams/`, {
        params: { course: courseName, university: universityName },
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      setStreams(response.data.streams);
      setModalStreams(response.data.streams);
      setModalUniversity(universityName);
      setError(null);
    } catch (err) {
      setError("Error fetching streams.");
    }
  };

  const fetchSubstreams = async (streamName, courseName, universityName) => {
    try {
      const response = await axios.get(`${baseURL}api/substreams-withid/`, {
        params: { stream: streamName, course: courseName, university: universityName },
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      return response.data;
    } catch (err) {
      return [];
    }
  };

  const handleCourseClick = (course, university) => {
    setSelectedCourse(course);
    setShowModal(true);
    fetchStreamsForCourse(course, university);
  };

  const handleStreamClick = async (stream) => {
    const substreams = await fetchSubstreams(stream.stream_name, selectedCourse, modalUniversity);
    setSelectedStream({ ...stream, substreams });
    setUpdatedSubstreams(substreams);
    setShowStreamModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUniversity || !selectedCourse || !stream || !streamName) {
      setFormErrors({ message: "All fields are required." });
      return;
    }
    try {
      await axios.post(`${baseURL}api/create-substream/`, {
        university_name: selectedUniversity,
        course_name: selectedCourse,
        stream_name: stream,
        substream_name: streamName,
      }, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      setSuccessMessage("SubStream added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setStreamName("");
      fetchStreamsForCourse(selectedCourse, selectedUniversity);
    } catch (err) {
      setError("Error creating substream.");
    }
  };

  const handleSubstreamChange = (id, newName) => {
    setUpdatedSubstreams((prev) => prev.map((s) => (s.id === id ? { ...s, name: newName } : s)));
  };

  const updateSubstreams = async () => {
    try {
      const payload = updatedSubstreams.map((s) => ({ id: s.id, name: s.name }));
      await axios.put(`${baseURL}api/update-substreams/${selectedStream.stream_id}/`, payload, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      alert("Substreams updated successfully.");
      setShowStreamModal(false);
    } catch (err) {
      alert("Error updating substreams.");
    }
  };

  const deleteSubstream = async (substreamId) => {
    try {
      const response = await axios.delete(`${baseURL}api/delete_substream/${substreamId}/`, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });
  
      if (response.status === 204) {
        setUpdatedSubstreams((prev) => prev.filter((s) => s.id !== substreamId));
        alert("Substream deleted successfully.");
      } else if (response.data?.message) {
        alert(response.data.message);
      }
    } catch (err) {
      alert("Failed to delete substream.");
    }
  };
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sub Stream List</h1>

      <form onSubmit={handleSubmit} className="grid gap-4 mb-6 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-sm font-medium mb-1">University</label>
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select university</option>
            {universities.map((u) => (
              <option key={u.id} value={u.university_name}>{u.university_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              fetchStreamsForCourse(e.target.value, selectedUniversity);
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">Select course</option>
            {coursesByUniversity[selectedUniversity]?.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stream</label>
          <select
            value={stream}
            onChange={(e) => setStream(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select stream</option>
            {streams.map((s) => (
              <option key={s.stream_id} value={s.stream_name}>{s.stream_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Substream</label>
          <input
            type="text"
            value={streamName}
            onChange={(e) => setStreamName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter substream name"
          />
        </div>

        <div className="self-end">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Substream
          </button>
        </div>
      </form>

      {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {universities.map((uni, idx) => (
          <div key={idx} className="border p-4 rounded shadow">
            <h2 className="font-semibold mb-2">{uni.university_name}</h2>
            <div className="flex flex-wrap gap-2">
              {coursesByUniversity[uni.university_name]?.map((course, i) => (
                <button
                  key={i}
                  onClick={() => handleCourseClick(course, uni.university_name)}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                >
                  {course}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Streams for {selectedCourse}</h3>
            {modalStreams.map((stream) => (
              <p
                key={stream.stream_id}
                className="text-blue-600 cursor-pointer mb-2"
                onClick={() => handleStreamClick(stream)}
              >
                {stream.stream_name}
              </p>
            ))}
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showStreamModal && selectedStream && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
            <h3 className="text-lg font-bold mb-4">Edit Substreams for {selectedStream.stream_name}</h3>
            {updatedSubstreams.map((sub) => (
              <div key={sub.id} className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded"
                  value={sub.name}
                  onChange={(e) => handleSubstreamChange(sub.id, e.target.value)}
                />
                <button
                  onClick={() => deleteSubstream(sub.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowStreamModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={updateSubstreams}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamListPage;
