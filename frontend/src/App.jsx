import React, {useState} from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ProfilePage from "./pages/ProfilePage"
import Sidebar from "./components/Sidebar"
import Chat from "./components/Chat"

function App() {
  const [selectedUser, setSelectedUser] = useState(null)
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route
          path="/"
          element={
            <div className="flex h-screen">
              <Sidebar onUserSelect={setSelectedUser} />
              <Chat selectedUser={selectedUser} />
            </div>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
