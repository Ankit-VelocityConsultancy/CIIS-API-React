import { useState, useEffect } from "react";
import axios from "axios";
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const ChangeCoursePage = () => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedYearUniversity, setyearSelectedUniversity] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedYearCourse, setYearSelectedCourse] = useState("");
  const [streams, setStreams] = useState([]);
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedYearStream, setYearSelectedStream] = useState("");
  const [substreams, setSubstreams] = useState([]);
  const [selectedSubstream, setSelectedSubstream] = useState("");
  const [selectedYearSubstream, setYearSelectedSubstream] = useState("");
  const baseURL = useRecoilValue(baseURLAtom);

  const [feeData, setFeeData] = useState(
    Array.from({ length: 8 }, () => ({
      semester: "",
      tuitionFees: 0,
      examFees: 0,
      studyMaterialFees: 0,
      reSittingFees: 0,
      entranceFees: 0,
      additionalFees: 0,
      discount: 0,
      totalFees: 0,
    }))
  );

  const [isTableVisible, setIsTableVisible] = useState(false); // New state to manage table visibility

  const [yearfeeData, setyearFeeData] = useState(
    Array.from({ length: 4 }, () => ({
      year: "",
      tuitionFees: 0,
      examFees: 0,
      studyMaterialFees: 0,
      reSittingFees: 0,
      entranceFees: 0,
      additionalFees: 0,
      discount: 0,
      totalFees: 0,
    }))
  );

  const [isYearTableVisible, setIsYearTableVisible] = useState(false); // New state to manage table visibility

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${baseURL}api/universities/`,{
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        });
        setUniversities(response.data);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (selectedUniversity) {
      const fetchCourses = async () => {
        try {
          const response = await axios.get(
           `${baseURL}api/courses-with-id/?university_id=${selectedUniversity}`,{
            headers: {
              Authorization: `Bearer ${apiToken}`,
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


  useEffect(() => {
    if (selectedYearUniversity) {
      const fetchCourses = async () => {
        try {
          const response = await axios.get(
            `${baseURL}api/courses-with-id/?university_id=${selectedYearUniversity}`,{
              headers: {
                Authorization: `Bearer ${apiToken}`,
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
  }, [selectedYearUniversity]);


  useEffect(() => {
    if (selectedCourse && selectedUniversity) {
      const fetchStreams = async () => {
        try {
          const response = await axios.get(
            `${baseURL}api/streams-with-id/?course_id=${selectedCourse}&university_id=${selectedUniversity}`,{
              headers: {
                Authorization: `Bearer ${apiToken}`,
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


  useEffect(() => {
    if (selectedYearCourse && selectedYearUniversity) {
      const fetchStreams = async () => {
        try {
          const response = await axios.get(
            `${baseURL}api/streams-with-id/?course_id=${selectedYearCourse}&university_id=${selectedYearUniversity}`,{
              headers: {
                Authorization: `Bearer ${apiToken}`,
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
  }, [selectedYearCourse, selectedYearUniversity]);


  useEffect(() => {
    if (selectedStream && selectedCourse && selectedUniversity) {
      const fetchSubstreams = async () => {
        try {
          const response = await axios.get(
            `${baseURL}api/substreams-with-id/?course_id=${selectedCourse}&university_id=${selectedUniversity}&stream_id=${selectedStream}`,{
              headers: {
                Authorization: `Bearer ${apiToken}`,
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
    if (selectedYearStream && selectedYearCourse && selectedYearUniversity) {
      const fetchSubstreams = async () => {
        try {
          const response = await axios.get(
            `${baseURL}api/substreams-with-id/?course_id=${selectedYearCourse}&university_id=${selectedYearUniversity}&stream_id=${selectedYearStream}`,{
              headers: {
                Authorization: `Bearer ${apiToken}`,
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
  }, [selectedYearStream, selectedYearCourse, selectedYearUniversity]);




  // Fetch existing semester fees data when all selections are made
  useEffect(() => {
    if (selectedUniversity && selectedCourse && selectedStream && selectedSubstream) {
      setIsTableVisible(true); // Show table when all selections are made
      const fetchExistingFeeData = async () => {
        try {
          const response = await axios.get(
            `${baseURL}api/get-sem-fees/?stream_id=${selectedStream}&substream_id=${selectedSubstream}`,{
              headers: {
                Authorization: `Bearer ${apiToken}`,
              },
            }
          );

          const fetchedData = response.data;
          
          // Initialize feeData with zero values
          const updatedFeeData = Array.from({ length: 8 }, () => ({
            semester: "",
            tuitionFees: 0,
            examFees: 0,
            studyMaterialFees: 0,
            reSittingFees: 0,
            entranceFees: 0,
            additionalFees: 0,
            discount: 0,
            totalFees: 0,
          }));

          // Populate fee data based on response
          fetchedData.forEach((semesterData) => {
            const semIndex = parseInt(semesterData.sem) - 1;
            updatedFeeData[semIndex] = {
              semester: semesterData.sem,
              tuitionFees: parseFloat(semesterData.fees_details.tutionfees),
              examFees: parseFloat(semesterData.fees_details.examinationfees),
              studyMaterialFees: parseFloat(semesterData.fees_details.bookfees),
              reSittingFees: parseFloat(semesterData.fees_details.resittingfees),
              entranceFees: parseFloat(semesterData.fees_details.entrancefees),
              additionalFees: parseFloat(semesterData.fees_details.extrafees),
              discount: parseFloat(semesterData.fees_details.discount),
              totalFees: parseFloat(semesterData.fees_details.totalfees),
            };
          });

          setFeeData(updatedFeeData);
        } catch (error) {
          console.error("Error fetching existing semester fee data:", error);
        }
      };
      fetchExistingFeeData();
    } else {
      setIsTableVisible(false); // Hide table if any selection is missing
    }
  }, [selectedUniversity, selectedCourse, selectedStream, selectedSubstream]);




  // Fetch existing semester fees data when all selections are made
  useEffect(() => {
    if (selectedYearUniversity && selectedYearCourse && selectedYearStream && selectedYearSubstream) {
      setIsYearTableVisible(true); // Show table when all selections are made
      const fetchExistingYearFeeData = async () => {
        try {
          const response = await axios.get(
            `${baseURL}api/get-year-fees/?stream_id=${selectedYearStream}&substream_id=${selectedYearSubstream}`,{
              headers: {
                Authorization: `Bearer ${apiToken}`,
              },
            }
          );

          const fetchedYearData = response.data;
          console.log("Get Year Data",fetchedYearData);
          // Initialize feeData with zero values
          const updatedYearFeeData = Array.from({ length: 4 }, () => ({
            year: "",
            tuitionFees: 0,
            examFees: 0,
            studyMaterialFees: 0,
            reSittingFees: 0,
            entranceFees: 0,
            additionalFees: 0,
            discount: 0,
            totalFees: 0,
          }));

          // Populate fee data based on response
          fetchedYearData.forEach((yearData) => {
            const yearIndex = parseInt(yearData.year) - 1;
            updatedYearFeeData[yearIndex] = {
              year: yearData.year,
              tuitionFees: parseFloat(yearData.fees_details.tutionfees),
              examFees: parseFloat(yearData.fees_details.examinationfees),
              studyMaterialFees: parseFloat(yearData.fees_details.bookfees),
              reSittingFees: parseFloat(yearData.fees_details.resittingfees),
              entranceFees: parseFloat(yearData.fees_details.entrancefees),
              additionalFees: parseFloat(yearData.fees_details.extrafees),
              discount: parseFloat(yearData.fees_details.discount),
              totalFees: parseFloat(yearData.fees_details.totalfees),
            };
          });

          setyearFeeData(updatedYearFeeData);
        } catch (error) {
          console.error("Error fetching existing year fee data:", error);
        }
      };
      fetchExistingYearFeeData();
    } else {
      setIsYearTableVisible(false); // Hide table if any selection is missing
    }
  }, [selectedYearUniversity, selectedYearCourse, selectedYearStream, selectedYearSubstream]);




  const handleFeeInputChange = (index, field, value) => {
    const newFeeData = [...feeData];
    newFeeData[index][field] = value;

    // Recalculate the total fees for the current row
    if (field !== "discount") {
      newFeeData[index].totalFees = calculateTotalFees(newFeeData[index]);
    }

    setFeeData(newFeeData);
  };

  
  const handleYearFeeInputChange = (index, field, value) => {
    const newFeeData = [...yearfeeData];
    newFeeData[index][field] = value;

    // Recalculate the total fees for the current row
    if (field !== "discount") {
      newFeeData[index].totalFees = calculateTotalFees(newFeeData[index]);
    }

    setyearFeeData(newFeeData);
  };

  const calculateTotalFees = (rowData) => {
    const {
      tuitionFees,
      examFees,
      studyMaterialFees,
      reSittingFees,
      entranceFees,
      additionalFees,
    } = rowData;

    return (
      tuitionFees +
      examFees +
      studyMaterialFees +
      reSittingFees +
      entranceFees +
      additionalFees
    );
  };

  const apiToken = localStorage.getItem("access"); // Replace with your token source
  console.log("API Token=="+apiToken);

  const handleSave = async () => {
    if (!selectedUniversity || !selectedCourse || !selectedStream || !selectedSubstream) {
      alert("Please select a university, course, stream, and substream.");
      return;
    }

    // Filter out rows where all fee fields are zero or empty
    const semesterFeesData = feeData
      .map((row, index) => ({
        university_id: selectedUniversity,
        course_id: selectedCourse,
        stream_id: selectedStream,
        substream_id: selectedSubstream,
        sem: index + 1, // Semester number (1 to 8)
        tutionfees: row.tuitionFees,
        examinationfees: row.examFees,
        bookfees: row.studyMaterialFees,
        resittingfees: row.reSittingFees,
        entrancefees: row.entranceFees,
        extrafees: row.additionalFees,
        discount: row.discount,
      }))
      .filter(
        (row) =>
          row.tutionfees ||
          row.examinationfees ||
          row.bookfees ||
          row.resittingfees ||
          row.entrancefees ||
          row.extrafees ||
          row.discount
      ); // Only keep rows where at least one fee field has a value

    if (semesterFeesData.length === 0) {
      alert("Please add fee data for at least one semester.");
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}api/create-semester-fees/`,
        semesterFeesData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`, // Replace with your actual token
          },
        }
      );
      console.log("Data saved successfully:", response.data);
      alert("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving the data. Please try again.");
    }
  };


  const handleYearSave = async () => {
    if (!selectedYearUniversity || !selectedYearCourse || !selectedYearStream || !selectedYearSubstream) {
      alert("Please select a university, course, stream, and substream.");
      return;
    }

    // Filter out rows where all fee fields are zero or empty
    const yearFeesData = yearfeeData
      .map((row, index) => ({
        university_id: selectedYearUniversity,
        course_id: selectedYearCourse,
        stream_id: selectedYearStream,
        substream_id: selectedYearSubstream,
        year: index + 1, // year number (1 to 8)
        tutionfees: row.tuitionFees,
        examinationfees: row.examFees,
        bookfees: row.studyMaterialFees,
        resittingfees: row.reSittingFees,
        entrancefees: row.entranceFees,
        extrafees: row.additionalFees,
        discount: row.discount,
      }))
      .filter(
        (row) =>
          row.tutionfees ||
          row.examinationfees ||
          row.bookfees ||
          row.resittingfees ||
          row.entrancefees ||
          row.extrafees ||
          row.discount
      ); // Only keep rows where at least one fee field has a value

    if (yearFeesData.length === 0) {
      alert("Please add fee data for at least one semester.");
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}api/create-year-fees/`,
        yearFeesData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`, // Replace with your actual token
          },
        }
      );
      console.log("Data saved successfully:", response.data);
      alert("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving the data. Please try again.");
    }
  };

  const handleCalculateDiscount = (index) => {
    const updatedFeeData = [...feeData];
    const row = updatedFeeData[index];

    const totalWithoutDiscount = calculateTotalFees(row);
    const discountAmount = row.discount || 0;
    const totalWithDiscount = totalWithoutDiscount - discountAmount;

    updatedFeeData[index].totalFees = totalWithDiscount;
    setFeeData(updatedFeeData);
  };

  const handleYearCalculateDiscount = (index) => {
    const updatedYearFeeData = [...yearfeeData];
    const row = updatedYearFeeData[index];

    const totalWithoutDiscount = calculateTotalFees(row);
    const discountAmount = row.discount || 0;
    const totalWithDiscount = totalWithoutDiscount - discountAmount;

    updatedYearFeeData[index].totalFees = totalWithDiscount;
    setyearFeeData(updatedYearFeeData);
  };

  return (
    <>
    <div className="change-course-page">
      <h1 className="font-bold text-2xl mb-4">SEMESTER FEES</h1>

      <div className="m-4 p-4 border rounded-lg shadow-md">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="university" className="block text-sm font-medium text-gray-700">
              University
            </label>
            <select
              id="university"
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select University</option>
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.university_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="course" className="block text-sm font-medium text-gray-700">
              Course
            </label>
            <select
              id="course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
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

          <div className="flex-1">
            <label htmlFor="stream" className="block text-sm font-medium text-gray-700">
              Stream
            </label>
            <select
              id="stream"
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              disabled={!selectedCourse}
            >
              <option value="">Select Stream</option>
              {streams.map((stream) => (
                <option key={stream.stream_id} value={stream.stream_id}>
                  {stream.stream_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="substream" className="block text-sm font-medium text-gray-700">
              Substream
            </label>
            <select
              id="substream"
              value={selectedSubstream}
              onChange={(e) => setSelectedSubstream(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              disabled={!selectedStream}
            >
              <option value="">Select Substream</option>
              {substreams.map((substream) => (
                <option key={substream.substream_id} value={substream.substream_id}>
                  {substream.substream_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Conditionally Render Table */}
      {isTableVisible && (
        <form>
         <table className="min-w-full table-auto mt-6 border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="p-2 border border-gray-300">Semester</th>
                <th className="p-2 border border-gray-300">Tuition Fees</th>
                <th className="p-2 border border-gray-300">Examination Fees</th>
                <th className="p-2 border border-gray-300">Book Fees</th>
                <th className="p-2 border border-gray-300">Resitting Fees</th>
                <th className="p-2 border border-gray-300">Entrance Fees</th>
                <th className="p-2 border border-gray-300">Additional Fees</th>
                <th className="p-2 border border-gray-300">Discount</th>
                <th className="p-2 border border-gray-300">Total Fees</th>
                <th className="p-2 border border-gray-300">Calculate Discount</th>
              </tr>
            </thead>
            <tbody>
              {feeData.map((row, index) => (
                <tr key={index} className="border-t border-b border-gray-300">
                  <td className="p-2 border border-gray-300">
                    <p className="w-[40px] h-[40px] flex items-center justify-center bg-[#eaa637] text-white rounded-full">
                      {index + 1}
                    </p>
                  </td>

                  <td className="p-2 border border-gray-300">
                    <input
                      type="number"
                      value={row.tuitionFees}
                      onChange={(e) =>
                        handleFeeInputChange(index, "tuitionFees", parseFloat(e.target.value))
                      }
                      className="p-2 border w-full bg-gray-100 rounded"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="number"
                      value={row.examFees}
                      onChange={(e) =>
                        handleFeeInputChange(index, "examFees", parseFloat(e.target.value))
                      }
                      className="p-2 border w-full bg-gray-100 rounded"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="number"
                      value={row.studyMaterialFees}
                      onChange={(e) =>
                        handleFeeInputChange(index, "studyMaterialFees", parseFloat(e.target.value))
                      }
                      className="p-2 border w-full bg-gray-100 rounded"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="number"
                      value={row.reSittingFees}
                      onChange={(e) =>
                        handleFeeInputChange(index, "reSittingFees", parseFloat(e.target.value))
                      }
                      className="p-2 border w-full bg-gray-100 rounded"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="number"
                      value={row.entranceFees}
                      onChange={(e) =>
                        handleFeeInputChange(index, "entranceFees", parseFloat(e.target.value))
                      }
                      className="p-2 border w-full bg-gray-100 rounded"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="number"
                      value={row.additionalFees}
                      onChange={(e) =>
                        handleFeeInputChange(index, "additionalFees", parseFloat(e.target.value))
                      }
                      className="p-2 border w-full bg-gray-100 rounded"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="number"
                      value={row.discount}
                      onChange={(e) =>
                        handleFeeInputChange(index, "discount", parseFloat(e.target.value))
                      }
                      className="p-2 border w-full bg-gray-100 rounded"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">{row.totalFees}</td>
                  <td className="p-2 border border-gray-300">
                    <button
                      type="button"
                      onClick={() => handleCalculateDiscount(index)}
                      className="bg-[#dd3751] text-white text-14 p-1 rounded"
                    >
                      Calculate Discount
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="button"
            onClick={handleSave}
            className="mt-4 text-white p-2 rounded bg-[#dd3751]"
          >
            Save Data
          </button>
        </form>
      )}
    </div>


    <div className="change-course-page">
    <h1 className="font-bold text-2xl mb-4">YEAR FEES</h1>

    <div className="m-4 p-4 border rounded-lg shadow-md">
      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="university" className="block text-sm font-medium text-gray-700">
            University
          </label>
          <select
            id="university"
            value={selectedYearUniversity}
            onChange={(e) => setyearSelectedUniversity(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Select University</option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.university_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="course" className="block text-sm font-medium text-gray-700">
            Course
          </label>
          <select
            id="course"
            value={selectedYearCourse}
            onChange={(e) => setYearSelectedCourse(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            disabled={!selectedYearUniversity}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.course_id} value={course.course_id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="stream" className="block text-sm font-medium text-gray-700">
            Stream
          </label>
          <select
            id="stream"
            value={selectedYearStream}
            onChange={(e) => setYearSelectedStream(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            disabled={!selectedYearCourse}
          >
            <option value="">Select Stream</option>
            {streams.map((stream) => (
              <option key={stream.stream_id} value={stream.stream_id}>
                {stream.stream_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="substream" className="block text-sm font-medium text-gray-700">
            Substream
          </label>
          <select
            id="substream"
            value={selectedYearSubstream}
            onChange={(e) => setYearSelectedSubstream(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            disabled={!selectedYearStream}
          >
            <option value="">Select Substream</option>
            {substreams.map((substream) => (
              <option key={substream.substream_id} value={substream.substream_id}>
                {substream.substream_name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>

    {/* Conditionally Render Table */}
    {isYearTableVisible && (
      <form>
      <table className="min-w-full table-auto mt-6 border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="p-2 border border-gray-300">Year</th>
              <th className="p-2 border border-gray-300">Tuition Fees</th>
              <th className="p-2 border border-gray-300">Examination Fees</th>
              <th className="p-2 border border-gray-300">Book Fees</th>
              <th className="p-2 border border-gray-300">Resitting Fees</th>
              <th className="p-2 border border-gray-300">Entrance Fees</th>
              <th className="p-2 border border-gray-300">Additional Fees</th>
              <th className="p-2 border border-gray-300">Discount</th>
              <th className="p-2 border border-gray-300">Total Fees</th>
              <th className="p-2 border border-gray-300">Calculate Discount</th>
            </tr>
          </thead>
          <tbody>
            {yearfeeData.map((row, index) => (
              <tr key={index} className="border-t border-b border-gray-300">
                <td className="p-2 border border-gray-300">
                  <p className="w-[40px] h-[40px] flex items-center justify-center bg-[#eaa637] text-white rounded-full">
                    {index + 1}
                  </p>
                </td>

                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    value={row.tuitionFees}
                    onChange={(e) =>
                      handleYearFeeInputChange(index, "tuitionFees", parseFloat(e.target.value))
                    }
                    className="p-2 border w-full bg-gray-100 rounded"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    value={row.examFees}
                    onChange={(e) =>
                      handleYearFeeInputChange(index, "examFees", parseFloat(e.target.value))
                    }
                    className="p-2 border w-full bg-gray-100 rounded"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    value={row.studyMaterialFees}
                    onChange={(e) =>
                      handleYearFeeInputChange(index, "studyMaterialFees", parseFloat(e.target.value))
                    }
                    className="p-2 border w-full bg-gray-100 rounded"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    value={row.reSittingFees}
                    onChange={(e) =>
                      handleYearFeeInputChange(index, "reSittingFees", parseFloat(e.target.value))
                    }
                    className="p-2 border w-full bg-gray-100 rounded"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    value={row.entranceFees}
                    onChange={(e) =>
                      handleYearFeeInputChange(index, "entranceFees", parseFloat(e.target.value))
                    }
                    className="p-2 border w-full bg-gray-100 rounded"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    value={row.additionalFees}
                    onChange={(e) =>
                      handleYearFeeInputChange(index, "additionalFees", parseFloat(e.target.value))
                    }
                    className="p-2 border w-full bg-gray-100 rounded"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    value={row.discount}
                    onChange={(e) =>
                      handleYearFeeInputChange(index, "discount", parseFloat(e.target.value))
                    }
                    className="p-2 border w-full bg-gray-100 rounded"
                  />
                </td>
                <td className="p-2 border border-gray-300">{row.totalFees}</td>
                <td className="p-2 border border-gray-300">
                  <button
                    type="button"
                    onClick={() => handleYearCalculateDiscount(index)}
                    className="bg-[#dd3751] text-white text-14 p-1 rounded"
                  >
                    Calculate Discount
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          onClick={handleYearSave}
          className="mt-4 text-white p-2 rounded bg-[#dd3751]"
        >
          Save Data
        </button>
      </form>
    )}
    </div>
    </>
  );
};

export default ChangeCoursePage;
