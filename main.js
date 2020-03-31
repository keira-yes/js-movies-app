const searchForm = document.getElementById('search-form'),
movies = document.getElementById('movies');

// Request XHR to server
function requestApi(method, url) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.send();
  request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) {
      console.log('error: ' + request.status);
      return;
    }
    if (request.status !== 200) {
      console.log('error: ' + request.status);
      return;
    }

    const output = JSON.parse(request.response);
    let inner = '';

    output.results.forEach(item => {
      let name = item.name || item.title,
        date = item.first_air_date || item.release_date;
      inner += `
      <div class="col-3">
        <h5>${name}</h5>
        <span>${date}</span>
      </div>
      `;
    });

    movies.innerHTML = inner;
    console.log(output);
  })
}

// Search request
function searchApi(e) {
  e.preventDefault();

  const searchText = document.getElementById('searchText').value,
   url = 'https://api.themoviedb.org/3/search/multi?api_key=0e66e3cd5d8c014d6e406d8aba055a88&language=ru-RU&query=' + searchText;

  requestApi('GET', url);
}

searchForm.addEventListener('submit', searchApi);