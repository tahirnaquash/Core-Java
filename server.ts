import express from "express";
import path from "path";
import fs from "fs";
import * as _XLSX from "xlsx";
import { createServer as createViteServer } from "vite";

const XLSX = (_XLSX as any).default || _XLSX;

const app = express();
const PORT = 3000;
const EXCEL_FILE = path.join(process.cwd(), "student_progress.xlsx");

app.use(express.json());

// Helper: Initialize or read Excel file
function getExcelData(): any[] {
  if (!fs.existsSync(EXCEL_FILE)) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(wb, ws, "Student Progress");
    // Define headers
    XLSX.utils.sheet_add_aoa(ws, [[
      "USN",
      "Name",
      "Streak",
      "CompletedProblemsCount",
      "CompletedProblemsList",
      "CompletedQuizzesCount",
      "CompletedQuizzesList",
      "CodingMarks",
      "QuizMarks",
      "TotalMarks",
      "Grade",
      "CertificateEarned",
      "LastActiveDate",
      "RegistrationTime",
      "SubmittedCodes"
    ]], { origin: "A1" });
    XLSX.writeFile(wb, EXCEL_FILE);
    return [];
  }

  try {
    const wb = XLSX.readFile(EXCEL_FILE);
    const sheetName = wb.SheetNames[0];
    const ws = wb.Sheets[sheetName];
    // Use raw values to avoid converting data unexpectedly
    return XLSX.utils.sheet_to_json(ws);
  } catch (err) {
    console.error("Error reading Excel file, returning empty list:", err);
    return [];
  }
}

// Helper: Save Excel data
function saveExcelData(data: any[]) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data, {
    header: [
      "USN",
      "Name",
      "Streak",
      "CompletedProblemsCount",
      "CompletedProblemsList",
      "CompletedQuizzesCount",
      "CompletedQuizzesList",
      "CodingMarks",
      "QuizMarks",
      "TotalMarks",
      "Grade",
      "CertificateEarned",
      "LastActiveDate",
      "RegistrationTime",
      "SubmittedCodes"
    ]
  });
  XLSX.utils.book_append_sheet(wb, ws, "Student Progress");
  XLSX.writeFile(wb, EXCEL_FILE);
}

// Helper to calculate coding marks based on problem difficulty tags in their ID
function calculateCodingMarks(completedProblemsListStr: string): number {
  if (!completedProblemsListStr) return 0;
  const problems = completedProblemsListStr.split(",").filter(Boolean);
  let total = 0;
  for (const pid of problems) {
    if (pid.includes("_e")) {
      total += 10; // Easy = 10 Marks
    } else if (pid.includes("_m")) {
      total += 15; // Medium = 15 Marks
    } else if (pid.includes("_h")) {
      total += 20; // Hard = 20 Marks
    }
  }
  return total;
}

// API Endpoints

// 1. Student Login / Registration
app.post("/api/students/login", (req: express.Request, res: express.Response) => {
  const { usn, name } = req.body;
  if (!usn || !name) {
    res.status(400).json({ error: "USN and Name are required" });
    return;
  }

  const normalizedUsn = usn.trim().toUpperCase();
  const normalizedName = name.trim();

  const students = getExcelData();
  const studentIndex = students.findIndex((s: any) => String(s.USN).toUpperCase() === normalizedUsn);

  if (studentIndex >= 0) {
    // Existing student - load progress
    const student = students[studentIndex];
    
    // Update name if changed
    if (student.Name !== normalizedName) {
      student.Name = normalizedName;
      student.LastActiveDate = new Date().toISOString().split("T")[0];
      saveExcelData(students);
    }

    let completedProblems: string[] = [];
    if (student.CompletedProblemsList) {
      completedProblems = String(student.CompletedProblemsList).split(",").filter(Boolean);
    }

    let completedQuizzes: Record<string, number> = {};
    if (student.CompletedQuizzesList) {
      try {
        completedQuizzes = JSON.parse(student.CompletedQuizzesList);
      } catch (e) {
        completedQuizzes = {};
      }
    }

    let userCodes: Record<string, string> = {};
    if (student.SubmittedCodes) {
      try {
        userCodes = JSON.parse(student.SubmittedCodes);
      } catch (e) {
        userCodes = {};
      }
    }

    res.json({
      usn: normalizedUsn,
      name: normalizedName,
      streak: Number(student.Streak) || 1,
      completedProblems,
      completedQuizzes,
      userCodes,
      message: "Welcome back! Your progression has been synchronized from the local Excel database."
    });
  } else {
    // New registration
    const todayStr = new Date().toISOString().split("T")[0];
    const newStudent = {
      USN: normalizedUsn,
      Name: normalizedName,
      Streak: 1,
      CompletedProblemsCount: 0,
      CompletedProblemsList: "",
      CompletedQuizzesCount: 0,
      CompletedQuizzesList: "{}",
      CodingMarks: 0,
      QuizMarks: 0,
      TotalMarks: 0,
      Grade: "F",
      CertificateEarned: "No",
      LastActiveDate: todayStr,
      RegistrationTime: new Date().toISOString(),
      SubmittedCodes: "{}"
    };

    students.push(newStudent);
    saveExcelData(students);

    res.json({
      usn: normalizedUsn,
      name: normalizedName,
      streak: 1,
      completedProblems: [],
      completedQuizzes: {},
      userCodes: {},
      message: "Registration successful! A new record has been created in the local server excel spreadsheet."
    });
  }
});

