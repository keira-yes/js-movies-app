const searchForm = document.getElementById('search-form'),
movies = document.getElementById('movies');

// XHR request on Promise to server
function requestApi(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);

    request.addEventListener('load', () => {
      if (request.status !== 200) {
        reject({status: request.status});
        return;
      }
      resolve(request.response)
    });

    request.addEventListener('error', () => {
      reject({status: request.status})
    });

    request.send();

  });
}

// Search request

function searchApi(e) {
  e.preventDefault();
  const searchText = document.getElementById('searchText').value,
   url = 'https://api.themoviedb.org/3/search/multi?api_key=0e66e3cd5d8c014d6e406d8aba055a88&language=ru-RU&query=' + searchText;

  movies.innerText = 'Загрузка...';

  requestApi('GET', url)
    .then(response => {
      const output = JSON.parse(response);
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