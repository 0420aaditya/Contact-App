import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import ContactCard from "./ContactCard"

const makeContact = (overrides = {}) => ({
    _id: "1",
    firstName: "Asha",
    lastName: "Rao",
    email: "asha@example.com",
    phone: "9800000001",
    photo: "",
    isFavorite: false,
    ...overrides,
})

const renderCard = (props = {}) => {
    return render(
        <MemoryRouter>
            <ContactCard contact={makeContact()} onDelete={() => {}} {...props} />
        </MemoryRouter>,
    )
}

describe("ContactCard", () => {
    it("shows the full name and initials when there is no photo", () => {
        renderCard()

        expect(screen.getByText("Asha Rao")).toBeInTheDocument()
        expect(screen.getByText("AR")).toBeInTheDocument()
    })

    it("shows the photo when a photo url is present", () => {
        renderCard({ contact: makeContact({ photo: "http://localhost:8000/uploads/a.png" }) })

        let image = screen.getByRole("img", { name: "Asha" })
        expect(image).toHaveAttribute("src", "http://localhost:8000/uploads/a.png")
    })

    it("shows view and edit icon links", () => {
        renderCard()

        expect(screen.getByRole("link", { name: "View" })).toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument()
    })

    it("shows the remove-from-favorites action for a favorite contact", () => {
        renderCard({ contact: makeContact({ isFavorite: true }), onToggleFavorite: () => {} })

        expect(screen.getByRole("button", { name: "Remove from favorites" })).toBeInTheDocument()
    })

    it("shows the add-to-favorites action for a non-favorite contact", () => {
        renderCard({ onToggleFavorite: () => {} })

        expect(screen.getByRole("button", { name: "Add to favorites" })).toBeInTheDocument()
    })

    it("calls onDelete with the contact when Delete is clicked", async () => {
        let onDelete = vi.fn()
        renderCard({ onDelete })

        await userEvent.click(screen.getByRole("button", { name: "Delete" }))

        expect(onDelete).toHaveBeenCalledTimes(1)
        expect(onDelete).toHaveBeenCalledWith(expect.objectContaining({ _id: "1" }))
    })

    it("calls onToggleFavorite with the contact when the star is clicked", async () => {
        let onToggleFavorite = vi.fn()
        renderCard({ onToggleFavorite })

        await userEvent.click(screen.getByRole("button", { name: "Add to favorites" }))

        expect(onToggleFavorite).toHaveBeenCalledTimes(1)
        expect(onToggleFavorite).toHaveBeenCalledWith(expect.objectContaining({ _id: "1" }))
    })

    it("hides edit and delete actions when showActions is false", () => {
        renderCard({ showActions: false })

        expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument()
        expect(screen.queryByRole("link", { name: "Edit" })).not.toBeInTheDocument()
    })
})
