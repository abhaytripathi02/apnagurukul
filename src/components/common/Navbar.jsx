import React, { useEffect, useState } from 'react'
import { Link, NavLink, matchPath } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'  // redux-toolkit
import { AiOutlineShoppingCart } from 'react-icons/ai'

import ProfileDropdown from '../core/Auth/ProfileDropdown'
// import { apiConnector } from '../../../services/apiConnector'
// import { Categories } from '../../../services/api'
import { IoIosArrowDropdownCircle } from 'react-icons/io'
import LOGO from '../../assets/Logo/ApnaGurukul-logo.png'

// import ConfirmationModal from "../common/ConfirmationModal"
// import { useDispatch } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import {logout} from '../../services/operations/authAPI';


const subLinks = [
  {
    title:'Python',
    path:'/course/python'
  },
  {
    title:'Web dev',
    path:'/course/webdev'
  }
]

const Navbar = () => {

  const Instructor = "Instructor";
  const Admin = "Admin";

  const {token} = useSelector((state) => state.auth);
  const {user} = useSelector((state) => state.profile);
  const {totalItems} = useSelector((state) => state.cart);

  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  //To keep track of confirmation modal
  // const [Modal, setModal] = useState(null);
  // console.log("Logout modal in Navbar: ",Modal);

  // const [subLink, setSubLink] = useState([]);

  // const fetchSublinks = async()=>{
  //     try{
        // const result = await apiConnector("GET", Categories.GET_CATEGORIES);
  //       setSubLink(result.data.data);
  //       console.log(result);
  //     }
  //     catch(error){
  //       console.log("Could not fetch category list");
  //       console.log(Error);
  //     }
  //  }

  // API Calls to backend to fetch category data
  useEffect(()=>{
    //  fetchSublinks();
  },[]);

  // match path 
  const location = useLocation();

  const matchRoute = (route) => {
      return matchPath({path:route}, location.pathname);
  }


  return (
    <div className='flex items-center justify-center h-14 border-b-2 border-b-yellow-100 fixed z-50 w-screen bg-[rgb(28,42,64)]'>
      <div className='flex w-11/12 max-w-maxContent items-center justify-between'>

        {/* Logo-image  */}
        <Link to="/">
          <img className='h-[50px] w-[160px]' src={LOGO} alt='ApnaGurukul' loading='lazy'></img>
        </Link>

       {/* navbar  */}
        <nav>
            <ul className='flex gap-x-6 text-richblack-25'>
                <li> 
                  <NavLink to= '/'>
                   <p className={`${matchRoute('')? "text-yellow-25":"text-white"}`}>Home</p>
                  </NavLink>
                </li>

                <li> 
                  <NavLink to= '/courses'>
                   <p className={`${matchRoute('courses')?"text-yellow-25":"text-white"}`}>Courses</p>
                  </NavLink>
                </li>

                {/* /api/v1/course/showAllCategories */}
                <li className='flex items-center gap-1 group'>
                    <p>Category</p> 
                    <IoIosArrowDropdownCircle/>

                    <div className='invisible absolute left-[37%] top-[90%] 
                                    flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                                    opacity-0 transition-all duration-200 group-hover:visible
                                    group-hover:opacity-100 lg:w-[300px] md:w-[200px]'>

                           <div className='absolute left-[50%] top-0 h-6 w-7 rotate-45 bg-richblack-5'>
            
                           </div> 

                           {
                            subLinks.length ? (
                              <>
                                {
                                  subLinks.map((elem,index)=>(
                                    <Link to={elem.path} key={index}>
                                      <p className='font-bold'>{elem.title}</p>
                                    </Link>
                                  ))
                                }
                              </>
                                
                              
                            ) : ( <div></div> )
                           }        

                    </div>
                </li>

                <li> 
                  <NavLink to= '/about'>
                     <p className={`${matchRoute('about')?"text-yellow-25":"text-white"}`}>About Us</p>
                  </NavLink>
                </li>

                <li> 
                  <NavLink to= '/contact'>
                   <p className={`${matchRoute('contact')?"text-yellow-25":"text-white"}`}>Contact</p>
                  </NavLink>
                </li>
            
            </ul>
        </nav>

        {/* login/signup/dashboard  */}
       <div className='flex gap-5 items-center'>

          {/* student dashboard cart  */}
          {
            user && (user?.accountType !== Instructor || user?.accountType !== Admin) 
            && (
              <Link to='/dashboard/cart' className='relative'>
                  <AiOutlineShoppingCart width="20px" height="20px"/>
                  {
                    totalItems > 0 && (
                      <span className='text-white font-bold'>
                        {totalItems}
                      </span>
                    )
                  }
              </Link>
            )
          }
          
          {/*  login & Signup button */}
          {
            token === null && (
              <>
                <NavLink to= '/login'>
                  <button type="button" className='bg-richblack-800 px-4 py-1.5 hover:scale-105 border border-richblack-700  rounded-md'>
                    <p className={"text-white"}>Login</p>
                  </button>
                </NavLink>   

                <NavLink to= '/signup'>
                  <button type="button" className='bg-richblack-800 px-4 py-1.5 hover:scale-105 border border-richblack-700  rounded-md'>
                    <p className={"text-white"}>Signup</p>
                  </button>
                </NavLink>         
              </>
            )
          }
         
          {
            token !== null && (
              <>

                <ProfileDropdown/>

                  {/* <div type="button" 
                   onClick={() =>
                      setModal({
                        text1: "Are you sure Navbar?",
                        text2: "You will be logged out of your account.",
                        btn1Text: "Logout",
                        btn2Text: "Cancel",
                        btn1Handler: () =>{
                          dispatch(logout(navigate));
                          setModal(null)
                        },
                        btn2Handler: () => setModal(null),
                      })}
                  className='bg-richblack-800 px-4 py-1.5 hover:scale-105 border border-richblack-700  rounded-md'>
                    <p className={"text-white"}>Logout</p>
                  </div>

              {Modal && <ConfirmationModal modalData={Modal} />} */}

              </>
            )
          }

       </div>

      </div>

    </div>
  )
}

export default Navbar