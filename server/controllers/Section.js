const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection=require("../models/SubSection");

// CREATE a new section
exports.createSection = async (req, res) => {
	try {
		// Extract the required properties from the request body
		const { sectionName, courseId } = req.body;

		// Validate the input
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}

		//Check if Section Exists Already
		const sectionDetails=await Section.findOne({sectionName:sectionName})

		if (sectionDetails){
			return res.status(400).json({
				success:false,
				message:"Section Already Exists Please Try Creating other Sections"
			})
		}

		// Create a new section with the given name
		const newSection = await Section.create({ sectionName });

		// Add the new section to the course's content array
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true }
		)
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourse,
		});
	} catch (error) {
		// Handle errors
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

// UPDATE a section
exports.updateSection = async (req, res) => {
	try {
		const { sectionName, sectionId,courseId} = req.body;
		if (!sectionName||!sectionId){
			return res.status(401).json({
				success:false,
				message:"All Fields are Required For Section Updation"
			})
		}
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);
		const course=await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		}).exec();

		res.status(200).json({
			success: true,
			data:course,
			message: section,
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

// DELETE a section
exports.deleteSection = async (req, res) => {
	try {
		
		const {sectionId,courseId } = req.body;
	

		//validation
		if (!sectionId||!courseId){
			return res.status(400).json({
				success:false,
				message:"All fields are required"
			})
		}

		//Firstly Delete this SectionId from Corresponding Courese

		await Course.findByIdAndUpdate(
			{_id:courseId},
			{
				$pull:
				{
					courseContent:sectionId,
				}
			}
			)

		const sectionDetails=await Section.findById(sectionId);
		if (!sectionDetails){
			return res.status(400).json({
				success:false,
				message:"Section Not Found"
			})
		}

		const subSections=sectionDetails.subSection;
		for(const subId of subSections)
		{
			await SubSection.findByIdAndDelete({_id:subId})
		}
		
		//Now Delete Section
		await Section.findByIdAndDelete({_id:sectionId});


		const courseResponse=await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		}).exec();

		res.status(200).json({
			success: true,
			message: "Section deleted",
			data:courseResponse
		});

	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};