import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const Navbar = () => {

  return (
    <div className='flex items-center justify-center h-14 border-b-2 border-b-yellow-100 fixed top-0 w-full z-50 bg-[rgb(0,8,20)]'>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between'>

        {/* image  */}
        <Link to="/">
          <img className='h-[50px]' src="https://res.cloudinary.com/dqv3zwory/image/upload/v1711099745/FileUploadProject/gsrf90ay4geeiakql3t7.png"></img>
        </Link>

       {/* links  */}
        <nav>
            <ul className='flex gap-x-6 text-richblack-25'>
                <li> <NavLink to= '/home'><p>Home</p></NavLink> </li>
                <li> </li>
                <li> <NavLink to= '/about'><p>About Us</p></NavLink> </li>
                <li> <NavLink to= '/contact'><p>Contact Us</p></NavLink> </li>
            </ul>
        </nav>

        {/* login and signup  */}
       <div>
        <button type="button"></button>
        <button type="button"></button>
       </div>

        </div>
    </div>
  )
}

export default Navbar