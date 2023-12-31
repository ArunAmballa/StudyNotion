const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");
const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
	
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		);
		console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}
//Pre-Middleware
// Define a pre-save hook to send email before the document has been saved
OTPSchema.post("save", async function (doc,next) {

	// Only send an email when a new document is created
	// if (this.isNew) {
		await sendVerificationEmail(doc.email, doc.otp);
	// }
	next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;