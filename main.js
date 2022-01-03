var express = require("express");
var mongoose = require("mongoose");
var app = express();
var database = require("./config/database");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(methodOverride());

var Employee = require("./models/employee");

app.listen(port);
console.log("App listening on port : " + port);
mongoose
  .connect(database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

//get all employees data from db
app.get("/api/employees", function (req, res) {
  Employee.find(function (err, employees) {
    if (err) res.send(err);
    res.json(employees);
  });
});

// Create employee
app.post("/api/employees", function (req, res) {
  Employee.create(
    {
      name: req.body.name,
      salary: req.body.salary,
      age: req.body.age,
    },
    function (err, employee) {
      if (err) res.send(err);

      Employee.find(function (err, employees) {
        if (err) res.send(err);
        res.json(employees);
      });

      res.send(employee);
    }
  );
});

// Get  employee from id
app.get("/api/employees/:employee_id", function (req, res) {
  let id = req.params.employee_id;
  Employee.findById(id, function (err, employee) {
    if (err) res.send(err);

    res.json(employee);
    console.log(employee);
  });
});

//Update the user
app.put("/api/employees/:employee_id", function (req, res) {
  let id = req.params.employee_id;
  var data = {
    name: req.body.name,
    salary: req.body.salary,
    age: req.body.age,
  };

  // save the user
  Employee.findByIdAndUpdate(id, data, function (err, employee) {
    if (err) throw err;

    res.send("Successfully! Employee updated - " + employee.name);
  });
});
