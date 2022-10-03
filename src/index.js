import './css/styles.css';
import { fetchCountries } from "./fetchCountries"
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const refs = {
    countryContainer: document.querySelector('.country-info'),
    countryList: document.querySelector('.country-list'),
    searchInput: document.querySelector('#search-box')
}

const DEBOUNCE_DELAY = 300;

refs.searchInput.addEventListener('input', debounce(() => {
    const name = refs.searchInput.value.trim();
    if (!name) {
        reset();
        return;
    }
    fetchCountries(name)
        .then(countryInfo => showCoutry(countryInfo))
        .catch(error => showError(error));
}, DEBOUNCE_DELAY))

function showCoutry(countryInfo) {
    reset();
    if (countryInfo.length === 1) {
        renderCountryInfo(countryInfo);
        return;
    }
    if (countryInfo.length >= 2 && countryInfo.length <= 10) {
        renderList(countryInfo);
    } else {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    }
}

function showError(error) {
    reset();
    console.log(error);
    Notiflix.Notify.failure('Oops, there is no country with that name')
}

function reset() {
    refs.countryList.innerHTML = '';
    refs.countryContainer.innerHTML = '';
}

function renderList(countryInfo) {
    countryInfo.map(item => {
            const countryListItem = `<li style="list-style:none; margin:5px; padding:0"><img src="${item.flags.svg}" width="30" height="20" /> ${item.name.official}</li>`
            refs.countryList.insertAdjacentHTML('beforeend', countryListItem);
        })
}

function renderCountryInfo(countryInfo) {
    const countryData = `<span style="font-size:28px; font-family:bold">
        <img src="${countryInfo[0].flags.svg}" width="35" height="35" /> 
        ${countryInfo[0].name.official}
        </span>
        <p>Capital: ${countryInfo[0].capital}</p>
        <p>Population: ${countryInfo[0].population}</p>
        <p>Languages: ${Object.values(countryInfo[0].languages)}</p>`;
        refs.countryContainer.insertAdjacentHTML('afterbegin', countryData);
}