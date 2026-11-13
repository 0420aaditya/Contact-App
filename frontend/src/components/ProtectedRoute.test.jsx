import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"

const renderProtected = () => {
    return render(
        <MemoryRouter initialEntries={["/secret"]}>
            <Routes>
                <Route
                    path="/secret"
                    element={
                        <ProtectedRoute>
                            <p>secret content</p>
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<p>login page</p>} />
            </Routes>
        </MemoryRouter>,
    )
}

describe("ProtectedRoute", () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it("renders children when a token exists", () => {
        localStorage.setItem("token", "a-valid-token")
        renderProtected()

        expect(screen.getByText("secret content")).toBeInTheDocument()
    })

    it("redirects to login when there is no token", () => {
        renderProtected()

        expect(screen.getByText("login page")).toBeInTheDocument()
        expect(screen.queryByText("secret content")).not.toBeInTheDocument()
    })
})
