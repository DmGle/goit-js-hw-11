import axios from 'axios';

const apiKey = '40969822-9ca982a77db095185d4787118';
const imagesPerPage = 40;

export async function fetchImages(searchQuery, page) {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${imagesPerPage}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.hits && data.hits.length > 0) {
      return { images: data.hits, totalHits: data.totalHits };
    } else {
      throw new Error('No images found');
    }
  } catch (error) {
    throw new Error('Error fetching images');
  }
}
