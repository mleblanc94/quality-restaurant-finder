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
    let intRLocationId=0;// Restuarant location Id
    let intRLatitude=0;// Restuarant latitude
    let intRLongitude=0;// Restuarant longitude
    let strFLContnet = '';
    //loop through the JSON
    for (i = 0; i < 6; i++) {
        //Store Location Details
        intRLocationId = objRestuarantAPIJson.results.data[i].location_id;
        intRLatitude = objRestuarantAPIJson.results.data[i].latitude;
        intRLongitude = objRestuarantAPIJson.results.data[i].longitude;

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
        hTitle.setAttribute('class','mb-2 mt-0 text-4xl font-medium leading-tight text-primary')
        hTitle.textContent = objRestuarantAPIJson.results.data[i].name;//Hotel Name        
        //add icon to title        
        divCardBlockHeader.append(hTitle);//add title to header
        //card body
        var divCardBlockBody = document.createElement('div');
        divCardBlockBody.setAttribute('class', 'card-body');
        divCardBlockBody.setAttribute('style', 'background-color: #FFFFFF;')

        var imgWeatherIcon = document.createElement('img');//Main Image 
        imgWeatherIcon.setAttribute('src', '' + objRestuarantAPIJson.results.data[i].photo.images.small.url + '');
        imgWeatherIcon.setAttribute('alt', 'Hotel');

        //Details
        var divCardBlockContentTemp = document.createElement('p');
        divCardBlockContentTemp.setAttribute('class', 'card-text');
        strFLContnet = ''
        if(objRestuarantAPIJson.results.data[i].description != '' && objRestuarantAPIJson.results.data[i].description != null)
        strFLContnet = objRestuarantAPIJson.results.data[i].description + '<br /><br />';
        strFLContnet = strFLContnet + '<b>Rating:</b> ' + objRestuarantAPIJson.results.data[i].rating + ',  <b>Ranking :</b> '  + objRestuarantAPIJson.results.data[i].ranking + 
        ',  <b>Open/Close :</b> '  + objRestuarantAPIJson.results.data[i].open_now_text + ', ' + objRestuarantAPIJson.results.data[i].price_level + 
        ',  <b>Distance :</b> '  + objRestuarantAPIJson.results.data[i].gb_distance; 
        
        divCardBlockContentTemp.innerHTML = strFLContnet;
        strFLContnet='';//Empty Contents 

        var divCardBlockContentTemp2 = document.createElement('p');
        divCardBlockContentTemp2.setAttribute('class', 'card-text');
        //add details
        strFLContnet = '<b>Address:</b> ' + objRestuarantAPIJson.results.data[i].address + ',  <b>Phone </b> '  + objRestuarantAPIJson.results.data[i].phone + 
        ',  <b>email:</b> <a href = "mailto:'  + objRestuarantAPIJson.results.data[i].email+ '">Send Email</a><br />'+
        '<a class="text-primary underline decoration-transparent transition duration-300 ease-in-out hover:decoration-inherit" href ="'  + objRestuarantAPIJson.results.data[i].website+ '" target="_blank">Restuarant Website</a>'+
        ', <a class="text-primary underline decoration-transparent transition duration-300 ease-in-out hover:decoration-inherit" href ="'  + objRestuarantAPIJson.results.data[i].web_url+ '" target="_blank">Trip Advisor Website</a>'+
        ', <a class="text-primary underline decoration-transparent transition duration-300 ease-in-out hover:decoration-inherit" href ="'  + objRestuarantAPIJson.results.data[i].web_url+ '#REVIEWS" target="_blank">Read Review</a>'+
        ', <a class="text-primary underline decoration-transparent transition duration-300 ease-in-out hover:decoration-inherit" href ="'  + objRestuarantAPIJson.results.data[i].write_review+ '" target="_blank">Write Review</a>';
        if (objRestuarantAPIJson.results.data[i].booking != null){
            strFLContnet= strFLContnet + '<br /><b>Order Online :</b> <a class="text-primary underline decoration-transparent transition duration-300 ease-in-out hover:decoration-inherit" href ="'  + objRestuarantAPIJson.results.data[i].booking.url+ '" target="_blank">' +
        ' '  + objRestuarantAPIJson.results.data[i].booking.provider+ '</a>';
        }        
        divCardBlockContentTemp2.innerHTML = strFLContnet;
       
        strFLContnet='';//Empty Contents 
        var divCardBlockContentTemp3 = document.createElement('p');
        divCardBlockContentTemp3.setAttribute('class', 'card-text');
        //get Cuisine
        if(objRestuarantAPIJson.results.data[i].cuisine != '' && objRestuarantAPIJson.results.data[i].cuisine != null){
            strFLContnet = '<br /><b><ul>Cuisine: </ul></b>';
            let objContents = objRestuarantAPIJson.results.data[i].cuisine;
            strFLContnet = strFLContnet + getInnerContents(objRestuarantAPIJson.results.data[i].cuisine);            
        }
       //get Food Options
        if(objRestuarantAPIJson.results.data[i].dietary_restrictions != '' && objRestuarantAPIJson.results.data[i].dietary_restrictions != null){
            strFLContnet = strFLContnet + ' <br /> <b><ul>Options:</ul></b>';
            strFLContnet = strFLContnet + getInnerContents(objRestuarantAPIJson.results.data[i].dietary_restrictions);
        }
        divCardBlockContentTemp3.innerHTML = strFLContnet;

        divCardBlockBody.append(imgWeatherIcon);
        divCardBlockBody.append(divCardBlockContentTemp);     
        divCardBlockBody.append(divCardBlockContentTemp2);  
        divCardBlockBody.append(divCardBlockContentTemp3);    
        divCardBlock.append(divCardBlockHeader);
        divCardBlock.append(divCardBlockBody);
        divContainerMain.append(divCardBlock);//add card to container

    }
}

function getInnerContents(objContents){
    let strInnerContents='';
    for(cnt=0; cnt<objContents.length; cnt++){
        if(cnt != 0) strInnerContents = strInnerContents +', ';
        strInnerContents = strInnerContents + objContents[cnt].name;
    }    
    return strInnerContents;
}

init();//Initiate the Application