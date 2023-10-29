import React from 'react'
import { HighlightText } from './HighlightText'
import know_your_progress from "../../../assets/Images/Know_your_progress.png";
import compare_with_others from "../../../assets/Images/Compare_with_others.png";
import plan_your_lessons from "../../../assets/Images/Plan_your_lessons.png";
import { Button } from './Button';

export const LearningLanguageSection = () => {
  return (
    <div className='w-11/12 flex flex-col gap-5 mt-[130px] items-center mb-32'>
        
        <div className='text-4xl font-semibold text-center'>
            Your Swiss Knife for 
            <HighlightText text={"Learning any Language"}></HighlightText>
        </div>

        <div className='text-center text-richblack-600 mx-auto text-base font-semibold w-[70%]'>
        Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>

        <div className='flex flex-row items-center justify-center mt-5'>
            <img src={know_your_progress} alt="know" className='object-contain -mr-32'></img>
            <img src={compare_with_others} alt="compare" className='object-contain'></img>
            <img src={plan_your_lessons} alt="plan" className='object-contain -ml-32'></img>
        </div>
        <div className='w-fit'>
            <Button active={true} linkto={"/signup"}>Learn More</Button>
        </div>
       
    </div>
  )
}
