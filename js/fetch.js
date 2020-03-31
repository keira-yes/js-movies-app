const searchForm = document.getElementById('search-form'),
  movies = document.getElementById('movies')
  img_url = 'https://image.tmdb.org/t/p/w500/';

// Search request on fetch
function searchApi(e) {
  e.preventDefault();
  const searchText = document.getElementById('searchText').value,
    url = 'https://api.themoviedb.org/3/search/multi?api_key=0e66e3cd5d8c014d6e406d8aba055a88&language=ru-RU&query=' + searchText;

  movies.innerText = 'Загрузка...';

  fetch(url)
    .then(response => {
      if (response.status !== 200) {
        return Promise.reject(new Error(response.status));
      }
      return response.json();
    })
    .then(output => {
      let inner = '';

      output.results.forEach(item => {
        let name = item.name || item.title,
          date = item.first_air_date || item.release_date,
          img = item.backdrop_path === null ? 'img/no_image.png' : img_url + item.backdrop_path;
        inner += `
          <div class="col-3">
            <div class="card mb-4">
              <img src=${img} class="card-img-top" alt=${name}>
              <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <span>${date}</span>
              </div>
            </div>
          </div>          
        `;
        console.log(item.backdrop_path);
      });

      movies.innerHTML = inner;
    })
    .catch(reason => {
      movies.innerText = 'Что-то пошло не так...';
      console.error('error', reason);
    });
}

searchForm.addEventListener('submit', searchApi);