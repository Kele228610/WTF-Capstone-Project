const BASE_URL = "https://wtf-capstone-project.vercel.app";

export const updateProfile = async (profileData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/profile/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile");
    }

    return data;
  } catch (error) {
    throw error;
  }
};      