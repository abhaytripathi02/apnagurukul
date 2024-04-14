import React from 'react'
import logo1 from '../../../assets/TimeLineLogo/Logo1.svg'
import logo2 from '../../../assets/TimeLineLogo/Logo2.svg'
import logo3 from '../../../assets/TimeLineLogo/Logo3.svg'
import logo4 from '../../../assets/TimeLineLogo/Logo4.svg'

import timelineimage from "../../../assets/Images/TimelineImage.png"

// Timeline Array 
const timeline = [
    {
        logo:logo1,
        heading:"Leadership",
        description:"Fully committed to the success company"
    },
    {
        logo:logo2,
        heading:"Responsibility",
        description:"Student always be our top priority"
    },
    {
        logo:logo3,
        heading:"Flexibility",
        description:"The ability to switch in an important skills"
    },
    {
        logo:logo4,
        heading:"Solve the problem",
        description:"Code your way to a solution"
    },
]


const TimelineSection = () => {
    // custom css using internal css
    const styles = {
        padding: '10px',
        borderRadius: '50px',
        // boxShadow: 'rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px',
    }

  return (
    <div> 

      <div className='flex flex-row gap-14 items-center mt-10'>
            {/* left-part  */}
            <div className='flex flex-col w-[45%] gap-6'>
                   {
                    timeline.map((element, index)=>{
                        return (
                            <div className='flex flex-row gap-6' style={styles} key={index}>
                                <div className='w-[50px] h-[50px] bg-white flex items-center justify-center rounded-[50px]'>
                                    <img src={element.logo} alt='logo' />
                                </div>

                                <div className=''>
                                    <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                    <p className='text-base'>{element.description}</p>
                                </div>
                            </div>  ) 
                    })
                   }
            </div>

            {/* right-part  */}
            <div className='relative shadow-blue-200 shadow-2xl'>
               <img src={timelineimage} alt="TimeLine"  className='shadow-white object-cover h-fit shadow-md'/>

               <div className='absolute w-[450px] bg-caribbeangreen-700 flex flex-row text-white uppercase py-8
                               left-24 translate-y-[-50%]'>

                <div className='flex flex-row gap-5 items-center border-r border-caribbeangreen-200 px-6'>
                    <p className='text-3xl font-bold'>10</p>
                    <p className='text-caribbeangreen-300 text-sm'>Years of Experience</p>
                </div>

                <div className='flex flex-row gap-5 items-center border-r border-caribbeangreen-200 px-6'>
                    <p className='text-3xl font-bold'>100+</p>
                    <p className='text-caribbeangreen-300 text-sm'>Types of Courses</p>
                </div>
               </div>

            </div>

      </div>

    </div>
  )
}

export default TimelineSection


