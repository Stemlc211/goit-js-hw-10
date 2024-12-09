import { fetchBreeds, fetchCatByBreed } from './cat-api';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

async function init() {
  try {
    loader.classList.remove('hidden');
    const breeds = await fetchBreeds();
    populateBreeds(breeds);
    new SlimSelect({ select: '.breed-select' });

    breedSelect.classList.remove('hidden');
  } catch (err) {
    ShowError(err.message);
  } finally {
    loader.classList.add('hidden');
  }
}

function populateBreeds(breeds) {
  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
}

async function HandleBreedChange() {
  const breedId = breedSelect.value;
  if (!breedId) return;

  try {
    showLoader();
    const cat = await fetchCatByBreed(breedId);
    displayCatInfo(cat);
  } catch (err) {
    ShowError(err.message);
  } finally {
    hideLoader();
  }
}

// function displayCatInfo(cat) {
//   const { name, description, temperament } = cat.breeds[0];
//   document.querySelector('.cat-image').src = cat.url;
//   document.querySelector('.cat-name').textContent = name;
//   document.querySelector('.cat-description').textContent = description;
//   document.querySelector(
//     '.cat-temperament'
//   ).textContent = `Temperament: ${temperament}`;
//   catInfo.classList.remove('hidden');
// }

function displayCatInfo(cat) {
  if (!cat || !cat.breeds || cat.breeds.length === 0) {
    Notiflix.Notify.failure('Details not found for the selected breed.');
    return;
  }

  const { url } = cat;
  const { name, description, temperament } = cat.breeds[0];

  document.querySelector('.cat-image').src = url;
  document.querySelector('.cat-image').alt = name;
  document.querySelector('.cat-name').textContent = name;
  document.querySelector('.cat-description').textContent = description;
  document.querySelector(
    '.cat-temperament'
  ).textContent = ` Temperament: ${temperament}`;

  catInfo.classList.remove('hidden');
}

function showLoader() {
  loader.classList.remove('hidden');
  catInfo.classList.add('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}

function ShowError(message) {
  error.textContent = message;
  error.classList.remove('hidden');
  setTimeout(() => error.classList.add('hidden'), 3000);
}

breedSelect.addEventListener('change', HandleBreedChange);

init();
