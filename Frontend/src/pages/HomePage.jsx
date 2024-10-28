import React from 'react'
import { Link } from 'react-router-dom'
import {FaArrowRight} from 'react-icons/fa'
import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton  from '../components/core/HomePage/Button'
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/HomePage/CodeBlocks'

import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import TimelineSection from '../components/core/HomePage/TimelineSection'

import Footer from '../components/common/Footer'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import ExploreMore from '../components/core/HomePage/ExploreMore'

import Education from './Education.json' // lottie-file downloaded json file 
import Lottie from 'lottie-react'
import ReviewSlider from '../components/common/ReviewSlider'
//animation component
import { Spotlight } from '../components/ui/Spotlight'
import Testimonials from '../components/core/HomePage/Testimonials'
import MainSection from '../components/core/HomePage/ScrollEffect'
import TimelineEffect from '../components/core/HomePage/Timeline-Effect'
import MeetOurEducators from '../components/core/HomePage/MeetOurEducators'

export const HomePage = () => {

  
  return (
    <div className='bg-black'>
        
      {/* Spotlight Animation   */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20"  fill="white"/>

        {/* Section-1  */}
        <section className='relative mx-auto flex flex-col w-11/12 items-center
          text-white justify-between mt-10 '>

          <Link to={"/signup"}>
               <div className='group mt-16 p-1 mx-auto h-10 rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-90'>
                <div className='flex flex-row items-center gap-2 rounded-full px-5 py-1 transition-all duration-200 hover:scale-90 group-hover:bg-richblack-900'>
                  <p>Become an Instructor</p>
                  <FaArrowRight/>
                </div>
               </div>
          </Link>
          
          <div className='text-center text-4xl font-semibold mt-8'>
              Empower Your Future With <HighlightText text={"Coding Skills"}/>
          </div>

          <div className='mt-5 w-[90%] text-center text-lg font-medium text-richblack-300'>
            With our online courses, you can learn at your own pace, from anywhere in the world, and get a access to <br /> wealth of resources, including hands-on projects, quizzes and personalized feedback from instructors.
          </div>

          <div className='flex flex-row mt-8 gap-6'>
            <CTAButton active={true} linkto={"/signup"}>  
                Learn Coding for Free
            </CTAButton>

            <CTAButton active={false} linkto={"/login"}>
              Browse Our Course Library
            </CTAButton>

          </div>

          <div className='flex flex-row justify-evenly mt-5'>
            {/* Lottie Animation Code  */}
            <div style={{width:"30%", height: "30%"}}>
                <Lottie animationData={Education}/>
            </div>
    
            {/* Video section 
            <div className='w-[40%] my-12 mx-3 shadow-md shadow-blue-200 hidden sm:flex '>
                <video muted autoPlay loop>
                  <source src={Banner} type="video/mp4"/>
                  </video>
            </div> */}
          </div>
        

          {/* code section-1 */}
           <div>
              <CodeBlocks 
                position={"lg:flex-row max-[800px]:flex-col"}
                heading={ 
                <div className='text-4xl font-semibold'>
                   Unlock your <HighlightText text={"coding Potential"}/>  with our online courses. Start learning today!
                </div> }

                subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you"}
                
                ctabtn1={
                  {
                    btnText:"try it yourself",
                    active:true,
                    linkto:"/signup"
                  }
                }
                ctabtn2={
                  {
                    btnText:"learn more",
                    active:false,
                    linkto:"/login"
                  }
                }
                
                codeColor={"text-yellow-25"}

                codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}

                backgroundGradient={<div className="codeblock1 absolute"></div>}
              />
           </div>


          
          {/* Code Section 2 */}
           <div>
           <CodeBlocks
             position={"lg:flex-row-reverse"}
             heading={
               <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                 Start <HighlightText text={"coding in seconds"} />
               </div>
             }
             subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
             }
             ctabtn1={{
               btnText: "Continue Lesson",
               link: "/signup",
               active: true,
             }}
             ctabtn2={{
               btnText: "Learn More",
               link: "/signup",
               active: false,
             }}
             codeColor={"text-white"}
             codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from  "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<>Home</ div>\n)\n}\nexport default Home;`}
             backgroundGradient={<div className="codeblock2 absolute"></div>}
           />
           </div>

          {/* <ExploreMore/> */}
        </section>

        <section >
         <TimelineEffect/>
        </section>
      
        {/* Section-2  */}
        <section className='bg-pure-greys-5 text-richblack-700 mt-8
        '>
            <div className='Homepage_bg h-[333px]'>
                 <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto'>
                           <div className='h-[150px]'></div>
                           <div className='flex flex-row row-span-7 text-white gap-8'>
                                    <CTAButton active={true} linkto={"/signup"}>
                                        <div className='flex flex-row items-center gap-2'>
                                          Explore Full Catalog
                                          <FaArrowRight/>
                                        </div>
                                    </CTAButton>

                                    <CTAButton active={false} linkto={"/login"}>
                                        <div className='flex flex-row items-center gap-2'>
                                          Learn More
                                          <FaArrowRight/>
                                        </div>
                                    </CTAButton>
                           </div>
                 </div>
            </div>

            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center gap-5 mt-24'>
                  <div className='flex flex-row gap-5 mb-12'>
                      <div className='font-semibold text-4xl w-[50%]'>
                         Get the Skills you need for a <HighlightText text={"job that is in demand"}/>
                      </div>

                      <div className='flex flex-col items-start gap-6 w-[40%] '>
                        <div className='font-semibold text-[15px]'>
                            The modern ApnaGurukul is the dictates its own terms. Today to be competitive specialist requires more than professional skills.
                        </div>
                        <div>
                             <CTAButton active={true} linkto={"/login"}>Learn More</CTAButton>
                        </div>
                      </div>
                  </div>

                <TimelineSection/>
                <LearningLanguageSection/>

            </div>
        </section>
        


        {/* Section-3  */}
         <section className='w-[11/12] mx-auto mt-10 max-w-maxContent flex flex-col items-center justify-between bg-richblack-900 gap-8 text-white'>
         
            <InstructorSection/>
            
      

            {/* <ReviewSlider/> */}
            <Testimonials/>
    
         </section>
          
        <MeetOurEducators/>

        {/* footer  */}
        <Footer/>
    </div>
  )
}

export default HomePage;
