const express = require("express");
//Instantiating Server
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

//Importing Routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");


//Data Base Connection
const database = require("./config/database");

//To load environmental variables in Process Object
const dotenv = require("dotenv");
dotenv.config();

//Backend PORT
const PORT = process.env.PORT || 4000;

//database connect
database.connect();

//Middlewares
//To Parse request Body
app.use(express.json());

//To Parse Cookie
app.use(cookieParser()); 

// Middleware to use Frontend
app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
	})
)

//Middleware to upload Files
app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)

//cloudinary connection
cloudinaryConnect();

//Mounting
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);


//default  route
app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

//Activating Server
app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})

