import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ConfirmDelete from "./ConfirmDelete"

const contact = { firstName: "Asha", lastName: "Rao" }

describe("ConfirmDelete", () => {
    it("shows the contact name in the question", () => {
        render(<ConfirmDelete contact={contact} onCancel={() => {}} onConfirm={() => {}} />)

        expect(screen.getByText(/Asha Rao/)).toBeInTheDocument()
    })

    it("calls onConfirm when Delete is clicked", async () => {
        let onConfirm = vi.fn()
        render(<ConfirmDelete contact={contact} onCancel={() => {}} onConfirm={onConfirm} />)

        await userEvent.click(screen.getByRole("button", { name: "Delete" }))

        expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    it("calls onCancel when Cancel is clicked", async () => {
        let onCancel = vi.fn()
        render(<ConfirmDelete contact={contact} onCancel={onCancel} onConfirm={() => {}} />)

        await userEvent.click(screen.getByRole("button", { name: "Cancel" }))

        expect(onCancel).toHaveBeenCalledTimes(1)
    })
})
