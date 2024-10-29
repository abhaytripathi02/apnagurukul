import React, { useEffect, useState } from 'react'
import { Link, NavLink, matchPath } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'  // redux-toolkit
import { AiOutlineShoppingCart } from 'react-icons/ai'

import ProfileDropdown from '../core/Auth/ProfileDropdown'
import { apiConnector } from '../../services/apiConnector'
import { Categories } from '../../services/api'
import { IoIosArrowDropdownCircle } from 'react-icons/io'
import LOGO from '../../assets/Logo/ApnaGurukul-logo.png'

import {X, Menu} from 'lucide-react'

import ConfirmationModal from "./ConfirmationModal"
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {logout} from '../../services/operations/authAPI';



const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  
  const toggleNavbar = () =>{
    setIsOpen(!isOpen);
  }

  const Instructor = "Instructor";
  const Admin = "Admin";

  const {token} = useSelector((state) => state.auth);
  const {user} = useSelector((state) => state.profile);
  const {totalItems} = useSelector((state) => state.cart);
  // const user = JSON.parse(localStorage.getItem('user'));
  // const token = JSON.parse(localStorage.getItem('token'));


  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  //To keep track of confirmation modal
  const [Modal, setModal] = useState(null);
  // console.log("Logout modal in Navbar: ",Modal);

  const [subLink, setSubLink] = useState([]);
  console.log("setData-2: ", subLink)
  

  const fetchSublinks = async()=>{
      try{
        const result = await apiConnector("GET", Categories.GET_CATEGORIES);
        setSubLink(result.data.Categorys);
      
        console.log("setData: ", subLink);
        console.log("Category data: ",result);
      }
      catch(error){
        console.log("Could not fetch category list");
        console.log(Error);
      }
   }

  // API Calls to backend to fetch category data
  useEffect(()=>{
     fetchSublinks();
  },[]);

  // match path 
  const location = useLocation();

  const matchRoute = (route) => {
      return matchPath({path:route}, location.pathname);
  }


  return (
    <div className='flex items-center justify-center h-14 border-b-2 border-b-yellow-100 fixed z-50 w-screen bg-[rgb(28,42,64)]'>
      <div className='flex w-11/12 max-w-maxContent items-center justify-between'>

      
        <div className='text-center'>
          <p className='font-bold text-white text-sm md:text-base lg:text-lg'> APNA  <span className='bg-gradient-to-r text-transparent bg-clip-text from-[#4489F6] to-[#f87aec]'> GURUKUL </span> </p>
        </div> 
        
         {/* Search bar  */}
          <div>
              <form class="max-w-md mx-auto">   
                  <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                  <div class="relative ">
                      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <svg class="w-4 h-4 text-white dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                          </svg>
                      </div>
                      <input type="search" id="default-search" class="block max-h-8 w-full bg-[rgb(30,49,78)] p-4 ps-10 text-sm text-white border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search course" required />

                      <button type="submit" class=" flex justify-center items-center text-white absolute max-h-6 end-2.5 bottom-1.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                  </div>
              </form>

          </div>

            {/* navbar  */}
            <nav className='hidden md:flex gap-10'>
                  <ul className='flex gap-x-6 text-richblack-25 '>
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
                                  subLink.length ? (
                                    <>
                                      {
                                        subLink.map((elem)=>(
                                      <Link
                                        to={`/catalog/${elem.name.split(" ").join("-").toLowerCase()}`}
                                        className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                        key={elem._id}
                                      >
                                        <p>{elem.name}</p>
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
          <div className='hidden md:flex gap-5 items-center'>

              {/* student dashboard cart  */}
              {
                user && (user?.accountType !== Instructor || user?.accountType !== Admin) 
                && (
                  <Link to='/dashboard/cart' className='relative'>
                      <AiOutlineShoppingCart width="20px" height="20px" className='text-white font-bold'/>
                      {
                        totalItems > 0 && (
                          <span className=' font-bold text-yellow-50 absolute top-[-10px] left-1'>
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
                    <ProfileDropdown/>
                )
              }

          </div>


       
       {/* Hamburger toggle buttuon  */}
       <div className='md:hidden'>
             <button onClick={toggleNavbar}> {isOpen ? <X className='text-white'/> : <Menu className='text-white'/>} </button> 
       </div>

       {
  isOpen && (
    <div 
      className="
        absolute top-full left-0 w-full 
        bg-richblack-900 p-6 space-y-6 
        z-50 shadow-lg min-h-screen
      "
    >
      {/* Navbar */}
      <nav className="w-full">
        <ul className="flex flex-col items-center space-y-4 text-white">
          <li className="w-full text-center" onClick={toggleNavbar} >
            <NavLink to="/">
              <p className={`${matchRoute('') ? 'text-yellow-25' : 'text-white'}`}>Home</p>
            </NavLink>
          </li>
          <li className="w-full text-center" onClick={toggleNavbar} >
            <NavLink to="/courses">
              <p className={`${matchRoute('courses') ? 'text-yellow-25' : 'text-white'}`}>Courses</p>
            </NavLink>
          </li>
          <li className="w-full text-center" onClick={toggleNavbar} >
            <NavLink to="/about">
              <p className={`${matchRoute('about') ? 'text-yellow-25' : 'text-white'}`}>About Us</p>
            </NavLink>
          </li>
          <li className="w-full text-center" onClick={toggleNavbar} >
            <NavLink to="/contact">
              <p className={`${matchRoute('contact') ? 'text-yellow-25' : 'text-white'}`}>Contact</p>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="flex justify-center gap-5">
        {/* Student Dashboard Cart */}
        {user &&
          (user?.accountType !== 'Instructor' || user?.accountType !== 'Admin') && (
            <Link to="/dashboard/cart" className="relative" onClick={toggleNavbar}>
              <AiOutlineShoppingCart
                width="20px"
                height="20px"
                className="text-white font-bold"
              />
              {totalItems > 0 && (
                <span className="font-bold text-yellow-50 absolute top-[-8px] left-2">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

        {/* Login & Signup Buttons */}
        {token === null && (
          <>
            <NavLink to="/login">
              <button
                type="button"
                className="
                  bg-richblack-800 px-4 py-1.5 border border-richblack-700 
                  rounded-md text-white hover:scale-105 transition-transform
                "
                onClick={toggleNavbar}
              >
                Login
              </button>
            </NavLink>
            <NavLink to="/signup">
              <button
                type="button"
                className="
                  bg-richblack-800 px-4 py-1.5 border border-richblack-700 
                  rounded-md text-white hover:scale-105 transition-transform
                "
                onClick={toggleNavbar}
              >
                Signup
              </button>
            </NavLink>
          </>
        )}
      </div>
    </div>
  )
}

      </div>

    </div>
  )
}

export default Navbar