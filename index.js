import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: (req, res ,cb) => {
    cb(null, 'images/')
  },
    filename:(req, file, cb)=>{
    cb(null,file.originalname + "_" + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer(
  {
    storage:storage
  }
)

// create MYSQL connection 
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "liu",
});

// API to get all majors table 

app.get('/students/majors',(req ,res)=>
{
 const q = "select * from major" ;
 db.query(q, (err,data) =>{
  if (err)
  {
    console.log(err);
    return res.json(err);
  }
  return res.json(data);
 })
});
// create API to get one single student record 
 app.get('/search/:id', (req, res) => {
          const id = req.params.id;          
          const q = "SELECT * FROM students WHERE StdID = ?";
          db.query(q,[id] ,(err, data) => {
    if (err) {
      return res.json(err);
      }
        return res.json(data);
  });
});
 

// create API to get all students records 
app.get("/students", (req, res) => {
  const q = "SELECT StdID, Fname, Lname, Email , Description , Address, Profile FROM students s inner join major m on s.Major = m.MajorCode ";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    for (const d of data)
    {
      d.Profile = fs.readFileSync(`./images/${d.Profile}`).toString('base64');
    }
    return res.json(data);
  });
});

// create API to insert a new record 
app.post("/create", upload.single('image'), (req, res) => {
  
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const major = req.body.major;
  const address = req.body.address;
  const image = req.file.filename;

  const q = "INSERT INTO students(`Fname`, `Lname`, `Email`, `Major`,`Address`, `Profile`) VALUES (?,?,?,?,?,?)";

  db.query(q, [fname,lname,email,major,address,image], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});
// create API to delete one student record 
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
 
  const q1 = "SELECT Profile from students where StdID = ?" ;
  db.query(q1,[id], (err1,data1) => {
 
    const filePath = `./images/${data1[0].Profile}`;
    console.log(filePath);
     fs.unlink(filePath, (err2) => {
      if (err1 || err2) {
        console.error('Error deleting file:', err1);
        return;
      }})
  });

  const q = " DELETE FROM students WHERE StdID = ? ";
  
  db.query(q, [id], (err, data) => {
    
    if (err) return res.send(err);
    return res.json(data);
  });
});

// create API to update  one student record 
app.post("/modify/:id", upload.single('image'),(req, res) => {
   const id = req.params.id;
   const fname =  req.body.fname;
   const lname=  req.body.lname;
   const email= req.body.email;
   const address =  req.body.address;
   const major = req.body.major;
   const image = req.file.filename;
//console.log(major);
//console.log(image);
const q = "UPDATE students SET `Fname`= ?, `Lname`= ?, `Email`= ? ,`Major` = ? ,`Address`= ? ,  `Profile` = ?  WHERE StdID = ?";  
db.query(q, [fname,lname,email,major,address, image, id], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.listen(5000, () => {
  console.log("Connected to backend.");
});
