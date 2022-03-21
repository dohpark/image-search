const baseURL = "https://api.unsplash.com";

const api = {
  searchPhotos: async (search) => {
    const url = `${baseURL}/search/photos?query=${search}`;
    const option = {
      method: "GET",
      headers: {
        "Accept-Version": "v1",
        Authorization: `Client-ID ${process.env.ACCESS_KEY}`,
      },
    };
    try {
      const res = await fetch(url, option);
      const resBody = await res.json();
      return resBody;
    } catch (e) {
      console.log(e);
    }
  },
};

export default api;
