const configDB = {
    users: {
        tableURL: "http://localhost:3000/users/",
        columnNames: ["id", "name", "email"],
    }
};

// POST: creates data row in DB
function db_createTableRow(entityName, row){
    let fetchOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(row)
    };
    return fetch(configDB[entityName].tableURL, fetchOptions)
           .then(resp => true,
                 err => console.error(err));
}


// GET: reads data rows from DB
function db_getTableRows(entityName) {
    let fetchOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    };
    return fetch(configDB[entityName].tableURL, fetchOptions)
           .then( response => response.json(),
                  err => console.error(err)
            );
}


// PUT: updates data row in DB
function db_updateTableRow(entityName, row){
    let fetchOptions = {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(row)
    };
    return fetch(configDB[entityName].tableURL + row.id, fetchOptions)
           .then(resp => true,
                 err => console.error(err));
}

// DELETE: removes data row from DB
function db_deleteTableRow(entityName, row){
    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache"
    };
    return fetch(configDB[entityName].tableURL + row.id, fetchOptions)
           .then(resp => true,
                 err => console.error(err));
}
