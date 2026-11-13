import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import ContactList from "./ContactList"

const contacts = [
    { _id: "1", firstName: "Asha", lastName: "Rao", email: "", phone: "9800000001", photo: "", isFavorite: false },
    { _id: "2", firstName: "Ravi", lastName: "Kumar", email: "", phone: "9800000002", photo: "", isFavorite: false },
]

describe("ContactList", () => {
    it("shows the empty message when there are no contacts", () => {
        render(<ContactList contacts={[]} emptyMessage="No contacts found." />)

        expect(screen.getByText("No contacts found.")).toBeInTheDocument()
    })

    it("renders one card per contact", () => {
        render(
            <MemoryRouter>
                <ContactList contacts={contacts} onDelete={() => {}} emptyMessage="none" />
            </MemoryRouter>,
        )

        expect(screen.getByText("Asha Rao")).toBeInTheDocument()
        expect(screen.getByText("Ravi Kumar")).toBeInTheDocument()
    })
})
