const configView = {
    tableElementID: "dynamicTable",
    getDataButtonID: "getDataBtn",
    entityName: "users"
};


function createTableElementFromTableRows(event) {
    entityName = configView.entityName
    getRowsFromDB(entityName)
    .then(rows => fillTableElement(entityName, configDB, configView.tableElementID, rows));
}

document.querySelector("#"+configView.getDataButtonID)
        .addEventListener("click", createTableElementFromTableRows);


function createAnyElement(name, attributes) {
    let element = document.createElement(name);
    for (let k in attributes) {
        element.setAttribute(k, attributes[k]);
    }
    return element;
}


function fillTableElement(entityName, configDB, tableElementID, rows) {
    let table = document.querySelector('#' + tableElementID);
    if (!table) {
        console.error(`Table element with "${tableElementID}" ID is not found in HTML code.`);
        return;
    }
    // add empty input row to table element
    let tBody = document.querySelector("tbody");
    tBody.innerHTML = '';
    let newRow = createEmptyInputRow(entityName);
    tBody.appendChild(newRow);
    // add data filled input rows to table element
    for (let row of rows) {
        newRow = createFilledInputRow(entityName, row);
        tBody.appendChild(newRow);
    }
}


function createEmptyInputRow(entityName) {
    let newRow = createAnyElement("tr");
    for (let columnName of configDB[entityName].columnNames) {
        let newCell = createAnyElement("td");
        let input = createAnyElement("input", {
            class: "form-control",
            name: columnName
        });
        if (columnName == "id") {
            input.setAttribute("readonly", true);
        }
        newCell.appendChild(input);
        newRow.appendChild(newCell);
    }
    let newBtn = createAnyElement("button", 
            { class: "btn btn-success",
              onclick: `createRow(this,\'${entityName}\')`
            }
        );

    newBtn.innerHTML = '<i class="fa fa-plus-circle" aria-hidden="true"></i>';

    let td = createAnyElement("td");
    td.appendChild(newBtn);
    newRow.appendChild(td);
    return newRow;
}


function createFilledInputRow(entityName, row){
    let newRow = createAnyElement("tr");
    for (let columnName of configDB[entityName].columnNames) {
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
    let btnGroup = createBtnGroup(entityName);
    newRow.appendChild(btnGroup);
    return newRow;
}


function createBtnGroup(entityName) {
    let group = createAnyElement("div", { class: "btn btn-group" });
    let infoBtn = createAnyElement("button", { class: "btn btn-info", onclick: `updateRow(this,\'${entityName}\')` });
    infoBtn.innerHTML = '<i class="fa fa-edit" aria-hidden="true"></i>';
    let delBtn = createAnyElement("button", { class: "btn btn-danger", onclick: `deleteRow(this,\'${entityName}\')` });
    delBtn.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';

    group.appendChild(infoBtn);
    group.appendChild(delBtn);

    let td = createAnyElement("td");
    td.appendChild(group);
    return td;
}


function getRowFromTableRowElement(tr) {
    let inputs = tr.querySelectorAll("input.form-control");
    let row = {};
    for (let i = 0; i < inputs.length; i++) {
        row[inputs[i].name] = inputs[i].value;
    }
    return row;
}


// create new row in DB from input
function createRow(btn, entityName) {
    let trElement = btn.parentElement.parentElement;
    let row = getRowFromTableRowElement(trElement);
    delete row.id;
    createRowInDB(entityName, row)
    .then(_ => createTableElementFromTableRows(entityName))
}


function getTrFromBtn(buttonElement){
    return buttonElement.parentElement.parentElement.parentElement;
}


// update row in DB from input
function updateRow(btn, entityName) {
    let trElement = getTrFromBtn(btn);
    let row = getRowFromTableRowElement(trElement);
    updateRowInDB(entityName, row)
    .then(_ => createTableElementFromTableRows(entityName));
}


// delete row in DB from input
function deleteRow(btn, entityName) {
    let trElement = getTrFromBtn(btn);
    let row = getRowFromTableRowElement(trElement);
    if (confirm("Please confirm the deletion of this row")) {
        deleteRowFromDB(entityName, row)
        .then(_ => createTableElementFromTableRows(entityName));
    }
}