import {BrowserRouter, Routes , Route} from 'react-router-dom'
import SignIn from './pages/Signin'
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import ComplaintRegister from './pages/ComplaintRegister';
import Complaints from './pages/Complaints';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefenseTutorials from './pages/DefenseTutorials';
import NewsArticles from './pages/NewsArticles';
import EmergencyContactForm from './pages/EmergencyContactForm';
import EmergencyContactDetails from './pages/EmergencyContactDetails';
import CrimeDataMap from './pages/CrimeDataMap';
import './App.css'
import SafeRouteMap from './pages/SafeRouteMap';
import UserProfile from './pages/userProfile';
import AdministrativeDashboard from './pages/AdministrativeDashBoard';
import AnonyMousComplaint from './pages/AnonymousComplant';
import AlertIcon from './components/shared/AlertIcon';
import OnlyAdminPrivateRoute from './components/shared/OnlyAdminPrivateRoute';
import Home from './components/shared/Home';
import OnlyUserPrivateRoute from './components/shared/OnlyUserPrivateRoute';
import SafePlacesMap from './pages/SafePlacesMap';
import CallIcon from './components/shared/CallIcon';
import VoiceDetection from './components/shared/MicIcon';
import Landing from './pages/Landing';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>  
          <Route path='/' element={<Landing/>} />
          <Route path='/signin' element={<SignIn/>} />
          <Route path='/signup' element={<SignUp/>} />
          
          <Route path='' element={<OnlyUserPrivateRoute/>}>
            <Route path='/dashboard' element={<Dashboard/>} />
            <Route path='/register-complaint' element={<ComplaintRegister/>} />
            <Route path='/anonymous-complaint' element={<AnonyMousComplaint/>} />
            <Route path='/show-complaints' element={<Complaints/>} />
            <Route path='/tutorials' element={<DefenseTutorials/>} />
            <Route path='/getnews' element={<NewsArticles/>} />
            <Route path='/addcontact' element={<EmergencyContactForm/>} />
            <Route path='/getcontact' element={<EmergencyContactDetails/>} />
            <Route path='/crimemap' element={<CrimeDataMap/>} />
            <Route path='/saferoute' element={<SafeRouteMap/>} />
            <Route path='/safeplaces' element={<SafePlacesMap/>} />

          </Route>

          <Route path='/profile' element={<UserProfile/>} />

          <Route path='' element={<OnlyAdminPrivateRoute/>}>
            <Route path='/admin-dashboard' element={<AdministrativeDashboard/>} />
          </Route>

        </Routes>
        <VoiceDetection/>
        <CallIcon/>
        <AlertIcon/>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App
