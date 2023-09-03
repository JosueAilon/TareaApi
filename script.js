const apiKey = 'bb7abbcea0251e406b9e2d37d08924a1'; // Replace with your API key
let language = 'en'; // Default language is English
const genreSelect = document.getElementById('genre-select');
const moviesList = document.getElementById('movies-list');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const englishButton = document.getElementById('english-button');
const spanishButton = document.getElementById('spanish-button');

let currentPage = 1;
const moviesPerPage = 10;

// Function to set the language and update the page
function setLanguage(lang) {
    language = lang;
    fetchGenres();
    fetchMoviesByGenreAndPage('', currentPage);
}

// Function to fetch genres and populate the select element
function fetchGenres() {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?language=${language}&api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            genreSelect.innerHTML = ''; // Clear previous options
            data.genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.name;
                genreSelect.appendChild(option);
            });
        })
        .catch(error => console.error(error));
}

// Function to fetch and display movies based on selected genre and page
function fetchMoviesByGenreAndPage(genreId, page) {
    const offset = (page - 1) * moviesPerPage;
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=${language}&with_genres=${genreId}&page=${page}`)
        .then(response => response.json())
        .then(data => {
            moviesList.innerHTML = ''; // Clear previous movies
            data.results.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('movie');

                const poster = document.createElement('img');
                poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                poster.alt = movie.title;

                const title = document.createElement('div');
                title.classList.add('movie-title');
                title.textContent = movie.title;

                const description = document.createElement('div');
                description.classList.add('movie-description');
                description.textContent = movie.overview;

                movieDiv.appendChild(poster);
                movieDiv.appendChild(title);
                movieDiv.appendChild(description);

                moviesList.appendChild(movieDiv);
            });

            // Enable or disable pagination buttons based on the current page
            prevButton.disabled = page === 1;
            nextButton.disabled = page >= data.total_pages;
        })
        .catch(error => console.error(error));
}

// Event listeners for language buttons
englishButton.addEventListener('click', () => {
    setLanguage('en');
});

spanishButton.addEventListener('click', () => {
    setLanguage('es');
});

// Event listener for genre selection change
genreSelect.addEventListener('change', () => {
    const selectedGenreId = genreSelect.value;
    currentPage = 1; // Reset to the first page when changing genres
    fetchMoviesByGenreAndPage(selectedGenreId, currentPage);
});

// Event listener for "Siguiente" button click
nextButton.addEventListener('click', () => {
    currentPage++;
    const selectedGenreId = genreSelect.value;
    fetchMoviesByGenreAndPage(selectedGenreId, currentPage);
});

// Event listener for "Anterior" button click
prevButton.addEventListener('click', () => {
    currentPage--;
    const selectedGenreId = genreSelect.value;
    fetchMoviesByGenreAndPage(selectedGenreId, currentPage);
});

// Initial load: Fetch genres and popular movies on the first page
fetchGenres();
fetchMoviesByGenreAndPage('', currentPage);