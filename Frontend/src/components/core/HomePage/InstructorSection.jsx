import React from 'react'
import instructor from '../../../assets/Images/woman-teaching-classroom.jpg'
import HighlightText from './HighlightText'
import CTAButton from './Button'
import {FaArrowRight} from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div className='flex flex-row gap-20 items-center'>

    <div className='w-[45%]'>
        <img src={instructor} alt="instructorImage" className='object-fill h-[600px]' />
    </div>

    <div className=' w-[50%] flex flex-col items-start gap-8'>
         <h1 className='text-4xl font-semibold text-white w-[50%]'> Become an <HighlightText text={"instructor"}/> </h1>
         <p className='font-medium text-base text-richblack-100 w-[70%] mb-12'>
             Instructor from around the world teach millions of students on ApnaGurukul. We Provide the tools and skills to teach what you love.
         </p>
         <CTAButton active={true} linkto={"/signup"} >
                 <div className='flex flex-row items-center gap-2'>
                      Start Teaching Learning 
                      <FaArrowRight/>
                 </div>
        </CTAButton>
       
    </div>
 </div>
  )
}

export default InstructorSection