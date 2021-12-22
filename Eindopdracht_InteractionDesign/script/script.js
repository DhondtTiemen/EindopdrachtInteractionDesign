const APIId = "3f6f8bf5";
const APIKey = "956638fbb334611811d806f74473341c";

let map, layergroup;

/*TO DO
- Als het geen geldige input is vermeldens
*/

//----- Add Markers ----- //
const airportsMarker = function(airports){
    //console.log(airports);

    layergroup.clearLayers();

    for (const airport of airports){
        //console.log(airport);

        //Designen van marker
        var airportIcon = L.icon({
            iconUrl: '../img/svg/airport.svg',
            iconSize: [36, 36]
        });

        //Aanmaken van marker
        let airportMarker = L.marker([airport.latitude, airport.longitude], {icon: airportIcon}).addTo(layergroup);
        airportMarker.bindPopup(`<div class="js-airport js-flightlink" airportname="${airport.name}" city="${airport.city}" countrycode="${airport.countryCode}" airportcode="${airport.fs}" lat="${airport.latitude}" long="${airport.longitude}">
                                    <p class="c-card-info c-card-info__title">${airport.name}</p>
                                    <p class="c-card-info c-card-info__subtitle">${airport.city}, ${airport.countryCode}</p>
                                    <a class="c-card-airport__marker-link">View Flights</a>
                                </div>`);

        airportMarker.on('click', listenToClickMarker);
    }

    //Kaart terugplaatsen op Belgïe
    map.setView([50.768707, 4.479281], 7.5);
    
    listenToClickAirport();
}

const startAirportMarker = function(airport){
    //console.log(airport);

    layergroup.clearLayers();

    //Designen van marker
    var airportIcon = L.icon({
        iconUrl: '../img/svg/airport.svg',
        iconSize: [36, 36]
    });

    //Aanmaken van marker
    let airportMarker = L.marker([airport.airportlatitude, airport.airportlongitude], {icon: airportIcon}).addTo(layergroup);
    airportMarker.bindPopup(`<div class="js-airport">
                                <p class="c-card-info c-card-info__title">${airport.airportname}</p>
                                <p class="c-card-info c-card-info__subtitle">${airport.airportcity}, ${airport.countrycode}</p>
                            </div>`);
}

const stopAirportMarker = function(airport){
    //console.log(airport);

    layergroup.clearLayers();

    //Designen van markers
    var startairportIcon = L.icon({
        iconUrl: '../img/svg/airport.svg',
        iconSize: [36, 36]
    });

    var airportIcon = L.icon({
        iconUrl: '../img/svg/finishflag.svg',
        iconSize: [36, 36]
    });

    //Aanmaken van markers
    let startairportMarker = L.marker([airport.destinationlatitude, airport.destinationlongitude], {icon: startairportIcon}).addTo(layergroup);

    let airportMarker = L.marker([airport.airportlatitude, airport.airportlongitude], {icon: airportIcon}).addTo(layergroup);
    airportMarker.bindPopup(`<div class="js-airport">
                                <p class="c-card-info c-card-info__title">${airport.airportname}</p>
                                <p class="c-card-info c-card-info__subtitle">${airport.airportcity}, ${airport.countrycode}</p>
                            </div>`);

    //Lijn aanmaken om airports te verbinden
    var coordinaten = [
        [airport.airportlatitude, airport.airportlongitude],
        [airport.destinationlatitude, airport.destinationlongitude],
    ];

    var polyline = L.polyline(coordinaten, {color: "#137AFF"}).addTo(layergroup);
    map.fitBounds(polyline.getBounds());
}

