const searchForm = document.getElementById('search-form'),
  movies = document.getElementById('movies'),
  img_url = 'https://image.tmdb.org/t/p/w500/';

// Show full info of each item
function showInfo() {
  console.log(this.dataset.type);
}

// Add click event to items
function addEventMedia() {
  const media = document.querySelectorAll('img[data-id]');
  media.forEach(elem => {
    elem.style.cursor = 'pointer';
    elem.addEventListener('click', showInfo);
  })
}

// Search request on fetch
function searchApi(e) {
  e.preventDefault();
  const searchText = document.getElementById('searchText').value;
  if (searchText.trim().length === 0) {
    movies.innerHTML = '<h3 class="danger-text">Поле поиска не может быть пустым!</h3>';
    return;
  }
   const url = 'https://api.themoviedb.org/3/search/multi?api_key=0e66e3cd5d8c014d6e406d8aba055a88&language=ru-RU&query=' + searchText;

  movies.innerHTML = '<div class="loader"></div>';

  fetch(url)
    .then(response => {
      if (response.status !== 200) {
        return Promise.reject(new Error(response.status));
      }
      return response.json();
    })
    .then(output => {
      let inner = '';

      if (output.results.length === 0) {
        inner = '<h3>По вашему запросу ничего не найдено...</h3>';
      }

      output.results.forEach(item => {
        console.log(item);
        const name = item.name || item.title,
          date = item.first_air_date || item.release_date || '',
          img = item.backdrop_path ? img_url + (item.backdrop_path || item.profile_path) : 'img/no_image.png';
        let dataInfo = '';

        if (item.media_type !== 'person') {
          dataInfo = `data-id=${item.id} data-type=${item.media_type}`
        }

        inner += `
          <div class="col-12 col-md-6 col-xl-3">
            <div class="card mb-4">
              <img src="${img}" class="card-img-top" alt="${name}" ${dataInfo}>
              <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <span>${date}</span>
              </div>
            </div>
          </div>          
        `;
      });

      movies.innerHTML = inner;

      addEventMedia();

    })
    .catch(reason => {
      movies.innerText = 'Что-то пошло не так...';
      console.error('error', reason);
    });
}

searchForm.addEventListener('submit', searchApi);

// Show popular items
document.addEventListener('DOMContentLoaded', () => {
  fetch('https://api.themoviedb.org/3/trending/all/day?api_key=0e66e3cd5d8c014d6e406d8aba055a88&language=ru-RU')
    .then(response => {
      if (response.status !== 200) {
        return Promise.reject(new Error(response.status));
      }
      return response.json();
    })
    .then(output => {
      let inner = '<h2 class="text-info"></h2>';

      output.results.forEach(item => {
        console.log(item);
        const name = item.name || item.title,
          date = item.first_air_date || item.release_date || '',
          img = item.backdrop_path ? img_url + (item.backdrop_path || item.profile_path) : 'img/no_image.png';
        let dataInfo = `data-id=${item.id} data-type=${item.media_type}`;

        inner += `
          <div class="col-12 col-md-6 col-xl-3">
            <div class="card mb-4">
              <img src="${img}" class="card-img-top" alt="${name}" ${dataInfo}>
              <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <span>${date}</span>
              </div>
            </div>
          </div>          
        `;
      });

      movies.innerHTML = inner;

      addEventMedia();

    })
    .catch(reason => {
      movies.innerText = 'Что-то пошло не так...';
      console.error('error', reason);
    });
});