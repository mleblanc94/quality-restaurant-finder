// Creation Date: 08/09/2023

// Global Variables.
var userFormEl = document.querySelector('#frmUserSearch');
var strCityName = document.querySelector('#txtboxCityName');
var strUserAddress = document.querySelector('#txtboxUserAddress');

var divContainerMain = document.querySelector('#divContainerMain');




//Function on Startup of Application
function init() {
    //Event Handler for Button Click
    userFormEl.addEventListener('submit', SearchSubmitHandler);// Search Button   

    //Empty Pre existing data
    divContainerMain.textContent = "";   
}

//Function called when search button is clicked
var SearchSubmitHandler = function (event) {
    event.preventDefault();
    //Empty existing data
    divContainerMain.textContent = "";    

    var strUserSearch = strCityName.value.trim();//get User input
    var strUAddress = strUserAddress.value.trim();//get User input

    if (strUserSearch && strUAddress) {
        getUserRepos(strUserSearch);//get weather data        
        strCityName.textContent = '';
    } else {
        alert('Please enter a City Name and Address');
    }
};

//function to get weather data using the Openweather API.
var getUserRepos = function (USearch) {
    //Empty existing data
    divContainerMain.textContent = "";
    
    var intLocationID = 0;
    const strLocationIDAPIurl = 'https://worldwide-restaurants.p.rapidapi.com/typeahead';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '4c261bf440mshaad27c31e06c53bp1101fejsnd94b5595d80a',
            'X-RapidAPI-Host': 'worldwide-restaurants.p.rapidapi.com'
        },
        body: new URLSearchParams({
            q: '' + USearch + '',
            language: 'en_US'
        })
    };

    fetch(strLocationIDAPIurl, options)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {                    
                    intLocationID = data.results.data[0].result_object.location_id;                    
                    getRestaurantData(intLocationID);
                });
            } else {
                alert('Error: ' + response.statusText);//if response not OK
            }
        })
        .catch(function (error) {//Exception Handling
            alert('Unable to connect to API');
        });
};

function getRestaurantData(intULocId) {
    const strRestaurantDataAPIurl = 'https://worldwide-restaurants.p.rapidapi.com/search';
    const optionsRestaurant = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '4c261bf440mshaad27c31e06c53bp1101fejsnd94b5595d80a',
            'X-RapidAPI-Host': 'worldwide-restaurants.p.rapidapi.com'
        },
        body: new URLSearchParams({
            language: 'en_US',
            limit: '30',
            location_id: '' + intULocId + '',
            currency: 'USD'
        })
    };

    fetch(strRestaurantDataAPIurl, optionsRestaurant)
        .then(function (response) {            
            if (response.ok) {
                response.json().then(function (data) {                   
                    console.log(data);                                   
                    DisplayRestaurantData(data);
                });
            } else {
                alert('Error: ' + response.statusText);//if response not OK
            }
        })
        .catch(function (error) {//Exception Handling
            alert('Unable to connect to API');
        });

}

function DisplayRestaurantData(objRestuarantAPIJson) { 

    //loop through the JSON
    for (i = 0; i < 10; i++) {
        //Main Card display
        var lnDivider = document.createElement('hr');//line 
        divContainerMain.append(lnDivider);

        var divCardBlock = document.createElement('div');//Card
        divCardBlock.setAttribute('class', 'card');
        divCardBlock.setAttribute('style', 'max-width: 92rem; margin: 5px; background-color:#FFFFFF;');

        var divCardBlockHeader = document.createElement('div');//card Header
        divCardBlockHeader.setAttribute('class', 'card-header');
        divCardBlockHeader.setAttribute('style', 'background-color: #FFFFFF')

        var hTitle = document.createElement('h2')//header title
        hTitle.textContent = objRestuarantAPIJson.results.data[i].name;//Hotel Name        
        //add icon to title        
        divCardBlockHeader.append(hTitle);//add title to header
        //card body
        var divCardBlockBody = document.createElement('div');
        divCardBlockBody.setAttribute('class', 'card-body');
        divCardBlockBody.setAttribute('style', 'background-color: #FFFFFF;')

        var imgWeatherIcon = document.createElement('img');//header 
        imgWeatherIcon.setAttribute('src', '' + objRestuarantAPIJson.results.data[i].photo.images.small.url + '');
        imgWeatherIcon.setAttribute('alt', 'Hotel');

        //Details
        var divCardBlockContentTemp = document.createElement('p');
        divCardBlockContentTemp.setAttribute('class', 'card-text');
        var strFLContnet = 'Rating: ' + objRestuarantAPIJson.results.data[i].rating + ',  Ranking : '  + objRestuarantAPIJson.results.data[i].ranking + 
        ',  Open/Close : '  + objRestuarantAPIJson.results.data[i].open_now_text + ', ' + objRestuarantAPIJson.results.data[i].price_level + 
        ',  Distance : '  + objRestuarantAPIJson.results.data[i].gb_distance; 
        
        divCardBlockContentTemp.textContent = strFLContnet;
       
        divCardBlockBody.append(imgWeatherIcon);
        divCardBlockBody.append(divCardBlockContentTemp);        
        divCardBlock.append(divCardBlockHeader);
        divCardBlock.append(divCardBlockBody);
        divContainerMain.append(divCardBlock);//add card to container

    }
}

init();//Initiate the Application