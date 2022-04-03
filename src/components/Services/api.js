import axios from "axios";

axios.defaults.baseURL = "https://pixabay.com/api/";
const KEY = "23662524-8f9d066540a3192ffa9ff9d93";

async function fetchImages(query, page) {
  const response = await axios.get(
    `?q=${query}&page=${page}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`
  );
  return response.data.hits;
}

export default fetchImages;
