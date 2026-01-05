import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// --------- Multer for File Uploads ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + "_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// --------- FIX: STABLE MYSQL CONNECTION POOL ----------
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "liu",
  connectionLimit: 10,
});

// --------- ROUTES ----------

// Get all majors
app.get("/students/majors", (req, res) => {
  const q = "SELECT * FROM major";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Get ONE student
app.get("/students/onerecord/:id", (req, res) => {
  const id = req.params.id;
  const q = "SELECT * FROM students WHERE StID = ?";

  db.query(q, [id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json({ message: "Record not found" });

    return res.json(data[0]);
  });
});

// Get ALL students
app.get("/students", (req, res) => {
  const q =
    "SELECT StdID, Fname, Lname, Email, Description, Address, Profile " +
    "FROM students s INNER JOIN major m ON s.Major = m.MajorCode";

  db.query(q, (err, data) => {
    if (err) return res.json(err);

    // Convert image filenames to Base64
    data.forEach((d) => {
      if (d.Profile && fs.existsSync(`./images/${d.Profile}`)) {
        d.Profile = fs.readFileSync(`./images/${d.Profile}`).toString("base64");
      }
    });

    return res.json(data);
  });
});

// Create Student
app.post("/students", upload.single("image"), (req, res) => {
  const { fname, lname, email, major, address } = req.body;
  const image = req.file?.filename;

  const q =
    "INSERT INTO students(`Fname`, `Lname`, `Email`, `Major`, `Address`, `Profile`) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(q, [fname, lname, email, major, address, image], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Delete student
app.delete("/students/:id", (req, res) => {
  const id = req.params.id;
  const q = "DELETE FROM students WHERE StdID = ?";

  db.query(q, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Update student
app.put("/students/:id", (req, res) => {
  const id = req.params.id;
  const { fname, lname, email, major, address, image } = req.body;

  const q =
    "UPDATE students SET `Fname`=?, `Lname`=?, `Email`=?, `Major`=?, `Address`=?, `Profile`=? WHERE StdID=?";

  db.query(q, [fname, lname, email, major, address, image, id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.listen(5000, () => {
  console.log("Connected to backend 🤝");
});
