import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { baseURLAtom, userTypeAtom } from "../../recoil/atoms";
import { Sidebar } from "@/components/mycomponents/Sidebar"; // ✅ Updated import path

const Exam = () => {
  const navigate = useNavigate();
  const baseURL = useRecoilValue(baseURLAtom);
  const userType = useRecoilValue(userTypeAtom); // Get user type
  const [examDetails, setExamDetails] = useState([]);
  const [examinationData, setExaminationData] = useState([]);
  const [examStatus, setExamStatus] = useState({});
  const [submittedExams, setSubmittedExams] = useState({});
  const [canStartTest, setCanStartTest] = useState({}); // New state to track if test can be started
  const university_logo = localStorage.getItem("university_logo");
  const student_name = localStorage.getItem("student_name");

  useEffect(() => {
    const storedExamDetails = localStorage.getItem("examDetails");
    const storedExaminationData = localStorage.getItem("examinationData");

    if (storedExamDetails && storedExaminationData) {
      const examDetailsData = JSON.parse(storedExamDetails);
      const examinationDataData = JSON.parse(storedExaminationData);

      setExamDetails(examDetailsData);
      setExaminationData(examinationDataData);

      const updateExamStatus = () => {
        const now = new Date();
        const status = {};
        examDetailsData.forEach((exam) => {
          const startDateTime = new Date(`${exam.examstartdate}T${exam.examstarttime}`);
          const endDateTime = new Date(`${exam.examenddate || exam.examstartdate}T${exam.examendtime}`);
          
          // Log the start and end date and time
          console.log(`Exam ID: ${exam.exam_id}`);
          console.log(`Start DateTime: ${startDateTime}`);
          console.log(`End DateTime: ${endDateTime}`);
          
          status[exam.exam_id] = now >= startDateTime && now <= endDateTime;
        });
        setExamStatus(status);
      };

      updateExamStatus();
      const interval = setInterval(updateExamStatus, 60000);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    const storedSubmittedExams = {};
    examDetails.forEach((exam) => {
      const isSubmitted = localStorage.getItem(`submitted_exam_${exam.exam_id}`);
      if (isSubmitted === "true") {
        storedSubmittedExams[exam.exam_id] = true;
      }
    });
    setSubmittedExams(storedSubmittedExams);
  }, [examDetails]);

  // New function to check if result exists for the exam and student
  const checkIfCanStartTest = async (exam_id) => {
    const student_id = localStorage.getItem("student_id");

    try {
      const response = await axios.get(`${baseURL}api/check_exam_result/`, {
        params: {
          student_id: student_id,
          exam_id: exam_id,
        },
      });

      if (response.status === 200 && response.data.has_result) {
        setCanStartTest((prevState) => ({
          ...prevState,
          [exam_id]: false, // Don't allow starting the test if result exists
        }));
      } else {
        setCanStartTest((prevState) => ({
          ...prevState,
          [exam_id]: true, // Allow starting the test if result doesn't exist
        }));
      }
    } catch (error) {
      console.error("Error checking exam result:", error);
    }
  };

  // New function to check if the exam is active based on the current date and time
  const checkIfExamIsActive = (exam) => {
    const now = new Date();
    const startDateTime = new Date(`${exam.examstartdate}T${exam.examstarttime}`);
    const endDateTime = new Date(`${exam.examenddate}T${exam.examendtime}`);

    return now >= startDateTime && now <= endDateTime;
  };

  useEffect(() => {
    examDetails.forEach((exam) => {
      // Check if result exists and if the exam is active
      checkIfCanStartTest(exam.exam_id);
    });
  }, [examDetails]);


 const handleStartTest = async (examInfo) => {
  const university=localStorage.getItem('university_id')
  console.log("oidddddddd",university)
  try {
    const response = await axios.get(`${baseURL}api/filter-questions/`, {
      params: {
        examtype: examInfo.examtype,
        semyear: examInfo.semyear,
        subject: examInfo.subject_name,
        university:university

      },
    });

    if (response.status === 200) {
      localStorage.setItem("questions", JSON.stringify(response.data));

      const formattedTitle = `${examInfo.course_name} - ${examInfo.stream_name} - ${examInfo.substream_name} - ${examInfo.subject_name} - ${examInfo.studypattern} ${examInfo.semyear}`;
      localStorage.setItem("selected_exam_title", formattedTitle);

      navigate("/test");
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
};




  return (
    <div className="flex flex-column flex-lg-row">
      {/* Sidebar only for Student */}
      {userType === "Student" && <Sidebar isCollapsed={false} setIsCollapsed={() => {}} />}
      
      <div className="flex-1 min-h-screen flex flex-col items-center bg-gray-100 p-6">
        <div className="bg-white shadow-md rounded-lg p-8 w-full">
         
      <div className="header-container flex flex-col items-center mb-8 w-full">
        {/* Centered logo */}
        <div className="flex justify-center w-full mb-4">
          <img
            src={university_logo}
            alt="University Logo"
            className="max-h-24 object-contain"
            style={{ maxWidth: "300px", borderRadius: "50%" }}
          />
        </div>

        {/* Greeting with student name centered */}
        <div
          className="text-center font-semibold text-xl"
          style={{ color: "#1F2937", fontFamily: "'Poppins', sans-serif" }}
        >
          Hello, <span style={{ color: "#2563EB" }}>{student_name}</span>
        </div>
      </div>

      <h2
        className="text-4xl font-extrabold mb-8 text-left"
        style={{ color: "#111827", fontFamily: "'Montserrat', sans-serif" }}
      >
        Exam Guidelines
      </h2>
      <ul
        className="list-disc pl-8 mb-10"
        style={{
          color: "#374151",
          fontSize: "18px",
          lineHeight: "1.8",
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        <li>Test link will be active on the given date and time as informed.</li>
        <li>Test duration 120 minutes.</li>
        <li>You must finish your examination within the given time.</li>
        <li>The system shall automatically end the test after the cut-off time.</li>
        <li>Do not refresh the browser or logout during the examination.</li>
        <li>Ensure a stable internet connection before starting the examination.</li>
      </ul>

          {examDetails.length === 0 ? (
            <div className="text-center text-gray-600 text-lg font-semibold p-6">
              No available tests right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {examDetails.map((exam) => {
                const examInfo = examinationData.find((e) => e.id === exam.exam_id);
                const isActive = examStatus[exam.exam_id];
                const isAlreadySubmitted = submittedExams[exam.exam_id];
                const canStart = canStartTest[exam.exam_id] && checkIfExamIsActive(exam); // Check if exam is active and result doesn't exist
                // const formattedTitle = `${exam.stream_name} - ${exam.subject_name} - Semester ${exam.semyear}`;
                // localStorage.setItem("selected_exam_title", formattedTitle);
                return (
                  <div key={exam.exam_id} className="p-6 border rounded-lg shadow-md bg-white">
                    <h3 className="text-xl font-semibold text-blue-600">
                      {examInfo ? `${examInfo.course_name} - ${examInfo.stream_name} - ${examInfo.substream_name} - ${examInfo.subject_name} - ${examInfo.studypattern} ${examInfo.semyear}` : "Exam Details"}
                    </h3>
                    {/* <p className="text-gray-700 mt-1">
                      {examInfo ? `${examInfo.substream_name} | ${examInfo.studypattern} | Year ${examInfo.semyear}` : ""}
                    </p> */}
                    <p className="text-gray-600 mt-2">Exam ID: <span className="font-semibold">{exam.exam_id}</span></p>
                    <p className="text-gray-600">
                      Time: <span className="font-medium">{exam.examstartdate} {exam.examstarttime}</span> - 
                      <span className="font-medium">{exam.examenddate} {exam.examendtime}</span>
                    </p>

                    <button
                      onClick={() => handleStartTest(examInfo)}
                      disabled={!isActive || isAlreadySubmitted || !canStart}
                      className={`w-full py-2 rounded-lg transition-colors mt-4 shadow-sm 
                        ${!isActive || isAlreadySubmitted || !canStart ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-[#fd0001] text-white hover:bg-red-700"}`}
                    >
                      {isAlreadySubmitted || !canStart ? "Exam Given" : isActive ? "Start Test" : "Test Expired"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exam;
