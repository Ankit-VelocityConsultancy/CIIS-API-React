import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseURLAtom } from "../../recoil/atoms";
import { useRecoilValue } from "recoil";

const ExamTest = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(120 * 60 * 1000);
  const baseURL = useRecoilValue(baseURLAtom);

  useEffect(() => {
    const storedQuestions = localStorage.getItem("questions");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }
  }, []);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      navigate("/exam/");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 1000 ? prev - 1000 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  const saveSingleAnswer = async (questionId) => {
    const submitted_answer = answers[questionId];
    const studentId = localStorage.getItem("student_id");
    const examId = questions.length > 0 ? questions[0].exam : null;

    if (!submitted_answer || !studentId || !examId || !questionId) return;

    try {
      await fetch(`${baseURL}api/save_single_answers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          exam_id: examId,
          question_id: questionId,
          submitted_answer,
        }),
      });
    } catch (err) {
      console.error("Error saving single answer", err);
    }
  };

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const { hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-[#fd0001]">Exam Test</h2>

        {timeLeft !== null && (
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
        )}

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
                        checked={
                          answers[questions[currentStep].id] === `option ${index + 1}`
                        }
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
              if (currentStep < questions.length - 1) {
                await saveSingleAnswer(questions[currentStep].id);
                setCurrentStep(currentStep + 1);
              } else {
                navigate("/exam/"); // just finish, no API call
              }
            }}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            {currentStep === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>

      <div className="w-full lg:w-1/3 p-4 bg-white shadow-lg rounded-lg mt-6 lg:mt-0 lg:ml-6">
        <h3 className="text-xl font-semibold text-center mb-4">Questions</h3>
        <div className="grid grid-cols-5 gap-3">
          {questions.map((q, index) => {
            const isAnswered = answers[q.id];
            const isActive = index === currentStep;
            return (
              <button
                key={q.id}
                onClick={async () => {
                  await saveSingleAnswer(questions[currentStep].id);
                  setCurrentStep(index);
                }}
                className={`
                  w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold
                  border 
                  ${isAnswered ? "bg-green-500 text-white" : "bg-gray-200 text-black"}
                  ${isActive ? "border-red-500" : "border-gray-300"}
                  hover:bg-gray-300 transition-all duration-200
                `}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExamTest;