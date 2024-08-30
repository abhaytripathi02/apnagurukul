import React from 'react'
import HighlightText from '../../core/HomePage/HighlightText'
import CTAButton  from '../../core/HomePage/Button'

import ComparewithOthers from '../../../assets/Images/Compare_with_others.png'
import KnowYourProgress from '../../../assets/Images/Know_your_progress.png'
import PlanYourLesson from '../../../assets/Images/Plan_your_lessons.png'

const LearningLanguageSection = () => {
  return (
    <div>
          <div className='flex flex-col mt-[10%] gap-10 mb-[8%]'> 
            <div className='text-4xl font-semibold text-center'>
            Your swiss knife for <HighlightText text={"learning any language"} />
            </div>

            <div className='text-center text-richblack-500 mx-auto text-base w-[70%] '>
              <p>Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more</p>
            </div>

            <div className=' flex flex-row justify-center items-center mt-5'>
              <div className='translate-x-[100px] object-contain'>
                  <img src={KnowYourProgress} alt="PlanYourLesson" />
              </div>

              <div className='object-contain z-10'> 
                <img src={ComparewithOthers} alt="PlanYourLesson"  />
              </div>

              <div className='object-contain translate-x-[-130px] z-20'>
                <img src={PlanYourLesson} alt="PlanYourLesson" />
              </div>
            </div>

            <div className='flex justify-center mt-4'>
                <CTAButton children ={"Learn More"} active={true} linkto={'./signup'} />
            </div>

          </div>
    </div>
  )
}

export default LearningLanguageSection