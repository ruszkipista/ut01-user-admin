let config = {
    tableURL: "http://localhost:3000/users/",
    columnNames: ["id", "name", "email"],
    tableElementID: "userTable"
};

// GET requests data from server
function getServerData(url) {
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

function startGetRows() {
    getServerData(config.tableURL)
    .then(data => fillTableElementWithDataRows(data, config.tableElementID));
}
document.querySelector("#getDataBtn").addEventListener("click", startGetRows);


function fillTableElementWithDataRows(data, tableElementID) {
    let table = document.querySelector('#' + tableElementID);
    if (!table) {
        console.error(`Table element with "${tableElementID}" ID is not found in HTML source.`);
        return;
    }
    // add new row to table
    let tBody = document.querySelector("tbody");
    tBody.innerHTML = '';
    let newRow = newUserRow();
    tBody.appendChild(newRow);


    for (let row of data) {
        let newRow = createAnyElement("tr");
        for (let columnName of config.columnNames) {
            let td = createAnyElement("td");

            let input = createAnyElement("input", {
                class: "form-control",
                value: row[columnName],
                name: columnName
            });
            if (columnName == "id") {
                input.setAttribute("readonly", true);
            }

            td.appendChild(input);
            newRow.appendChild(td);
        }
        let btnGroup = createBtnGroup();
        newRow.appendChild(btnGroup);
        tBody.appendChild(newRow);
    }
}


function createAnyElement(name, attributes) {
    let element = document.createElement(name);
    for (let k in attributes) {
        element.setAttribute(k, attributes[k]);
    }
    return element;
}

function createBtnGroup() {
    let group = createAnyElement("div", { class: "btn btn-group" });
    let infoBtn = createAnyElement("button", { class: "btn btn-info", onclick: "setRow(this)" });
    infoBtn.innerHTML = '<i class="fa fa-edit" aria-hidden="true"></i>';
    let delBtn = createAnyElement("button", { class: "btn btn-danger", onclick: "delRow(this)" });
    delBtn.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';

    group.appendChild(infoBtn);
    group.appendChild(delBtn);

    let td = createAnyElement("td");
    td.appendChild(group);
    return td;
}

// DELETE: remove row from table
function delRow(btn) {
    let tr = btn.parentElement.parentElement.parentElement;
    let data = getRowData(tr);
    let id = data.id;
    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache"
    };
    fetch(`${config.tableURL}${id}`, fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    ).then(data => startGetRows());
}

// create new row
function newUserRow(row) {
    let tr = createAnyElement("tr");
    for (let k of config.columnNames) {
        let td = createAnyElement("td");
        let input = createAnyElement("input", {
            class: "form-control",
            name: k
        });
        td.appendChild(input);
        tr.appendChild(td);
    }
    let newBtn = createAnyElement("button",
        {
            class: "btn btn-success",
            onclick: "createUser(this)"
        });

    newBtn.innerHTML = '<i class="fa fa-plus-circle" aria-hidden="true"></i>';

    let td = createAnyElement("td");
    td.appendChild(newBtn);
    tr.appendChild(td);
    return tr;
}

// POST: create new row in DB
function createUser(btn) {
    let tr = btn.parentElement.parentElement;
    let data = getRowData(tr);
    delete data.id;
    let fetchOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(config.tableURL, fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    ).then(
        data => startGetRows()
    );
}

function getRowData(tr) {
    let inputs = tr.querySelectorAll("input.form-control");
    let data = {};
    for (let i = 0; i < inputs.length; i++) {
        data[inputs[i].name] = inputs[i].value;
    }
    return data;
}

// PUT: update data
function setRow(btn) {
    let tr = btn.parentElement.parentElement.parentElement;
    let data = getRowData(tr);
    let fetchOptions = {
            method: "PUT",
            mode: "cors",
            cache: "no-cache",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
    };
    fetch(`${config.tableURL}${data.id}`, fetchOptions)
    .then(resp => resp.json(), err => console.error(err))
    .then(data => startGetRows());
}