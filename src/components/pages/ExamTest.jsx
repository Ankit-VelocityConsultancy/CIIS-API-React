import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseURLAtom, showLogoutModalAtom } from "../../recoil/atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExamTest = () => {
  const navigate = useNavigate();
  const baseURL = useRecoilValue(baseURLAtom);
  const [showLogoutModal, setShowLogoutModal] = useRecoilState(showLogoutModalAtom);

  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examDetails, setExamDetails] = useState({ name: "" });
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);

  // Helper to set currentStep and persist it
  const setStep = (step) => {
    setCurrentStep(step);
    localStorage.setItem("currentStep", step.toString());
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      const storedQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
      setQuestions(storedQuestions);

      const storedExamId = localStorage.getItem("selected_exam_id");
      if (storedExamId) setSelectedExamId(parseInt(storedExamId));
      const studentId = localStorage.getItem("student_id");

      // Sync answers from backend
      if (studentId && storedExamId) {
        try {
          const response = await fetch(
            `${baseURL}api/sync_answers/?student_id=${studentId}&exam_id=${storedExamId}`
          );
          const data = await response.json();
          if (data.answers) {
            setAnswers(data.answers);
            localStorage.setItem("answers", JSON.stringify(data.answers));
          }
        } catch (err) {
          console.error("Failed to sync answers:", err);
          // fallback to localStorage answers on failure
          const storedAnswers = JSON.parse(localStorage.getItem("answers") || "{}");
          setAnswers(storedAnswers);
        }
      } else {
        const storedAnswers = JSON.parse(localStorage.getItem("answers") || "{}");
        setAnswers(storedAnswers);
      }

      // Sync currentStep using last answered question from login exam_progress
      const examProgressAll = JSON.parse(localStorage.getItem("exam_progress") || "[]");

      let startStep = 0;
      if (examProgressAll.length > 0 && storedExamId) {
        const progressForThisExam = examProgressAll.find(
          (e) => e.exam_id === parseInt(storedExamId)
        );

        if (progressForThisExam) {
          const lastAnsweredId = progressForThisExam.last_answered_question_id;
          if (lastAnsweredId != null) {
            const lastIndex = storedQuestions.findIndex(
              (q) => Number(q.id) === Number(lastAnsweredId)
            );
            if (lastIndex !== -1) {
              startStep = lastIndex + 1;
              if (startStep >= storedQuestions.length) {
                startStep = storedQuestions.length - 1;
              }
            }
          }
        }
      }

      // If user has a saved step in localStorage (maybe partial attempt), prioritize it
      const savedStep = parseInt(localStorage.getItem("currentStep"), 10);
      if (!isNaN(savedStep)) {
        setCurrentStep(savedStep);
      } else {
        setCurrentStep(startStep);
        localStorage.setItem("currentStep", startStep.toString());
      }

      // Load exam details
      const examinationData = JSON.parse(localStorage.getItem("examinationData") || "[]");
      if (examinationData.length > 0 && storedExamId) {
        const examData = examinationData.find(
          (e) => e.exam_id === parseInt(storedExamId) || e.id === parseInt(storedExamId)
        );
        const savedTitle = localStorage.getItem("selected_exam_title") || "";
        const parts = savedTitle.split(" - ");
        const filteredParts = parts.filter(p => p && p.trim() !== "");
        const displayName = filteredParts.join(" - ");
        setExamDetails({ name: displayName });
      }

      // Timer with elapsed time correction
      if (storedQuestions.length > 0 && storedQuestions[0].exam) {
        const examIdToUse = storedExamId ? parseInt(storedExamId) : storedQuestions[0].exam;

        const savedTimeLeft = parseInt(localStorage.getItem("exam_time_left"));
        const savedTimestamp = parseInt(localStorage.getItem("exam_time_saved_at"));
        const now = Date.now();

        if (savedTimeLeft && savedTimestamp) {
          const elapsed = now - savedTimestamp;
          const adjustedTimeLeft = savedTimeLeft - elapsed;
          if (adjustedTimeLeft > 0) {
            setTimeLeft(adjustedTimeLeft);
            return;
          }
        }

        try {
          const response = await fetch(`${baseURL}api/get_exam_timer/?student_id=${studentId}&exam_id=${examIdToUse}`);
          const data = await response.json();
          const apiTimeLeft = parseInt(data.time_left_ms);
          setTimeLeft(apiTimeLeft > 0 ? apiTimeLeft : storedQuestions[0].examduration * 60000);
        } catch {
          setTimeLeft(storedQuestions[0].examduration * 60000);
        }
      }
    };

    fetchQuestions();

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      setShowLeaveModal(true);
      return (e.returnValue = "Are you sure you want to leave this exam?");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [baseURL]);

  const handleLeaveExam = () => {
    setShowLeaveModal(false);
    localStorage.removeItem("exam_time_left");
    localStorage.removeItem("exam_time_saved_at");
    localStorage.removeItem("answers");
    localStorage.removeItem("currentStep");
    localStorage.removeItem("selected_exam_id");
    navigate("/exam");
  };

  const handleStayOnPage = () => {
    setShowLeaveModal(false);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("student_id");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("selected_exam_id");
    localStorage.removeItem("answers");
    localStorage.removeItem("currentStep");
    localStorage.removeItem("exam_time_left");
    localStorage.removeItem("exam_time_saved_at");
    localStorage.removeItem("exam_progress");
    setShowLogoutModal(false);
    navigate("/login");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
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
      localStorage.removeItem("selected_exam_id");
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
          const examIdToUse = selectedExamId || questions[0]?.exam;
          if (studentId && examIdToUse) {
            fetch(`${baseURL}api/save_exam_timer/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ student_id: studentId, exam_id: examIdToUse, time_left_ms: updated }),
            });
          }
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, questions, selectedExamId, baseURL]);

  const handleAnswerChange = (questionId, optionValue) => {
    const updatedAnswers = { ...answers, [questionId]: optionValue };
    setAnswers(updatedAnswers);
    localStorage.setItem("answers", JSON.stringify(updatedAnswers));
  };

  const saveSingleAnswer = async (questionId) => {
    const submitted_answer = answers[questionId] || "NA";
    const studentId = localStorage.getItem("student_id");
    const examIdToUse = localStorage.getItem("selected_exam_id")
      ? parseInt(localStorage.getItem("selected_exam_id"))
      : questions[0]?.exam;

    if (!submitted_answer || !studentId || !examIdToUse || !questionId) return;

    try {
      await fetch(`${baseURL}api/save_single_answers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          exam_id: examIdToUse,
          question_id: questionId,
          submitted_answer,
          time_left_ms: timeLeft,
        }),
      });

      setStep(currentStep + 1);
    } catch (err) {
      console.error("Error saving single answer", err);
      toast.error("Error saving answer. Please try again.");
    }
  };

  const saveResultAfterExam = async () => {
    const studentId = localStorage.getItem("student_id");
    const examIdToUse = selectedExamId || questions[0]?.exam;
    if (!studentId || !examIdToUse) return;

    try {
      await fetch(`${baseURL}api/save_result_after_exam/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, exam_id: examIdToUse }),
      });

      localStorage.removeItem("exam_time_left");
      localStorage.removeItem("exam_time_saved_at");
      localStorage.removeItem("selected_exam_id");
      localStorage.removeItem("answers");
      localStorage.removeItem("currentStep");
      localStorage.removeItem("exam_progress");

      setExamSubmitted(true);
    } catch (error) {
      toast.error("An error occurred while saving your results.");
    }
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

  if (questions.length === 0 || timeLeft === null) return <div>Loading questions...</div>;

  if (examSubmitted) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md text-center max-w-md">
          <h2 className="text-xl font-semibold mb-4">The Examination has been submitted successfully for</h2>
          <h4 className="text-md text-gray-700 mb-2">{examDetails.name}</h4>
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

        {currentStep < questions.length && (
          <div>
            <p className="font-semibold">
              Question {currentStep + 1} of {questions.length}
            </p>
            <p className="mb-2">{questions[currentStep].question}</p>
            {["option1", "option2", "option3", "option4"].map(
              (opt, i) =>
                questions[currentStep][opt] && (
                  <div key={i} className="mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`question-${questions[currentStep].id}`}
                        value={`option ${i + 1}`}
                        checked={answers[questions[currentStep].id] === `option ${i + 1}`}
                        onChange={() => handleAnswerChange(questions[currentStep].id, `option ${i + 1}`)}
                        className="mr-2 accent-red-600"
                      />
                      {questions[currentStep][opt]}
                    </label>
                  </div>
                )
            )}
          </div>
        )}

        {currentStep === questions.length && (
          <div className="text-center mt-8">
            <h3 className="text-xl font-semibold mb-4">Submit Exam</h3>
            <button onClick={saveResultAfterExam} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
              Submit
            </button>
          </div>
        )}

        <div className="flex justify-between flex-wrap gap-2 mt-6">
          <button onClick={() => navigate("/exam")} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700">
            Dashboard
          </button>

          {currentStep > 0 && (
            <button onClick={() => setStep(currentStep - 1)} className="bg-gray-500 text-white px-6 py-2 rounded-lg">
              Previous
            </button>
          )}

          {currentStep < questions.length && (
            <button
              onClick={() => saveSingleAnswer(questions[currentStep].id)}
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
          {questions.map((_, index) => {
            const qid = questions[index]?.id;
            const answer = answers[qid];
            const isAttempted =
              answer === "option 1" ||
              answer === "option 2" ||
              answer === "option 3" ||
              answer === "option 4";

            return (
              <button
                key={index}
                className={`py-2 rounded-full text-lg ${
                  isAttempted ? "bg-green-500 text-white" : "bg-gray-300"
                }`}
                onClick={() => setStep(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

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
