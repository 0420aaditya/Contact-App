import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import "./css/global.css"
import "./css/sidebar.css"
import "./css/dashboard.css"
import "./css/contacts.css"
import "./css/forms.css"
import "./css/profile.css"
import App from "./App.jsx"

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
)
