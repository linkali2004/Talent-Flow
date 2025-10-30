import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Registration from "./components/Registeration"
import Users from './components/Users'
import JobPage from './components/JobPage'
import Build from './components/Build'
import User from "../src/components/User"
import Test from './components/Test'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/jobs" element={<Jobs></Jobs>} />
      <Route path="/registration" element={<Registration></Registration>} />
      <Route path="/candidates" element={<Users />} />
      <Route path="/candidates/:id" element={<User />} />
      <Route path="/assessment/:id" element={<JobPage />} />
      <Route path="/build/:id" element={<Build></Build>} />
      <Route path="/test/:id" element={<Test />} />
    </Routes>
  )
}

export default App
