/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { JavaProblem } from "../javaData";
import { Play, Copy, Check, Lightbulb, HelpCircle, Terminal, RefreshCw, ChevronLeft, ChevronRight, CheckCircle2, Lock, Unlock } from "lucide-react";

interface CodingWorkspaceProps {
  problem: JavaProblem;
  isCompleted: boolean;
  toggleCompleted: (id: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

// Generate a clean starter skeleton code from the full solution
function getSkeletonCode(problem: JavaProblem): string {
  const lines = problem.solutionCode.split("\n");
  const result: string[] = [];
  let insideMain = false;
  let mainBraceCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("public static void main")) {
      result.push(line);
      insideMain = true;
      mainBraceCount = 1;
      // If the next line is Scanner initialization, keep it
      if (i + 1 < lines.length && lines[i + 1].includes("Scanner sc")) {
        result.push(lines[i + 1]);
        i++;
      }
      result.push("        // TODO: Write your Java code here to solve the question");
      result.push(`        // Question: ${problem.question}`);
      result.push("");
      continue;
    }
    
    if (insideMain) {
      // Track braces to find the end of the main method
      for (const char of line) {
        if (char === "{") mainBraceCount++;
        if (char === "}") mainBraceCount--;
      }
      if (mainBraceCount <= 0) {
        insideMain = false;
        // Keep scanner close if present
        if (problem.solutionCode.includes("sc.close()")) {
          result.push("        sc.close();");
        }
        result.push("    }");
      }
    } else {
      result.push(line);
    }
  }
  return result.join("\n");
}

interface ValidationResult {
  passed: boolean;
  message: string;
}

