import React from 'react'
import instructor from "../../../assets/Images/Instructor.png";
import { HighlightText } from './HighlightText';
import { Button } from './Button';
import { FaArrowRight } from 'react-icons/fa';

export const InstructorSection = () => {
  return (
    <div className='mt-10'> 
        <div className='flex flex-row gap-2 items-center'>
            <div className='w-[50%]'>
                <img src={instructor} alt="instructor" className='shadow-white'></img>
            </div>
            <div className='w-[50%] flex flex-col gap-5'>
                    <div className='text-4xl font-semibold w-[50%]'>
                        Become an 
                        <HighlightText text={"instructor"}></HighlightText>
                    </div>
                    <p className='font-medium text-[16px] w-[80%] text-richblack-300'>
                    Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
                    </p>
                    <div className='w-fit'>
                    <Button active={true} linkto={"/signup"}>
                        <div className='flex gap-2 items-center'>
                            Start Learning Today 
                            <FaArrowRight></FaArrowRight>
                        </div>
                    </Button>
                    </div>
                    
            </div>
            

        </div>
    </div>
  )
}
