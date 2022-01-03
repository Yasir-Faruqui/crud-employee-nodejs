var express = require("express");
var mongoose = require("mongoose");
var app = express();
var database = require("./config/database");
var bodyParser = require("body-parser"); // pull information from HTML POST (express4)
var methodOverride = require("method-override");

var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json
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
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

//get all employee data from db
app.get("/api/employees", function (req, res) {
  Employee.find(function (err, employees) {
    if (err) res.send(err);
    res.json(employees);
  });
});

// create employee
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

// get a employee with ID of 1
app.get("/api/employees/:employee_id", function (req, res) {
  let id = req.params.employee_id;
  Employee.findById(id, function (err, employee) {
    if (err) res.send(err);

    res.json(employee);
    console.log(employee);
  });
});
