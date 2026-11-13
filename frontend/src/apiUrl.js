const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000"

export const contactUrl = `${backendUrl}/contacts`
export const authUrl = `${backendUrl}/auth`
