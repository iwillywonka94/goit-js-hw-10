import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './scripts/fetchCountries';
import { input, countryList, countryInfo } from './scripts/refs'


const DEBOUNCE_DELAY = 300;
const MANY_SEARCH_RESULTS = "Too many matches found. Please enter a more specific name.";
const ERROR_MESSAGE = "Oops, there is no country with that name";

input.addEventListener("input", debounce(searchField, DEBOUNCE_DELAY))

function searchField (value) {
    if (!input.value) {
        clearInput();
        return
    }
    fetchCountries(input.value.trim()).then(response => {
        if(response.length >= 10) {
            return Notiflix.Notify.failure(MANY_SEARCH_RESULTS);
        }
        else if (response.length >= 2 && response.length < 10) {
            clearInput();
            markupListCountry(response);
        }
        else {
            clearInput();
            markupInfoAboutCountry(response);
        }
    }).catch(error => {
        clearInput();
        console.error(error);
        Notiflix.Notify.failure(ERROR_MESSAGE);
    })
};


function clearInput () {
    countryList.innerHTML = "";
    countryInfo.innerHTML = "";
};

function markupListCountry(array) {
    const markUp = array.map(({name, flags}) => `<li class="list"><img width="50" src="${flags.svg}"> ${name.official}</li>`).join("")
    countryList.insertAdjacentHTML('beforeend', markUp)
};

function markupInfoAboutCountry (array) {
    const markUp = array.map(({name, capital, population, languages, flags}) => `<ul><li class="list"><img width="50" src="${flags.svg}"> ${name.official}</li><li class="item">Capital: ${capital}</li><li class="item">Population: ${population}</li><li class="item">Languages: ${Object.values(languages)}</li></ul>`).join("")
    countryInfo.insertAdjacentHTML('beforeend', markUp);
};
