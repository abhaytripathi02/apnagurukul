import React from "react"


// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import required modules
import { Pagination,FreeMode, Navigation } from 'swiper/modules';

// Import Swiper styles
import "swiper/css"
import "swiper/swiper-bundle.css"
import "swiper/css/bundle"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../../App.css"
////




// import { getAllCourses } from "../../services/operations/courseDetailsAPI"
import CourseCard from "./Course_Card"

function Course_Slider({ Courses }) {

  return (
    <>
      {Courses?.length ? (
        <Swiper
          slidesPerView={4}
          spaceBetween={25}
          loop={true}
          modules={[FreeMode, Pagination, Navigation]}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
          pagination={true}
          navigation = {true}
          className="max-h-[30rem]"
        >
          {Courses?.map((course, i) => (
            <SwiperSlide key={i}>
              <CourseCard course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-2xl text-richblack-5">No Course Found</p>
      )}
    </>
  )
}

export default Course_Slider
