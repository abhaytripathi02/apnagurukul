import './App.css';
import { Route, Routes } from 'react-router-dom';
import  HomePage from "./pages/HomePage";

function App() {
  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter '>
    
        <Routes>
          <Route path='/' element={<HomePage/>} />
        </Routes>

    </div>
  );
}

export default App;