const markerSearchedAirport = function(city, countrycode, airportcode, airportname, lat, long){
    //console.log(city);

    //Designen van marker
    var airportIcon = L.icon({
        iconUrl: '../img/svg/airport.svg',
        iconSize: [36, 36]
    });

    //Aanmaken van marker
    let airportMarker = L.marker([lat, long], {icon: airportIcon}).addTo(layergroup);
    airportMarker.bindPopup(`<div class="js-airport js-flightlink" airportname="${airportname}" city="${city}" countrycode="${countrycode}" airportcode="${airportcode}" lat="${lat}" long="${long}">
                                <p class="c-card-info c-card-info__title">${airportname}</p>
                                <p class="c-card-info c-card-info__subtitle">${city}, ${countrycode}</p>
                                <a class="c-card-airport__marker-link">View Flights</a>
                            </div>`);

    airportMarker.on('click', listenToClickMarker);

    //map.fitBounds(airportMarker.getBounds());
}

//----- SHOW functions ----- //
const showAirports = function(jsonObject){
    console.log("Airports ingeladen...");
    //console.log(jsonObject);

    const airportHTML = document.querySelector(".js-airports");
    let htmlstringAirports = "";
    let htmlstringSearchBar = "";
    let htmlstringAirportCity = "";
    let htmlstringAirportEnd = "";

    //Airports sorteren op alfabet
    const airports = jsonObject.airports;
    //console.log(airports);

    airports.sort(function(a, b){
        var airport1 = a.name.toLowerCase(), airport2 = b.name.toLowerCase();
        if (airport1 < airport2){
            return -1;
        }
        if (airport1 > airport2){
            return 1;
        }
        return 0;
    });

    for (const airport of airports){
        const airportCode = airport.fs;
        //console.log(airportCode);

        const airportName = airport.name;
        //console.log(airportName);

        const countryCode = airport.countryCode;
        //console.log(countryName);

        const airportCity = airport.city;
        //console.log(airportCity);

        const airportLatitude = airport.latitude;
        //console.log(airportLatitude);

        const airportLongitude = airport.longitude;
        //console.log(airportLongitude);

        const airportCoordinaten = `${airportLatitude}, ${airportLongitude}`;

        htmlstringSearchBar = `<div class="o-layout__item u-1-of-3-bp4">
                                    <div class="c-search o-layout">
                                        <input class="c-search__input o-layout__item u-5-of-6 js-searchbar" type="text" placeholder="Search airport.. ">
                                        <svg class="c-search__icon o-layout__item u-1-of-6 js-searchicon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                                        <svg class="c-search__icon o-layout__item u-1-of-6 js-clearicon hidden" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
                                    </div>
                                    <div class="c-card__list js-airports">`;

        htmlstringAirportCity += `<div class="c-card js-airport" airportname="${airportName}" city="${airportCity}" countrycode="${countryCode}" airportcode="${airportCode}" lat="${airportLatitude}" long="${airportLongitude}">
                                    <div class="o-layout o-layout--align-center o-layout--justify-center">
                                        <div class="o-layout__item u-5-of-6">
                                            <p class="c-card-info c-card-info__title">${airportName}</p>
                                            <p class="c-card-info c-card-info__subtitle">${airportCity}, ${countryCode}</p>
                                        </div>
                                        <div class="o-layout__item u-1-of-6">
                                            <svg class="c-card__icon" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><polygon points="6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12"/></g></svg>
                                        </div>
                                    </div>
                                </div>`;

        htmlstringAirportEnd = `</div>`;

        htmlstringAirports = `${htmlstringSearchBar} ${htmlstringAirportCity} ${htmlstringAirportEnd}`;
    }

    airportsMarker(airports);

    airportHTML.innerHTML = htmlstringAirports;
    listenToSearchAirport();
    listenToClickAirport();
}

