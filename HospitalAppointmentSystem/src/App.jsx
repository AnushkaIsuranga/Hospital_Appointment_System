import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage/HomePage.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import UpdateAppointment from './components/UpdateAppointment.jsx'
import AddAppointment from './components/AddAppointment.jsx'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage/>} />
          <Route path='/home' element={<HomePage/>} />
          <Route path='/appointment-dash' element={<Dashboard/>} />
          <Route path='/add-appointment' element={<AddAppointment/>} />
          <Route path='/edit-appointment/:id' element={<UpdateAppointment/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