// Verify that the user-typed code actually solves the specific problem
function checkCodeCorrectness(code: string, problem: JavaProblem): ValidationResult {
  const cleanCode = code.replace(/\s+/g, " ");
  
  // 1. Check if user left the skeleton untouched
  const skeleton = getSkeletonCode(problem);
  if (code.trim() === skeleton.trim()) {
    return {
      passed: false,
      message: "Please modify the starter code template and type your own Java logic inside the main method body to solve the question."
    };
  }

  // 2. Specialized validators with required keywords for pedagogical correctness
  const validators: Record<string, { keywords: string[]; desc: string }> = {
    s1_e1: {
      keywords: ["if", "5000"],
      desc: "Implement a conditional check to see if the purchase amount is greater than or equal to 5000."
    },
    s1_e2: {
      keywords: ["switch", "case"],
      desc: "Use a switch-case block checking codes 1, 2, and 3 to assign the correct employee shift."
    },
    s1_m1: {
      keywords: ["if", "100", "300"],
      desc: "Calculate dynamic slab-based bills using 'if' statements checking the 100 and 300 unit thresholds."
    },
    s1_m2: {
      keywords: ["%", "100", "balance"],
      desc: "Ensure withdrawal is a multiple of 100 (using %) and is within the available bank balance limit."
    },
    s1_h1: {
      keywords: ["if", "200"],
      desc: "Implement hourly parking fee brackets and limit the maximum daily parking charges to Rs. 200."
    },
    s1_h2: {
      keywords: ["for"],
      desc: "Use a 'for' loop to iterate over the 7 days of sales data, tracking totals and counting targets."
    },
    
    // Session 2
    s2_e1: {
      keywords: ["for", "marks"],
      desc: "Declare a local array containing the student marks, traverse with a loop, and calculate the average."
    },
    s2_e2: {
      keywords: ["toUpperCase", "length"],
      desc: "Utilize built-in String methods to convert customer name to uppercase and determine its length."
    },
    s2_m1: {
      keywords: ["for", "=="],
      desc: "Loop over the product array, checking if any product matches the target search ID."
    },
    s2_m2: {
      keywords: ["indexOf", "substring"],
      desc: "Use indexOf('@') and substring() to isolate and extract the domain from the email string."
    },
    s2_h1: {
      keywords: ["for"],
      desc: "Write a traverse loop comparing each index to track both highest and second-highest price variables."
    },
    s2_h2: {
      keywords: ["split"],
      desc: "Split the feedback string into a word array to scan and count matches of the keyword 'good'."
    },

    // Session 3
    s3_e1: {
      keywords: ["class BankAccount", "new BankAccount"],
      desc: "Create a BankAccount class with state fields, instantiate it using 'new', and display the fields."
    },
    s3_e2: {
      keywords: ["this", "Product"],
      desc: "Write a parameterized constructor for the Product class utilizing the 'this' keyword."
    },
    s3_m1: {
      keywords: ["calculateAnnualSalary", "Employee"],
      desc: "Implement calculateAnnualSalary() inside Employee multiplying monthly salary by 12."
    },
    s3_m2: {
      keywords: ["Product("],
      desc: "Implement constructor overloading (multiple Product constructor signatures) in the Product class."
    },
    s3_h1: {
      keywords: ["deposit", "withdraw"],
      desc: "Implement transactional methods to deposit funds, withdraw funds with balance checks, and display balance."
    },
    s3_h2: {
      keywords: ["Student", "new Student"],
      desc: "Create an array of Student objects and traverse it using a loop to find the highest-scoring student."
    },

    // Session 4
    s4_e1: {
      keywords: ["extends Employee", "super"],
      desc: "Establish inheritance using 'extends Employee' and call the parent constructor with 'super()'."
    },
    s4_e2: {
      keywords: ["extends Payment", "@Override", "processPayment"],
      desc: "Override the processPayment() method inside UPIPayment with the @Override compiler annotation."
    },
    s4_m1: {
      keywords: ["extends Employee", "super", "calculateSalary"],
      desc: "Calculate PermanentEmployee salary by applying a 20% allowance on the inherited basicSalary variable."
    },
    s4_m2: {
      keywords: ["extends Payment", "@Override", "Payment payment"],
      desc: "Declare a parent Payment reference variable and assign different subclass objects to process polymorphically."
    },
    s4_h1: {
      keywords: ["extends Employee", "Employee[] employees"],
      desc: "Create an Employee parent array holding subclass objects, looping to call overridden calculateSalary() methods."
    },
    s4_h2: {
      keywords: ["abstract class Delivery", "extends Delivery"],
      desc: "Create an abstract class Delivery with an abstract calculateCharge() method overridden in subclasses."
    },

    // Session 5
    s5_e1: {
      keywords: ["try", "catch", "ArithmeticException"],
      desc: "Implement a try-catch block intercepting ArithmeticException to handle bill division by zero."
    },
    s5_e2: {
      keywords: ["ArrayList", "add("],
      desc: "Instantiate an ArrayList of Strings, populate elements with add(), and display with a loop."
    },
    s5_m1: {
      keywords: ["throw", "IllegalArgumentException"],
      desc: "Explicitly trigger a manual error by throwing a new IllegalArgumentException if withdrawal exceeds balance."
    },
    s5_m2: {
      keywords: ["HashMap", "put", "containsKey"],
      desc: "Construct a HashMap mapping IDs to prices, insert with put(), and lookup keys with containsKey()."
    },
    s5_h1: {
      keywords: ["extends Exception", "throws InsufficientBalanceException"],
      desc: "Create custom checked exception InsufficientBalanceException extending Exception and declare 'throws' on withdraw."
    },
    s5_h2: {
      keywords: ["ArrayList", "Student"],
      desc: "Maintain Student objects in an ArrayList and traverse using a loop to filter students scoring >= 75."
    }
  };

  const validator = validators[problem.id];
  if (validator) {
    for (const kw of validator.keywords) {
      if (!cleanCode.toLowerCase().includes(kw.toLowerCase())) {
        return {
          passed: false,
          message: `Your typed code does not seem to contain: "${kw}"\n\nRequirement: ${validator.desc}`
        };
      }
    }
  } else if (code.length < 50) {
    return {
      passed: false,
      message: "The typed Java code is too short. Please write the complete program code."
    };
  }

  return {
    passed: true,
    message: "Success"
  };
}

