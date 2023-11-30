import Notiflix from 'notiflix';
import { fetchImages } from './api';
import { createImageCard } from './gallery';

document.addEventListener('DOMContentLoaded', function () {
  const gallery = document.querySelector('.gallery');
  let currentPage = 1;
  const imagesPerPage = 40;
  let loading = false; // Додана змінна для уникнення повторних запитів

  function renderGallery(images) {
    if (images.length > 0) {
      images.forEach(image => {
        const card = createImageCard(image);
        gallery.appendChild(card);
      });
    } else {
      showNoResultsMessage();
    }
  }

  async function loadMoreImages() {
    if (loading) return;
    loading = true;
  
    const searchQuery = searchForm.elements.searchQuery.value;
  
    try {
      const { images, totalHits } = await fetchImages(searchQuery, currentPage);
      renderGallery(images);
      handleLoadMoreBtn(totalHits);
      loading = false;
    } catch (error) {
      console.error('Error fetching images:', error.message);
      Notiflix.Notify.failure('Error fetching images. Please try again.');
      loading = false;
    }
  }

  function handleLoadMoreBtn(totalHits) {
    const loadMoreBtn = document.querySelector('.load-more');

    if (loadMoreBtn) {
      loadMoreBtn.style.display = totalHits > currentPage * imagesPerPage ? 'block' : 'none';
      if (totalHits <= currentPage * imagesPerPage) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.warning("You've reached the end of search results.");
      }
    }
  }

  function showNoResultsMessage() {
    const message = 'Sorry, there are no images matching your search query. Please try again.';
    Notiflix.Notify.failure(message);
  }

  window.addEventListener('scroll', function () {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 200) {
      currentPage++;
      loadMoreImages();
    }
  });

  const searchForm = document.getElementById('search-form');

  if (searchForm) {
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      currentPage = 1;
      gallery.innerHTML = ''; // Очищаємо галерею при новому пошуку
      loadMoreImages();
    });
  }
});
