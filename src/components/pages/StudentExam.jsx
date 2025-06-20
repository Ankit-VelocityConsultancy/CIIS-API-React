import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { baseURLAtom, userTypeAtom } from "../../recoil/atoms";
import { Sidebar } from "@/components/mycomponents/Sidebar";

const Exam = () => {
  const navigate = useNavigate();
  const baseURL = useRecoilValue(baseURLAtom);
  const userType = useRecoilValue(userTypeAtom);
  const [examDetails, setExamDetails] = useState([]);
  const [examinationData, setExaminationData] = useState([]);
  const [examStatus, setExamStatus] = useState({});
  const [submittedExams, setSubmittedExams] = useState({});
  const [canStartTest, setCanStartTest] = useState({});
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
    const storedExamDetails = localStorage.getItem("examDetails");
    const resultDataString = localStorage.getItem("result_data");
    const currentStudentId = localStorage.getItem("student_id");

    if (storedExamDetails && resultDataString && currentStudentId) {
      const examDetailsData = JSON.parse(storedExamDetails);
      const resultData = JSON.parse(resultDataString);

      // Create a map: key => `${exam_id}_${examdetails_id}`, value => true if exam given
      const examsGivenMap = {};

      examDetailsData.forEach((exam) => {
        const key = `${exam.exam_id}_${exam.id}`; // id is examDetails.id
        const given = resultData.some(
          (res) =>
            res.student_id == currentStudentId &&
            res.exam_id == exam.exam_id &&
            res.examdetails_id == exam.id
        );
        examsGivenMap[key] = given;
      });

      setSubmittedExams(examsGivenMap);
    }
  }, []);

const checkIfCanStartTest = async (exam_id) => {
  const student_id = localStorage.getItem("student_id");

  const examDetailsString = localStorage.getItem("examDetails");
  let exam_details_id = null;

  if (examDetailsString) {
    try {
      const examDetailsArr = JSON.parse(examDetailsString);
      const now = new Date();

      // Filter all examDetails with the exam_id
      const matchedExamDetails = examDetailsArr.filter(ed => Number(ed.exam_id) === Number(exam_id));

      // Find currently active examDetail if any
      const activeExamDetail = matchedExamDetails.find(ed => {
        const start = new Date(ed.examstartdate);
        const end = new Date(ed.examenddate);
        return now >= start && now <= end;
      });

      if (activeExamDetail) {
        exam_details_id = activeExamDetail.id;
      } else if (matchedExamDetails.length > 0) {
        // fallback to highest id
        exam_details_id = matchedExamDetails.reduce((maxId, ed) => (ed.id > maxId ? ed.id : maxId), matchedExamDetails[0].id);
      }
    } catch (error) {
      console.error("Failed to parse examDetails from localStorage:", error);
    }
  }

  console.log("student_id:", student_id);
  console.log("exam_id:", exam_id);
  console.log("exam_details_id:", exam_details_id);

  try {
    const response = await axios.get(`${baseURL}api/check_exam_result/`, {
      params: { student_id, exam_id, examdetails_id: exam_details_id },
    });

    if (response.status === 200 && response.data.has_result) {
      setCanStartTest((prev) => ({ ...prev, [exam_id]: false }));
    } else {
      setCanStartTest((prev) => ({ ...prev, [exam_id]: true }));
    }
  } catch (error) {
    console.error("Error checking exam result:", error);
  }
};


  const checkIfExamIsActive = (exam) => {
    const now = new Date();
    const startDateTime = new Date(`${exam.examstartdate}T${exam.examstarttime}`);
    const endDateTime = new Date(`${exam.examenddate}T${exam.examendtime}`);
    return now >= startDateTime && now <= endDateTime;
  };

  useEffect(() => {
    examDetails.forEach((exam) => {
      checkIfCanStartTest(exam.exam_id);
    });
  }, [examDetails]);

  // Updated handleStartTest to accept examDetailsId and save it to localStorage
  const handleStartTest = async (examInfo, exam_id, examDetailsId) => {
    const university = localStorage.getItem("university_id");

    try {
      // Save the examDetailsId to localStorage
      localStorage.setItem("exam_details_id", examDetailsId);

      const response = await axios.get(`${baseURL}api/filter-questions/`, {
        params: {
          exam_id
        },
      });

      if (response.status === 200) {
        localStorage.setItem("questions", JSON.stringify(response.data));

        const formattedTitle = `${examInfo.course_name} - ${examInfo.stream_name} - ${examInfo.subject_name} - ${examInfo.studypattern} ${examInfo.semyear}`;
        localStorage.setItem("selected_exam_title", formattedTitle);

        // Save the selected exam id explicitly
        localStorage.setItem("selected_exam_id", exam_id);

        navigate("/test");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  return (
    <div className="flex flex-column flex-lg-row">
      {userType === "Student" && <Sidebar isCollapsed={false} setIsCollapsed={() => {}} />}

      <div className="flex-1 min-h-screen flex flex-col items-center bg-gray-100 p-6">
        <div className="bg-white shadow-md rounded-lg p-8 w-full">
          <div className="header-container flex flex-col items-center mb-8 w-full">
            <div className="flex justify-center w-full mb-4">
              {/* Uncomment if you want to show university logo */}
              {/* <img
                src={university_logo}
                alt="University Logo"
                className="max-h-24 object-contain"
                style={{ maxWidth: "300px", borderRadius: "50%" }}
              /> */}
            </div>

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
              {examDetails
                .filter((exam) => {
                  const now = new Date();
                  const endDateTime = new Date(`${exam.examenddate}T${exam.examendtime}`);
                  return endDateTime >= now;
                })
                .map((exam) => {
                  const examInfo = examinationData.find((e) => e.id === exam.exam_id);
                  const isActive = examStatus[exam.exam_id];
                  const key = `${exam.exam_id}_${exam.id}`;
                  const isAlreadySubmitted = submittedExams[key] || false;
                  const canStart = canStartTest[exam.exam_id] && checkIfExamIsActive(exam);

                  return (
                    <div
                      key={`${exam.exam_id}_${exam.id}`}
                      className="p-6 border rounded-lg shadow-md bg-white"
                    >
                      <h3 className="text-xl font-semibold text-blue-600">
                        {examInfo
                          ? [
                              examInfo.course_name,
                              examInfo.stream_name,
                              examInfo.substream_name,
                              examInfo.subject_name,
                              `${examInfo.studypattern || ""} ${examInfo.semyear || ""}`.trim(),
                            ]
                              .filter((val) => val && val.trim() !== "")
                              .join(" - ")
                          : "Exam Details"}
                      </h3>
                      <p className="text-gray-600 mt-2">
                        Exam ID: <span className="font-semibold">{exam.exam_id}</span>
                      </p>
                      <p className="text-gray-600">
                        Time:{" "}
                        <span className="font-medium">
                          {exam.examstartdate} {exam.examstarttime}
                        </span>{" "}
                        -{" "}
                        <span className="font-medium">
                          {exam.examenddate} {exam.examendtime}
                        </span>
                      </p>

                      <button
                        onClick={() => handleStartTest(examInfo, exam.exam_id, exam.id)}
                        disabled={!isActive || isAlreadySubmitted}
                        className={`w-full py-2 rounded-lg transition-colors mt-4 shadow-sm ${
                          !isActive || isAlreadySubmitted
                            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                            : "bg-[#fd0001] text-white hover:bg-red-700"
                        }`}
                      >
                        {isAlreadySubmitted ? "Exam Given" : isActive ? "Start Test" : "Test Expired"}
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