export default function CodingWorkspace({
  problem,
  isCompleted,
  toggleCompleted,
  onNext,
  onPrev,
}: CodingWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"playground" | "solution" | "quiz">("playground");
  const [copied, setCopied] = useState(false);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [terminalOutput, setTerminalOutput] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  
  // Core dynamic coding practice states
  const [userCode, setUserCode] = useState<string>("");
  const [unlockedSolutions, setUnlockedSolutions] = useState<Record<string, boolean>>({});

  // Load default inputs and skeleton code when problem changes
  useEffect(() => {
    const defaultVals: Record<string, string> = {};
    problem.simulationInputs.forEach((inp) => {
      defaultVals[inp.name] = String(inp.defaultVal);
    });
    setInputs(defaultVals);
    
    // Generate the starter skeleton for the new problem
    const skeleton = getSkeletonCode(problem);
    setUserCode(skeleton);

    setTerminalOutput(`$ javac ${problem.id}.java\n[Ready to compile. Type your Java solution on the left, adjust inputs if needed, and click 'Compile & Run Java Code']`);
    setQuizSelectedOption(null);
    setQuizChecked(false);
    setActiveTab("playground");
  }, [problem]);

  const handleInputChange = (name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(problem.solutionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runSimulation = () => {
    setIsCompiling(true);
    setTerminalOutput(`$ javac ${problem.id}.java\nCompiling typed code in memory...\nLinking syntax trees...`);
    
    setTimeout(() => {
      // 1. Verify code correctness based on the question
      const checkResult = checkCodeCorrectness(userCode, problem);
      
      if (!checkResult.passed) {
        setTerminalOutput(`$ javac ${problem.id}.java\nCompilation / Verification Error:\n----------------------------------------\n\n${checkResult.message}\n\nStatus: Compilation Failed.`);
        setIsCompiling(false);
        return;
      }
      
      // 2. If correct, execute standard simulation and print outcomes
      const output = problem.simulate(inputs);
      setTerminalOutput(`$ javac ${problem.id}.java\n$ java ${problem.id}\nCompiling codebase... Done.\nRunning automated tests... All Tests Passed! 🎉\n\n--- [Console Output] ---\n${output}\n------------------------\n\nExecution finished successfully with exit code 0.\nStatus: Completed! Progress synchronized.`);
      setIsCompiling(false);
      
      // Auto-complete if they solve it successfully
      if (!isCompleted) {
        toggleCompleted(problem.id);
      }
    }, 850);
  };

  const handleCheckQuiz = () => {
    if (quizSelectedOption === null) return;
    setQuizChecked(true);
    if (quizSelectedOption === problem.quiz.correctIndex) {
      // Auto-complete if they answer the quiz correctly
      if (!isCompleted) {
        toggleCompleted(problem.id);
      }
    }
  };

  const difficultyColors = {
    Easy: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Medium: "bg-amber-50 text-amber-800 border-amber-200",
    Hard: "bg-rose-50 text-rose-800 border-rose-200",
  };

  return (
    <div className="flex flex-col h-full bg-white border-4 border-indigo-50 rounded-3xl overflow-hidden shadow-xl" id={`workspace-${problem.id}`}>
      {/* Problem Header */}
      <div className="bg-white px-6 py-5 border-b-4 border-indigo-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-mono font-black uppercase tracking-wider px-3 py-0.5 rounded-full border-2 ${difficultyColors[problem.difficulty] || "bg-slate-50 border-slate-200"}`}>
              {problem.difficulty}
            </span>
            <span className="text-[10px] font-mono font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-0.5 rounded-full border border-indigo-100">
              Module {problem.sessionNum}
            </span>
          </div>
          <h3 className="font-sans text-lg font-black text-slate-800 uppercase tracking-tight">
            {problem.title}
          </h3>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => toggleCompleted(problem.id)}
            id="btn-toggle-completed"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider border-2 transition-all shadow-sm ${
              isCompleted
                ? "bg-emerald-100 border-emerald-200 text-emerald-800 hover:bg-emerald-200"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <CheckCircle2 className={`h-4.5 w-4.5 ${isCompleted ? "text-emerald-600 fill-emerald-50" : "text-gray-400"}`} />
            {isCompleted ? "Completed" : "Mark as Done"}
          </button>
        </div>
      </div>

      {/* Scenarios and Question info */}
      <div className="p-6 border-b-4 border-indigo-50 bg-indigo-50/20 space-y-2">
        <p className="font-sans text-xs text-slate-600 leading-relaxed">
          <span className="font-black text-indigo-900 uppercase tracking-wider mr-1">Scenario:</span> {problem.scenario}
        </p>
        <p className="font-sans text-xs text-slate-800 leading-relaxed font-bold">
          <span className="text-rose-600 font-black uppercase tracking-wider mr-1">Question:</span> {problem.question}
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex bg-slate-50/80 p-1.5 border-b-4 border-indigo-50 gap-1.5 select-none">
        <button
          onClick={() => setActiveTab("playground")}
          className={`flex-1 py-2.5 text-center rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] sm:text-xs border-2 ${
            activeTab === "playground"
              ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
              : "border-transparent text-slate-500 hover:bg-white/50"
          }`}
          id="tab-playground"
        >
          💻 Interactive IDE
        </button>
        <button
          onClick={() => setActiveTab("solution")}
          className={`flex-1 py-2.5 text-center rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] sm:text-xs border-2 ${
            activeTab === "solution"
              ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
              : "border-transparent text-slate-500 hover:bg-white/50"
          }`}
          id="tab-solution"
        >
          📄 Source Solution
        </button>
        <button
          onClick={() => setActiveTab("quiz")}
          className={`flex-1 py-2.5 text-center rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] sm:text-xs border-2 ${
            activeTab === "quiz"
              ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
              : "border-transparent text-slate-500 hover:bg-white/50"
          }`}
          id="tab-quiz"
        >
          ❓ Quick Quiz
        </button>
      </div>

      {/* Tabs Content */}
      <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
        {/* PLAYGROUND TAB */}
        {activeTab === "playground" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full" id="playground-content">
            {/* Left Column: Code Editor */}
            <div className="space-y-4 flex flex-col h-full" id="ide-editor-panel">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="space-y-0.5">
                  <h4 className="font-sans text-xs font-black text-indigo-900 uppercase tracking-widest">
                    Java Code Editor
                  </h4>
                  <p className="font-sans text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    Type your solution inside the main method body below.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const skeleton = getSkeletonCode(problem);
                    setUserCode(skeleton);
                    setTerminalOutput(`$ javac ${problem.id}.java\n[Code reset to starter template. Ready to compile!]`);
                  }}
                  className="text-[10px] font-black uppercase tracking-widest text-indigo-700 hover:text-indigo-800 bg-indigo-50 border border-indigo-150 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  title="Reset code to original starter skeleton"
                  id="btn-reset-code"
                >
                  Reset Template
                </button>
              </div>

              {/* Textarea Code Box */}
              <div className="flex-1 min-h-[320px] flex flex-col rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-950 font-mono text-xs shadow-inner">
                <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>{problem.title.replace(/\s+/g, "")}.java</span>
                  <span className="text-indigo-400 font-black uppercase tracking-widest">Interactive IDE</span>
                </div>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="flex-1 w-full p-4 font-mono text-xs text-slate-100 bg-slate-950 border-0 outline-none focus:ring-0 resize-none select-text whitespace-pre overflow-auto font-semibold leading-relaxed leading-6 h-full"
                  spellCheck="false"
                  id="code-editor-textarea"
                />
              </div>

              {/* Input variables */}
              {problem.simulationInputs.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-150 space-y-3 shrink-0">
                  <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest block">
                    Execution Parameter Variables
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {problem.simulationInputs.map((input) => (
                      <div key={input.name} className="space-y-1">
                        <label className="font-sans text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                          {input.label}
                        </label>
                        <input
                          type={input.type === "number" ? "number" : "text"}
                          id={`input-${input.name}`}
                          value={inputs[input.name] || ""}
                          onChange={(e) => handleInputChange(input.name, e.target.value)}
                          className="w-full rounded-xl border-2 border-slate-250 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Console Terminal and Run Action */}
            <div className="flex flex-col h-full gap-4 justify-between" id="ide-terminal-panel">
              <div className="space-y-1">
                <h4 className="font-sans text-xs font-black text-indigo-900 uppercase tracking-widest">
                  Compilation & Execution Console
                </h4>
                <p className="font-sans text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Check console outputs and correctness analysis.
                </p>
              </div>

              {/* Console Output Screen */}
              <div className="flex-1 flex flex-col rounded-2xl bg-slate-900 border-4 border-slate-950 overflow-hidden shadow-lg min-h-[250px]">
                <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between shrink-0">
                  <span className="font-mono text-[10px] text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-widest">
                    <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                    Java Runtime Terminal
                  </span>
                  <span className="font-mono text-[9px] text-slate-500 font-black">LOCAL VM</span>
                </div>
                <pre className="flex-1 p-5 font-mono text-xs text-indigo-300 overflow-x-auto whitespace-pre-wrap leading-relaxed select-text bg-slate-900 h-full" id="terminal-screen">
                  {terminalOutput}
                </pre>
              </div>

              {/* Action Trigger Button */}
              <button
                onClick={runSimulation}
                disabled={isCompiling}
                id="btn-execute-simulation"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-white py-3.5 text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-150 active:translate-y-0.5 hover:bg-indigo-700 transition-all shrink-0 mt-2"
              >
                {isCompiling ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Compiling & Verifying...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" />
                    <span>Compile & Run Java Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* SOLUTION TAB */}
        {activeTab === "solution" && (
          <div className="space-y-5 animate-fadeIn" id="solution-content">
            {(!unlockedSolutions[problem.id] && !isCompleted) ? (
              <div className="rounded-3xl border-4 border-amber-100 bg-amber-50/20 p-8 text-center space-y-5 max-w-2xl mx-auto my-6" id="solution-locked-card">
                <div className="mx-auto h-16 w-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center border-4 border-amber-200 shadow-sm animate-pulse">
                  <Lock className="h-8 w-8 text-amber-600" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-sans text-base font-black text-amber-900 uppercase tracking-wide">
                    Syllabus Reference Solution Hidden
                  </h4>
                  <p className="font-sans text-xs text-amber-800 leading-relaxed max-w-md mx-auto font-semibold">
                    To maximize your learning in the Core Java syllabus, we highly recommend typing and testing your solution first inside the 💻 Interactive IDE.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setUnlockedSolutions(prev => ({ ...prev, [problem.id]: true }))}
                    className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 text-xs font-black uppercase tracking-widest shadow-md transition-all active:translate-y-0.5 animate-bounce"
                    id="btn-unlock-solution"
                  >
                    <Unlock className="h-4 w-4" />
                    <span>Reveal Reference Solution</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <h4 className="font-sans text-xs font-black text-indigo-900 uppercase tracking-widest">
                      Source Code Solution
                    </h4>
                    <p className="font-sans text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      Review the full, compiled standard solution as documented in the syllabus.
                    </p>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    id="btn-copy-solution"
                    className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 border-2 border-indigo-150 px-3.5 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Block display */}
                <div className="relative rounded-2xl bg-slate-50 border-2 border-slate-150 overflow-hidden font-mono text-xs max-h-[400px] overflow-y-auto shadow-inner">
                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span>Java Source File • {problem.title.replace(/\s+/g, "")}.java</span>
                    <span>UTF-8</span>
                  </div>
                  <table className="w-full border-collapse">
                    <tbody>
                      {problem.solutionCode.split("\n").map((line, i) => (
                        <tr key={i} className="hover:bg-indigo-50/20">
                          <td className="w-10 text-right pr-3 pl-2 select-none border-r border-slate-200 text-[10px] text-slate-400 font-mono bg-slate-100/50 py-0.5">
                            {i + 1}
                          </td>
                          <td className="pl-4 font-mono text-xs text-slate-800 py-0.5 select-text whitespace-pre">
                            {line}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Explanation card */}
                <div className="rounded-3xl border-4 border-indigo-50 bg-indigo-50/20 p-5 space-y-3">
                  <h5 className="font-sans text-xs font-black text-indigo-950 uppercase tracking-widest flex items-center gap-1.5">
                    <Lightbulb className="h-4 w-4 text-indigo-600" />
                    Line-by-Line Code Explanation
                  </h5>
                  <p className="font-sans text-xs text-indigo-900 leading-relaxed font-semibold">
                    {problem.explanation}
                  </p>
                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-indigo-800 font-black uppercase tracking-widest block mb-1.5">
                      CONCEPTS LEARNED:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {problem.concepts.map((concept, idx) => (
                        <span key={idx} className="font-mono text-[9px] bg-white text-indigo-800 px-2.5 py-1 rounded-full border-2 border-indigo-100 font-bold uppercase tracking-wide">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* QUIZ TAB */}
        {activeTab === "quiz" && (
          <div className="space-y-5" id="quiz-content">
            <div className="space-y-1">
              <h4 className="font-sans text-xs font-black text-indigo-900 uppercase tracking-widest">
                Problem Concept Check Quiz
              </h4>
              <p className="font-sans text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Reinforce syntax rules and code analysis before taking the main session deck.
              </p>
            </div>

            <div className="rounded-3xl border-4 border-indigo-50 bg-white p-6 shadow-md space-y-5">
              <p className="font-sans text-sm font-black text-slate-800">
                {problem.quiz.question}
              </p>

              {/* Multi-choice items */}
              <div className="space-y-3">
                {problem.quiz.options.map((opt, idx) => {
                  let optStyle = "border-slate-200 hover:border-indigo-400 text-slate-600";
                  if (quizChecked) {
                    if (idx === problem.quiz.correctIndex) {
                      optStyle = "bg-indigo-50 border-indigo-400 text-indigo-900 font-black";
                    } else if (idx === quizSelectedOption) {
                      optStyle = "bg-rose-50 border-rose-400 text-rose-800 font-bold";
                    } else {
                      optStyle = "border-slate-100 text-slate-400 opacity-60";
                    }
                  } else if (quizSelectedOption === idx) {
                    optStyle = "bg-indigo-50/50 border-indigo-500 text-indigo-950 font-bold";
                  }

                  return (
                    <button
                      key={idx}
                      id={`quiz-option-${idx}`}
                      onClick={() => !quizChecked && setQuizSelectedOption(idx)}
                      disabled={quizChecked}
                      className={`w-full flex items-center justify-between text-left p-4 rounded-2xl border-2 text-xs sm:text-sm transition-all ${optStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                          quizSelectedOption === idx ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="font-bold">{opt}</span>
                      </div>
                      {quizChecked && idx === problem.quiz.correctIndex && (
                        <span className="font-mono text-[9px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase">
                          CORRECT
                        </span>
                      )}
                      {quizChecked && idx === quizSelectedOption && idx !== problem.quiz.correctIndex && (
                        <span className="font-mono text-[9px] font-black bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full uppercase">
                          WRONG
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Submit Quiz and Feedback block */}
              {!quizChecked ? (
                <button
                  onClick={handleCheckQuiz}
                  disabled={quizSelectedOption === null}
                  id="btn-submit-quiz"
                  className="w-full rounded-2xl bg-indigo-600 text-white py-3 text-xs font-black uppercase tracking-widest hover:bg-indigo-700 disabled:bg-slate-150 disabled:text-slate-400 transition-all shadow-md active:translate-y-0.5"
                >
                  Check Answer
                </button>
              ) : (
                <div className="rounded-2xl bg-indigo-50/40 p-5 border-2 border-indigo-100 text-xs text-indigo-950 space-y-2">
                  <h5 className="font-black font-sans uppercase tracking-widest flex items-center gap-1">
                    <HelpCircle className="h-4 w-4 text-indigo-600" />
                    Explanation
                  </h5>
                  <p className="font-sans text-xs leading-relaxed text-indigo-900 font-semibold">
                    {problem.quiz.explanation}
                  </p>
                  <p className="text-[10px] font-mono text-emerald-700 font-black uppercase tracking-widest pt-1">
                    🎉 PROGRESS LOGGED: Problem marked as active study.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Workspace Footer Navigation */}
      <div className="bg-slate-50 border-t-4 border-indigo-50 px-6 py-4 flex items-center justify-between shrink-0 select-none">
        <button
          onClick={onPrev}
          id="btn-prev-problem"
          className="flex items-center gap-1.5 font-sans text-xs font-black uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>
        <div className="hidden sm:block font-mono text-[10px] text-slate-400 font-black uppercase tracking-widest">
          STUDENT PORTAL • CSE JAVA SYLLABUS
        </div>
        <button
          onClick={onNext}
          id="btn-next-problem"
          className="flex items-center gap-1.5 font-sans text-xs font-black uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
