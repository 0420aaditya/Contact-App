import { Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import Login from "./pages/Login.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Contacts from "./pages/Contacts.jsx"
import Favorites from "./pages/Favorites.jsx"
import AddContact from "./pages/AddContact.jsx"
import ContactDetails from "./pages/ContactDetails.jsx"
import EditContact from "./pages/EditContact.jsx"
import Profile from "./pages/Profile.jsx"

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
            <Route path="/contacts/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/contacts/add" element={<ProtectedRoute><AddContact /></ProtectedRoute>} />
            <Route path="/contacts/edit/:id" element={<ProtectedRoute><EditContact /></ProtectedRoute>} />
            <Route path="/contacts/:id" element={<ProtectedRoute><ContactDetails /></ProtectedRoute>} />

            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            <Route path="*" element={<div>Page not found</div>} />
        </Routes>
    )
}

export default App
