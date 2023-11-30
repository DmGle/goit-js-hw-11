import Notiflix from 'notiflix';
import { fetchImages } from './api';
import { createImageCard } from './gallery';

document.addEventListener('DOMContentLoaded', function () {
  const gallery = document.querySelector('.gallery');
  const loadMoreBtn = document.querySelector('.load-more');
  let currentPage = 1;
  const searchForm = document.getElementById('search-form');

  if (searchForm) {
    searchForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const searchQuery = event.target.elements.searchQuery.value;

      try {
        const { images, totalHits } = await fetchImages(searchQuery, currentPage);
        renderGallery(images);
        handleLoadMoreBtn(totalHits);
      } catch (error) {
        console.error('Error fetching images:', error.message);
        Notiflix.Notify.failure('Error fetching images. Please try again.');
        clearGallery();
      }
    });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', async function () {
      currentPage++;
      const searchQuery = searchForm.elements.searchQuery.value;

      try {
        const { images, totalHits } = await fetchImages(searchQuery, currentPage);
        renderGallery(images);
        handleLoadMoreBtn(totalHits);
      } catch (error) {
        console.error('Error fetching images:', error.message);
        Notiflix.Notify.failure('Error fetching images. Please try again.');
        clearGallery();
      }
    });
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

  function handleLoadMoreBtn(totalHits) {
    if (loadMoreBtn) {
      loadMoreBtn.style.display = totalHits > currentPage * imagesPerPage ? 'block' : 'none';
      if (totalHits <= currentPage * imagesPerPage) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.warning("You've reached the end of search results.");
      }
    }
  }

  function clearGallery() {
    gallery.innerHTML = '';
  }

  function showNoResultsMessage() {
    const message = 'Sorry, there are no images matching your search query. Please try again.';
    Notiflix.Notify.failure(message);
  }
});
