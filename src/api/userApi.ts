import api from "."

export const getUserDetails = async (userId: string, token: string) => {
  if (userId) {
    token = token.replace(/"/g, "")
    const res = await api.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.status !== 200) {
      throw new Error("Something went wrong!")
    }
    return res.data.data
  }
  throw Error("Did not fetch user info")
}
 