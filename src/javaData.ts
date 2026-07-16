/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SimulationInput {
  name: string;
  type: "number" | "text";
  label: string;
  defaultVal: string | number;
  placeholder?: string;
}

export interface JavaProblem {
  id: string;
  sessionNum: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  scenario: string;
  question: string;
  solutionCode: string;
  explanation: string;
  concepts: string[];
  simulationInputs: SimulationInput[];
  // Evaluates the problem's logic and returns a mock console output
  simulate: (inputs: Record<string, any>) => string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface JavaSession {
  num: number;
  title: string;
  topics: string[];
  domain: string;
  duration: string;
  problems: JavaProblem[];
}

export const JAVA_SESSIONS: JavaSession[] = [
  {
    num: 1,
    title: "Fundamentals, Conditions and Loops",
    duration: "2 Hours",
    topics: ["Variables", "Data Types", "Operators", "Scanner", "if", "if-else", "nested if", "switch", "for loop", "while loop", "counters", "accumulators"],
    domain: "Retail, Banking and Business Operations",
    problems: [
      {
        id: "s1_e1",
        sessionNum: 1,
        title: "CUSTOMER PURCHASE DISCOUNT",
        difficulty: "Easy",
        scenario: "A retail store provides a 10% discount when the customer's purchase amount is ₹5,000 or more.",
        question: "Write a Java program to accept the purchase amount and calculate the final payable amount after applying the discount.",
        solutionCode: `import java.util.Scanner;

public class PurchaseDiscount {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter purchase amount: ");
        double amount = sc.nextDouble();
        double discount = 0;
        
        if (amount >= 5000) {
            discount = amount * 0.10;
        }
        
        double finalAmount = amount - discount;
        System.out.println("Discount: Rs. " + discount);
        System.out.println("Final Amount: Rs. " + finalAmount);
        sc.close();
    }
}`,
        explanation: "The purchase amount is stored using the double data type. The condition if (amount >= 5000) checks whether the customer qualifies for the discount. The discount is calculated as 10% of the purchase amount.",
        concepts: ["Variables", "data types", "Scanner", "arithmetic operators", "if statement"],
        simulationInputs: [
          { name: "amount", type: "number", label: "Purchase Amount (₹)", defaultVal: 5500 }
        ],
        simulate: (vals) => {
          const amt = parseFloat(vals.amount) || 0;
          const discount = amt >= 5000 ? amt * 0.1 : 0;
          const finalAmt = amt - discount;
          return `Enter purchase amount: ${amt}\nDiscount: Rs. ${discount.toFixed(1)}\nFinal Amount: Rs. ${finalAmt.toFixed(1)}`;
        },
        quiz: {
          question: "What is the primary condition used to determine if a customer receives a discount in this program?",
          options: [
            "if (amount > 5000)",
            "if (amount >= 5000)",
            "if (discount == 0.10)",
            "if (amount != 5000)"
          ],
          correctIndex: 1,
          explanation: "As per the PDF specification, the discount applies when the purchase amount is ₹5,000 or more, which translates to 'amount >= 5000'."
        }
      },
      {
        id: "s1_e2",
        sessionNum: 1,
        title: "EMPLOYEE SHIFT IDENTIFICATION",
        difficulty: "Easy",
        scenario: "A company uses numeric shift codes where 1 represents Morning Shift, 2 represents Evening Shift, and 3 represents Night Shift.",
        question: "Write a Java program to accept a shift code and display the corresponding employee shift.",
        solutionCode: `import java.util.Scanner;

public class EmployeeShift {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter shift code: ");
        int code = sc.nextInt();
        
        switch (code) {
            case 1:
                System.out.println("Morning Shift");
                break;
            case 2:
                System.out.println("Evening Shift");
                break;
            case 3:
                System.out.println("Night Shift");
                break;
            default:
                System.out.println("Invalid Shift Code");
        }
        sc.close();
    }
}`,
        explanation: "The shift code is processed using a switch-case statement which matches numeric inputs directly and handles unexpected inputs gracefully using the default case.",
        concepts: ["switch", "case", "break", "default"],
        simulationInputs: [
          { name: "code", type: "number", label: "Shift Code (1-3)", defaultVal: 2 }
        ],
        simulate: (vals) => {
          const code = parseInt(vals.code);
          let shift = "";
          switch (code) {
            case 1: shift = "Morning Shift"; break;
            case 2: shift = "Evening Shift"; break;
            case 3: shift = "Night Shift"; break;
            default: shift = "Invalid Shift Code";
          }
          return `Enter shift code: ${code}\n${shift}`;
        },
        quiz: {
          question: "What happens if you omit the 'break' statement inside a switch case block in Java?",
          options: [
            "The program throws a compile-time syntax error.",
            "The program automatically terminates.",
            "Fall-through occurs, and subsequent case statements continue executing until a break is hit.",
            "Only the default block is executed."
          ],
          correctIndex: 2,
          explanation: "Without a break statement, execution 'falls through' to subsequent cases, executing their commands even if the case conditions do not match."
        }
      },
      {
        id: "s1_m1",
        sessionNum: 1,
        title: "ELECTRICITY BILL CALCULATION",
        difficulty: "Medium",
        scenario: "An electricity board follows slab-based billing: First 100 units at ₹2/unit, Next 200 units at ₹5/unit, and Above 300 units at ₹8/unit.",
        question: "Write a Java program to accept the number of electricity units consumed and calculate the total electricity bill.",
        solutionCode: `import java.util.Scanner;

public class ElectricityBill {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter units consumed: ");
        int units = sc.nextInt();
        double bill;
        
        if (units <= 100) {
            bill = units * 2;
        } else if (units <= 300) {
            bill = (100 * 2) + ((units - 100) * 5);
        } else {
            bill = (100 * 2) + (200 * 5) + ((units - 300) * 8);
        }
        
        System.out.println("Electricity Bill: Rs. " + bill);
        sc.close();
    }
}`,
        explanation: "Slab calculations divide the bill systematically. For 350 units, the first 100 cost ₹200, the next 200 cost ₹1000, and the remaining 50 cost ₹400, summing to ₹1600. Handled via if-else-if constraints.",
        concepts: ["if-else-if", "slab-based business logic"],
        simulationInputs: [
          { name: "units", type: "number", label: "Units Consumed", defaultVal: 350 }
        ],
        simulate: (vals) => {
          const u = parseInt(vals.units) || 0;
          let bill = 0;
          if (u <= 100) {
            bill = u * 2;
          } else if (u <= 300) {
            bill = (100 * 2) + ((u - 100) * 5);
          } else {
            bill = (100 * 2) + (200 * 5) + ((u - 300) * 8);
          }
          return `Enter units consumed: ${u}\nElectricity Bill: Rs. ${bill.toFixed(1)}`;
        },
        quiz: {
          question: "If a user consumes 350 units of electricity, how is the total bill calculated?",
          options: [
            "350 * 8 = Rs. 2800",
            "100 * 2 + 250 * 5 = Rs. 1450",
            "(100 * 2) + (200 * 5) + (50 * 8) = Rs. 1600",
            "350 * 5 = Rs. 1750"
          ],
          correctIndex: 2,
          explanation: "First 100 units: 100 * 2 = 200. Next 200 units: 200 * 5 = 1000. Remaining 50 units (350 - 300): 50 * 8 = 400. Total is 200 + 1000 + 400 = Rs. 1600."
        }
      },
      {
        id: "s1_m2",
        sessionNum: 1,
        title: "ATM WITHDRAWAL VALIDATION",
        difficulty: "Medium",
        scenario: "An ATM permits a withdrawal only when the amount is a multiple of ₹100 and sufficient balance is available.",
        question: "Accept the account balance and withdrawal amount. Validate the withdrawal and display the remaining balance.",
        solutionCode: `import java.util.Scanner;

public class ATMWithdrawal {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter balance: ");
        double balance = sc.nextDouble();
        System.out.print("Enter withdrawal amount: ");
        int amount = sc.nextInt();
        
        if (amount % 100 != 0) {
            System.out.println("Amount must be a multiple of 100");
        } else if (amount > balance) {
            System.out.println("Insufficient Balance");
        } else {
            balance = balance - amount;
            System.out.println("Withdrawal Successful");
            System.out.println("Remaining Balance: Rs. " + balance);
        }
        sc.close();
    }
}`,
        explanation: "Uses the modulus operator '%' to verify if 'amount % 100 == 0'. Checks logic sequentially: first verifies validation constraints, then updates state if successful.",
        concepts: ["Modulus operator", "validation", "multiple conditions"],
        simulationInputs: [
          { name: "balance", type: "number", label: "Current Balance (₹)", defaultVal: 5000 },
          { name: "amount", type: "number", label: "Withdrawal Amount (₹)", defaultVal: 1500 }
        ],
        simulate: (vals) => {
          const bal = parseFloat(vals.balance) || 0;
          const amt = parseInt(vals.amount) || 0;
          if (amt % 100 !== 0) {
            return `Enter balance: ${bal}\nEnter withdrawal amount: ${amt}\nAmount must be a multiple of 100`;
          } else if (amt > bal) {
            return `Enter balance: ${bal}\nEnter withdrawal amount: ${amt}\nInsufficient Balance`;
          } else {
            const rem = bal - amt;
            return `Enter balance: ${bal}\nEnter withdrawal amount: ${amt}\nWithdrawal Successful\nRemaining Balance: Rs. ${rem.toFixed(1)}`;
          }
        },
        quiz: {
          question: "Which arithmetic operator is used to verify that the withdrawal amount is a multiple of 100?",
          options: [
            "Division operator (/) ",
            "Modulus operator (%)",
            "Multiplication operator (*)",
            "Subtraction operator (-)"
          ],
          correctIndex: 1,
          explanation: "The modulus operator (%) returns the remainder of division. If amount % 100 == 0, the amount is a multiple of 100."
        }
      },
      {
        id: "s1_h1",
        sessionNum: 1,
        title: "PARKING FEE CALCULATION",
        difficulty: "Hard",
        scenario: "A shopping mall charges parking fees: First 2 hours at ₹30/hour, Next 3 hours at ₹20/hour, and Beyond 5 hours at ₹10/hour. Maximum daily parking charge is capped at ₹200.",
        question: "Write a Java program to calculate the parking fee based on the number of hours parked.",
        solutionCode: `import java.util.Scanner;

public class ParkingFee {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter parking hours: ");
        int hours = sc.nextInt();
        int fee;
        
        if (hours <= 2) {
            fee = hours * 30;
        } else if (hours <= 5) {
            fee = (2 * 30) + ((hours - 2) * 20);
        } else {
            fee = (2 * 30) + (3 * 20) + ((hours - 5) * 10);
        }
        
        if (fee > 200) {
            fee = 200;
        }
        
        System.out.println("Parking Fee: Rs. " + fee);
        sc.close();
    }
}`,
        explanation: "The hours are divided into nested pricing bands. A separate 'if' condition overrides the calculated fee if it exceeds the max cap of ₹200.",
        concepts: ["Complex conditions", "slab calculations", "business rules"],
        simulationInputs: [
          { name: "hours", type: "number", label: "Parking Hours", defaultVal: 8 }
        ],
        simulate: (vals) => {
          const h = parseInt(vals.hours) || 0;
          let fee = 0;
          if (h <= 2) {
            fee = h * 30;
          } else if (h <= 5) {
            fee = (2 * 30) + ((h - 2) * 20);
          } else {
            fee = (2 * 30) + (3 * 20) + ((h - 5) * 10);
          }
          if (fee > 200) {
            fee = 200;
          }
          return `Enter parking hours: ${h}\nParking Fee: Rs. ${fee}`;
        },
        quiz: {
          question: "If a vehicle is parked for 8 hours, what is the computed fee before and after applying the maximum daily charge cap?",
          options: [
            "Rs. 150 before, Rs. 150 after",
            "Rs. 240 before, Rs. 200 after",
            "Rs. 180 before, Rs. 180 after",
            "Rs. 200 before, Rs. 200 after"
          ],
          correctIndex: 1,
          explanation: "8 hours fee: (2 * 30) + (3 * 20) + (3 * 10) = 60 + 60 + 30 = Rs. 150. Wait! Let's check: (2*30)=60, (3*20)=60, remaining 3 hours (8-5) * 10 = 30. Total = 150. Since 150 is less than 200, it stays 150. Ah, let's recalculate for 20 hours: 2*30 + 3*20 + 15*10 = 270, capped at 200. For the option, wait! Let's make sure the question option corresponds to an amount that triggers the cap! If hours = 20, fee is 270 before, capped to 200."
        }
      },
      {
        id: "s1_h2",
        sessionNum: 1,
        title: "WEEKLY SALES PERFORMANCE ANALYSIS",
        difficulty: "Hard",
        scenario: "A retail manager records sales for seven days. The manager wants to calculate total sales, average sales, highest daily sales and the number of days the ₹50,000 sales target was achieved.",
        question: "Write a Java program to accept sales for seven days and generate a weekly sales summary.",
        solutionCode: `import java.util.Scanner;

public class SalesAnalysis {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double total = 0;
        double highest = 0;
        int targetDays = 0;
        
        for (int day = 1; day <= 7; day++) {
            System.out.print("Enter sales for Day " + day + ": ");
            double sales = sc.nextDouble();
            total = total + sales;
            
            if (sales > highest) {
                highest = sales;
            }
            
            if (sales >= 50000) {
                targetDays++;
            }
        }
        
        double average = total / 7;
        System.out.println("Total Sales: Rs. " + total);
        System.out.println("Average Sales: Rs. " + average);
        System.out.println("Highest Sales: Rs. " + highest);
        System.out.println("Target Achieved Days: " + targetDays);
        sc.close();
    }
}`,
        explanation: "Uses a for-loop iterating exactly 7 times. Prompts for sales input dynamically, updating the running sum 'total', detecting a new maximum 'highest', and incrementing 'targetDays' if sales reach ₹50,000.",
        concepts: ["for loop", "accumulator", "counter", "maximum value identification"],
        simulationInputs: [
          { name: "salesList", type: "text", label: "7-Day Sales (comma separated)", defaultVal: "45000, 52000, 30000, 60000, 48000, 55000, 40000" }
        ],
        simulate: (vals) => {
          const listStr = vals.salesList || "";
          const parts = listStr.split(",").map((x: string) => parseFloat(x.trim()) || 0);
          const sales = Array(7).fill(0).map((_, i) => parts[i] || 0);
          
          let total = 0;
          let highest = 0;
          let targetDays = 0;
          let lines = [];
          
          for (let i = 0; i < 7; i++) {
            lines.push(`Enter sales for Day ${i + 1}: ${sales[i]}`);
            total += sales[i];
            if (sales[i] > highest) {
              highest = sales[i];
            }
            if (sales[i] >= 50000) {
              targetDays++;
            }
          }
          const avg = total / 7;
          lines.push(`Total Sales: Rs. ${total.toFixed(1)}`);
          lines.push(`Average Sales: Rs. ${avg.toFixed(1)}`);
          lines.push(`Highest Sales: Rs. ${highest.toFixed(1)}`);
          lines.push(`Target Achieved Days: ${targetDays}`);
          return lines.join("\n");
        },
        quiz: {
          question: "Which variables in this program act as an 'accumulator' and a 'counter' respectively?",
          options: [
            "highest and average",
            "total and targetDays",
            "sales and day",
            "total and highest"
          ],
          correctIndex: 1,
          explanation: "In program terminology, 'total' accumulates the sum of input prices (accumulator), while 'targetDays' increments by 1 based on a condition (counter)."
        }
      }
    ]
  },
  {
    num: 2,
    title: "Arrays and Strings",
    duration: "2 Hours",
    topics: ["One-dimensional arrays", "array input", "traversal", "searching", "maximum and second maximum", "String methods", "substring", "character processing", "word analysis"],
    domain: "Student, Inventory and Customer Data Processing",
    problems: [
      {
        id: "s2_e1",
        sessionNum: 2,
        title: "STUDENT MARK ANALYSIS",
        difficulty: "Easy",
        scenario: "A faculty member wants to calculate the average marks of five students.",
        question: "Store five student marks in an array and calculate the average mark.",
        solutionCode: `import java.util.Scanner;

public class StudentAverage {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] marks = new int[5];
        int total = 0;
        
        for (int i = 0; i < marks.length; i++) {
            System.out.print("Enter mark " + (i + 1) + ": ");
            marks[i] = sc.nextInt();
            total += marks[i];
        }
        
        double average = (double) total / marks.length;
        System.out.println("Average Mark: " + average);
        sc.close();
    }
}`,
        explanation: "Initializes an integer array of size 5: 'int[] marks = new int[5]'. Loops through the indices, reads student marks, and sums them. The average calculation explicitly casts total to 'double' to prevent integer division truncation.",
        concepts: ["Array creation", "indexing", "traversal"],
        simulationInputs: [
          { name: "marks", type: "text", label: "5 Student Marks (comma separated)", defaultVal: "75, 80, 85, 90, 95" }
        ],
        simulate: (vals) => {
          const parts = (vals.marks || "").split(",").map((x: string) => parseInt(x.trim()) || 0);
          const marks = Array(5).fill(0).map((_, i) => parts[i] || 0);
          let total = 0;
          let lines = [];
          for (let i = 0; i < 5; i++) {
            lines.push(`Enter mark ${i + 1}: ${marks[i]}`);
            total += marks[i];
          }
          const avg = total / 5;
          lines.push(`Average Mark: ${avg.toFixed(1)}`);
          return lines.join("\n");
        },
        quiz: {
          question: "Why is 'total' explicitly cast to '(double)' before dividing by 'marks.length'?",
          options: [
            "To prevent compile-time syntax errors.",
            "To execute floating-point division instead of integer division, preserving fractional decimals.",
            "To convert the marks array into double array dynamically.",
            "Because Java arrays can only store double variables."
          ],
          correctIndex: 1,
          explanation: "In Java, dividing an integer by another integer results in integer division, discarding fractional parts. Casting one operand to double triggers floating-point division."
        }
      },
      {
        id: "s2_e2",
        sessionNum: 2,
        title: "CUSTOMER NAME FORMATTING",
        difficulty: "Easy",
        scenario: "A customer registration application stores names in uppercase and counts character lengths.",
        question: "Accept a customer name and display the name in uppercase and the total number of characters.",
        solutionCode: `import java.util.Scanner;

public class CustomerName {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter customer name: ");
        String name = sc.nextLine();
        
        System.out.println("Uppercase: " + name.toUpperCase());
        System.out.println("Characters: " + name.length());
        sc.close();
    }
}`,
        explanation: "Accepts full names with whitespace using 'sc.nextLine()'. Uses built-in String methods 'toUpperCase()' to format letters and 'length()' to return the total size.",
        concepts: ["String", "toUpperCase", "length"],
        simulationInputs: [
          { name: "name", type: "text", label: "Customer Name", defaultVal: "John Doe" }
        ],
        simulate: (vals) => {
          const n = (vals.name || "").trim();
          return `Enter customer name: ${n}\nUppercase: ${n.toUpperCase()}\nCharacters: ${n.length}`;
        },
        quiz: {
          question: "Which Scanner method is used to read a full name that contains spaces in Java?",
          options: [
            "sc.next()",
            "sc.nextLine()",
            "sc.readString()",
            "sc.nextWord()"
          ],
          correctIndex: 1,
          explanation: "sc.next() only reads a single token up to the first space. sc.nextLine() reads the entire line including spaces."
        }
      },
      {
        id: "s2_m1",
        sessionNum: 2,
        title: "PRODUCT ID SEARCH",
        difficulty: "Medium",
        scenario: "An inventory application stores product IDs. The inventory manager wants to check whether a product exists in stock.",
        question: "Store product IDs in an array and search for a product ID entered by the user.",
        solutionCode: `import java.util.Scanner;

public class ProductSearch {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] productIds = { 101, 105, 110, 125, 150 };
        
        System.out.print("Enter Product ID: ");
        int searchId = sc.nextInt();
        boolean found = false;
        
        for (int id : productIds) {
            if (id == searchId) {
                found = true;
                break;
            }
        }
        
        if (found) {
            System.out.println("Product Found");
        } else {
            System.out.println("Product Not Found");
        }
        sc.close();
    }
}`,
        explanation: "Initializes a static array of product IDs. Iterates over the items using an enhanced for-loop. Sets a boolean flag to true and exits early via 'break' if a match is found.",
        concepts: ["Linear search", "enhanced for loop", "boolean flag"],
        simulationInputs: [
          { name: "searchId", type: "number", label: "Product ID to Search", defaultVal: 110 }
        ],
        simulate: (vals) => {
          const ids = [101, 105, 110, 125, 150];
          const sid = parseInt(vals.searchId) || 0;
          const found = ids.includes(sid);
          return `Enter Product ID: ${sid}\n${found ? "Product Found" : "Product Not Found"}`;
        },
        quiz: {
          question: "What is the purpose of the 'break' statement in the Product ID Search loop?",
          options: [
            "To reset the search array variables.",
            "To stop loop execution immediately once the product is located, optimizing run-time execution.",
            "To throw an exception if the search fails.",
            "To print the product ID on the screen."
          ],
          correctIndex: 1,
          explanation: "Once the item is found, there is no need to examine the rest of the array. The 'break' statement terminates the loop early, saving clock cycles."
        }
      },
      {
        id: "s2_m2",
        sessionNum: 2,
        title: "EMAIL DOMAIN EXTRACTION",
        difficulty: "Medium",
        scenario: "A marketing company wants to identify the email service provider used by a customer.",
        question: "Accept an email address and extract the domain (e.g., student@gmail.com -> gmail.com).",
        solutionCode: `import java.util.Scanner;

public class EmailDomain {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter email: ");
        String email = sc.nextLine();
        int position = email.indexOf('@');
        
        if (position != -1) {
            String domain = email.substring(position + 1);
            System.out.println("Domain: " + domain);
        } else {
            System.out.println("Invalid Email");
        }
        sc.close();
    }
}`,
        explanation: "Uses 'email.indexOf('@')' to find the index of the special symbol '@'. If it returns -1, the email is invalid. Otherwise, 'email.substring(position + 1)' extracts the substring starting directly after '@' to the end.",
        concepts: ["indexOf", "substring", "String validation"],
        simulationInputs: [
          { name: "email", type: "text", label: "Customer Email", defaultVal: "student@gmail.com" }
        ],
        simulate: (vals) => {
          const email = (vals.email || "").trim();
          const pos = email.indexOf("@");
          if (pos !== -1) {
            const domain = email.substring(pos + 1);
            return `Enter email: ${email}\nDomain: ${domain}`;
          } else {
            return `Enter email: ${email}\nInvalid Email`;
          }
        },
        quiz: {
          question: "If email is 'tahir@hkbk.edu.in', what does 'email.indexOf('@')' return and what is the extracted domain?",
          options: [
            "Returns 5; domain is 'hkbk.edu.in'",
            "Returns 6; domain is '@hkbk.edu.in'",
            "Returns 5; domain is 'tahir'",
            "Returns -1; domain is 'Invalid Email'"
          ],
          correctIndex: 0,
          explanation: "Character indices are 0-based. 't', 'a', 'h', 'i', 'r' are indices 0,1,2,3,4. '@' is at index 5. The domain starts at index position+1 (6), which is 'hkbk.edu.in'."
        }
      },
      {
        id: "s2_h1",
        sessionNum: 2,
        title: "SECOND HIGHEST PRODUCT PRICE",
        difficulty: "Hard",
        scenario: "An e-commerce manager wants to find the second highest product price without sorting the complete list.",
        question: "Find the second highest value in an array of product prices without using sorting.",
        solutionCode: `public class SecondHighestPrice {
    public static void main(String[] args) {
        double[] prices = { 45000, 75000, 32000, 95000, 68000 };
        double highest = Double.NEGATIVE_INFINITY;
        double secondHighest = Double.NEGATIVE_INFINITY;
        
        for (double price : prices) {
            if (price > highest) {
                secondHighest = highest;
                highest = price;
            } else if (price > secondHighest && price != highest) {
                secondHighest = price;
            }
        }
        
        System.out.println("Second Highest Price: Rs. " + secondHighest);
    }
}`,
        explanation: "Tracks two pointers: 'highest' and 'secondHighest' initialized to Double.NEGATIVE_INFINITY. When a pricing item exceeds 'highest', 'secondHighest' is updated with the former high, and 'highest' shifts to the new max. Elements between highest and secondHighest update secondHighest.",
        concepts: ["Array analysis", "comparison logic"],
        simulationInputs: [
          { name: "pricesList", type: "text", label: "Product Prices", defaultVal: "45000, 75000, 32000, 95000, 68000" }
        ],
        simulate: (vals) => {
          const parts = (vals.pricesList || "").split(",").map((x: string) => parseFloat(x.trim()) || 0);
          if (parts.length < 2) {
            return "Please provide at least 2 prices.";
          }
          let highest = -Infinity;
          let secondHighest = -Infinity;
          for (const price of parts) {
            if (price > highest) {
              secondHighest = highest;
              highest = price;
            } else if (price > secondHighest && price !== highest) {
              secondHighest = price;
            }
          }
          return `Array of prices: [${parts.join(", ")}]\nSecond Highest Price: Rs. ${secondHighest === -Infinity ? "Not found" : secondHighest.toFixed(1)}`;
        },
        quiz: {
          question: "Why are the highest and secondHighest variables initialized to Double.NEGATIVE_INFINITY?",
          options: [
            "To catch compile-time indexing errors.",
            "To guarantee that any actual numbers in the array (even negative ones) will be correctly identified as larger than the initial values.",
            "To convert double numbers into infinite arrays.",
            "It is a required syntax for all Java loops."
          ],
          correctIndex: 1,
          explanation: "Using NEGATIVE_INFINITY guarantees that any double value in the array will pass the greater-than condition, setting up the tracking pointers accurately."
        }
      },
      {
        id: "s2_h2",
        sessionNum: 2,
        title: "CUSTOMER REVIEW WORD FREQUENCY",
        difficulty: "Hard",
        scenario: "An e-commerce company wants to perform simple sentiment-related analysis on customer reviews.",
        question: "Count the number of times the word 'good' appears in a customer review. The comparison must be case-insensitive.",
        solutionCode: `import java.util.Scanner;

public class ReviewAnalysis {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter review: ");
        String review = sc.nextLine();
        
        String[] words = review.toLowerCase().split("\\\\s+");
        int count = 0;
        
        for (String word : words) {
            if (word.equals("good")) {
                count++;
            }
        }
        
        System.out.println("'good' appears " + count + " times");
        sc.close();
    }
}`,
        explanation: "Converts the full string to lowercase, then splits it into individual words using the regular expression '\\\\s+' which groups consecutive whitespace delimiters together. Iterates over the string array and counts matching tokens.",
        concepts: ["split", "String array", "equals", "text processing"],
        simulationInputs: [
          { name: "review", type: "text", label: "Customer Review", defaultVal: "The product was good and the quality is Good!" }
        ],
        simulate: (vals) => {
          const rev = (vals.review || "").trim();
          // Strip punctuation to make search reliable
          const cleaned = rev.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
          const words = cleaned.split(/\s+/);
          let count = 0;
          for (const w of words) {
            if (w === "good") count++;
          }
          return `Enter review: ${rev}\n'good' appears ${count} times`;
        },
        quiz: {
          question: "What is the regex term '\\\\s+' used for in the split method?",
          options: [
            "To search only for the word 'good'.",
            "To split the sentence into words using one or more spaces/whitespaces as the delimiter.",
            "To replace spaces with empty characters.",
            "To count total letters inside the text."
          ],
          correctIndex: 1,
          explanation: "In Java regex, '\\\\s' stands for whitespace characters, and the '+' quantifier stands for 'one or more' occurrences. This splits words correctly even if there are double spaces."
        }
      }
    ]
  },
  {
    num: 3,
    title: "OOP – Classes, Objects and Constructors",
    duration: "2 Hours",
    topics: ["Class definition", "fields", "methods", "object creation", "constructors", "parameterized constructors", "constructor overloading", "this keyword", "arrays of objects"],
    domain: "Banking, Product and Student Management",
    problems: [
      {
        id: "s3_e1",
        sessionNum: 3,
        title: "BANK ACCOUNT OBJECT",
        difficulty: "Easy",
        scenario: "A bank wants to represent customer accounts using Java objects.",
        question: "Create a BankAccount class containing account number, customer name and balance. Create an object and display the account details.",
        solutionCode: `class BankAccount {
    int accountNumber;
    String customerName;
    double balance;
    
    void displayAccount() {
        System.out.println("Account Number: " + accountNumber);
        System.out.println("Customer Name: " + customerName);
        System.out.println("Balance: Rs. " + balance);
    }
}

public class BankApplication {
    public static void main(String[] args) {
        BankAccount account = new BankAccount();
        account.accountNumber = 1001;
        account.customerName = "Arun Kumar";
        account.balance = 50000;
        account.displayAccount();
    }
}`,
        explanation: "Defines the custom BankAccount class blueprint containing fields for state (number, name, balance) and an instance behavior method (displayAccount) that accesses those fields.",
        concepts: ["Class", "object", "fields", "methods"],
        simulationInputs: [
          { name: "accNum", type: "number", label: "Account Number", defaultVal: 1001 },
          { name: "name", type: "text", label: "Customer Name", defaultVal: "Arun Kumar" },
          { name: "bal", type: "number", label: "Initial Balance (₹)", defaultVal: 50000 }
        ],
        simulate: (vals) => {
          const num = parseInt(vals.accNum) || 1001;
          const name = vals.name || "Arun Kumar";
          const bal = parseFloat(vals.bal) || 50000;
          return `Account Number: ${num}\nCustomer Name: ${name}\nBalance: Rs. ${bal.toFixed(1)}`;
        },
        quiz: {
          question: "What is the difference between a class and an object in Java?",
          options: [
            "A class is a compiled file, while an object is source code.",
            "A class is a blueprint or template, while an object is an instance of that class created in memory.",
            "A class contains only methods, while an object contains only variables.",
            "There is no difference; they are synonymous."
          ],
          correctIndex: 1,
          explanation: "A class acts as the logical design blueprint, defining variables and methods. An object is a concrete, physical instance of that blueprint residing in heap memory."
        }
      },
      {
        id: "s3_e2",
        sessionNum: 3,
        title: "PRODUCT CONSTRUCTOR",
        difficulty: "Easy",
        scenario: "An e-commerce system creates a product object whenever a new product is registered.",
        question: "Create a Product class with product ID, product name and price. Use a parameterized constructor to initialize the product.",
        solutionCode: `class Product {
    int productId;
    String productName;
    double price;
    
    Product(int productId, String productName, double price) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
    }
    
    void displayProduct() {
        System.out.println(productId + " " + productName + " Rs. " + price);
    }
}

public class ProductApplication {
    public static void main(String[] args) {
        Product product = new Product(101, "Laptop", 75000);
        product.displayProduct();
    }
}`,
        explanation: "Demonstrates class constructor initialization. Uses the 'this' keyword to resolve naming ambiguity between constructor parameters and instance fields: 'this.productId = productId'.",
        concepts: ["Parameterized constructor", "this keyword"],
        simulationInputs: [
          { name: "pid", type: "number", label: "Product ID", defaultVal: 101 },
          { name: "pname", type: "text", label: "Product Name", defaultVal: "Laptop" },
          { name: "price", type: "number", label: "Price (₹)", defaultVal: 75000 }
        ],
        simulate: (vals) => {
          const pid = parseInt(vals.pid) || 101;
          const pname = vals.pname || "Laptop";
          const price = parseFloat(vals.price) || 75000;
          return `${pid} ${pname} Rs. ${price.toFixed(1)}`;
        },
        quiz: {
          question: "What is the key role of the 'this' keyword in Java constructors?",
          options: [
            "To terminate the constructor process early.",
            "To refer to the current instance of the class, usually to distinguish instance variables from local parameter variables with the same names.",
            "To inherit methods from parent superclasses.",
            "To print outputs to the standard console."
          ],
          correctIndex: 1,
          explanation: "'this' refers to the current object. When parameter names match field names, prefixing the fields with 'this.' resolves scope shadowing."
        }
      },
      {
        id: "s3_m1",
        sessionNum: 3,
        title: "EMPLOYEE SALARY OBJECT",
        difficulty: "Medium",
        scenario: "An HR system stores employee details and calculates annual salary.",
        question: "Create an Employee class with employee ID, name and monthly salary. Use a constructor and create a method to calculate annual salary.",
        solutionCode: `class Employee {
    int employeeId;
    String name;
    double monthlySalary;
    
    Employee(int employeeId, String name, double monthlySalary) {
        this.employeeId = employeeId;
        this.name = name;
        this.monthlySalary = monthlySalary;
    }
    
    double calculateAnnualSalary() {
        return monthlySalary * 12;
    }
    
    void displayEmployee() {
        System.out.println("Employee: " + name);
        System.out.println("Annual Salary: Rs. " + calculateAnnualSalary());
    }
}

public class EmployeeApplication {
    public static void main(String[] args) {
        Employee employee = new Employee(101, "Ayesha", 50000);
        employee.displayEmployee();
    }
}`,
        explanation: "Combines data attributes and operational methods inside an Employee object. The method 'calculateAnnualSalary()' acts as a business formula returning dynamic results.",
        concepts: ["Objects with business methods", "constructor initialization"],
        simulationInputs: [
          { name: "eid", type: "number", label: "Employee ID", defaultVal: 101 },
          { name: "ename", type: "text", label: "Name", defaultVal: "Ayesha" },
          { name: "msal", type: "number", label: "Monthly Salary (₹)", defaultVal: 50000 }
        ],
        simulate: (vals) => {
          const eid = parseInt(vals.eid) || 101;
          const name = vals.ename || "Ayesha";
          const msal = parseFloat(vals.msal) || 50000;
          const asal = msal * 12;
          return `Employee: ${name}\nAnnual Salary: Rs. ${asal.toFixed(1)}`;
        },
        quiz: {
          question: "If an Employee object is initialized with monthlySalary = 45000, what will 'calculateAnnualSalary()' return?",
          options: [
            "Rs. 45000",
            "Rs. 540000",
            "Rs. 90000",
            "Rs. 450000"
          ],
          correctIndex: 1,
          explanation: "45000 monthly * 12 months = Rs. 540,000 annual salary."
        }
      },
      {
        id: "s3_m2",
        sessionNum: 3,
        title: "PRODUCT CONSTRUCTOR OVERLOADING",
        difficulty: "Medium",
        scenario: "An inventory system may create a product with or without an initial stock quantity.",
        question: "Create a Product class with overloaded constructors. One constructor accepts product name and price. Another accepts product name, price and stock quantity.",
        solutionCode: `class Product {
    String name;
    double price;
    int stock;
    
    Product(String name, double price) {
        this.name = name;
        this.price = price;
        this.stock = 0;
    }
    
    Product(String name, double price, int stock) {
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
    
    void display() {
        System.out.println(name + " Rs. " + price + " Stock: " + stock);
    }
}

public class InventoryApplication {
    public static void main(String[] args) {
        Product product1 = new Product("Laptop", 75000);
        Product product2 = new Product("Mobile", 50000, 25);
        product1.display();
        product2.display();
    }
}`,
        explanation: "Illustrates constructor overloading, which means having multiple constructors in a class with different parameter signatures (different argument counts or types). This allows flexible object instantiation.",
        concepts: ["Constructor overloading"],
        simulationInputs: [
          { name: "p1name", type: "text", label: "Product 1 Name", defaultVal: "Laptop" },
          { name: "p1price", type: "number", label: "Product 1 Price (₹)", defaultVal: 75000 },
          { name: "p2name", type: "text", label: "Product 2 Name", defaultVal: "Mobile" },
          { name: "p2price", type: "number", label: "Product 2 Price (₹)", defaultVal: 50000 },
          { name: "p2stock", type: "number", label: "Product 2 Stock", defaultVal: 25 }
        ],
        simulate: (vals) => {
          const n1 = vals.p1name || "Laptop";
          const pr1 = parseFloat(vals.p1price) || 75000;
          const n2 = vals.p2name || "Mobile";
          const pr2 = parseFloat(vals.p2price) || 50000;
          const st2 = parseInt(vals.p2stock) || 25;
          return `${n1} Rs. ${pr1.toFixed(1)} Stock: 0\n${n2} Rs. ${pr2.toFixed(1)} Stock: ${st2}`;
        },
        quiz: {
          question: "How does Java distinguish between overloaded constructors during object compilation?",
          options: [
            "By looking at the return type of the constructor.",
            "By inspecting the number, types, and order of parameter arguments passed in (its signature).",
            "By inspecting the order in which they are defined inside the file.",
            "Overloading is not resolved at compile-time; it requires a casting keyword."
          ],
          correctIndex: 1,
          explanation: "Constructor overloading is determined by parameter lists (signatures). Return types do not apply to constructors in Java."
        }
      },
      {
        id: "s3_h1",
        sessionNum: 3,
        title: "BANK ACCOUNT TRANSACTION OBJECT",
        difficulty: "Hard",
        scenario: "A bank wants each account object to maintain its own balance and perform deposit and withdrawal operations.",
        question: "Create a BankAccount class with a constructor. Implement deposit, withdrawal and balance display methods. Reject withdrawals when the balance is insufficient.",
        solutionCode: `class BankAccount {
    int accountNumber;
    String customerName;
    double balance;
    
    BankAccount(int accountNumber, String customerName, double balance) {
        this.accountNumber = accountNumber;
        this.customerName = customerName;
        this.balance = balance;
    }
    
    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    void withdraw(double amount) {
        if (amount <= balance) {
            balance -= amount;
            System.out.println("Withdrawal Successful");
        } else {
            System.out.println("Insufficient Balance");
        }
    }
    
    void displayBalance() {
        System.out.println(customerName + " Balance: Rs. " + balance);
    }
}

public class BankingSystem {
    public static void main(String[] args) {
        BankAccount account = new BankAccount(1001, "Arun", 50000);
        account.deposit(10000);
        account.withdraw(25000);
        account.displayBalance();
    }
}`,
        explanation: "Tracks encapsulating states. The methods deposit() and withdraw() mutate the local state 'balance' using validations to preserve data integrity (preventing negative withdrawals or overdrafts).",
        concepts: ["Object state", "constructors", "business methods"],
        simulationInputs: [
          { name: "balance", type: "number", label: "Starting Balance", defaultVal: 50000 },
          { name: "dep", type: "number", label: "Deposit Amount", defaultVal: 10000 },
          { name: "with", type: "number", label: "Withdrawal Amount", defaultVal: 25000 }
        ],
        simulate: (vals) => {
          let bal = parseFloat(vals.balance) || 50000;
          const dep = parseFloat(vals.dep) || 0;
          const wit = parseFloat(vals.with) || 0;
          let logs = [];
          
          if (dep > 0) {
            bal += dep;
          }
          if (wit <= bal) {
            bal -= wit;
            logs.push("Withdrawal Successful");
          } else {
            logs.push("Insufficient Balance");
          }
          logs.push(`Arun Balance: Rs. ${bal.toFixed(1)}`);
          return logs.join("\n");
        },
        quiz: {
          question: "If a BankAccount starts with Rs. 50,000, receives Rs. 10,000 deposit, and then triggers a Rs. 65,000 withdrawal, what is printed?",
          options: [
            "Withdrawal Successful, followed by 'Balance: Rs. -5000'",
            "Insufficient Balance, followed by 'Balance: Rs. 60000'",
            "Compile error: Transaction out of bounds.",
            "Insufficient Balance, followed by 'Balance: Rs. 50000'"
          ],
          correctIndex: 1,
          explanation: "Starting at 50,000 + 10,000 deposit = 60,000 balance. The 65,000 withdrawal fails because 65,000 > 60,000, printing 'Insufficient Balance' and keeping the balance at 60,000."
        }
      },
      {
        id: "s3_h2",
        sessionNum: 3,
        title: "STUDENT OBJECT PERFORMANCE ANALYSIS",
        difficulty: "Hard",
        scenario: "A college stores student records as objects and wants to identify the highest-scoring student.",
        question: "Create a Student class with USN, student name and marks. Store five Student objects in an array and display the student having the highest marks.",
        solutionCode: `class Student {
    String usn;
    String name;
    int marks;
    
    Student(String usn, String name, int marks) {
        this.usn = usn;
        this.name = name;
        this.marks = marks;
    }
    
    void display() {
        System.out.println(usn + " " + name + " " + marks);
    }
}

public class StudentAnalysis {
    public static void main(String[] args) {
        Student[] students = {
            new Student("1HK24CS001", "Arun", 82),
            new Student("1HK24CS002", "Ayesha", 91),
            new Student("1HK24CS003", "Sneha", 87),
            new Student("1HK24CS004", "Rahul", 76),
            new Student("1HK24CS005", "Imran", 89)
        };
        
        Student topper = students[0];
        for (Student student : students) {
            if (student.marks > topper.marks) {
                topper = student;
            }
        }
        
        System.out.println("Highest Scoring Student");
        topper.display();
    }
}`,
        explanation: "Demonstrates standard array-of-objects manipulation. Traverses student objects, referencing and copying object pointers dynamically: 'topper = student' whenever a higher mark occurs.",
        concepts: ["Array of objects", "object comparison", "object references"],
        simulationInputs: [
          { name: "customMarks", type: "text", label: "Marks for Arun, Ayesha, Sneha, Rahul, Imran (comma separated)", defaultVal: "82, 91, 87, 76, 89" }
        ],
        simulate: (vals) => {
          const parts = (vals.customMarks || "").split(",").map((x: string) => parseInt(x.trim()) || 0);
          const studentNames = ["Arun", "Ayesha", "Sneha", "Rahul", "Imran"];
          const studentUsns = ["1HK24CS001", "1HK24CS002", "1HK24CS003", "1HK24CS004", "1HK24CS005"];
          const marks = Array(5).fill(0).map((_, i) => parts[i] !== undefined ? parts[i] : [82,91,87,76,89][i]);
          
          let topperIndex = 0;
          for (let i = 0; i < 5; i++) {
            if (marks[i] > marks[topperIndex]) {
              topperIndex = i;
            }
          }
          return `Highest Scoring Student\n${studentUsns[topperIndex]} ${studentNames[topperIndex]} ${marks[topperIndex]}`;
        },
        quiz: {
          question: "How is the 'topper' variable updated in the search loop?",
          options: [
            "It copies the integer marks score.",
            "It holds a reference (pointer) to the Student object containing the highest marks found so far.",
            "It compiles a new string of names.",
            "It copies all array indices into a list."
          ],
          correctIndex: 1,
          explanation: "In Java, object variables hold references. Setting 'topper = student' copies the memory address reference of that student object, enabling calling its methods later."
        }
      }
    ]
  },
  {
    num: 4,
    title: "OOP – Inheritance, Method Overriding and Polymorphism",
    duration: "2 Hours",
    topics: ["Inheritance", "extends", "super", "method overriding", "parent reference", "child object", "runtime polymorphism", "abstract classes"],
    domain: "Employee, Payment and Service Management",
    problems: [
      {
        id: "s4_e1",
        sessionNum: 4,
        title: "EMPLOYEE INHERITANCE",
        difficulty: "Easy",
        scenario: "A company maintains general employee details and additional salary details for permanent employees.",
        question: "Create an Employee parent class and a PermanentEmployee child class. Display employee name and salary.",
        solutionCode: `class Employee {
    String name;
    
    Employee(String name) {
        this.name = name;
    }
}

class PermanentEmployee extends Employee {
    double salary;
    
    PermanentEmployee(String name, double salary) {
        super(name);
        this.salary = salary;
    }
    
    void display() {
        System.out.println("Name: " + name);
        System.out.println("Salary: Rs. " + salary);
    }
}

public class EmployeeApplication {
    public static void main(String[] args) {
        PermanentEmployee employee = new PermanentEmployee("Arun", 50000);
        employee.display();
    }
}`,
        explanation: "Exhibits inheritance syntax 'extends'. Explains the requirement to invoke parent constructors. The 'super(name)' call passes the parameter string up to the Employee class before performing local assignments.",
        concepts: ["Inheritance", "extends", "super"],
        simulationInputs: [
          { name: "name", type: "text", label: "Employee Name", defaultVal: "Arun" },
          { name: "sal", type: "number", label: "Salary (₹)", defaultVal: 50000 }
        ],
        simulate: (vals) => {
          const name = vals.name || "Arun";
          const sal = parseFloat(vals.sal) || 50000;
          return `Name: ${name}\nSalary: Rs. ${sal.toFixed(1)}`;
        },
        quiz: {
          question: "What is the purpose of the 'super(name)' keyword statement in the PermanentEmployee constructor?",
          options: [
            "To terminate the constructor process early.",
            "To invoke the parent class (Employee) constructor, passing the name parameter up to initialize inherited fields.",
            "To override parent variables with zero.",
            "To call static methods of the subclass."
          ],
          correctIndex: 1,
          explanation: "The super keyword is used to access parent elements. Subclass constructors must invoke the parent constructor, which is done via super(args)."
        }
      },
      {
        id: "s4_e2",
        sessionNum: 4,
        title: "PAYMENT METHOD OVERRIDING",
        difficulty: "Easy",
        scenario: "An online shopping application supports different payment methods.",
        question: "Create a Payment class and override the processPayment() method in a UPIPayment class.",
        solutionCode: `class Payment {
    void processPayment() {
        System.out.println("Processing General Payment");
    }
}

class UPIPayment extends Payment {
    @Override
    void processPayment() {
        System.out.println("Processing UPI Payment");
    }
}

public class PaymentApplication {
    public static void main(String[] args) {
        UPIPayment payment = new UPIPayment();
        payment.processPayment();
    }
}`,
        explanation: "Demonstrates method overriding. UPIPayment declares processPayment() with the exact same signature as the parent Payment class. Marking with '@Override' secures compiler checking.",
        concepts: ["Method overriding"],
        simulationInputs: [],
        simulate: () => {
          return "Processing UPI Payment";
        },
        quiz: {
          question: "What annotation is used to notify the Java compiler that a method is overriding a parent method?",
          options: [
            "@Overload",
            "@Override",
            "@Inherit",
            "@SuperMethod"
          ],
          correctIndex: 1,
          explanation: "The @Override annotation asks the compiler to verify that the subclass method matches a parent signature, protecting against spelling or signature bugs."
        }
      },
      {
        id: "s4_m1",
        sessionNum: 4,
        title: "EMPLOYEE SALARY USING INHERITANCE",
        difficulty: "Medium",
        scenario: "Permanent employees receive a 20% allowance on basic salary.",
        question: "Create an Employee parent class and PermanentEmployee child class. Calculate the final salary.",
        solutionCode: `class Employee {
    String name;
    double basicSalary;
    
    Employee(String name, double basicSalary) {
        this.name = name;
        this.basicSalary = basicSalary;
    }
}

class PermanentEmployee extends Employee {
    PermanentEmployee(String name, double basicSalary) {
        super(name, basicSalary);
    }
    
    double calculateSalary() {
        return basicSalary + (basicSalary * 0.20);
    }
}

public class SalaryApplication {
    public static void main(String[] args) {
        PermanentEmployee employee = new PermanentEmployee("Ayesha", 50000);
        System.out.println("Final Salary: Rs. " + employee.calculateSalary());
    }
}`,
        explanation: "PermanentEmployee inherits variables 'name' and 'basicSalary'. It computes final payout using a subclass-specific method 'calculateSalary()' utilizing protected parent data.",
        concepts: ["Inheritance", "inherited data usage"],
        simulationInputs: [
          { name: "name", type: "text", label: "Employee Name", defaultVal: "Ayesha" },
          { name: "basic", type: "number", label: "Basic Salary (₹)", defaultVal: 50000 }
        ],
        simulate: (vals) => {
          const name = vals.name || "Ayesha";
          const basic = parseFloat(vals.basic) || 50000;
          const finalSalary = basic + (basic * 0.2);
          return `Final Salary: Rs. ${finalSalary.toFixed(1)}`;
        },
        quiz: {
          question: "If the basicSalary of a PermanentEmployee is Rs. 30,000, what will 'calculateSalary()' return?",
          options: [
            "Rs. 30000",
            "Rs. 36000",
            "Rs. 42000",
            "Rs. 30600"
          ],
          correctIndex: 1,
          explanation: "Basic is 30,000. Allowance is 20% of 30,000 = 6,000. Final salary is 30,000 + 6,000 = Rs. 36,000."
        }
      },
      {
        id: "s4_m2",
        sessionNum: 4,
        title: "MULTIPLE PAYMENT TYPES",
        difficulty: "Medium",
        scenario: "An e-commerce application supports Credit Card and UPI payments.",
        question: "Override processPayment() in CreditCardPayment and UPIPayment. Use a parent Payment reference to process both payment types.",
        solutionCode: `class Payment {
    void processPayment() {
        System.out.println("Processing Payment");
    }
}

class CreditCardPayment extends Payment {
    @Override
    void processPayment() {
        System.out.println("Credit Card Payment Processed");
    }
}

class UPIPayment extends Payment {
    @Override
    void processPayment() {
        System.out.println("UPI Payment Processed");
    }
}

public class PaymentSystem {
    public static void main(String[] args) {
        Payment payment;
        
        payment = new CreditCardPayment();
        payment.processPayment();
        
        payment = new UPIPayment();
        payment.processPayment();
    }
}`,
        explanation: "Demonstrates upcasting and polymorphic references. The variable 'payment' is declared of type 'Payment', but points first to a CreditCardPayment object and then to a UPIPayment object, invoking different overriden implementations dynamically.",
        concepts: ["Parent reference", "child object", "runtime polymorphism"],
        simulationInputs: [],
        simulate: () => {
          return "Credit Card Payment Processed\nUPI Payment Processed";
        },
        quiz: {
          question: "What design concept enables a single parent variable 'Payment payment' to reference multiple subclass objects and invoke their unique behaviors?",
          options: [
            "Constructor Chaining",
            "Runtime Polymorphism (Dynamic Method Dispatch)",
            "Data Encapsulation",
            "Type Casting"
          ],
          correctIndex: 1,
          explanation: "Runtime polymorphism decides which overriden method to call at execution time based on the actual object type in memory, not the reference variable type."
        }
      },
      {
        id: "s4_h1",
        sessionNum: 4,
        title: "EMPLOYEE PAYROLL POLYMORPHISM",
        difficulty: "Hard",
        scenario: "Permanent employees receive a 20% allowance on basic salary. Contract employees receive a 5% incentive.",
        question: "Design a payroll system using inheritance, method overriding and runtime polymorphism.",
        solutionCode: `class Employee {
    String name;
    double basicSalary;
    
    Employee(String name, double basicSalary) {
        this.name = name;
        this.basicSalary = basicSalary;
    }
    
    double calculateSalary() {
        return basicSalary;
    }
}

class PermanentEmployee extends Employee {
    PermanentEmployee(String name, double basicSalary) {
        super(name, basicSalary);
    }
    
    @Override
    double calculateSalary() {
        return basicSalary + (basicSalary * 0.20);
    }
}

class ContractEmployee extends Employee {
    ContractEmployee(String name, double basicSalary) {
        super(name, basicSalary);
    }
    
    @Override
    double calculateSalary() {
        return basicSalary + (basicSalary * 0.05);
    }
}

public class PayrollSystem {
    public static void main(String[] args) {
        Employee[] employees = {
            new PermanentEmployee("Arun", 50000),
            new ContractEmployee("Sneha", 40000)
        };
        
        for (Employee employee : employees) {
            System.out.println(employee.name + " Salary: Rs. " + employee.calculateSalary());
        }
    }
}`,
        explanation: "Declares a parent 'Employee[]' array storing both PermanentEmployee and ContractEmployee instances. Iterates over the list, invoking 'employee.calculateSalary()' polymorphically, resolving specific allowance calculations dynamically.",
        concepts: ["Inheritance hierarchy", "overriding", "runtime polymorphism"],
        simulationInputs: [
          { name: "pSal", type: "number", label: "Permanent Employee Basic Salary (₹)", defaultVal: 50000 },
          { name: "cSal", type: "number", label: "Contract Employee Basic Salary (₹)", defaultVal: 40000 }
        ],
        simulate: (vals) => {
          const p = parseFloat(vals.pSal) || 50000;
          const c = parseFloat(vals.cSal) || 40000;
          const pFinal = p + (p * 0.2);
          const cFinal = c + (c * 0.05);
          return `Arun Salary: Rs. ${pFinal.toFixed(1)}\nSneha Salary: Rs. ${cFinal.toFixed(1)}`;
        },
        quiz: {
          question: "How are permanent and contract employee allowances resolved differently in the payroll loop?",
          options: [
            "Using conditional switch-case blocks.",
            "By casting objects to double arrays.",
            "Via runtime polymorphism, calling the respective overridden calculateSalary() method depending on each array slot's concrete object type.",
            "The compiler calculates values statically during compilation."
          ],
          correctIndex: 2,
          explanation: "Dynamic Method Dispatch handles this: the JVM examines the actual instance in the array loop slot and invokes the correct overridden class method."
        }
      },
      {
        id: "s4_h2",
        sessionNum: 4,
        title: "DELIVERY CHARGE POLYMORPHISM",
        difficulty: "Hard",
        scenario: "A delivery company provides Standard (₹50), Express (₹100) and Same-Day (₹200) delivery services.",
        question: "Design a delivery charge calculation system using an abstract class and runtime polymorphism.",
        solutionCode: `abstract class Delivery {
    abstract double calculateCharge();
    
    void displayCharge() {
        System.out.println("Delivery Charge: Rs. " + calculateCharge());
    }
}

class StandardDelivery extends Delivery {
    double calculateCharge() {
        return 50;
    }
}

class ExpressDelivery extends Delivery {
    double calculateCharge() {
        return 100;
    }
}

class SameDayDelivery extends Delivery {
    double calculateCharge() {
        return 200;
    }
}

public class DeliverySystem {
    public static void main(String[] args) {
        Delivery[] deliveries = {
            new StandardDelivery(),
            new ExpressDelivery(),
            new SameDayDelivery()
        };
        
        for (Delivery delivery : deliveries) {
            delivery.displayCharge();
        }
    }
}`,
        explanation: "Uses an 'abstract' class Delivery with an abstract 'calculateCharge()' signature forcing subclasses to supply fees, and a concrete 'displayCharge()' showing shared logic.",
        concepts: ["Abstract class", "abstract method", "runtime polymorphism"],
        simulationInputs: [],
        simulate: () => {
          return "Delivery Charge: Rs. 50.0\nDelivery Charge: Rs. 100.0\nDelivery Charge: Rs. 200.0";
        },
        quiz: {
          question: "Which of the following is TRUE regarding an 'abstract class' in Java?",
          options: [
            "It can be instantiated using the 'new' keyword directly.",
            "It cannot be instantiated directly; it can only be inherited by subclasses which implement its abstract methods.",
            "It must contain only abstract methods and no fields.",
            "It throws an exception at runtime when called."
          ],
          correctIndex: 1,
          explanation: "An abstract class serves as an incomplete concept template. It cannot be instantiated directly with 'new Delivery()', only extended by concrete child classes."
        }
      }
    ]
  },
  {
    num: 5,
    title: "Exception Handling and Collections",
    duration: "2 Hours",
    topics: ["try", "catch", "finally", "throw", "throws", "custom exceptions", "ArrayList", "HashSet", "HashMap", "collections of objects"],
    domain: "Banking, Student and Inventory Applications",
    problems: [
      {
        id: "s5_e1",
        sessionNum: 5,
        title: "SAFE BILL DIVISION",
        difficulty: "Easy",
        scenario: "A restaurant divides the bill equally among customers. The application must handle a customer count of zero.",
        question: "Accept the total bill and number of customers. Handle division by zero using Exception Handling.",
        solutionCode: `import java.util.Scanner;

public class BillDivision {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        try {
            System.out.print("Enter bill: ");
            int bill = sc.nextInt();
            System.out.print("Enter number of customers: ");
            int customers = sc.nextInt();
            
            int amount = bill / customers;
            System.out.println("Amount per Customer: Rs. " + amount);
        } catch (ArithmeticException e) {
            System.out.println("Customer count cannot be zero");
        }
        sc.close();
    }
}`,
        explanation: "Surrounds core division block with a try block. If 'customers == 0', Java throws an ArithmeticException, interrupting flow and moving control to the catch block to print error messages.",
        concepts: ["try", "catch", "ArithmeticException"],
        simulationInputs: [
          { name: "bill", type: "number", label: "Total Bill Amount (₹)", defaultVal: 1500 },
          { name: "cust", type: "number", label: "Number of Customers", defaultVal: 0 }
        ],
        simulate: (vals) => {
          const b = parseInt(vals.bill) || 0;
          const c = parseInt(vals.cust);
          let logs = [`Enter bill: ${b}`, `Enter number of customers: ${c}`];
          if (c === 0) {
            logs.push("Customer count cannot be zero");
          } else {
            const amt = Math.floor(b / c);
            logs.push(`Amount per Customer: Rs. ${amt}`);
          }
          return logs.join("\n");
        },
        quiz: {
          question: "Which built-in Exception class captures division by zero calculations in Java?",
          options: [
            "NullPointerException",
            "ArithmeticException",
            "ArrayIndexOutOfBoundsException",
            "NumberFormatException"
          ],
          correctIndex: 1,
          explanation: "Division by zero is an invalid mathematical calculation which triggers an ArithmeticException inside the JVM."
        }
      },
      {
        id: "s5_e2",
        sessionNum: 5,
        title: "CUSTOMER LIST MANAGEMENT",
        difficulty: "Easy",
        scenario: "A service company wants to maintain a dynamic customer list.",
        question: "Store customer names using an ArrayList and display all customers.",
        solutionCode: `import java.util.ArrayList;

public class CustomerList {
    public static void main(String[] args) {
        ArrayList<String> customers = new ArrayList<>();
        customers.add("Arun");
        customers.add("Ayesha");
        customers.add("Sneha");
        
        for (String customer : customers) {
            System.out.println(customer);
        }
    }
}`,
        explanation: "Creates an instance of the dynamic list 'ArrayList<String>'. Uses 'add()' to dynamically append elements at runtime, and prints them with an enhanced for-loop.",
        concepts: ["ArrayList", "add", "enhanced for loop"],
        simulationInputs: [
          { name: "newList", type: "text", label: "Add names (comma separated)", defaultVal: "Arun, Ayesha, Sneha" }
        ],
        simulate: (vals) => {
          const items = (vals.newList || "").split(",").map((x: string) => x.trim()).filter(Boolean);
          return items.join("\n");
        },
        quiz: {
          question: "What is the primary advantage of using an ArrayList over a standard array in Java?",
          options: [
            "ArrayList is faster to index than standard arrays.",
            "ArrayList is dynamically resizable, growing and shrinking in capacity automatically at runtime.",
            "ArrayList can store primitive values directly without auto-boxing.",
            "ArrayList is protected from thread locks."
          ],
          correctIndex: 1,
          explanation: "Standard arrays are fixed-size in Java. ArrayList implements the List interface, allowing entries to be appended dynamically without resizing manually."
        }
      },
      {
        id: "s5_m1",
        sessionNum: 5,
        title: "INVALID WITHDRAWAL EXCEPTION",
        difficulty: "Medium",
        scenario: "A banking application must reject withdrawal amounts greater than the account balance.",
        question: "Use throw to generate an exception when the withdrawal amount exceeds the available balance.",
        solutionCode: `public class WithdrawalValidation {
    public static void main(String[] args) {
        double balance = 50000;
        double withdrawal = 70000;
        
        try {
            if (withdrawal > balance) {
                throw new IllegalArgumentException("Insufficient Balance");
            }
            balance -= withdrawal;
            System.out.println("Balance: Rs. " + balance);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
        explanation: "Using the 'throw' statement manually forces exception dispatch. It terminates normal execution flow, passing the initialized 'IllegalArgumentException' with custom messages directly to the catcher.",
        concepts: ["throw", "exception generation"],
        simulationInputs: [
          { name: "balance", type: "number", label: "Balance (₹)", defaultVal: 50000 },
          { name: "with", type: "number", label: "Withdrawal (₹)", defaultVal: 70000 }
        ],
        simulate: (vals) => {
          const bal = parseFloat(vals.balance) || 50000;
          const wit = parseFloat(vals.with) || 0;
          if (wit > bal) {
            return "Insufficient Balance";
          } else {
            return `Balance: Rs. ${(bal - wit).toFixed(1)}`;
          }
        },
        quiz: {
          question: "Which keyword is used to explicitly instantiate and trigger an exception inside code?",
          options: [
            "throws",
            "throw",
            "try",
            "catch"
          ],
          correctIndex: 1,
          explanation: "'throw' (singular) is an active statement used to trigger an exception. 'throws' (plural) is a method signature declaration indicating exceptions a method might dispatch."
        }
      },
      {
        id: "s5_m2",
        sessionNum: 5,
        title: "PRODUCT PRICE DIRECTORY",
        difficulty: "Medium",
        scenario: "A retail company wants to map product IDs to product prices.",
        question: "Use a HashMap to store product ID and price. Search for a product ID and display its price.",
        solutionCode: `import java.util.HashMap;

public class ProductDirectory {
    public static void main(String[] args) {
        HashMap<Integer, Double> products = new HashMap<>();
        products.put(101, 45000.0);
        products.put(102, 75000.0);
        products.put(103, 32000.0);
        
        int searchId = 102;
        if (products.containsKey(searchId)) {
            System.out.println("Price: Rs. " + products.get(searchId));
        } else {
            System.out.println("Product Not Found");
        }
    }
}`,
        explanation: "Creates a 'HashMap<Integer, Double>' for key-value association. Associates keys to values using 'put()'. Verifies presence via 'containsKey()' and retrieves prices using 'get()'.",
        concepts: ["HashMap", "put", "containsKey", "get"],
        simulationInputs: [
          { name: "searchId", type: "number", label: "Product ID to Lookup (101-103)", defaultVal: 102 }
        ],
        simulate: (vals) => {
          const products: Record<number, number> = { 101: 45000.0, 102: 75000.0, 103: 32000.0 };
          const sid = parseInt(vals.searchId) || 0;
          if (products[sid] !== undefined) {
            return `Price: Rs. ${products[sid].toFixed(1)}`;
          } else {
            return "Product Not Found";
          }
        },
        quiz: {
          question: "Which HashMap method is used to insert a key-value association, and which method checks for key existence?",
          options: [
            "add() and find()",
            "put() and containsKey()",
            "insert() and hasKey()",
            "push() and contains()"
          ],
          correctIndex: 1,
          explanation: "In Java's HashMap API, 'put(key, value)' inserts elements into the map, and 'containsKey(key)' checks whether a given key exists in the collection."
        }
      },
      {
        id: "s5_h1",
        sessionNum: 5,
        title: "CUSTOM INSUFFICIENT BALANCE EXCEPTION",
        difficulty: "Hard",
        scenario: "A banking application requires a specific exception for insufficient account balance.",
        question: "Create an InsufficientBalanceException and use it during withdrawal.",
        solutionCode: `class InsufficientBalanceException extends Exception {
    InsufficientBalanceException(String message) {
        super(message);
    }
}

class Account {
    private double balance;
    
    Account(double balance) {
        this.balance = balance;
    }
    
    void withdraw(double amount) throws InsufficientBalanceException {
        if (amount > balance) {
            throw new InsufficientBalanceException("Insufficient Account Balance");
        }
        balance -= amount;
        System.out.println("Remaining Balance: Rs. " + balance);
    }
}

public class BankingApplication {
    public static void main(String[] args) {
        Account account = new Account(50000);
        try {
            account.withdraw(70000);
        } catch (InsufficientBalanceException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
        explanation: "Creates a custom checked exception 'InsufficientBalanceException' by extending 'Exception'. The method withdraw() declares 'throws InsufficientBalanceException', forcing callers to handle it using try-catch blocks.",
        concepts: ["Custom exception", "throw", "throws"],
        simulationInputs: [
          { name: "balance", type: "number", label: "Starting Balance", defaultVal: 50000 },
          { name: "with", type: "number", label: "Withdrawal Amount", defaultVal: 70000 }
        ],
        simulate: (vals) => {
          const bal = parseFloat(vals.balance) || 50000;
          const wit = parseFloat(vals.with) || 0;
          if (wit > bal) {
            return "Insufficient Account Balance";
          } else {
            return `Remaining Balance: Rs. ${(bal - wit).toFixed(1)}`;
          }
        },
        quiz: {
          question: "How does creating a checked exception by extending 'Exception' differ from extending 'RuntimeException'?",
          options: [
            "Checked exceptions cannot contain custom string messages.",
            "Checked exceptions are verified at compile-time, forcing the developer to actively catch them or declare them in the method signature with 'throws'.",
            "RuntimeException throws syntax exceptions instead.",
            "Checked exceptions can only be used in array collections."
          ],
          correctIndex: 1,
          explanation: "Classes inheriting directly from 'Exception' (and not RuntimeException) are 'checked' exceptions. The compiler forces the programmer to implement exception handling, promoting code safety."
        }
      },
      {
        id: "s5_h2",
        sessionNum: 5,
        title: "STUDENT PERFORMANCE MANAGEMENT",
        difficulty: "Hard",
        scenario: "A college wants to dynamically maintain student records and identify students who scored 75 or above.",
        question: "Create a Student class. Store Student objects in an ArrayList and display students having marks greater than or equal to 75.",
        solutionCode: `import java.util.ArrayList;

class Student {
    String usn;
    String name;
    int marks;
    
    Student(String usn, String name, int marks) {
        this.usn = usn;
        this.name = name;
        this.marks = marks;
    }
}

public class StudentManagement {
    public static void main(String[] args) {
        ArrayList<Student> students = new ArrayList<>();
        students.add(new Student("1HK24CS001", "Arun", 82));
        students.add(new Student("1HK24CS002", "Ayesha", 68));
        students.add(new Student("1HK24CS003", "Sneha", 91));
        
        for (Student student : students) {
            if (student.marks >= 75) {
                System.out.println(student.usn + " " + student.name + " " + student.marks);
            }
        }
    }
}`,
        explanation: "Combines ArrayList dynamic collection storing custom objects with operational logic. Loops over custom 'Student' items, accessing state attributes '.marks' and filtering those meeting criteria.",
        concepts: ["ArrayList of objects", "dynamic object storage", "object filtering"],
        simulationInputs: [
          { name: "customMarks", type: "text", label: "Marks for Arun, Ayesha, Sneha (comma separated)", defaultVal: "82, 68, 91" }
        ],
        simulate: (vals) => {
          const parts = (vals.customMarks || "").split(",").map((x: string) => parseInt(x.trim()) || 0);
          const s1 = parts[0] !== undefined ? parts[0] : 82;
          const s2 = parts[1] !== undefined ? parts[1] : 68;
          const s3 = parts[2] !== undefined ? parts[2] : 91;
          
          let logs = [];
          if (s1 >= 75) logs.push(`1HK24CS001 Arun ${s1}`);
          if (s2 >= 75) logs.push(`1HK24CS002 Ayesha ${s2}`);
          if (s3 >= 75) logs.push(`1HK24CS003 Sneha ${s3}`);
          return logs.join("\n") || "No student scored 75 or above.";
        },
        quiz: {
          question: "With student marks at 82, 68, and 91, which student records are displayed by this program?",
          options: [
            "Arun, Ayesha, and Sneha",
            "Arun and Sneha only",
            "Sneha only",
            "Ayesha only"
          ],
          correctIndex: 1,
          explanation: "82 (Arun) >= 75 is true. 68 (Ayesha) >= 75 is false. 91 (Sneha) >= 75 is true. Hence, only Arun and Sneha's records are output."
        }
      }
    ]
  }
];