const showFlights = async function(flightsByAirport, airport){
    console.log("Flights zijn aan het inladen...");
    console.log(airport);
    console.log(flightsByAirport);

    const airportHTML = document.querySelector(".js-airports");
    let htmlstringFlightsTemperarely = "";
    let htmlstringEndTemperarely = "";
    let htmlstringAirportCity = "";
    let htmlstringFlights = "";
    let htmlstringEnd = "";
    let htmlstringAirportCityWithFlights = "";

    const today = new Date();
    const todayMonth = today.toLocaleString('default', {month: 'short'});
    const todayNumber = today.getDate();
    const todayYear = today.getFullYear();
    const todayDate = `${todayMonth} ${todayNumber}, ${todayYear}`;

    htmlstringAirportCity = `<div class="o-layout__item u-1-of-3-bp4">
                                <div class="c-header o-layout o-layout--align-center o-layout--justify-center">
                                    <div class="o-layout__item u-1-of-6 js-backbutton-flights">
                                        <svg class="c-card__icon u-turn-180" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><polygon points="6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12"/></g></svg>
                                    </div>
                                    <div class="o-layout__item u-5-of-6">
                                        <p class="c-card-info c-card-info__title u-mb-clear">${airport.airportname}</p>
                                        <p class="c-card-info c-card-info__subtitle">${todayDate}</p>
                                    </div>
                                </div>
                                <div class="c-card__list js-flights">`;



    aantalFlights = flightsByAirport.flightStatuses.length;
    //console.log(aantalFlights);

    if (aantalFlights == 0) {
        console.log("Er zijn geen vluchten...");

        htmlstringFlights = `<div class="c-lead--sm u-text-align-center has-error">
                                Er zijn op dit moment geen vluchten vanuit airport <b>${airport.airportname}</b>
                            </div>`;

        htmlstringEnd = `</div>`;

        htmlstringAirportCityWithFlights = `${htmlstringAirportCity} ${htmlstringFlights} ${htmlstringEnd}`;
        airportHTML.innerHTML = htmlstringAirportCityWithFlights;
    }

    for (i = 0; i < aantalFlights; i++){
        htmlstringFlightsTemperarely += `<div class="c-card skeleton js-flight">
                                            <p class="c-card-info c-card-info__subsubtitle u-italic hide-text">Flight: 2203</p>
                                            <div class="o-layout o-layout--align-center o-layout--justify-center">
                                                <div class="o-layout__item u-1-of-3">
                                                    <p class="c-card-info c-card-info__title u-text-align-start hide-text"></p>
                                                    <p class="c-card-info c-card-info__subtitle u-text-align-start hide-text"></p>
                                                    <p class="c-card-info c-card-info__subsubtitle u-text-align-start hide-text"></p>
                                                </div>
                                                <div class="o-layout__item u-1-of-3">
                                                    <p class="c-card-info c-card-info__title u-text-align-end hide-text"></p>
                                                    <p class="c-card-info c-card-info__subtitle u-text-align-end hide-text"></p>
                                                    <p class="c-card-info c-card-info__subsubtitle u-text-align-end hide-text"></p>
                                                </div>
                                            </div>
                                        </div>`;
    }

    htmlstringEndTemperarely = `</div>`;

    htmlstringAirportCityWithFlightsTemperarely = `${htmlstringAirportCity} ${htmlstringFlightsTemperarely} ${htmlstringEndTemperarely}`;
    airportHTML.innerHTML = htmlstringAirportCityWithFlightsTemperarely;


    //Flightinformatie
    const flightsStatus = flightsByAirport.flightStatuses;
    for (const flight of flightsStatus){
        //console.log(flight);

        const flightId = flight.flightId;
        //console.log(flightId);

        const flightNumber = flight.flightNumber;
        //console.log(flightNumber);

        const startUur = flight.departureDate.dateUtc;
        //console.log(startUur);

        const departureTime = startUur.substr(11, 5);
        console.log(`Start: ${departureTime}`);

        const stopUur = flight.arrivalDate.dateLocal;
        //console.log(stopUur);

        const arrivalTime = stopUur.substr(11, 5);
        console.log(`Stop: ${arrivalTime}`);

        //Start AirportInfo ophalen
        const startAirportCode = flight.departureAirportFsCode;
        const startAirportInfo = await getInfoStartAirport(startAirportCode);
        const startAirport = startAirportInfo.airport;

        const startAirportName = startAirport.name;
        //console.log(startAirportName);
        const startAirportCity = startAirport.city;
        //console.log(startAirportCity);
        const startAirportCountryCode = startAirport.countryCode;
        //console.log(startAirportCountryCode);
        const startAirportCountry = startAirport.countryName;
        //console.log(startAirportCountry)
        const startAirportLatitude = startAirport.latitude;
        //console.log(startAirportLatitude);
        const startAirportLongitude = startAirport.longitude;
        //console.log(startAirportLongitude);

        //Stop AirportInfo ophalen
        const stopAirportCode = flight.arrivalAirportFsCode;
        const stopAirportInfo = await getInfoStopAirport(stopAirportCode);
        const stopAirport = stopAirportInfo.airport;

        const stopAirportName = stopAirport.name;
        //console.log(stopAirportName);
        const stopAirportCity = stopAirport.city;
        //console.log(stopAirportCity);
        const stopAirportCountryCode = stopAirport.countryCode;
        //console.log(stopAirportCountryCode);
        const stopAirportCountry = stopAirport.countryName;
        //console.log(stopAirportCountry)
        const stopAirportLatitude = stopAirport.latitude;
        //console.log(stopAirportLatitude);
        const stopAirportLongitude = stopAirport.longitude;
        //console.log(stopAirportLongitude);

        htmlstringFlights += `<div class="c-card js-flight" name="${stopAirportName}" city="${stopAirportCity}" countrycode="${stopAirportCountryCode}" latStart="${startAirportLatitude}" longStart="${startAirportLongitude}" latStop="${stopAirportLatitude}" longStop="${stopAirportLongitude}">
                                <p class="c-card-info c-card-info__subsubtitle u-italic">Flight: ${flightNumber}</p>
                                <div class="o-layout o-layout--align-center o-layout--justify-center">
                                    <div class="o-layout__item u-1-of-2">
                                        <p class="c-card-info c-card-info__title u-text-align-start">${startAirportCity}</p>
                                        <p class="c-card-info c-card-info__subtitle u-text-align-start">${startAirportCountry}</p>
                                        <p class="c-card-info c-card-info__subsubtitle u-text-align-start">${departureTime}</p>
                                    </div>
                                    <div class="o-layout__item u-1-of-2">
                                        <p class="c-card-info c-card-info__title u-text-align-end">${stopAirportCity}</p>
                                        <p class="c-card-info c-card-info__subtitle u-text-align-end">${stopAirportCountry}</p>
                                        <p class="c-card-info c-card-info__subsubtitle u-text-align-end">${arrivalTime}</p>
                                    </div>
                                </div>
                                <div class="c-status-line o-layout__item u-1-of-3">
                                    <div class="c-status-line-circle"></div>
                                    <svg class="c-status-line-plane" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                                    <div class="c-status-line-circle"></div>
                                </div>
                            </div>`;

        htmlstringEnd = `</div>`;
    }

    htmlstringAirportCityWithFlights = `${htmlstringAirportCity} ${htmlstringFlights} ${htmlstringEnd}`;
    airportHTML.innerHTML = htmlstringAirportCityWithFlights;

    listenToClickFlight();
    listenToClickBackButton();
}

