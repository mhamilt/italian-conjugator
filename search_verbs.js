let verbConjugationCodes = {
    "passato": "PST.PTCP.M.SG",
    "presente": "PRS.IND",
    "imperfetto": "IPRF.IND",
    "remoto": "PRET.IND",
    "futuro": "FUT.IND",
    "congiuntivo": "PRS.SBJV",
    "congiuntivo-imperfetto": "IPRF.SBJV",
    "condizionale": "COND",
    "imperative": "IMP"
}

let personCodes = {
    "io": "1SG",
    "tu": "2SG",
    "lei": "3SG",
    "noi": "1PL",
    "voi": "2PL",
    "loro": "3PL"
}

let table_header = [
    "presente",
    "imperfetto",
    "remoto",
    "futuro",
    "congiuntivo",
    "congiuntivo-imperfetto",
    "condizionale",
    "imperative"
];

let table_rows = [
    "io",
    "tu",
    "lei",
    "noi",
    "voi",
    "loro"
];

let verbsJsonData;

if (localStorage.getItem("verbs") === 'undefined' || !localStorage.getItem("verbs")) {
    $.getJSON("./verbs.json", function (json) {
        verbsJsonData = json;
        document.getElementById("searchbar").disabled = false;
        searchVerbs(window.location.hash.substr(1));
        try {
            localStorage.setItem("verbs", LZString.compress(JSON.stringify(verbsJsonData)));
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
    verbsJsonData = JSON.parse(LZString.decompress(localStorage.getItem('verbs')));
}

$.getJSON("./verbs.json", function(json) {
    verbsJsonData = json;
    document.getElementById("searchbar").disabled = false

    searchVerbs(window.location.hash.substr(1))
});

function searchVerbs(verb) {
    let verbdata = getVerbData(verb)

    if (verbdata) {
        console.log(verb);
        fillTable(verbdata)
    }
}

function getCell(column_id, row_id) {
    let column_element = $('#' + column_id).index();
    let row_element = $('#' + row_id);
    return row_element.find('td').eq(column_element)[0];
}

function getVerbData(verb) {
    if (typeof verbsJsonData === 'undefined' ||
        verbsJsonData[verb] === 'undefined') {
        return null
    }
    return verbsJsonData[verb];
}

function getConjugation(verbData, tense, person) {
    let conjugation = verbData[verbConjugationCodes[tense] + '.' + personCodes[person]]
    if (!conjugation){
        return '';
    }
    return conjugation;
}

function fillTable(verbData) {
    for (let tense of table_header){
        for (let person of table_rows)
        {
            getCell(tense, person).innerText = getConjugation(verbData, tense, person);
        }
    }
    document.getElementById("infinitive").innerText = " " + verbData["INF"];
    document.getElementById("passato").innerText = " " + verbData["PST.PTCP.M.SG"];
    document.getElementById("gerund").innerText = " " + verbData["GER"];
}

addEventListener("input", (event) => {
    searchVerbs(event.target.value.toLowerCase().replaceAll(" ",''));
});
console.log(window.location.hash.substr(1))