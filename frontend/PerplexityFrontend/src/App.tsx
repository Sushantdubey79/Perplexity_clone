import './App.css'
import Router from './routes/routes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Essential styling


function App() {

  return (

    <div>
      
      <Router>
      </Router>

      <ToastContainer position="top-right" autoClose={3000} /> 
    
    </div>

  )
}

export default App
