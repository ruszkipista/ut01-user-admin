const configView = {
    tableElementID: "dynamicTable",
    getDataButtonID: "getDataBtn",
};


document.querySelector("#"+configView.getDataButtonID)
        .addEventListener("click", v_clickedGetDataButton);

function v_clickedGetDataButton(event){
    c_createTableElementFromTableRows();
}

function v_createAnyElement(name, attributes) {
    let element = document.createElement(name);
    for (let k in attributes) {
        element.setAttribute(k, attributes[k]);
    }
    return element;
}


function v_fillTableElement(entityName, rows) {
    tableElementID = configView.tableElementID;
    const table = document.querySelector('#' + tableElementID);
    if (!table) {
        console.error(`Table element with "${tableElementID}" ID is not found in HTML code.`);
        return;
    }
    // add empty input row to table element
    const tBody = document.querySelector("tbody");
    tBody.innerHTML = '';
    let newRow = v_createEmptyInputRow(entityName);
    tBody.appendChild(newRow);
    // add data filled input rows to table element
    for (let row of rows) {
        newRow = v_createFilledInputRow(entityName, row);
        tBody.appendChild(newRow);
    }
}


function v_createEmptyInputRow(entityName) {
    let newRow = v_createAnyElement("tr");
    for (let columnName of configDB[entityName].columnNames) {
        let newCell = v_createAnyElement("td");
        let input = v_createAnyElement("input", {
            class: "form-control",
            name: columnName
        });
        if (columnName == "id") {
            input.setAttribute("readonly", true);
        }
        newCell.appendChild(input);
        newRow.appendChild(newCell);
    }
    let newBtn = v_createAnyElement("button", 
            { class: "btn btn-success",
              onclick: `v_createRow(this,\'${entityName}\')`
            }
        );

    newBtn.innerHTML = '<i class="fa fa-plus-circle" aria-hidden="true"></i>';

    let td = v_createAnyElement("td");
    td.appendChild(newBtn);
    newRow.appendChild(td);
    return newRow;
}


function v_createFilledInputRow(entityName, row){
    let newRow = v_createAnyElement("tr");
    for (let columnName of configDB[entityName].columnNames) {
        let td = v_createAnyElement("td");

        let input = v_createAnyElement("input", {
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
    let btnGroup = v_createBtnGroup(entityName);
    newRow.appendChild(btnGroup);
    return newRow;
}


function v_createBtnGroup(entityName) {
    let group = v_createAnyElement("div", { class: "btn btn-group" });
    let infoBtn = v_createAnyElement("button", { class: "btn btn-info", onclick: `v_updateRow(this,\'${entityName}\')` });
    infoBtn.innerHTML = '<i class="fa fa-edit" aria-hidden="true"></i>';
    let delBtn = v_createAnyElement("button", { class: "btn btn-danger", onclick: `v_deleteRow(this,\'${entityName}\')` });
    delBtn.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';

    group.appendChild(infoBtn);
    group.appendChild(delBtn);

    let td = v_createAnyElement("td");
    td.appendChild(group);
    return td;
}


function v_getRowFromTRelement(tr) {
    let inputs = tr.querySelectorAll("input.form-control");
    let row = {};
    for (let i = 0; i < inputs.length; i++) {
        row[inputs[i].name] = inputs[i].value;
    }
    return row;
}


// create new row from input
function v_createRow(btn, entityName){
    let trElement = btn.parentElement.parentElement;
    let row = v_getRowFromTRelement(trElement);
    c_createRow(row, entityName);
}


// update row from input
function v_updateRow(btn, entityName) {
    let trElement = btn.parentElement.parentElement.parentElement;
    let row = v_getRowFromTRelement(trElement);
    c_updateRow(row, entityName);
}


// delete row from input
function v_deleteRow(btn, entityName) {
    let trElement = btn.parentElement.parentElement.parentElement;
    let row = v_getRowFromTRelement(trElement);
    if (confirm(`Please confirm the deletion of row ${row.id}`)) {
        c_deleteRow(row, entityName);
    }
}