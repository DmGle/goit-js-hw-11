import Notiflix from 'notiflix';
import axios from 'axios';

const apiKey = '40969822-9ca982a77db095185d4787118';
const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let currentPage = 1;
const imagesPerPage = 40;

searchForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  const searchQuery = event.target.elements.searchQuery.value;
  try {
    const { images, totalHits } = await fetchImages(searchQuery, currentPage);
    renderGallery(images);
    loadMoreBtn.style.display = totalHits > currentPage * imagesPerPage ? 'block' : 'none';
    if (totalHits <= currentPage * imagesPerPage) {
      loadMoreBtn.style.display = 'none';
      alert("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
});

loadMoreBtn.addEventListener('click', async function () {
  currentPage++;
  const searchQuery = searchForm.elements.searchQuery.value;
  try {
    const { images, totalHits } = await fetchImages(searchQuery, currentPage);
    renderGallery(images);
    if (totalHits <= currentPage * imagesPerPage) {
      loadMoreBtn.style.display = 'none';
      alert("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
});

async function fetchImages(searchQuery, page) {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${imagesPerPage}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.hits && data.hits.length > 0) {
    return { images: data.hits, totalHits: data.totalHits };
  } else {
    throw new Error('No images found');
  }
}

function renderGallery(images) {
  gallery.innerHTML = '';
  if (images.length > 0) {
    images.forEach(image => {
      const card = createImageCard(image);
      gallery.appendChild(card);
    });
  } else {
    showNoResultsMessage();
  }
}

function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');
  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';
  const info = document.createElement('div');
  info.classList.add('info');
  const likes = createInfoItem('Likes', image.likes);
  const views = createInfoItem('Views', image.views);
  const comments = createInfoItem('Comments', image.comments);
  const downloads = createInfoItem('Downloads', image.downloads);
  info.appendChild(likes);
  info.appendChild(views);
  info.appendChild(comments);
  info.appendChild(downloads);
  card.appendChild(img);
  card.appendChild(info);
  return card;
}

function createInfoItem(label, value) {
  const item = document.createElement('p');
  item.classList.add('info-item');
  item.innerHTML = `<b>${label}:</b> ${value}`;
  return item;
}

function showNoResultsMessage() {
  const message = 'Sorry, there are no images matching your search query. Please try again.';
  alert(message);
}
