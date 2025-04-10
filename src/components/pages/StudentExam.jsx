import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { baseURLAtom } from "../../recoil/atoms";

const Exam = () => {
  const navigate = useNavigate();
  const baseURL = useRecoilValue(baseURLAtom);
  const [examDetails, setExamDetails] = useState([]);
  const [examinationData, setExaminationData] = useState([]);
  const [examStatus, setExamStatus] = useState({});
  const [submittedExams, setSubmittedExams] = useState({});

  useEffect(() => {
    // Retrieve stored data from localStorage
    const storedExamDetails = localStorage.getItem("examDetails");
    const storedExaminationData = localStorage.getItem("examinationData");

    if (storedExamDetails && storedExaminationData) {
      const examDetailsData = JSON.parse(storedExamDetails);
      const examinationDataData = JSON.parse(storedExaminationData);

      setExamDetails(examDetailsData);
      setExaminationData(examinationDataData);

      // Function to update exam status
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

      // Initial check
      updateExamStatus();

      // Update status every 1 minute
      const interval = setInterval(updateExamStatus, 60000);

      return () => clearInterval(interval);
    }
  }, []);

  // Check submitted exams from localStorage
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

  const handleStartTest = async (exam) => {
    try {
      const response = await axios.get(`${baseURL}api/filter-questions/`, {
        params: {
          examtype: "THEORY",
          semyear: exam.semyear,
          subject: exam.subject_name,
        },
      });

      if (response.status === 200) {
        localStorage.setItem("questions", JSON.stringify(response.data));
        navigate("/test");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-full w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Exam Guidelines</h2>
        <ul className="list-disc pl-6 mb-8 text-gray-700">
          <li>Test link will be active on the given date and time as informed.</li>
          <li>Test duration 120 minutes.</li>
          <li>You must finish your examination within the given time.</li>
          <li>This is a time-bounded examination and the system shall automatically end the test after the cut-off time.</li>
          <li>Please do not refresh the browser or logout during the examination.</li>
          <li>Make sure you have a stable internet connection and a charged device before starting the examination.</li>
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

              return (
                <div key={exam.exam_id} className="p-6 border rounded-lg shadow-md bg-white">
                  <h3 className="text-xl font-semibold text-blue-600">
                    {examInfo ? `${examInfo.course_name} - ${examInfo.substream_name}` : "Exam Details"}
                  </h3>
                  <p className="text-gray-700 mt-1">
                    {examInfo ? `${examInfo.subject_name} | ${examInfo.studypattern} | Year ${examInfo.semyear}` : ""}
                  </p>
                  <p className="text-gray-600 mt-2">Exam ID: <span className="font-semibold">{exam.exam_id}</span></p>
                  <p className="text-gray-600">
                    Time: <span className="font-medium">{exam.examstartdate} {exam.examstarttime}</span> - 
                    <span className="font-medium">{exam.examenddate} {exam.examendtime}</span>
                  </p>

                  <button
                    onClick={() => handleStartTest(examInfo)}
                    disabled={!isActive || isAlreadySubmitted}
                    className={`w-full py-2 rounded-lg transition-colors mt-4 shadow-sm 
                      ${!isActive || isAlreadySubmitted ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-[#fd0001] text-white hover:bg-red-700"}`}
                  >
                    {isAlreadySubmitted ? "Test Already Submitted" : isActive ? "Start Test" : "Test Expired"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exam;
