const dotenv = require("dotenv").config();

const morgan = require("morgan");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { initRealTimeServer } = require("./realTime/realtime.server");
const { notFound } = require("./middleware/errorHandler");
const http = require("http");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const server = http.createServer(app);

initRealTimeServer(server);

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database Connected");
    })
    .catch((error) => {
        console.log(error);
    });


app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter)

app.use(notFound);

server.listen(process.env.PORT || 5200, function () {
    console.log("Ready To GO");
});