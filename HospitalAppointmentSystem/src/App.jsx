import './App.css'
import { compile } from "@fileforge/react-print";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage/HomePage.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import EditAppointment from './components/UpdateAppointment.jsx'
import AddAppointment from './components/AddAppointment.jsx'
import GeneratReport from './components/Dashboard/GenerateReport.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage/>} />
          <Route path='/home' element={<HomePage/>} />
          <Route path='/report' element={<GeneratReport/>} />
          <Route path='/appointment-dash' element={<Dashboard/>} />
          <Route path='/add-appointment' element={<AddAppointment/>} />
          <Route path="/edit-appointment/:id" element={<EditAppointment />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
