let verbConjugationCodes = {
    "passato": "PST.PTCP.M.SG",
    "presente": "PRS.IND",
    "imperfetto": "IPRF.IND",
    "remoto": "PRET.IND",
    "futuro": "FUT.IND",
    "conguintivo": "PRS.SBJV",
    "condizionale": "COND"
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
    "conguintivo",
    "condizionale"
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

$.getJSON("./verbs.json", function(json) {
    verbsJsonData = json;
    document.getElementById("searchbar").disabled = false

    searchVerbs("essere")
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

function fillTable(verbData) {
    for (let tense of table_header){
        for (let person of table_rows)
        {
            getCell(tense, person).innerText = verbData[verbConjugationCodes[tense] + '.' + personCodes[person]];
        }
    }
    document.getElementById("infinitive").innerText = " " + verbData["INF"];
    document.getElementById("passato").innerText = " " + verbData["PST.PTCP.M.SG"];
    document.getElementById("gerund").innerText = " " + verbData["GER"];
}

addEventListener("input", (event) => {
    searchVerbs(event.target.value);
});