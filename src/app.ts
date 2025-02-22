import express, { Request, Response } from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./swagger";
import { AppDataSource } from "./config/data-source";
import TelegramBot from "node-telegram-bot-api";
import { DataSource } from "typeorm";
import cors from "cors";
import { Student } from "./entity/student.entity";
import { describe } from "node:test";
import { Teacher } from "./entity/teacher.entity";
import { Class } from "./entity/class.entity";
// import studentRoute from "./routes/student.route";
// import teacherRoute from "./routes/teacher.route";

// Load environment variables early
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const token = process.env.TELEGRAM_TOKEN;

if (!token) {
  throw new Error("TELEGRAM_TOKEN is not defined in .env");
}

// Enable CORS
app.use(cors({ origin: "*" }));

// Middleware
app.use(express.json());

// Swagger setup
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Default Route
// app.use("/api/student", studentRoute);
// app.use("/api/teacher", teacherRoute);


// Create Telegram Bot instance
const bot = new TelegramBot(token, { polling: true });

// Set bot commands
const commands = [
  { command: "/start", description: "Start the bot and get command list" },
  { command: "/student", description: "Get list of students" },
  { command: "/teacher", description: "Get list of teachers" },
  { command: "/class", description: "Get list of classes" },
];

bot.setMyCommands(commands)
  .then(() => console.log("Telegram bot commands set successfully"));

// Handle /start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Hello from Sopheak_Bot, how can I help you?");
});

// Handle /student command
bot.onText(/\/student/, async (msg) => {
  const studentRepo = AppDataSource.getRepository(Student);
  try {
    const student = await studentRepo.find({
      take: 10
    })
    if (student.length === 0) {
      return bot.sendMessage(msg.chat.id, "No student found.");
    }

    const studentList = student.map(
      (student, index) => `${index + 1}. ${student.first_name} ${student.last_name}🧑🏻‍🎓\n Gender:${student.gender}\n\n`
    ).join("\n");
    const caption = `📋 Students List 📝 `;

    bot.sendMessage(msg.chat.id, `${caption}\n\n${studentList}`);
  } catch (error) {
    console.error("Error fetching student:", error);
    bot.sendMessage(msg.chat.id, "Failed to fetch student. Please try again later.");
  }
});

bot.onText(/\/teacher/, async (msg) => {
  const teacherRepo = AppDataSource.getRepository(Teacher);
  try {
    const teacher = await teacherRepo.find({
      take: 10
    })
    if (teacher.length === 0) {
      return bot.sendMessage(msg.chat.id, "No teacher found.");
    }

    const studentList = teacher.map(
      (teacher, index) => `${index + 1}. ${teacher.first_name} ${teacher.last_name}👨🏻‍🏫\n Tell:${teacher.phone}☎️\n\n`
    ).join("\n");
    const caption = `📋 Teachers List 📝 `;

    bot.sendMessage(msg.chat.id, `${caption}\n\n${studentList}`);
  } catch (error) {
    console.error("Error fetching teacher:", error);
    bot.sendMessage(msg.chat.id, "Failed to fetch teacher. Please try again later.");
  }
});

bot.onText(/\/class/, async (msg) => {
  const classRepo = AppDataSource.getRepository(Class);
  try {
    const grade = await classRepo.find({
      take: 10
    })
    if (grade.length === 0) {
      return bot.sendMessage(msg.chat.id, "No grade found.");
    }

    const classList = grade.map(
      (grade) => `📌 Class Name🎉\n${grade.class_name}\n\n📌 Subject📚\n🔥${grade.subject}\n\n📌 Teacher_id🪪\n${grade.id}\n\n`
    ).join("\n");
    const caption = `📋 Class List 📝 `;

    bot.sendMessage(msg.chat.id, `${caption}\n\n${classList}`);
  } catch (error) {
    console.error("Error fetching grade:", error);
    bot.sendMessage(msg.chat.id, "Failed to fetch grade. Please try again later.");
  }
});

// Start Server after initializing database
AppDataSource.initialize()
  .then(() => {
    console.log("Connection initialized with database...");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

// Database connection helper function
export const getDataSource = (delay = 3000): Promise<DataSource> => {
  if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (AppDataSource.isInitialized) resolve(AppDataSource);
      else reject(new Error("Failed to create connection with database"));
    }, delay);
  });
};

export default app;
