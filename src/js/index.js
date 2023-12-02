import Notiflix from 'notiflix';
import { fetchImages } from './api';
import { createImageCard } from './gallery';

document.addEventListener('DOMContentLoaded', function () {
  const gallery = document.querySelector('.gallery');
  const jsGuard = document.querySelector('.js-guard');
  let currentPage = 1;
  const imagesPerPage = 40;
  let loading = false;
  let isLastPage = false; // Додали змінну для визначення останньої сторінки
  
  // Створення обсервера
  let options = {
    root: null,
    rootMargin: '250px',
    threshold: 1.0,
  };

  let observer = new IntersectionObserver(onLoad, options);

  function onLoad(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isLastPage) {
        loadMoreImages();
      }
    });
  }

  // Додавання обсервера до jsGuard
  observer.observe(jsGuard);

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
    if (loading || isLastPage) return;
  
    const searchInput = document.querySelector('.search-form input[name="searchQuery"]');
    const searchQuery = searchInput.value.trim();
  
    if (!searchQuery) {
      console.error('Пошуковий запит порожній');
      return;
    }
  
    loading = true;
  
    try {
      const { images, totalHits, totalPages } = await fetchImages(searchQuery, currentPage);
  
      if (currentPage === totalPages) {
        isLastPage = true;
        console.log('Це остання сторінка');
      }
  
      renderGallery(images);
      handleLoadMoreBtn(totalHits);
      loading = false;
  
      if (!isLastPage) {
        currentPage++;
      }
    } catch (error) {
      console.error('Помилка завантаження зображень:', error.message);
      Notiflix.Notify.failure('Помилка завантаження зображень. Будь ласка, спробуйте ще раз.');
      loading = false;
    }
  }

  function handleLoadMoreBtn(totalHits) {
    const loadMoreBtn = document.querySelector('.load-more');

    if (loadMoreBtn) {
      loadMoreBtn.style.display = totalHits > currentPage * imagesPerPage ? 'block' : 'none';

      if (isLastPage) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.warning('Ви дійшли до кінця результатів пошуку.');
        observer.disconnect(); // Відключаємо обсервер, оскільки далі завантажувати не потрібно
      }
    }
  }

  function showNoResultsMessage() {
    const message = 'Вибачте, зображень, що відповідають вашому запиту, не знайдено. Будь ласка, спробуйте ще раз.';
    Notiflix.Notify.failure(message);
  }

  window.addEventListener('scroll', function () {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = document.documentElement.clientHeight;
    const scrollThreshold = 200;

    if (scrollTop + clientHeight >= scrollHeight - scrollThreshold) {
      loadMoreImages();
    }
  });

  const searchForm = document.getElementById('search-form');

  if (searchForm) {
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      currentPage = 1;
      gallery.innerHTML = '';
      isLastPage = false; // Скидаємо прапорець останньої сторінки
      loadMoreImages();
    });
  }
});
