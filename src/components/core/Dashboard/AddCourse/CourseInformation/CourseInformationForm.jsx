import { useEffect, useState} from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdClose, MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"
import TagInput from "./TagInput"
import RequirementsField from "./RequirementsField"
import { FaCross } from "react-icons/fa"

export default function CourseInformationForm() {

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course, editCourse } = useSelector((state) => state.course)  // course state ke andar course ka data kaha se aaya ??
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([]);

 

  useEffect(() => {
    dispatch(setStep(1));  // remove this line when Add course section is over

    const getCategories = async () => {
      setLoading(true)
      const response = await fetchCourseCategories();

      // console.log("Response in CourseInfo: ", response);

      if (response.length > 0) {
        // console.log("categories", categories)
        setCourseCategories(response)
      }
      setLoading(false)
    }

    // if form is in edit mode
    if (editCourse) {
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("coursePrice", course.price)
      setValue("courseTags", course.tag)
      setValue("courseBenefits", course.whatYouWillLearn)
      setValue("courseCategory", course.category)
      setValue("courseRequirements", course.instructions)
      setValue("courseImage", course.thumbnail)
    }
    getCategories();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isFormUpdated = () => {
    const currentValues = getValues();
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !== course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true
    }
    return false
  }


  //  handle next button click
  const onSubmit = async (data) => {
    console.log("Add Course Data of Step-1: ", data)

    // if course in edit state
    if (editCourse) {

      if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();
        // console.log(data)
        formData.append("courseId", course._id);

        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle)
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc)
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice)
        }
        if (currentValues.courseTags.toString() !== course.tags.toString()) {
          formData.append("tags", JSON.stringify(data.courseTags))
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits)
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory)
        }
        if (
          currentValues.courseRequirements.toString() !==course.instructions.toString()){
           formData.append("instructions",JSON.stringify(data.courseRequirements))
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnail", data.courseImage)
        }
        // console.log("Edit Form data: ", formData)
        setLoading(true)
        const result = await editCourseDetails(formData, token);
        setLoading(false);

        if (result) {
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } else {
        toast.error("No changes made to the form")
      }

      return;
    }


    // Create a New Course 
    const formData = new FormData();
    formData.append("courseName", data.courseTitle)
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("tags", JSON.stringify(data.courseTags))
    formData.append("whatYouWillLearn", data.courseBenefits)
    formData.append("category", data.courseCategory)
    // formData.append("status", COURSE_STATUS.DRAFT)
    // formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("thumbnail_Img", data.courseImage)

    try {
      console.log("Form data line NO-154:", formData);
      
      const formDataObj = Object.fromEntries(formData.entries());
      console.log("formData Object: ",formDataObj);

      //API Network call
      setLoading(true);
      const result = await addCourseDetails(formData, token);
      setLoading(false);
      console.log("Result of Add Course line No-159:", result);
      if (result) {
        dispatch(setStep(2))
        dispatch(setCourse(result))
      }

    } catch (error) {
      console.log("Something went wrong while Course Adding into Database")
      console.log("Error:", error);
    }
  }



  //for custom tag input logic:
  const [customTag, setCustomTag] = useState([]);
  
  // Add logic
  const Action = (event) =>{
    if(event.keyCode === 13){
      event.preventDefault();
      const tagData = event.target.value.trim(); 

      if (tagData && !customTag.includes(tagData)){
        setCustomTag([...customTag, tagData]);
        event.target.value = "";
      }
    }
  }

  // Delete Logic
  const handleDeleteChip = (index) => {
    console.log("index:", index);
      if (customTag.length === 0) {
        return null; // Return null if the array is empty
      }

     customTag.splice(index,1);
     setCustomTag([...customTag]);
  }

  useEffect(()=>{
       setValue("courseTags", customTag);
       //issue !!
  },[customTag]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >

      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
          Course Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="form-style w-full rounded-sm pl-1"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course title is required
          </span>
        )}
      </div>


      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Course Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full rounded-sm pl-1"
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Description is required
          </span>
        )}
      </div>


      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Course Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12 rounded-sm bg-richblack-600"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Price is required
          </span>
        )}
      </div>


      {/* Course Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          defaultValue=""
          id="courseCategory"
          className="form-style w-full rounded-sm pl-1 bg-richblack-600 text-white"
        >
          <option value="" disabled >
            Choose a Category
          </option>
          {!loading &&
            courseCategories?.map((category, index) => (
              <option key={index} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
        )}
      </div>

      {/* Custom Component for handling course tags inputs */}
      {/* <TagInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      /> */}

      {/* Custom Component for handling course tags inputs */}
      <div className="text-white flex gap-2">
           {customTag.length > 0 &&
            customTag.map((tag, index)=>(
                  <div className="flex bg-yellow-300 rounded-xl p-1" key={index}>
                   <p>{tag}</p>
                    <button
                        type="button"
                        className="ml-2 focus:outline-none"
                        onClick={() => handleDeleteChip(index)}
                      >
                      <MdClose className="text-sm" />
                    </button>
                  </div>
            ))
           }
      </div>

       <div className="flex flex-col">
        <label htmlFor="tag" className="text-white">Enter a Tags <sup className="text-pink-200">*</sup></label>
        <input
            type="text"
            id = "tag"
            placeholder="Enter a Tag"
            className="form-style rounded-sm pl-1"
            {...register('courseTags',{required:true})}
            onKeyDown={Action}
       />
       </div>
     

      {/* Component for uploading thumbnail and showing preview of media*/}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />


      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the course is required
          </span>
        )}
      </div>


      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />


      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          // onClick={() => dispatch(setStep(2))}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>


    </form>
  )

}