//----- GET functions ----- //
const getMap = function(){
    map = L.map("map").setView([50.768707, 4.479281], 7.5);
    
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        zoomOffset: -1,
        accessToken: "pk.eyJ1IjoidGllbWVuZCIsImEiOiJja3dkbzFmMTgwdzJsMzFuMjB5cDUxb2h6In0.5o5LR0PFO1M5YXMCfOXIMw",
        className: 'map-tiles'
    }).addTo(map);

    layergroup = L.layerGroup().addTo(map);
}

const get = (url) => fetch(url).then((r) => r.json());

const getAirports = async function(){
    const url = `https://cors.guillaume.cloud/https://api.flightstats.com/flex/airports/rest/v1/json/countryCode/BE?appId=${APIId}&appKey=${APIKey}`;
    
    const airportsResponse = await get(url);
    showAirports(airportsResponse);
}

const getFlights = async function(airportCode, year, month, day, hourOfDay, airport){
    const url = `https://cors.guillaume.cloud/https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/${airportCode}/dep/${year}/${month}/${day}/${hourOfDay}?appId=${APIId}&appKey=${APIKey}&utc=false&numHours=1`;

    const flightResponse = await get(url);
    showFlights(flightResponse, airport);
}

const getInfoStartAirport = async function(airportcode){
    const url = `https://cors.guillaume.cloud/https://api.flightstats.com/flex/airports/rest/v1/json/${airportcode}/today?appId=${APIId}&appKey=${APIKey}`;
    return get(url);
}

