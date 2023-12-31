import axios from 'axios';

const apiKey = '40969822-9ca982a77db095185d4787118';
const imagesPerPage = 40;

export async function fetchImages(searchQuery, page) {
  try {
    const encodedSearchQuery = encodeURIComponent(searchQuery);
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodedSearchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${imagesPerPage}`;

    console.log('API URL:', url);

    const response = await axios.get(url);
    const data = response.data;

    if (data.totalHits > 0) {
      return { images: data.hits, totalHits: data.totalHits, totalPages: Math.ceil(data.totalHits / imagesPerPage) };
    } else {
      return { images: [], totalHits: 0, totalPages: 0 };
    }
  } catch (error) {
    console.error('Error fetching images:', error.message);
    throw new Error('Error fetching images');
  }
}