import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
//pages
import HomePage from "./pages/HomePage";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import Contact from './pages/Contact';

//Components
import Navbar from './components/common/Navbar';
import NotFound from './components/common/NotFound';
import PrivateRoute from './components/core/Auth/PrivateRoute';
import OpenRoute from './components/core/Auth/OpenRoute';
import MyProfile from './components/core/Dashboard/MyProfile';
import Settings from './components/core/Dashboard/Settings/index';
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses';
import Cart from './components/core/Dashboard/Cart/index'
import AddCourse from './components/core/Dashboard/AddCourse/index'
import MyCourses from './components/core/Dashboard/MyCourses'
import CourseDetails from './pages/CourseDetails'


import { useSelector, useDispatch} from 'react-redux';
import Catalog from './pages/Catalog';
import toast from 'react-hot-toast';
import { setToken } from './slices/authSlice';
import { setUser } from './slices/profileSlice';
import { setCourse } from './slices/courseSlice';







function App() {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);
  const token = JSON.parse(localStorage.getItem('token'));

  const navigate = useNavigate();

  useEffect(()=>{
        

    (async () => {
      try {
     
        const response = await fetch('http://localhost:4000/api/v1/auth/verify-token', {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json', // Indicate the type of content you're sending
            'Authorization': `Bearer ${token}` // Replace 'yourToken' with the actual token
          },
          body: JSON.stringify({ token: token }) // JSON.stringify()- This converts the JavaScript object obj into a JSON string.
        });
        
        // JSON.parse() method converts the JSON string into a JavaScript object.
         

        // Parse the JSON response - convert json object into javaScript object
        const data = await response.json();

        // Log or handle the successful response
        console.log('Token verification successful:', data);
       
  
        if(data.success == false) {
          toast.error('Token verification failed'); 

          localStorage.removeItem("token")
          localStorage.removeItem("user")
          localStorage.removeItem("course")

          dispatch(setToken(null))
          dispatch(setUser(null))
          dispatch(setCourse(null))

          navigate('/login');
        }
  
      } catch (error) {
  
        // Handle errors such as network issues or bad responses
        console.error('Token verification failed:', error.message);
        toast.error('Unexpected Error while validating token');   
      }
    })();

  }, []);





  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter '>
      <Navbar/>
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='*' element={<NotFound/>} />  
          <Route path='/about' element={<About/>} />   
          <Route path='/contact' element={<Contact/> } /> 
          <Route path='/catalog/:catalogName' element={<Catalog/>}/>
          <Route path="courses/:courseId" element={<CourseDetails/>} />

          {/* Open Route - for Only Non Logged in User */}
          <Route path='/login'
                 element={
                  <OpenRoute>
                        <Login/>
                  </OpenRoute>
                 } />  

          <Route path='/signup'
                 element={
                 <OpenRoute>
                      <Signup/>
                 </OpenRoute>
                 } />  

          <Route path='/forgot-password' element={<ForgotPassword/>} />   
          <Route path='/reset-password/:id' element={<UpdatePassword/>} /> 
          <Route path='/verify-email' element={<VerifyEmail/>}/>                

          {/* Private Route - for Only Logged in User */}
           <Route 
                  element={
                      <PrivateRoute>
                        <Dashboard/>
                      </PrivateRoute>
          } 
            >

            {/* Why exact ? */}

           <Route path='/dashboard/my-profile'  element={ <MyProfile/>} />
           <Route path='/dashboard/settings' exact element={<Settings/>} />

           {
            user?.accountType === 'Student' && ( 
              <>
                <Route path='/dashboard/enrolled-courses'  element={<EnrolledCourses/>} />
                <Route path='/dashboard/cart' element={<Cart/>} />
              </>
            )
           }
           
           {/* Routes for instructor only */}
           {
            user?.accountType === 'Instructor' && ( 
              <>
              <Route path='/dashboard/add-course' element={<AddCourse/>} />
               <Route path='/dashboard/my-courses' element={<MyCourses/>} />
                
              </>
            )
           }

          </Route>



          {/* Route for all users -students/instructor/admin */}

          {/* Routes for Students only  */}

       

          {/* Routes for Admin only   */}


        </Routes>
    </div>
  );
}

export default App;
