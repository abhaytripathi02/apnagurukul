import './App.css';
import { Route, Routes } from 'react-router-dom';

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


import { useSelector} from 'react-redux';
import Catalog from './pages/Catalog';
import { useEffect } from 'react';

// import { setUser } from './slices/profileSlice';



function App() {

  // const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);
  // const user = JSON.parse(localStorage.getItem('user'));

  // Fetch user from localStorage and update Redux state
  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     const token = JSON.parse(localStorage.getItem("token"))
  //     dispatch(getUserDetails(token, navigate))
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])



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
