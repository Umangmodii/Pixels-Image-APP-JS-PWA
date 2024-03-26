const apiKey = 'mJStW8Y04RIxhcOsArZneoFnUgoVJiD1CeD2lZgQI1v3msZxjDISfsZE';
let currentPage = 1;
let totalPages = 1;
let totalResults = 0;

function searchImages(query, page) {
  let apiUrl = `https://api.pexels.com/v1/curated?per_page=20&page=${page}`;
  if (query) {
    apiUrl = `https://api.pexels.com/v1/search?query=${query}&per_page=20&page=${page}`;
  }

  fetch(apiUrl, {
    headers: {
      Authorization: apiKey,
    },
  })
    .then(response => response.json())
    .then(data => {
      const imagesContainer = document.getElementById('imagesContainer');
      imagesContainer.innerHTML = ''; // Clear previous search results

      // Create rows for images
      for (let i = 0; i < data.photos.length; i += 4) {
        const row = document.createElement('div');
        row.classList.add('row', 'justify-content-center');

        for (let j = i; j < i + 4 && j < data.photos.length; j++) {
          const imgContainer = document.createElement('div');
          imgContainer.classList.add('col-md-3', 'mb-3');

          const imgElement = document.createElement('img');
          imgElement.src = data.photos[j].src.medium;
          imgElement.alt = data.photos[j].alt;
          imgElement.classList.add('img-fluid', 'rounded', 'image-item');
          imgContainer.appendChild(imgElement);

          const downloadBtn = document.createElement('a');
          downloadBtn.href = data.photos[j].src.original;
          downloadBtn.download = 'image.jpg';
          downloadBtn.innerHTML = '<button class="btn btn-primary mt-2">Download</button>';
          imgContainer.appendChild(downloadBtn);

          row.appendChild(imgContainer);
        }

        imagesContainer.appendChild(row);
      }

      // Update total results
      totalResults = data.total_results;
      updateTotalResults();

      // Update pagination
      currentPage = page;
      totalPages = Math.ceil(data.total_results / 20);
      updatePaginationButtons();
    })
    .catch(error => console.error('Error fetching images:', error));
}

function updateTotalResults() {
  const totalResultsElement = document.getElementById('totalResults');
  totalResultsElement.textContent = `Total Results: ${totalResults}`;
}

function updatePaginationButtons() {
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');

  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      searchImages(document.getElementById('searchInput').value.trim(), currentPage - 1);
    }
  });

  nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      searchImages(document.getElementById('searchInput').value.trim(), currentPage + 1);
    }
  });
}

document.getElementById('searchBtn').addEventListener('click', () => {
  const searchInput = document.getElementById('searchInput');
  const query = searchInput.value.trim();
  if (query !== '') {
    searchImages(query, 1);
  } else {
    alert('Please enter search keywords.');
  }
});

// Fetch and display images on page load
document.addEventListener('DOMContentLoaded', () => {
  searchImages('', 1); // Empty query fetches 20 random images
});
