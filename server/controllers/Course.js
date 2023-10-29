const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mongoose=require("mongoose");
// Function to create a new course
exports.createCourse = async (req, res) => {
	try {
		// Get user ID from request object
		const userId = req.user.id;

		// Get all required fields from request body
		let {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag,
			category,
			status,
			instructions,
		} = req.body;

		// Get thumbnail image from request files
		const thumbnail = req.files.thumbnailImage;

		// Check if any of the required fields are missing
		if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag ||
			!thumbnail ||
			!category
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}

		if (!status || status === undefined) {
			status = "Draft";
		}

		//All these Not needed

		if (req.user.accountType!=="Instructor"){
			return res.status(400).json({
				success:false,
				message:"You are not a Instructor"
			})
		}
		const instructorDetails=req.user
		console.log("InstructorDetails",instructorDetails)

		//Check if Instructor Already Created the Course

		const courseDetails=await Course.findOne({courseName:courseName})
		if (courseDetails){
			return res.status(400).json({
				success:false,
				message:"A Course Already Exists With the Given Name"
			})
		}


		// Check if the Category given is valid
		const categoryDetails = await Category.findById({_id:category});
		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category Details Not Found",
			});
		}

		// Upload the Thumbnail to Cloudinary
		const thumbnailImage = await uploadImageToCloudinary(
			thumbnail,
			process.env.FOLDER_NAME
		);
		console.log(thumbnailImage);

		// Create a new course with the given details
		const newCourse = await Course.create({
			courseName,
			courseDescription,
			instructor: instructorDetails.id,
			whatYouWillLearn: whatYouWillLearn,
			price,
			tag: tag,
			category: categoryDetails._id,
			thumbnail: thumbnailImage.secure_url,
			status: status,
			instructions: instructions,
		});

		// Add the new course to the User Schema of the Instructor
		await User.findByIdAndUpdate(
			{
				_id: instructorDetails.id,
			},
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		);
		console.log(category)
		// Add the new course to the Categories
		await Category.findByIdAndUpdate(
			{ _id:categoryDetails._id},
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		);
		// Return the new course and a success message
		res.status(200).json({
			success: true,
			data: newCourse,
			message: "Course Created Successfully",
		});
	} catch (error) {
		// Handle any errors that occur during the creation of the course
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to create course",
			error: error.message,
		});
	}
};

exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find(
			{},
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnroled: true,
			}
		)
			.populate("instructor")
			.exec();

		//If No Courses exists
		if(!allCourses){
			return res.status(400).json({
				success:false,
				message:"No Courses Found"
			})
		}

		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
	}
};

//getCourseDetails
exports.getCourseDetails = async (req, res) => {
    try {
            //get id
            const {courseId} = req.body;
            //find course details
            const courseDetails = await Course.find(
                                        {_id:courseId})
                                        .populate(
                                            {
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails",
                                                },
                                            }
                                        )
                                        .populate("category")
                                        //.populate("ratingAndreviews")
                                        .populate({
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection",
                                            },
                                        })
                                        .exec();

                //validation
                if(!courseDetails) {
                    return res.status(400).json({
                        success:false,
                        message:`Could not find the course with ${courseId}`,
                    });
                }
                //return response
                return res.status(200).json({
                    success:true,
                    message:"Course Details fetched successfully",
                    data:courseDetails,
                })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

//Delete Course
exports.deleteCourse=async(req,res)=>{
	try{

		const {courseId,categoryId}=req.body;
		const userId=req.user.id;

		//Validation
		if (!courseId||!categoryId||!userId){
			return res.status(400).json({
				success:false,
				message:"All Fileds are Required"
			})
		}

		//Firstly Delete this courseId from user

		await User.findByIdAndUpdate({_id:userId},
			{
				$pull:
				{
					courses:courseId,
				}
			})

		//Also Delete this courseId from Category as well
		await Category.findByIdAndUpdate({_id:categoryId},
			{
				$pull:
				{
					courses:courseId,
				}
			})
		
		//Now Finally Delete This Course From Course Collection
		const courseDetails=await Course.findByIdAndDelete({_id:courseId});
		if (!courseDetails){
			return res.status(400).json({
				success:false,
				message:"Course Not Found"
			})
		}

		//Return response
		return res.status(200).json({
			success:true,
			message:"Course Deleted Successfully"
		})

	}
	catch(error){
			return res.status(500).json({
				success:false,
				message:"Something Went Wrong while while Deleting the Course"
			})
	}
}