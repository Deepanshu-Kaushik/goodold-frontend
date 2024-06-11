export default async (url, options = {}, setter = null) => {
  try {
    const response = await fetch(url, {
      ...options,
    });
    if (response.status >= 200 && response.status <= 210) {
      const data = await response.json();
      setter(data);
    } else if (response.status === 403) {
      return () => navigate("/login");
    } else {
      throw new Error("Something went wrong!");
    }
  } catch (error) {
    console.log(error)
    throw new Error(error.message);
  }
};
