import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import RegistrationForm from './component/RegistrationForm'
import Login from './component/Login';
import Events from './component/Events'
import Summernote from './component/summernote';
import { Modal } from 'reactstrap';
import Modals from './component/modal'
import Feedback from './component/Feedback';
function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path='/' element={<RegistrationForm/>} />  
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<Events />} />
        <Route path="/userresponse/:id" element={<Feedback/>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;