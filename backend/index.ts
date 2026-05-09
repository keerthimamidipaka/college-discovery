import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: ["https://college-discovery-sigma.vercel.app", "http://localhost:3000"],
}));
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.json({ message: "College Discovery API is running!" });
});

// ✅ GET all colleges with search and filter
app.get("/colleges", async (req, res) => {
  try {
    const { search, state, course, minFees, maxFees } = req.query;

    const colleges = await prisma.college.findMany({
      where: {
        AND: [
          search
            ? { name: { contains: search as string, mode: "insensitive" } }
            : {},
          state ? { state: { equals: state as string, mode: "insensitive" } } : {},
          course ? { courses: { has: course as string } } : {},
          minFees ? { fees: { gte: parseInt(minFees as string) } } : {},
          maxFees ? { fees: { lte: parseInt(maxFees as string) } } : {},
        ],
      },
      orderBy: { rating: "desc" },
    });

    res.json(colleges);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
});

// ✅ GET single college by ID
app.get("/colleges/:id", async (req, res) => {
  try {
    const college = await prisma.college.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        questions: {
          include: { answers: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    res.json(college);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch college" });
  }
});

// ✅ GET compare colleges
app.get("/compare", async (req, res) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ error: "Please provide college IDs" });
    }

    const idList = (ids as string).split(",").map((id) => parseInt(id));

    const colleges = await prisma.college.findMany({
      where: { id: { in: idList } },
    });

    res.json(colleges);
  } catch (error) {
    res.status(500).json({ error: "Failed to compare colleges" });
  }
});

// ✅ POST a question for a college
app.post("/colleges/:id/questions", async (req, res) => {
  try {
    const { author, content } = req.body;

    if (!author || !content) {
      return res.status(400).json({ error: "Author and content are required" });
    }

    const question = await prisma.question.create({
      data: {
        collegeId: parseInt(req.params.id),
        author,
        content,
      },
    });

    res.json(question);
  } catch (error) {
    res.status(500).json({ error: "Failed to post question" });
  }
});

// ✅ POST an answer to a question
app.post("/questions/:id/answers", async (req, res) => {
  try {
    const { author, content } = req.body;

    if (!author || !content) {
      return res.status(400).json({ error: "Author and content are required" });
    }

    const answer = await prisma.answer.create({
      data: {
        questionId: parseInt(req.params.id),
        author,
        content,
      },
    });

    res.json(answer);
  } catch (error) {
    res.status(500).json({ error: "Failed to post answer" });
  }
});

// ✅ GET predictor results
app.get("/predict", async (req, res) => {
  try {
    const { exam, rank } = req.query;

    if (!exam || !rank) {
      return res.status(400).json({ error: "Exam and rank are required" });
    }

    const rankNum = parseInt(rank as string);
    let colleges: any[];

    if (exam === "JEE") {
      colleges = await prisma.college.findMany({
        where: { jeeRank: { not: null } },
        orderBy: { jeeRank: "asc" },
      });
      colleges = colleges.map((c) => ({
        ...c,
        chance: rankNum <= c.jeeRank! * 0.5 ? "High" : rankNum <= c.jeeRank! ? "Medium" : "Low",
      }));
    } else if (exam === "EAMCET") {
      colleges = await prisma.college.findMany({
        where: { eamcetRank: { not: null } },
        orderBy: { eamcetRank: "asc" },
      });
      colleges = colleges.map((c) => ({
        ...c,
        chance: rankNum <= c.eamcetRank! * 0.5 ? "High" : rankNum <= c.eamcetRank! ? "Medium" : "Low",
      }));
    } else if (exam === "BITSAT") {
      colleges = await prisma.college.findMany({
        where: { bitsatScore: { not: null } },
        orderBy: { bitsatScore: "desc" },
      });
      colleges = colleges.map((c) => ({
        ...c,
        chance: rankNum >= c.bitsatScore! * 1.1 ? "High" : rankNum >= c.bitsatScore! ? "Medium" : "Low",
      }));
    } else if (exam === "WBJEE") {
      colleges = await prisma.college.findMany({
        where: { wbjeeRank: { not: null } },
        orderBy: { wbjeeRank: "asc" },
      });
      colleges = colleges.map((c) => ({
        ...c,
        chance: rankNum <= c.wbjeeRank! * 0.5 ? "High" : rankNum <= c.wbjeeRank! ? "Medium" : "Low",
      }));
    } else {
      return res.status(400).json({ error: "Invalid exam type" });
    }

    res.json(colleges);
  } catch (error) {
    res.status(500).json({ error: "Failed to get predictions" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});