const baseURL = "https://api.unsplash.com";

const api = {
  searchPhotos: async (search, page) => {
    const url = `${baseURL}/search/photos?query=${search}&page=${page}&per_page=12`;
    const option = {
      method: "GET",
      headers: {
        "Accept-Version": "v1",
        Authorization: `Client-ID ${s}`,
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
  searchId: async (id) => {
    const url = `${baseURL}/photos/${id}`;
    const option = {
      method: "GET",
      headers: {
        "Accept-Version": "v1",
        Authorization: `Client-ID ${s}`,
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
