let verbConjugationCodes = {
    "PRS.IND"   : "presente"              ,
    "IPRF.IND"  : "imperfetto"            ,
    "PRET.IND"  : "remoto"                ,
    "FUT.IND"   : "futuro"                ,
    "PRS.SBJV"  : "congiuntivo"           ,
    "IPRF.SBJV" : "congiuntivo-imperfetto",
    "COND"      : "condizionale"          ,
    "IMP"       : "imperative"            ,
}

let personCodes = {
    "1SG":"io",
    "2SG":"tu",
    "3SG":"lei",
    "1PL":"noi",
    "2PL":"voi",
    "3PL":"loro"
}

//-----------------------------------------------------------------------------
// Loading Data
let verbsJsonData;

const localStorageName = "verbs_italian"

if (localStorage.getItem(localStorageName) === 'undefined' || !localStorage.getItem(localStorageName)) {
    $.getJSON("./verbs.json", function (json) {
        verbsJsonData = json;
        document.getElementById("searchbar").disabled = false;
        searchVerbs(window.location.hash.substr(1));
        try {
            localStorage.setItem(localStorageName, LZString.compress(JSON.stringify(verbsJsonData)));
        }
        catch (e) {
            console.log("Local Storage is full, Please empty data");
        }
    });
    console.log('not local');
}
else {
    console.log('local');
    document.getElementById("searchbar").disabled = false
    verbsJsonData = JSON.parse(LZString.decompress(localStorage.getItem(localStorageName)));
}

//-----------------------------------------------------------------------------
// Searching Data

function searchVerbs(verb) {
    let verbdata = getVerbData(verb)

    if (verbdata) {
        console.log(verb);
        fillTable(verbdata)
    }
}

//-----------------------------------------------------------------------------

function getCell(column_id, row_id) {    
    let column_element = $('#' + column_id.replace('.', '\\.')).index();
    let row_element = $('#' + row_id);

    return row_element.find('td').eq(column_element)[0];
}

//-----------------------------------------------------------------------------

function getVerbData(verb) {
    if (typeof verbsJsonData === 'undefined' ||
        verbsJsonData[verb] === 'undefined') {
        return null
    }
    return verbsJsonData[verb];
}

//-----------------------------------------------------------------------------

function getConjugation(verbData, tense, person) {    
    let conjugation = verbData[tense + '.' + person]    
    return ((!conjugation) ? '' : conjugation);
}

//-----------------------------------------------------------------------------

function fillTable(verbData) {
    for (const tense in verbConjugationCodes) {
        for (const person in personCodes) {
            getCell(tense, person).innerText = getConjugation(verbData, tense, person);
        }
    }

    document.getElementById("INF").innerText           = " " + verbData["INF"];
    document.getElementById("GER").innerText           = " " + verbData["GER"];
    document.getElementById("PST.PTCP.M.SG").innerText = " " + verbData["PST.PTCP.M.SG"];
}

//-----------------------------------------------------------------------------
// Listeners

addEventListener("input", (event) => {
    searchVerbs(event.target.value.toLowerCase().replaceAll(" ",''));
});
console.log(window.location.hash.substr(1))