const API_URL = "https://ps-api.illuminati.com.mm";

export const apiFetch = async (endpoint, options = {}) => {

    const response = await fetch(`${API_URL}${endpoint}`,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );

    if (!response.ok) {
        throw new Error(
            `API Error: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
};