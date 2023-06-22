const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

const user = require("./routes/users/routes");
const servicing = require("./routes/servicing/routes");
const employees = require("./routes/employees/routes");
const schedules = require("./routes/schedules/routes");
const hours = require("./routes/opening_hours/routes");
const employees_unavailable = require("./routes/employee_hours_unavailable/routes");

app.get("/", (req, res) => {
  res.send("Api Rodando");
});
app.use("/user", user);
app.use("/servicing", servicing);
app.use("/employees", employees);
app.use("/schedules", schedules);
app.use("/opening_hours", hours);
app.use("/employees_unavailable", employees_unavailable);

app.listen(port, () => {
  console.log(`App rodando na porta ${port}.`);
});
