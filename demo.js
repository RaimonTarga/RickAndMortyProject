const fetchCharacters = "https://rickandmortyapi.com/api/character";
const fetchLocations = "https://rickandmortyapi.com/api/location";
const fetchEpisodes = "https://rickandmortyapi.com/api/episode";
const printElement = document.getElementById("print");
const printFicha = document.getElementById("printFicha");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const searchField = document.getElementById('searchField');
const backButton = document.getElementById("backButton");
const typeSelector = document.getElementById("typeSelector");
let currentPage = 1;

searchField.addEventListener('input', (evt) => {
    clearPage();
    updateResults();
});

printResults(currentPage, undefined, fetchCharacters);

function printResults(pageNumber, filter, fetchString){
    fetch(fetchString + "?page=" + pageNumber)
    .then(function cogerRespuesta(respuesta) { 
        return respuesta.json();
    })
    .then(function cogerData(data){ 
        displayData(data, filter);
    })
    .catch(error => {
        //clearPage();
        nextButton.style = "display:none";
        currentPage--;
        //printElement.innerHTML = 'There was a problem with the fetch operation:' + error;
    });
}

function displayData(data, filter){
    data.results.forEach(element => {
        if (filter === undefined || element.name.toLowerCase().includes(filter.toLowerCase())){
            const node = document.createElement("div");
            switch(parseInt(typeSelector.value)){
                case 0:
                    node.innerHTML = 
                    `
                    <div class="ficha">
                    <h1>${element.name}</h1>
                    <img src="${element.image}">
                    </div>  
                    `;
                    
                break;
                case 1:
                    node.innerHTML = 
                    `
                    <div class="ficha">
                    <h1>${element.name}</h1>
                    </div>  
                    `
                break;
                case 2:
                    node.innerHTML = 
                    `
                    <div class="ficha">
                    <h1>${element.episode}</h1>
                    <h1>${element.name}</h1>
                    </div>  
                    `;
                break;
            }
            node.onclick = function(){
                showElement(element);
            };
            printElement.appendChild(node);
        };
    });
}

function clearPage(){
    printElement.innerHTML = "";
    printFicha.innerHTML = "";
}

function nextPage(){
    clearPage();
    currentPage++;
    updateResults();
    if (currentPage != 1){
        previousButton.style = "display:inline";
    }
}

function previousPage(){
    clearPage();
    currentPage--;
    updateResults();
    if (currentPage == 1){
        previousButton.style = "display:none";
    }
    nextButton.style = "display:inline";
}

function showElement(element){
    clearPage();
    let node = document.createElement("div");
    switch(parseInt(typeSelector.value)){
        case 0:
            node.innerHTML = 
            `
            <div class="fichaExpandida">
            <h1>${element.name}</h1>
            <img src="${element.image}">
            <h1>Status: ${element.status}</h1>
            <h1>Species: ${element.species}</h1>
            <h1>Type: ${element.type}</h1>
            <h1>Gender: ${element.gender}</h1>
            </div>  
            `;
            printFicha.appendChild(node);
            node = document.createElement("div");
            node.innerHTML = 
            `
            <div class="fichaLink">
            <h1>Location: ${element.location.name}</h1>
            </div>  
            `;
            
            node.onclick = function(){
                fetch(element.location.url)
                    .then(function cogerRespuesta(respuesta) { 
                        return respuesta.json();
                    })
                    .then(function cogerData(data){
                        typeSelector.selectedIndex = 1; 
                        currentPage = 0;
                        showElement(data);
                    })
            }
            printFicha.appendChild(node);

            node = document.createElement("div");
            node.innerHTML = 
            `
            <h1>Appears in episodes:</h1> 
            `;
            printFicha.appendChild(node);

            node = document.createElement("div");
            node.className = "nodeGrid";
            for (let i = 0; i < element.episode.length; i++){
                let episodeURL = element.episode[i];
                fetch(episodeURL)
                    .then(function cogerRespuesta(respuesta) { 
                        return respuesta.json();
                    })
                    .then(function cogerData(data){
                        gridElement = document.createElement("div");
                        gridElement.innerHTML = 
                        `
                            <div class="nodeElement">${data.episode}</div>
                        `
                        gridElement.onclick = function(){
                            currentPage = 0;
                            typeSelector.selectedIndex = 2; 
                            showElement(data);
                        }
                        node.appendChild(gridElement);
                    })
            }
            printFicha.appendChild(node);
            
        break;
        case 1:
            node.innerHTML = 
            `
            <div class="fichaExpandida">
            <h1>${element.name}</h1>
            <h1>dimension: ${element.dimension}</h1>
            <h1>Type: ${element.type}</h1>
            <h1>Residents:</h1>
            </div>  
            `;
            printFicha.appendChild(node);
            node = document.createElement("div");
            node.className = "nodeGrid";
            for (let i = 0; i < element.residents.length; i++){
                let residentURL = element.residents[i];
                fetch(residentURL)
                    .then(function cogerRespuesta(respuesta) { 
                        return respuesta.json();
                    })
                    .then(function cogerData(data){
                        gridElement = document.createElement("div");
                        gridElement.innerHTML = 
                        `
                            <div class="nodeElement">${data.name}</div>
                        `
                        gridElement.onclick = function(){
                            currentPage = 0;
                            typeSelector.selectedIndex = 0; 
                            showElement(data);
                        }
                        node.appendChild(gridElement);
                    })
            }
            printFicha.appendChild(node);
        break;
        case 2:
            node.innerHTML = 
            `
            <div class="fichaExpandida">
            <h1>${element.name}</h1>
            <h1>episode: ${element.episode}</h1>
            <h1>air date: ${element.air_date}</h1>
            <h1>Characters: </h1>
            </div>  
            `;
            printFicha.appendChild(node);
            node = document.createElement("div");
            node.className = "nodeGrid";
            for (let i = 0; i < element.characters.length; i++){
                let charactersURL = element.characters[i];
                fetch(charactersURL)
                    .then(function cogerRespuesta(respuesta) { 
                        return respuesta.json();
                    })
                    .then(function cogerData(data){
                        gridElement = document.createElement("div");
                        gridElement.innerHTML = 
                        `
                            <div class="nodeElement">${data.name}</div>
                        `
                        gridElement.onclick = function(){
                            typeSelector.selectedIndex = 0;
                            currentPage = 0;
                            showElement(data);
                        }
                        node.appendChild(gridElement);
                    })
            }
            printFicha.appendChild(node);
        break;
    }
    backButton.style = "display:inline";
}

function goBack(){
    clearPage();
    updateResults();
    backButton.style = "display:none";
}

function changeType(){
    clearPage();
    updateResults();
}

function updateResults(){
    switch(parseInt(typeSelector.value)){
        case 0:
            printResults(currentPage, searchField.value, fetchCharacters);
        break;
        case 1:
            printResults(currentPage, searchField.value, fetchLocations);
        break;
        case 2:
            printResults(currentPage, searchField.value, fetchEpisodes);
        break;
    }
}