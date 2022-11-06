const express = require("express");
const uuid = require("uuid");
const path = require("path");
const app = express();

const logger = require("./middleware/logger");
const members = require("./data/members");
const students = require("./data/students.json");

/* app.get('/', (req, res) => {
  res.send(`<h1>Hello World! It's Codecool</h1><p>valami</p>`);
  // ? send single file from specific location -- __dirname points to current directory
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));  
}); */

// ? initialise middleware
// app.use(logger);
// ? Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ? create a simple rest api gets the members from the members.js
app.get("/api/members5", (req, res) => {
  res.json(members);
});

// ? get a single member
app.get("/api/members/:id", (req, res) => {
  res.json(members.filter((member) => member.id === parseInt(req.params.id)));
});

// ! GET ALL STUDENTS from students.json
app.get("/api/students", (req, res) => {
  res.json(students);
  console.log(students);
});

// * GET ALL STUDENTS SELECTED BY STATUS
app.get("/api/students/active", (req, res) => {
  res.json(students.filter((student) => student.status === true));
});

app.get("/api/students/finished", (req, res) => {
  res.json(students.filter((student) => student.status === false));
});

// ! GET A SINGLE STUDENT SELECTED BY ID
app.get("/api/students/:id", (req, res) => {
  // ? give a message there is no student with this id
  // ? the "some" method runs the condition inside and gives back a boolean
  // ? if the student.id does not exist, it'll equal false
  const found = students.some(
    (student) => student.id === parseInt(req.params.id)
  );
  if (found) {
    // * actual get method we need to get a single student by id:
    res.json(
      students.filter((student) => student.id === parseInt(req.params.id))
    );
  } else {
    res.status(400).json({
      msg: `No student with the id of ${req.params.id} has been found`,
    });
  }
});

// ! CREATE MEMBER WITH POST REQUEST
app.post("/api/students", (req, res) => {
  // ? we want to be able to send data and when we get that data, it's gonna be in the request object
  // res.send(req.body);
  const newStudent = {
    id: uuid.v4(),
    name: req.body.name,
    status: "true",
  };
  if (!newStudent.name) {
    return res.status(400).json({ msg: "Please include a name" });
  }
  students.push(newStudent);
  res.json(students);
});

// ! UPDATE STUDENT WITH PUT REQUEST
// ? explained in video around 50. min

app.put("/api/students/:id", (req, res) => {
  const found = students.some(
    (student) => student.id === parseInt(req.params.id)
  );
  if (found) {
    const updatedStudent = req.body;
    students.forEach((student) => {
      if (student.id === parseInt(req.params.id)) {
        student.name = updatedStudent.name ? updatedStudent.name : student.name;
        student.status = updatedStudent.status
          ? updatedStudent.status
          : student.status;
        res.json({ msg: "Student updated", student });
      }
    });
  } else {
    res.status(400).json({
      msg: `No student with the id of ${req.params.id} has been found`,
    });
  }
});

// ! DELETE STUDENT WITH DELETE REQUEST
app.delete("/api/students/:id", (req, res) => {
  const found = students.some(
    (student) => student.id === parseInt(req.params.id)
  );
  if (found) {
    res.json({
      msg: "Student deleted",
      students: students.filter(
        (student) => student.id !== parseInt(req.params.id)
      ),
    });
  } else {
    res.status(400).json({
      msg: `No student with the id of ${req.params.id} has been found`,
    });
  }
});

// ! set static folder
app.use(express.static(path.join(__dirname, "public")));
// ? use is a method when we wanna include a middleware

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
