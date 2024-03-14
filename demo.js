const fetchCharacters = "https://rickandmortyapi.com/api/character"; 
const printElement = document.getElementById("print");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const searchField = document.getElementById('searchField');
const backButton = document.getElementById("backButton");
let savedPages = [];
let currentPage = 1;

searchField.addEventListener('input', (evt) => {
    clearPage();
    printPage(currentPage, searchField.value);
});

printPage(currentPage);


function printPage(pageNumber, filter){
    if (pageNumber > savedPages.length){
        fetch(fetchCharacters + "?page=" + pageNumber) // PIDES LA INFORMACIÓN A LA API
        .then(function cogerRespuesta(respuesta) {  // TE DEVUELVE ESA INFORMACIÓN (EN LA VARIABLE RESPUESTA)
            return respuesta.json(); // TRANSFORMO ESA INFORMACIÓN PARA PODERLA PROCESAR
        })
        .then(function cogerData(data){ // YA TENGO LA INFORMACIÓN PROCESADA
            displayData(data, filter);
            savedPages.push(data);
        })
        .catch(error => {
            clearPage();
            printElement.innerHTML = 'There was a problem with the fetch operation:' + error;
        });
    }
    else {
        displayData(savedPages[pageNumber-1], filter);
    }
}

function displayData(data, filter){
    data.results.forEach(element => {
        if (filter === undefined || element.name.toLowerCase().includes(filter)){
            const node = document.createElement("div");
            node.innerHTML = 
            `
            <div class="ficha">
            <h1>${element.name}</h1>
            <img src="${element.image}">
            </div>  
            `;
            node.onclick = function(){
                showElement(element);
            };
            printElement.appendChild(node);
        };
    });
}

function clearPage(){
    printElement.innerHTML = "";
}

function nextPage(){
    clearPage();
    currentPage++;
    printPage(currentPage, searchField.value);
    if (currentPage != 1){
        previousButton.style = "display:inline";
    }
}

function previousPage(){
    clearPage();
    currentPage--;
    printPage(currentPage, searchField.value);
    if (currentPage == 1){
        previousButton.style = "display:none";
    }
}

function showElement(element){
    clearPage();
    printElement.innerHTML = element.name;
    const node = document.createElement("div");
    node.innerHTML = 
    `
    <div class="fichaExpandida">
    <h1>${element.name}</h1>
    <img src="${element.image}">
    
    </div>  
    `;
    printElement.appendChild(node);
    backButton.style = "display:inline";
}

function goBack(){
    clearPage();
    printPage(currentPage, searchField.value);
    backButton.style = "display:none";
}