const getInfoStopAirport = async function(airportcode){
    const url = `https://cors.guillaume.cloud/https://api.flightstats.com/flex/airports/rest/v1/json/${airportcode}/today?appId=${APIId}&appKey=${APIKey}`;
    return get(url);
}

//----- EventListeners functions ----- //
const listenToClickLogo = function(){
    const button = document.querySelector('.js-logo');
    button.addEventListener('click', function(){
        console.log('Refresh page!');
        location.reload();
    })
}

const listenToDarkMode = function(){
    const toggle = document.querySelector('.js-darkmode');
    toggle.addEventListener('change', function(){
        console.log('Dark mode...');
        document.querySelector('html').classList.toggle('is-night');
    })
}

const listenToClickBackButton = function(){
    const button = document.querySelector('.js-backbutton-flights');
    button.addEventListener('click', function(){
        console.log('Backbutton clicked');
        getAirports();
    })
}

const listenToSearchAirport = function(){
        const input = document.querySelector('.js-searchbar');
        const iconSearch = document.querySelector('.js-searchicon');
        const iconClear = document.querySelector('.js-clearicon');

        iconSearch.addEventListener('click', function(){
            console.log('Zoekicon geklikt...');

            layergroup.clearLayers();

            let zoekopdracht = input.value.toUpperCase();
            console.log(zoekopdracht);
        
            const airports = document.querySelector('.js-airports');
            const airport = airports.querySelectorAll(".js-airport");
        
            for (i = 0; i < airport.length; i++){
                //console.log(airport[i]);
                let city = airport[i].getAttribute("city");
                let countrycode = airport[i].getAttribute("countrycode");
                let airportcode = airport[i].getAttribute("airportcode");
                let airportname = airport[i].getAttribute("airportname");
                let lat = airport[i].getAttribute("lat");
                let long = airport[i].getAttribute("long");
                //console.log(city);
        
                if (city.toUpperCase().indexOf(zoekopdracht) > -1){
                    airport[i].style.display = "";
                    markerSearchedAirport(city, countrycode, airportcode, airportname, lat, long);
                }
                else {
                    airport[i].style.display = "none";
                }
            }
        });

        input.addEventListener('input', function(){
            console.log('Letter getypt...');

            iconClear.classList.remove('hidden');
            iconSearch.classList.add('hidden');

            iconClear.addEventListener('click', function(){
                input.value = "";
                iconClear.classList.add('hidden');
                iconSearch.classList.remove('hidden');
                getAirports();
            });

            if(input.value == ""){
                iconClear.classList.add('hidden');
                iconSearch.classList.remove('hidden');
            }
            

            layergroup.clearLayers();

            let zoekopdracht = input.value.toUpperCase();
            console.log(zoekopdracht);
        
            const airports = document.querySelector('.js-airports');
            const airport = airports.querySelectorAll(".js-airport");

            let searchAirport = "";
        
            for (i = 0; i < airport.length; i++){
                //console.log(airport[i]);
                let city = airport[i].getAttribute("city");
                let countrycode = airport[i].getAttribute("countrycode");
                let airportcode = airport[i].getAttribute("airportcode");
                let airportname = airport[i].getAttribute("airportname");
                let lat = airport[i].getAttribute("lat");
                let long = airport[i].getAttribute("long");
                //console.log(city);
        
                if (city.toUpperCase().indexOf(zoekopdracht) > -1){
                    airport[i].style.display = "";
                    markerSearchedAirport(city, countrycode, airportcode, airportname, lat, long);
                }
                else {
                    airport[i].style.display = "none";
                }
            }

            console.log(searchAirport);

        })
}

