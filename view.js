const configView = {
    tableElementID: "userTable",
    getDataButtonID: "getDataBtn",
};


function createTableElementFromUsers() {
    getUsersFromDB()
    .then(rows => fillTableElement(configView.tableElementID, rows));
}

document.querySelector("#"+configView.getDataButtonID)
        .addEventListener("click", createTableElementFromUsers);


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
    for (let columnName of configDB.columnNamesUsers) {
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
              onclick: "createUser(this)"
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
    for (let columnName of configDB.columnNamesUsers) {
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
    let infoBtn = createAnyElement("button", { class: "btn btn-info", onclick: "updateUser(this)" });
    infoBtn.innerHTML = '<i class="fa fa-edit" aria-hidden="true"></i>';
    let delBtn = createAnyElement("button", { class: "btn btn-danger", onclick: "deleteUser(this)" });
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
function createUser(btn) {
    let tr = btn.parentElement.parentElement;
    let row = getRowFromTableElementRow(tr);
    delete row.id;
    createUserInDB(row)
    .then(_ => createTableElementFromUsers())
}


// update row in DB from input
function updateUser(btn) {
    let tr = btn.parentElement.parentElement.parentElement;
    let row = getRowFromTableElementRow(tr);
    updateUserInDB(row)
    .then(_ => createTableElementFromUsers());
}


// delete row in DB from input
function deleteUser(btn) {
    let tr = btn.parentElement.parentElement.parentElement;
    let row = getRowFromTableElementRow(tr);
    deleteUserFromDB(row)
    .then(_ => createTableElementFromUsers());
}