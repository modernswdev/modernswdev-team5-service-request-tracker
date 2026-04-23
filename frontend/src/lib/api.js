//centralized API utility for making requests to the backend
//this file can be imported in any component to use the apiFetch function for making API calls

const envBaseUrl = "http://localhost:8000"
export const API_BASE_URL = envBaseUrl.replace(/\/+$/, "")

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options)

  let data = null
  const isJson = response.headers.get("content-type")?.includes("application/json")
  if (isJson) {
    data = await response.json()
  }

  if (!response.ok) {
    const message = data?.detail || data?.message || "Request failed"
    throw new Error(message)
  }

  return data
}
