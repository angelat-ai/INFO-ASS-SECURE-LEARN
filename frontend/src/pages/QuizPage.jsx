import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LESSONS_DATA, QUIZ_DATA } from "../data/lessons";
import styles from "../styles/QuizPage.module.css";

export default function QuizPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = LESSONS_DATA.find((l) => l.id === Number(lessonId));
  const questions = QUIZ_DATA[Number(lessonId)] || [];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [state, setState] = useState("idle");
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const q = questions[current];
  const total = questions.length;
  const progress = ((current) / total) * 100;

  const handleSelect = (idx) => {
    if (state !== "idle") return;
    setSelected(idx);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    const isCorrect = selected === q.correct;

    if (isCorrect) {
      setState("correct");
      setShowExplanation(true);
      setAnswers((prev) => [...prev, { questionId: q.id, correct: true, attempts: attempts + 1 }]);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 2) {
        setState("wrong_final");
        setShowExplanation(true);
        setAnswers((prev) => [...prev, { questionId: q.id, correct: false, attempts: newAttempts }]);
      } else {
        setState("wrong_retry");
        setSelected(null);
        setTimeout(() => setState("idle"), 1500);
      }
    }
  };

  const handleNext = () => {
    if (current + 1 >= total) {
      const score = answers.filter((a) => a.correct).length + (state === "correct" ? 0 : 0);
      const finalScore = answers.filter((a) => a.correct).length + (state === "correct" ? 1 : 0);
      const pct = Math.round((finalScore / total) * 100);
      navigate(`/quiz-result/${lessonId}`, {
        state: { score: finalScore, total, pct, lessonId: Number(lessonId) },
      });
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAttempts(0);
      setState("idle");
      setShowExplanation(false);
    }
  };

  if (!lesson || questions.length === 0) {
    return (
      <div className={styles.notFound}>
        <p>Quiz not found.</p>
        <button onClick={() => navigate("/lessons")}>Back to Lessons</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(`/lessons/${lessonId}`)}>
          ← back
        </button>
        <span className={styles.questionCount}>
          Question {current + 1} out {total}
        </span>
      </div>

      <div className={styles.progressWrap}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.content}>
        <h2 className={styles.question}>{q.question}</h2>

        <div className={styles.options}>
          {q.options.map((opt, idx) => {
            let optClass = styles.option;
            if (selected === idx) {
              if (state === "correct") optClass = `${styles.option} ${styles.optionCorrect}`;
              else if (state === "wrong_final" || state === "wrong_retry") optClass = `${styles.option} ${styles.optionWrong}`;
              else optClass = `${styles.option} ${styles.optionSelected}`;
            }
            if ((state === "wrong_final") && idx === q.correct) {
              optClass = `${styles.option} ${styles.optionCorrectReveal}`;
            }

            return (
              <button
                key={idx}
                className={optClass}
                onClick={() => handleSelect(idx)}
                disabled={state === "correct" || state === "wrong_final"}
              >
                <span className={styles.optionRadio}>
                  {selected === idx && state === "correct" && "●"}
                  {selected === idx && (state === "wrong_final" || state === "wrong_retry") && "●"}
                  {(selected !== idx || state === "idle") && "○"}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {state === "wrong_retry" && (
          <div className={styles.retryMsg}>
            ❌ Incorrect! You have 1 more attempt.
          </div>
        )}

        {showExplanation && (
          <div className={`${styles.explanation} ${state === "correct" ? styles.explanationCorrect : styles.explanationWrong}`}>
            <p className={styles.explanationTitle}>
              {state === "correct" ? "✅ Correct! 🎉" : "❌ Wrong Answer"}
            </p>
            <p className={styles.explanationText}>{q.explanation}</p>
          </div>
        )}

        {state === "idle" || state === "wrong_retry" ? (
          <button
            className={styles.confirmBtn}
            onClick={handleConfirm}
            disabled={selected === null || state === "wrong_retry"}
          >
            Confirm Answer
          </button>
        ) : (
          <button className={styles.nextBtn} onClick={handleNext}>
            {current + 1 >= total ? "See Results" : "Next Question"}
          </button>
        )}
      </div>
    </div>
  );
}
