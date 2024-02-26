class CountryName {
    common: string;
    constructor(common: string) {
        this.common = common;
    }
}

class Currency {
    name: string;
    symbol: string;
    constructor(name: string, symbol: string) {
        this.name = name;
        this.symbol = symbol;
    }
}

class Country {
    name: CountryName;
    population: number;
    region: string;
    currencies: Currency;
    constructor(name: string, population: number, region: string, currencies: Currency) {
        this.name = new CountryName(name);
        this.population = population;
        this.region = region;
        this.currencies = currencies;
    }
}

class Counter {
    [key: string]: number;
}

function createTableRegion(countries: Country[]):void {
    const counterRegion: Counter = {
        Asia: 0,
        Europe: 0,
        Africa: 0,
        Americas: 0,
        Oceania: 0,
        Antarctic: 0
    };
    countries.forEach(country => {
        counterRegion[country.region]++;
    });
    Object.keys(counterRegion).forEach(key => {
        $('.regionTable').append(`<tr><td>${key}</td><td>${counterRegion[key]}</td></tr>`)
    });
}

    function createTableCurrency(countries: Country[]):void {
        const counterCurrency:Counter = {};
        countries.forEach(country => {
            if (!country.currencies) {
                counterCurrency['No currency'] = (counterCurrency['No Currency'] || 0) + 1;
                return;
            }
            let keys = Object.keys(country.currencies);
            keys.forEach(key => {
                counterCurrency[key] = (counterCurrency[key]||0) + 1;
            })
        });
        Object.keys(counterCurrency).forEach(key => {
            $('.currencyTable').append(`<tr><td>${key}</td><td>${counterCurrency[key]}</td></tr>`);
        })
    }

function displayCountriesInfo(countries: Country[]):void {
    const sumPop: number = countries.reduce((acc, country) => acc + country.population, 0);
    $('.countriesCount').text(`Total number of countries returned is : ${countries.length}`);
    $('.sumAllPop').text(`population of all countries returned is : ${sumPop}`);
    $('.avgPop').text(`Average population of all countries is : ${Math.floor(sumPop / countries.length)}`);
    countries.forEach(country => {
        $('.countryTable').append(`<tr><td>${country.name.common}</td><td>${country.population}</td></tr>`)
    });
}

function clearBoard():void {
    $('.countryTable').empty();
    $('.regionTable').empty();
    $('.currencyTable').empty();
}

function fetchDataAndDisplay(url: string):void {
    clearBoard()
    $.get({
        url: url,
        dataType: 'json',
        success: function(countries: Country[]) {
            displayCountriesInfo(countries);
            createTableRegion(countries);
            createTableCurrency(countries);
            },
            error: function(error) {
                console.error('Error fetching data:', error);
            }
    });
}

$('#showAllBtn').on('click', function():void {
    fetchDataAndDisplay('https://restcountries.com/v3.1/all');
})

$('#searchBtn').on('click', function():void {
    fetchDataAndDisplay(`https://restcountries.com/v3.1/name/${$('#search').val()}`);
});