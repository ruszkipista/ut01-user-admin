let config = {
    tableURL: "http://localhost:3000/users/",
    columnNames: ["id", "name", "email"],
    tableElementID: "userTable",
    getDataButtonID: "getDataBtn"
};


function createTableElementFromDBtable() {
    getTableRowsFromDB(config.tableURL)
    .then(rows => fillTableElement(config.tableElementID, rows));
}

document.querySelector("#"+config.getDataButtonID)
        .addEventListener("click", createTableElementFromDBtable);


function createAnyElement(name, attributes) {
    let element = document.createElement(name);
    for (let k in attributes) {
        element.setAttribute(k, attributes[k]);
    }
    return element;
}


function fillTableElement(tableElementID, rows) {
    let table = document.querySelector('#' + tableElementID);
    if (!table) {
        console.error(`Table element with "${tableElementID}" ID is not found in HTML code.`);
        return;
    }
    // add empty input row to table element
    let tBody = document.querySelector("tbody");
    tBody.innerHTML = '';
    let newRow = createEmptyInputRow();
    tBody.appendChild(newRow);
    // add data filled input rows to table element
    for (let row of rows) {
        newRow = createFilledInputRow(row);
        tBody.appendChild(newRow);
    }
}


function createEmptyInputRow() {
    let newRow = createAnyElement("tr");
    for (let columnName of config.columnNames) {
        let newCell = createAnyElement("td");
        let input = createAnyElement("input", {
            class: "form-control",
            name: columnName
        });
        newCell.appendChild(input);
        newRow.appendChild(newCell);
    }
    let newBtn = createAnyElement("button", 
            { class: "btn btn-success",
              onclick: "createRow(this)"
            }
        );

    newBtn.innerHTML = '<i class="fa fa-plus-circle" aria-hidden="true"></i>';

    let td = createAnyElement("td");
    td.appendChild(newBtn);
    newRow.appendChild(td);
    return newRow;
}


function createFilledInputRow(row){
    let newRow = createAnyElement("tr");
    for (let columnName of config.columnNames) {
        let td = createAnyElement("td");

        let input = createAnyElement("input", {
            class: "form-control",
            name: columnName,
            value: row[columnName]
        });
        if (columnName == "id") {
            input.setAttribute("readonly", true);
        }

        td.appendChild(input);
        newRow.appendChild(td);
    }
    let btnGroup = createBtnGroup();
    newRow.appendChild(btnGroup);
    return newRow;
}


function createBtnGroup() {
    let group = createAnyElement("div", { class: "btn btn-group" });
    let infoBtn = createAnyElement("button", { class: "btn btn-info", onclick: "updateRow(this)" });
    infoBtn.innerHTML = '<i class="fa fa-edit" aria-hidden="true"></i>';
    let delBtn = createAnyElement("button", { class: "btn btn-danger", onclick: "deleteRow(this)" });
    delBtn.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';

    group.appendChild(infoBtn);
    group.appendChild(delBtn);

    let td = createAnyElement("td");
    td.appendChild(group);
    return td;
}


function getRowFromTableElementRow(tr) {
    let inputs = tr.querySelectorAll("input.form-control");
    let row = {};
    for (let i = 0; i < inputs.length; i++) {
        row[inputs[i].name] = inputs[i].value;
    }
    return row;
}


// create new row in DB from input
function createRow(btn) {
    let tr = btn.parentElement.parentElement;
    let row = getRowFromTableElementRow(tr);
    delete row.id;
    modifyTableRowInDB("POST", row)
    .then(_ => createTableElementFromDBtable())
}


// update row in DB from input
function updateRow(btn) {
    let tr = btn.parentElement.parentElement.parentElement;
    let row = getRowFromTableElementRow(tr);
    modifyTableRowInDB("PUT", row)
    .then(_ => createTableElementFromDBtable());
}


// delete row in DB from input
function deleteRow(btn) {
    let tr = btn.parentElement.parentElement.parentElement;
    let row = getRowFromTableElementRow(tr);
    deleteTableRowFromDB(row)
    .then(_ => createTableElementFromDBtable());
}


// GET: requests data rows from DB
function getTableRowsFromDB(url) {
    let fetchOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    };
    return fetch(url, fetchOptions)
           .then( response => response.json(),
                  err => console.error(err)
            );
}


// POST: create data row in DB
// PUT: update data row in DB
function modifyTableRowInDB(method, row){
    let fetchOptions = {
        method: method,
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(row)
    };
    return fetch(config.tableURL, fetchOptions)
           .then(resp => true,
                 err => console.error(err));
}


// DELETE: remove data row from DB
function deleteTableRowFromDB(row){
    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache"
    };
    return fetch(config.tableURL + row.id, fetchOptions)
           .then(resp => true,
                 err => console.error(err));
}