// 2. Save Progress
app.post("/api/students/progress", (req: express.Request, res: express.Response) => {
  const { usn, name, streak, completedProblems, completedQuizzes, certificateEarned, userCodes } = req.body;
  if (!usn) {
    res.status(400).json({ error: "USN is required" });
    return;
  }

  const normalizedUsn = usn.trim().toUpperCase();
  const students = getExcelData();
  let studentIndex = students.findIndex((s: any) => String(s.USN).toUpperCase() === normalizedUsn);

  const todayStr = new Date().toISOString().split("T")[0];

  const listStr = Array.isArray(completedProblems) ? completedProblems.join(",") : "";
  const quizzesStr = completedQuizzes ? JSON.stringify(completedQuizzes) : "{}";

  // Calculate detailed grades and scores
  const codingMarks = calculateCodingMarks(listStr);
  let quizMarks = 0;
  if (completedQuizzes) {
    for (const key of Object.keys(completedQuizzes)) {
      quizMarks += (Number(completedQuizzes[key]) || 0) * 2; // 2 marks per correct answer
    }
  }

  const totalMarks = codingMarks + quizMarks;
  const pct = (totalMarks / 500) * 100;
  let grade = "F";
  if (pct >= 90) grade = "S";
  else if (pct >= 80) grade = "A";
  else if (pct >= 70) grade = "B";
  else if (pct >= 60) grade = "C";
  else if (pct >= 50) grade = "D";

  const submittedCodesStr = userCodes ? JSON.stringify(userCodes) : "{}";

  // Write physical .java files to server directory for instructors to verify directly
  if (userCodes) {
    try {
      const subDir = path.join(process.cwd(), "submissions", normalizedUsn);
      if (!fs.existsSync(subDir)) {
        fs.mkdirSync(subDir, { recursive: true });
      }
      for (const [probId, codeText] of Object.entries(userCodes)) {
        if (codeText && typeof codeText === "string") {
          const match = codeText.match(/public\s+class\s+(\w+)/) || codeText.match(/class\s+(\w+)/);
          const className = match ? match[1] : probId;
          fs.writeFileSync(path.join(subDir, `${className}.java`), codeText);
        }
      }
    } catch (err) {
      console.error("Error writing submissions to disk:", err);
    }
  }

  if (studentIndex >= 0) {
    // Update existing
    students[studentIndex].Streak = Number(streak) || 1;
    students[studentIndex].CompletedProblemsCount = Array.isArray(completedProblems) ? completedProblems.length : 0;
    students[studentIndex].CompletedProblemsList = listStr;
    students[studentIndex].CompletedQuizzesCount = completedQuizzes ? Object.keys(completedQuizzes).length : 0;
    students[studentIndex].CompletedQuizzesList = quizzesStr;
    students[studentIndex].CodingMarks = codingMarks;
    students[studentIndex].QuizMarks = quizMarks;
    students[studentIndex].TotalMarks = totalMarks;
    students[studentIndex].Grade = grade;
    students[studentIndex].CertificateEarned = certificateEarned ? "Yes" : "No";
    students[studentIndex].LastActiveDate = todayStr;
    students[studentIndex].SubmittedCodes = submittedCodesStr;
  } else {
    // Fallback registration
    const newStudent = {
      USN: normalizedUsn,
      Name: name ? name.trim() : "Unknown",
      Streak: Number(streak) || 1,
      CompletedProblemsCount: Array.isArray(completedProblems) ? completedProblems.length : 0,
      CompletedProblemsList: listStr,
      CompletedQuizzesCount: completedQuizzes ? Object.keys(completedQuizzes).length : 0,
      CompletedQuizzesList: quizzesStr,
      CodingMarks: codingMarks,
      QuizMarks: quizMarks,
      TotalMarks: totalMarks,
      Grade: grade,
      CertificateEarned: certificateEarned ? "Yes" : "No",
      LastActiveDate: todayStr,
      RegistrationTime: new Date().toISOString(),
      SubmittedCodes: submittedCodesStr
    };
    students.push(newStudent);
  }

  saveExcelData(students);
  res.json({ status: "success", message: "Progress and grades synchronized with Excel database." });
});

// 3. Admin: Get all student records
app.get("/api/admin/students", (req: express.Request, res: express.Response) => {
  const students = getExcelData();
  res.json(students);
});

// 4. Download Excel File endpoint
app.get("/api/admin/download-excel", (req: express.Request, res: express.Response) => {
  if (fs.existsSync(EXCEL_FILE)) {
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=student_progress.xlsx");
    const stream = fs.createReadStream(EXCEL_FILE);
    stream.pipe(res);
  } else {
    res.status(404).json({ error: "Excel file not found yet" });
  }
});

// Vite middleware / SPA fallback setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
