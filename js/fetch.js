const searchForm = document.getElementById('search-form'),
  movies = document.getElementById('movies');

// Search request on fetch
function searchApi(e) {
  e.preventDefault();
  const searchText = document.getElementById('searchText').value,
    url = 'https://api.themoviedb.org/3/search/multi?api_key=0e66e3cd5d8c014d6e406d8aba055a88&language=ru-RU&query=' + searchText;

  movies.innerText = 'Загрузка...';

  fetch(url)
    .then(response => response.json())
    .then(output => {
      let inner = '';

      output.results.forEach(item => {
        let name = item.name || item.title,
          date = item.first_air_date || item.release_date;
        inner += `<div class="col-3"><h5>${name}</h5><span>${date}</span></div>`;
      });

      movies.innerHTML = inner;
    })
    .catch(reason => {
      movies.innerText = 'Что-то пошло не так...';
      console.error('error', reason.status);
    });
}

searchForm.addEventListener('submit', searchApi);