const searchForm = document.getElementById('search-form'),
  movies = document.getElementById('movies'),
  img_url = 'https://image.tmdb.org/t/p/w500/';

// Get video youtube
function getVideo(type, id) {
  let youtube = document.querySelector('.video');
  fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=0e66e3cd5d8c014d6e406d8aba055a88&language=ru-RU`)
    .then(response => {
      if (response.status !== 200) {
        return Promise.reject(new Error(response.status));
      }
      return response.json();
    })
    .then(output => {
      console.log(output);
      let videoFrame = `<h4>Видео</h4>`;

      if (output.results.length === 0) {
        videoFrame += '<p>К сожалению, видео отсутствует.</p>'
      }

      output.results.forEach(item => {
        videoFrame += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      });
      youtube.innerHTML = videoFrame;
    })
    .catch(reason => {
      youtube.innerText = 'Видео отсутствует';
      console.error('error', reason);
    });
}

// Show full info of each item
function showInfo() {
  let url = '';

  if (this.dataset.type) {
    url = `https://api.themoviedb.org/3/${this.dataset.type}/${this.dataset.id}?api_key=0e66e3cd5d8c014d6e406d8aba055a88&language=ru-RU`;
  } else {
    movies.innerHTML = '<h2 class="text-danger">Произошла ошибка. Повторите позже</h2>';
  }

  fetch(url)
    .then(response => {
      if (response.status !== 200) {
        return Promise.reject(new Error(response.status));
      }
      return response.json();
    })
    .then(output => {
      console.log(output);
      movies.innerHTML = `
      <div class="col-4">
        <img src="${img_url}${output.poster_path}" alt="${output.name || output.title}">
        ${(output.homepage) ? `<p><a href="${output.homepage}" target="_blank">Официальная страница</a></p>` : ''}
        ${(output.imdb_id) ? `<p><a href="https://imdb.com/title/${output.imdb_id}" target="_blank">Сcылка на imdb.com</a></p>` : ''}
      </div>
      <div class="col-8">
        <h3>${output.name || output.title}</h3>
        <p>Рейтинг: ${output.vote_average}</p>
        <p>Статус: ${output.status}</p>
        <p>Премьера: ${output.release_date || output.first_air_date}</p>
        ${(output.last_episode_to_air) ? `<p>Вышло сезонов: ${output.number_of_seasons}, серий: ${output.number_of_episodes}</p>` : ''}
        <p>${output.overview}</p>
        <p>Жанр: ${output.genres.map(item => item.name)}</p>
        <p class="video"></p>
      </div>   
      <div class="col-12"></div>
      `;
      getVideo(this.dataset.type, this.dataset.id);
    })
    .catch(reason => {
      movies.innerText = 'Что-то пошло не так...';
      console.error('error', reason);
    });
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
  movies.innerHTML = '<div class="loader"></div>';
  fetch('https://api.themoviedb.org/3/trending/all/day?api_key=0e66e3cd5d8c014d6e406d8aba055a88&language=ru-RU')
    .then(response => {
      if (response.status !== 200) {
        return Promise.reject(new Error(response.status));
      }
      return response.json();
    })
    .then(output => {
      let inner = '<div class="col-12 mb-5"><h2 class="text-info text-center">Популярные</h2></div>';

      output.results.forEach(item => {
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