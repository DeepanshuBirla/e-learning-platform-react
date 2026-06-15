import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TestTimer from "../Components/TestTimer";
import API from "../services/api";

export default function CourseTest() {
  const { slug } = useParams(); // yahan slug actually courseId hai
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [passPercentage, setPassPercentage] = useState(60);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(`/quizzes/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQuiz(res.data.quiz);
      setQuestions(res.data.quiz.questions || []);
      setPassPercentage(res.data.quiz.passPercentage || 60);
    } catch (error) {
      alert(error.response?.data?.message || "Quiz not found");
      navigate(`/learn/${slug}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [slug]);

  const handleOptionClick = (index) => {
    setAnswers({ ...answers, [current]: index });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        `/quizzes/submit/${slug}`,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const testResult = {
        score: res.data.score,
        total: res.data.total,
        percentage: res.data.percentage,
        passed: res.data.passed,
      };

      const attempt = {
        courseSlug: slug,
        date: new Date().toLocaleString(),
        score: testResult.score,
        total: testResult.total,
        percentage: testResult.percentage,
        passed: testResult.passed,
      };

      const history = JSON.parse(localStorage.getItem("testHistory")) || [];
      history.push(attempt);
      localStorage.setItem("testHistory", JSON.stringify(history));

      setResult(testResult);
      setSubmitted(true);
    } catch (error) {
      alert(error.response?.data?.message || "Test submit failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-6">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow text-center">
          <h2 className="text-2xl font-bold mb-3">Quiz Not Available</h2>
          <p className="text-gray-500 mb-4">
            This course does not have quiz questions yet.
          </p>
          <button
            onClick={() => navigate(`/learn/${slug}`)}
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            Back to Learning
          </button>
        </div>
      </div>
    );
  }

  if (submitted && result) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div
            className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 ${
              result.passed ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {result.passed ? "✅" : "❌"}
          </div>

          <h2 className="text-3xl font-bold mb-4">Test Result</h2>

          <p className="text-lg mb-2">
            Score: <b>{result.score}</b> / {result.total}
          </p>

          <p className="text-lg mb-4">
            Percentage: <b>{result.percentage}%</b>
          </p>

          {result.passed ? (
            <p className="text-green-600 font-semibold mb-4">
              Passed – Certificate Unlocked
            </p>
          ) : (
            <p className="text-red-600 font-semibold mb-4">
              Failed – Please Try Again
            </p>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate(`/learn/${slug}`)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Back to Learning
            </button>

            {!result.passed ? (
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Retry Test
              </button>
            ) : (
              <button
                onClick={() => navigate("/student")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-5">
          <div>
            <h2 className="text-2xl font-bold">Course Quiz</h2>
            <p className="text-sm text-gray-500">
              Pass Percentage: {passPercentage}%
            </p>
            <p className="text-sm text-gray-500">
              Question {current + 1} of {questions.length}
            </p>
          </div>

          <TestTimer duration={10 * 60} onTimeUp={handleSubmit} />
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
          <div
            className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600"
            style={{
              width: `${((current + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>

        <div className="bg-gray-50 border rounded-xl p-5 mb-5">
          <h3 className="text-xl font-semibold">{q.question}</h3>
        </div>

        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(i)}
              className={`w-full text-left p-4 rounded-xl border transition ${
                answers[current] === i
                  ? "bg-blue-100 border-blue-600 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
            className="bg-gray-300 px-5 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {current < questions.length - 1 ? (
            <button
              onClick={() => setCurrent(current + 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
            >
              Submit Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}