const listenToClickAirport = function(){
    for (const btn of document.querySelectorAll('.js-airport')){
        btn.addEventListener('click', function(){
            console.log('Airport clicked!');

            const airportCode = this.getAttribute('airportcode');
            const countryCode = this.getAttribute('countrycode');
            const airportName = this.getAttribute('airportname');
            const airportCity = this.getAttribute('city');
            const airportLatitude = this.getAttribute('lat');
            const airportLongitude = this.getAttribute('long');

            var today = new Date();
            //console.log(today);

            let year = today.getFullYear();
            let month = today.getMonth() + 1;
            let day = today.getDate();
            let hourOfDay = today.getHours();

            //Aanmaken JSONObject Airport
            const airport = {
                'airportcode': airportCode,
                'countrycode': countryCode,
                'airportname': airportName,
                'airportcity': airportCity,
                'airportlatitude': airportLatitude,
                'airportlongitude': airportLongitude,
            }

            startAirportMarker(airport);
            getFlights(airportCode, year, month, day, hourOfDay, airport);
        })
    }
}

const listenToClickMarker = function(){
    console.log('Pop Up verschijnt..');
    listenToClickLink();
}

const listenToClickLink = function(){
    link = document.querySelector('.js-flightlink');
    link.addEventListener('click', function(){
        console.log("Flights worden ingeladen...");

        const airportCode = this.getAttribute('airportcode');
        const countryCode = this.getAttribute('countrycode');
        const airportName = this.getAttribute('airportname');
        const airportCity = this.getAttribute('city');
        const airportLatitude = this.getAttribute('lat');
        const airportLongitude = this.getAttribute('long');

        var today = new Date();
        //console.log(today);

        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        let hourOfDay = today.getHours();

        //Aanmaken JSONObject Airport
        const airport = {
            'airportcode': airportCode,
            'countrycode': countryCode,
            'airportname': airportName,
            'airportcity': airportCity,
            'airportlatitude': airportLatitude,
            'airportlongitude': airportLongitude,
        }

        startAirportMarker(airport);
        getFlights(airportCode, year, month, day, hourOfDay, airport);
    })
}

const listenToClickFlight = function(){
    for (const btn of document.querySelectorAll('.js-flight')){
        btn.addEventListener('click', function(){
            //Info over luchthaven ophalen
            const airportName = this.getAttribute('name');
            const airportCity = this.getAttribute('city');
            const countryCode = this.getAttribute('countrycode');
            const startLat = this.getAttribute('latStart');
            const startLong = this.getAttribute('longStart');
            const latitude = this.getAttribute('latStop');
            const longitude = this.getAttribute('longStop');

            const airport = {
                'countrycode': countryCode,
                'airportname': airportName,
                'airportcity': airportCity,
                'airportlatitude': latitude,
                'airportlongitude': longitude,
                'destinationlatitude': startLat,
                'destinationlongitude': startLong,
            }

            stopAirportMarker(airport);
        })
    }
}

document.addEventListener("DOMContentLoaded", function() {
    listenToClickLogo();
    getMap();
    listenToSearchAirport();
    listenToDarkMode();
    getAirports();
});