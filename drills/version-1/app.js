const baseUrl = 'http://api.citybik.es/v2/networks'
const networkIdUrl = 'http://api.citybik.es'
let countryDropDown = document.querySelector('.country-drop-down')
let cityDropDown = document.querySelector('.city-drop-down')
let main = document.querySelector('main')
let businessSection = document.querySelector('.business-section')
let cruisingBike = document.querySelector('.cruising-bike')
let citiesArray = []


function populateCountries(data) {
  let filteredCountries = (data.networks.map(country => {
    return country.location.country
  }))
 filteredCountries.sort()
  for(let i=0; i<filteredCountries.length; i++) {
    if(filteredCountries[i] !== filteredCountries[i-1]) {
      var createOptions = document.createElement('option')
      createOptions.classList.add('country-option')
      createOptions.innerHTML = filteredCountries[i]
      countryDropDown.appendChild(createOptions)
      }
    }
  countryDropDown.addEventListener('change', () => selectCity(data))
}





function selectCity(data) {
  let filteredCities = (data.networks.map((city, index) => {
    return city.location.city
  }))
  filteredCities.sort()

  citiesArray = []
  for(let i = 0; i<filteredCities.length; i++) {
    if(filteredCities[i] !== filteredCities[i-1]) {
      citiesArray.push(filteredCities[i])
    }
  }
  cityDropDown.length = 1

  for(let i=0; i<citiesArray.length; i++) {
    if(event.target.value === data.networks[i].location.country) {
      var createOptions = document.createElement('option')
      createOptions.innerHTML = data.networks[i].location.city
      cityDropDown.appendChild(createOptions)
    }
  }
  cityDropDown.addEventListener('change', () => showBusinesses(data))
  cityDropDown.addEventListener('change', showSection)
}

function showSection() {
  businessSection.style.display = 'flex'
  cruisingBike.style.display = 'none'
}

function showBusinesses(data) {
  businessSection.textContent =''
  data.networks.map(cities => {
    if(event.target.value === cities.location.city) {
      let businessDiv = document.createElement('div')
      let businessTitle = document.createElement('h3')
      businessTitle.textContent = 'Businesses'
      businessSection.appendChild(businessTitle)
      businessSection.appendChild(businessDiv)
      for(let i=0; i<cities.company.length; i++) {
        let businessNameHeader = document.createElement('p')
        businessDiv.appendChild(businessNameHeader)
        businessNameHeader.textContent = cities.company[i]
      }
      let businessLink = document.createElement('a')
      businessLink.classList.add('bike-list')
      businessLink.href = cities.href
      businessLink.textContent = 'Bike Stations'
      businessDiv.appendChild(businessLink)
      businessLink.addEventListener('click', () => getMoreData(data, event))
    }
  })
}

function bikesAvailable(data) {

  for(let i=0; i<data.network.stations.length; i++) {
    let stationSection = document.createElement('section')
    let stationName = document.createElement('h4')
    let stationList = document.createElement('ul')
    let emptySlots = document.createElement('li')
    let freeBikes = document.createElement('li')

    stationSection.classList.add('station-section')
    stationList.classList.add('station-list')
    stationName.textContent = data.network.stations[i].name
    emptySlots.textContent = 'Empty Slots: ' + data.network.stations[i].empty_slots
    freeBikes.textContent = 'Bikes Available: ' + data.network.stations[i].free_bikes

    businessSection.appendChild(stationSection)
    stationSection.appendChild(stationName)
    stationSection.appendChild(stationList)
    stationList.appendChild(emptySlots)
    stationList.appendChild(freeBikes)
  }
}


function getMoreData(data, event) {
  event.preventDefault()
  fetch(baseUrl + event.target.href.split('/networks')[1])
    .then(response => {
      return response.json()
    })
    .then(bikesAvailable)
}

fetch(baseUrl)
  .then(response => {
    return response.json()
  })
  .then(populateCountries)




  //end
