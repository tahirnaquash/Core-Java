/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { JAVA_SESSIONS, JavaProblem } from "../javaData";
import { BookOpen, Trophy, ArrowLeft, CheckCircle, XCircle, HelpCircle, ArrowRight, RotateCcw, AlertTriangle } from "lucide-react";

interface QuizDeckProps {
  completedQuizzes: Record<string, number>; // quizId -> score (out of 6)
  onCompleteQuiz: (sessionNum: number, score: number) => void;
}

export default function QuizDeck({ completedQuizzes, onCompleteQuiz }: QuizDeckProps) {
  const [activeSessionNum, setActiveSessionNum] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Active session questions
  const activeSession = JAVA_SESSIONS.find((s) => s.num === activeSessionNum);
  const questionsList: JavaProblem[] = activeSession ? activeSession.problems : [];

  const handleStartQuiz = (num: number) => {
    setActiveSessionNum(num);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerChecked(true);
    const activeQuestion = questionsList[currentQuestionIndex];
    if (selectedOption === activeQuestion.quiz.correctIndex) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    const isLast = currentQuestionIndex === questionsList.length - 1;
    if (isLast) {
      setQuizFinished(true);
      if (activeSessionNum !== null) {
        // Record final score (correctCount is updated by state, but since setCorrectCount is async, we calculate true final correct value)
        const finalScore = correctCount + (selectedOption === questionsList[currentQuestionIndex].quiz.correctIndex ? 1 : 0);
        onCompleteQuiz(activeSessionNum, finalScore);
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    }
  };

  const handleResetQuiz = () => {
    if (activeSessionNum === null) return;
    handleStartQuiz(activeSessionNum);
  };

  const handleExitQuiz = () => {
    setActiveSessionNum(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6" id="quiz-deck-container">
      {/* Quiz Deck Selector Screen */}
      {activeSessionNum === null ? (
        <div className="space-y-6" id="deck-selector-screen">
          <div className="space-y-1">
            <h2 className="font-sans text-xl sm:text-2xl font-black tracking-tight text-indigo-900 uppercase">
              Interactive Practice Quiz Decks
            </h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mt-1">
              Test your conceptual understanding across the 5 curriculum modules. Each deck contains exactly 6 questions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" id="decks-grid">
            {JAVA_SESSIONS.map((session) => {
              const prevScore = completedQuizzes[session.num];
              const isDone = prevScore !== undefined;

              return (
                <div
                  key={session.num}
                  id={`quiz-deck-card-${session.num}`}
                  className="flex flex-col justify-between rounded-3xl border-4 border-indigo-50 bg-white p-6 shadow-md space-y-4 hover:border-indigo-400 hover:shadow-lg transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full uppercase border-2 border-indigo-100">
                        Module 0{session.num} Quiz
                      </span>
                      {isDone && (
                        <span className="font-mono text-[10px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full uppercase border border-rose-150">
                          Score: {prevScore}/6
                        </span>
                      )}
                    </div>
                    <h3 className="font-sans text-base font-black text-slate-800 leading-snug">
                      {session.title}
                    </h3>
                    <p className="font-sans text-xs text-slate-500 leading-relaxed font-semibold line-clamp-2">
                      Review topics: {session.topics.slice(0, 5).join(", ")}...
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider">6 QUESTIONS TOTAL</span>
                    <button
                      onClick={() => handleStartQuiz(session.num)}
                      id={`start-quiz-btn-${session.num}`}
                      className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-black uppercase tracking-wider shadow-md active:translate-y-0.5 transition-all"
                    >
                      <span>{isDone ? "Retake Deck" : "Start Test"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Active Quiz Taking Session Screen */
        <div className="space-y-6" id="active-quiz-session">
          {/* Quiz Header Info */}
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-3xl border-4 border-indigo-50 shadow-md">
            <button
              onClick={handleExitQuiz}
              id="btn-quiz-exit"
              className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-700 bg-indigo-50 border-2 border-indigo-100 px-3 py-1.5 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Exit Practice</span>
            </button>
            <span className="font-mono text-xs text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full uppercase border-2 border-indigo-100 font-black">
              {activeSession?.title.split(" - ")[0]}
            </span>
            <div className="font-sans text-xs font-black text-indigo-950 uppercase tracking-widest">
              Score: {correctCount} / {questionsList.length}
            </div>
          </div>

          {/* Quiz card detail */}
          {!quizFinished ? (
            <div className="rounded-3xl border-4 border-indigo-50 bg-white p-6 shadow-md space-y-6" id="quiz-question-card">
              {/* Progress Line */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>QUESTION {currentQuestionIndex + 1} OF {questionsList.length}</span>
                  <span className="font-mono">{Math.round(((currentQuestionIndex + 1) / questionsList.length) * 100)}% Complete</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questionsList.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Problem statement and text */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-150 px-3 py-1 rounded-full inline-block">
                  CONCEPT: {questionsList[currentQuestionIndex].title}
                </span>
                <p className="font-sans text-base sm:text-lg font-black text-slate-800">
                  {questionsList[currentQuestionIndex].quiz.question}
                </p>
              </div>

              {/* Options Selection block */}
              <div className="space-y-3">
                {questionsList[currentQuestionIndex].quiz.options.map((option, idx) => {
                  let optStyle = "border-slate-200 hover:border-indigo-400 text-slate-600";
                  if (isAnswerChecked) {
                    if (idx === questionsList[currentQuestionIndex].quiz.correctIndex) {
                      optStyle = "bg-indigo-50 border-indigo-400 text-indigo-900 font-black";
                    } else if (idx === selectedOption) {
                      optStyle = "bg-rose-50 border-rose-400 text-rose-800 font-bold";
                    } else {
                      optStyle = "border-slate-100 text-slate-400 opacity-60";
                    }
                  } else if (selectedOption === idx) {
                    optStyle = "bg-indigo-50/50 border-indigo-500 text-indigo-950 font-bold";
                  }

                  return (
                    <button
                      key={idx}
                      id={`active-quiz-opt-${idx}`}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerChecked}
                      className={`w-full flex items-center justify-between text-left p-4 rounded-2xl border-2 text-xs sm:text-sm transition-all ${optStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                          selectedOption === idx ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="font-bold">{option}</span>
                      </div>
                      {isAnswerChecked && idx === questionsList[currentQuestionIndex].quiz.correctIndex && (
                        <span className="font-mono text-[9px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase">
                          CORRECT
                        </span>
                      )}
                      {isAnswerChecked && idx === selectedOption && idx !== questionsList[currentQuestionIndex].quiz.correctIndex && (
                        <span className="font-mono text-[9px] font-black bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full uppercase">
                          WRONG
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom control buttons */}
              <div className="pt-4 border-t border-slate-150 flex items-center justify-end">
                {!isAnswerChecked ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={selectedOption === null}
                    id="btn-quiz-check"
                    className="flex items-center gap-1.5 rounded-2xl bg-indigo-600 text-white px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-indigo-700 disabled:bg-slate-150 disabled:text-slate-400 transition-all shadow-md active:translate-y-0.5"
                  >
                    <span>Check Answer</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    id="btn-quiz-next"
                    className="flex items-center gap-1.5 rounded-2xl bg-indigo-600 text-white px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md active:translate-y-0.5"
                  >
                    <span>{currentQuestionIndex === questionsList.length - 1 ? "Finish Quiz" : "Next Question"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Detailed Explanation card displayed after check */}
              {isAnswerChecked && (
                <div className="rounded-2xl bg-indigo-50/40 p-5 border-2 border-indigo-100 text-xs text-indigo-950 space-y-2">
                  <h5 className="font-black font-sans uppercase tracking-widest flex items-center gap-1">
                    <HelpCircle className="h-4 w-4 text-indigo-600" />
                    Explanation Summary
                  </h5>
                  <p className="font-sans text-xs leading-relaxed text-indigo-900 font-semibold">
                    {questionsList[currentQuestionIndex].quiz.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed Final Results Card Screen */
            <div className="rounded-3xl border-4 border-indigo-50 bg-white p-8 shadow-lg text-center space-y-6" id="quiz-results-card">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="h-16 w-16 bg-amber-100 text-indigo-950 rounded-full flex items-center justify-center border-4 border-amber-300 shadow-md">
                  <Trophy className="h-8 w-8 text-amber-500 fill-amber-100" />
                </div>
                <h3 className="font-sans text-xl font-black text-slate-800 uppercase tracking-tight">Quiz Deck Completed!</h3>
                <p className="font-sans text-xs text-slate-500 max-w-sm leading-relaxed font-semibold">
                  Great effort! You finished Session {activeSessionNum} Quiz Deck based strictly on HKBK College Core Java materials.
                </p>
              </div>

              {/* Score breakdown metrics */}
              <div className="inline-flex flex-col items-center justify-center p-6 rounded-3xl bg-indigo-50 border-2 border-indigo-100 min-w-[200px]">
                <span className="text-5xl font-black text-indigo-950">{correctCount} / 6</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 font-black mt-1.5">
                  {Math.round((correctCount / 6) * 100)}% SCORE RATE
                </span>
              </div>

              {/* Comments block */}
              <p className="font-sans text-sm font-black text-indigo-950">
                {correctCount >= 4
                  ? "🎉 Outstanding Work! You have unlocked local progress flags for this Session Module!"
                  : "💡 Keep learning! Review the curriculum code examples and retake the quiz anytime."}
              </p>

              {/* Action layout */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleResetQuiz}
                  id="btn-quiz-retry"
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-2xl border-2 border-indigo-100 bg-white px-5 py-3 text-xs font-black text-indigo-700 hover:bg-indigo-50 transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Retry Quiz</span>
                </button>
                <button
                  onClick={handleExitQuiz}
                  id="btn-quiz-exit-final"
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-2xl bg-indigo-600 text-white px-5 py-3 text-xs font-black hover:bg-indigo-700 transition-all shadow-md"
                >
                  <span>Back to Decks List</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
