import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showLogoutModalAtom } from "../../recoil/atoms";
import { useRecoilState } from "recoil";


const ExamTest = () => {
  const navigate = useNavigate();
  const baseURL = useRecoilValue(baseURLAtom);

  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examDetails, setExamDetails] = useState({ name: "", semester: "", subject: "", studyPattern: "" });
  const [showLeaveModal, setShowLeaveModal] = useState(false); // New state for the modal visibility
  // const [showLogoutModal, setShowLogoutModal] = useState(false); // Modal visibility for logout confirmation
  const [showLogoutModal, setShowLogoutModal] = useRecoilState(showLogoutModalAtom);
  
  useEffect(() => {
    const fetchQuestions = async () => {
      const storedQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
      const studentId = localStorage.getItem("student_id");
      setQuestions(storedQuestions);

      // Retrieve exam details from local storage
      const examinationData = JSON.parse(localStorage.getItem("examinationData") || "[]");

      if (examinationData.length > 0) {
        const examData = examinationData[0]; // Assuming we are working with the first record for simplicity
        setExamDetails({
          name: `${examData.course_name} - ${examData.stream_name}`,
          semester: `Semester ${examData.semyear}`,
          subject: examData.subject_name,
          studyPattern: examData.studypattern
        });
      }

      if (storedQuestions.length > 0 && storedQuestions[0].exam) {
        const examId = storedQuestions[0].exam;

        try {
          const response = await fetch(`${baseURL}api/get_exam_timer/?student_id=${studentId}&exam_id=${examId}`);
          const data = await response.json();
          const restoredTime = parseInt(data.time_left_ms);
          setTimeLeft(restoredTime > 0 ? restoredTime : storedQuestions[0].examduration * 60000);
        } catch {
          setTimeLeft(storedQuestions[0].examduration * 60000);
        }
      }
    };

    fetchQuestions();

    // Handle page unload (refresh/close)
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      setShowLeaveModal(true);
      return (e.returnValue = "Are you sure you want to leave this exam?");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleLeaveExam = () => {
    setShowLeaveModal(false);
    localStorage.removeItem("exam_time_left");
    localStorage.removeItem("exam_time_saved_at");
    navigate("/exam"); // Navigate to the exam page
  };

  const handleStayOnPage = () => {
    setShowLeaveModal(false); // Close the modal and stay on the page
  };

  const handleLogout = () => {
    setShowLogoutModal(true); // Show logout confirmation modal
  };

  const handleConfirmLogout = () => {
    // Perform the logout logic (clear session or tokens, etc.)
    localStorage.removeItem("student_id");
    localStorage.removeItem("accessToken");
    // Add your logOut() logic here (if needed)
    navigate("/login"); // Navigate to login page after logout
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false); // Close the logout confirmation modal
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      localStorage.removeItem("exam_time_left");
      localStorage.removeItem("exam_time_saved_at");
      navigate("/exam");
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = Math.max(prev - 1000, 0);
        localStorage.setItem("exam_time_left", updated.toString());
        localStorage.setItem("exam_time_saved_at", Date.now().toString());

        if (updated % 10000 < 1000) {
          const studentId = localStorage.getItem("student_id");
          const examId = questions[0]?.exam;
          if (studentId && examId) {
            fetch(`${baseURL}api/save_exam_timer/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ student_id: studentId, exam_id: examId, time_left_ms: updated }),
            });
          }
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, questions]);

  const saveSingleAnswer = async (questionId) => {
    const submitted_answer = answers[questionId] || "NA";
    const studentId = localStorage.getItem("student_id");
    const examId = questions[0]?.exam;

    if (!submitted_answer || !studentId || !examId || !questionId) return;

    try {
      await fetch(`${baseURL}api/save_single_answers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, exam_id: examId, question_id: questionId, submitted_answer }),
      });
    } catch (err) {
      console.error("Error saving single answer", err);
    }
  };

  const saveResultAfterExam = async () => {
    const studentId = localStorage.getItem("student_id");
    const examId = questions[0]?.exam;
    if (!studentId || !examId) return;

    try {
      await fetch(`${baseURL}api/save_result_after_exam/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, exam_id: examId }),
      });

      // Clear timer from local storage
      localStorage.removeItem("exam_time_left");
      localStorage.removeItem("exam_time_saved_at");

      setExamSubmitted(true);
    } catch (error) {
      toast.error("An error occurred while saving your results.");
    }
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

  if (questions.length === 0 || timeLeft === null) return <div>Loading questions...</div>;

  // ✅ Final submit screen
  if (examSubmitted) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md text-center max-w-md">
          <h2 className="text-xl font-semibold mb-4">The Examination has been submitted successfully for</h2>
          <h3 className="text-lg font-bold text-gray-800 mb-2">{examDetails.subject}</h3>
          <h4 className="text-md text-gray-700 mb-2">{examDetails.name}</h4>
          <h5 className="text-md text-gray-700 mb-6">{examDetails.semester}</h5>
          <button onClick={() => navigate("/exam")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 p-4">
      <div className="w-full lg:w-3/4 bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-[#fd0001]">Exam Test</h2>

        <div className="flex justify-center gap-2 md:!gap-4 mb-8">
          <TimeBox label="Hours" value={hours} />
          <TimeBox label="Minutes" value={minutes} />
          <TimeBox label="Seconds" value={seconds} pulse />
        </div>

        {/* Question Panel */}
        {currentStep < questions.length && (
          <div>
            <p className="font-semibold">Question {currentStep + 1} of {questions.length}</p>
            <p className="mb-2">{questions[currentStep].question}</p>
            {["option1", "option2", "option3", "option4"].map((opt, i) =>
              questions[currentStep][opt] && (
                <div key={i} className="mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`question-${questions[currentStep].id}`}
                      value={`option ${i + 1}`}
                      checked={answers[questions[currentStep].id] === `option ${i + 1}`}
                      onChange={() =>
                        setAnswers({ ...answers, [questions[currentStep].id]: `option ${i + 1}` })
                      }
                      className="mr-2 accent-red-600"
                    />
                    {questions[currentStep][opt]}
                  </label>
                </div>
              )
            )}
          </div>
        )}

        {/* Submit screen */}
        {currentStep === questions.length && (
          <div className="text-center mt-8">
            <h3 className="text-xl font-semibold mb-4">Submit Exam</h3>
            <button
              onClick={saveResultAfterExam}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        )}

        <div className="flex justify-between flex-wrap gap-2 mt-6">
          <button onClick={() => navigate("/exam")} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700">Previous</button>

          {currentStep > 0 && (
            <button onClick={() => setCurrentStep(currentStep - 1)} className="bg-gray-500 text-white px-6 py-2 rounded-lg">Back</button>
          )}

          {currentStep < questions.length && (
            <button
              onClick={async () => {
                await saveSingleAnswer(questions[currentStep].id);
                setCurrentStep((prev) => prev + 1);
              }}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              {currentStep === questions.length - 1 ? "Next" : "Next"}
            </button>
          )}
        </div>
      </div>

      <div className="lg:w-1/4 bg-gray-200 p-4">
        <h2 className="text-2xl font-bold mb-4">Questions</h2>
        <div className="grid grid-cols-4 gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`py-2 rounded-full text-lg ${answers[questions[index]?.id] ? "bg-green-500 text-white" : "bg-gray-300"}`}
              onClick={() => setCurrentStep(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modal for before unload */}
      {showLeaveModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs">
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to leave this exam?</h2>
            <div className="flex gap-4">
              <button onClick={handleLeaveExam} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                Leave Exam
              </button>
              <button onClick={handleStayOnPage} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Stay on Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs">
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to log out?</h2>
            <div className="flex gap-4">
              <button
                onClick={handleConfirmLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Log Out
              </button>
              <button
                onClick={handleCancelLogout}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Stay on Page
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
    </div>
  );
};

const TimeBox = ({ value, label, pulse }) => (
  <div className={`bg-green-500 text-white p-2 md:!p-4 rounded-lg shadow-lg text-center ${pulse ? "animate-pulse" : ""}`}>
    <p className="text-2xl md:!text-3xl font-bold">{value}</p>
    <span className="text-sm md:!text-lg">{label}</span>
  </div>
);

export default ExamTest;
