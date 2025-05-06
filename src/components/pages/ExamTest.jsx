import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";
import { toast, ToastContainer } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast

const ExamTest = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const baseURL = useRecoilValue(baseURLAtom);

  // Fetch questions and determine initial timeLeft
  useEffect(() => {
    const fetchQuestions = async () => {
      const storedQuestions = localStorage.getItem("questions");
      const studentId = localStorage.getItem("student_id");
      const parsed = storedQuestions ? JSON.parse(storedQuestions) : [];

      setQuestions(parsed);

      if (parsed.length > 0 && parsed[0].exam) {
        const examId = parsed[0].exam;
        const examdetailsId = parsed[0].examdetails_id; // Assuming examdetails_id is part of each question

        try {
          const response = await fetch(`${baseURL}api/get_exam_timer/?student_id=${studentId}&exam_id=${examId}`);
          const data = await response.json();

          let restoredTime = parseInt(data.time_left_ms);
          if (restoredTime && restoredTime > 0) {
            setTimeLeft(restoredTime);
          } else {
            const examduration = parseInt(parsed[0].examduration || "0");
            setTimeLeft(examduration * 60 * 1000);
          }
        } catch (err) {
          console.error("Timer fetch error:", err);
          const examduration = parseInt(parsed[0].examduration || "0");
          setTimeLeft(examduration * 60 * 1000);
        }
      }
    };

    fetchQuestions();
  }, []);

  // Save answer for a single question (including skipped questions)
  const saveSingleAnswer = async (questionId) => {
    const submitted_answer = answers[questionId] || "NA"; // Use "NA" for skipped questions
    const studentId = localStorage.getItem("student_id");
    const examId = questions.length > 0 ? questions[0].exam : null;
    const examdetailsId = questions.length > 0 ? questions[0].examdetails_id : null; // Get examdetails_id from the question

    if (!submitted_answer || !studentId || !examId || !questionId || !examdetailsId) return;

    try {
      await fetch(`${baseURL}api/save_single_answers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          exam_id: examId,
          examdetails_id: examdetailsId,  // Send examdetails_id
          question_id: questionId,
          submitted_answer,
        }),
      });
    } catch (err) {
      console.error("Error saving single answer", err);
    }
  };

  // Save the result after finishing the exam
  const saveResultAfterExam = async () => {
    const studentId = localStorage.getItem("student_id");
    const examId = questions[0]?.exam;
    const examdetailsId = questions[0]?.examdetails_id; // Ensure examdetails_id is fetched from the first question

    if (!studentId || !examId || !examdetailsId) return;

    try {
      const response = await fetch(`${baseURL}api/save_result_after_exam/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          exam_id: examId,
          examdetails_id: examdetailsId,  // Send examdetails_id here
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Your examination has been saved successfully!"); // Show success message
        setTimeout(() => {
          navigate("/exam"); // Navigate after 2 seconds delay
        }, 2000); // Navigate after 2 seconds delay
      } else {
        toast.error(result.error || "An error occurred while saving your results.");
      }
    } catch (error) {
      console.error("Error saving result:", error);
      toast.error("An error occurred while saving your results.");
    }
  };

  // Format the time in milliseconds
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  if (questions.length === 0 || timeLeft === null) {
    return <div>Loading questions...</div>;
  }

  const { hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-[#fd0001]">Exam Test</h2>

        <div className="flex justify-center gap-4 mb-8">
          <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg text-center">
            <p className="text-3xl font-bold">{hours}</p>
            <span className="text-lg">Hours</span>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg text-center">
            <p className="text-3xl font-bold">{minutes}</p>
            <span className="text-lg">Minutes</span>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg text-center animate-pulse">
            <p className="text-3xl font-bold">{seconds}</p>
            <span className="text-lg">Seconds</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="font-semibold">
            Question {currentStep + 1} of {questions.length}
          </p>
          <p className="mb-2">{questions[currentStep].question}</p>
          {questions[currentStep].type?.toLowerCase() === "mcq" && (
            <div>
              {["option1", "option2", "option3", "option4"].map((opt, index) =>
                questions[currentStep][opt] && (
                  <div key={index} className="mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`question-${questions[currentStep].id}`}
                        value={`option ${index + 1}`}
                        checked={answers[questions[currentStep].id] === `option ${index + 1}`}
                        onChange={() =>
                          setAnswers({
                            ...answers,
                            [questions[currentStep].id]: `option ${index + 1}`,
                          })
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
        </div>

        <div className="flex justify-between flex-wrap gap-2">
          <button
            onClick={() => navigate("/exam")}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Previous
          </button>

          <button
            onClick={async () => {
              await saveSingleAnswer(questions[currentStep].id);
              if (currentStep > 0) setCurrentStep(currentStep - 1);
            }}
            disabled={currentStep === 0}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            Back
          </button>

          <button
            onClick={async () => {
              await saveSingleAnswer(questions[currentStep].id);
              setCurrentStep(questions.length - 1);
            }}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
          >
            Last Step
          </button>

          <button
            onClick={async () => {
              await saveSingleAnswer(questions[currentStep].id);

              if (currentStep === questions.length - 1) {
                // Clear timer data
                localStorage.removeItem("exam_time_left");
                localStorage.removeItem("exam_time_saved_at");

                // Save 0 to backend
                const studentId = localStorage.getItem("student_id");
                const examId = questions[0].exam;
                await fetch(`${baseURL}api/save_exam_timer/`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    student_id: studentId,
                    exam_id: examId,
                    time_left_ms: 0,
                  }),
                });

                // Save result after exam
                await saveResultAfterExam(); // Call the function to save result

              } else {
                setCurrentStep(currentStep + 1);
              }
            }}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            {currentStep === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>

      {/* Toast container to show success notification */}
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar={true} />
    </div>
  );
};

export default ExamTest;
