const configDB = {
    users: {
        tableURL: "http://localhost:3000/users/",
        columnNames: ["id", "name", "email"],
    }
};

// Create
function createRowInDB(entityName, row){
    return createTableRowInDB(configDB[entityName].tableURL, row)
}
// Read
function getRowsFromDB(entityName){
    return getTableRowsFromDB(configDB[entityName].tableURL);
}
// Update
function updateRowInDB(entityName, row){
    return updateTableRowInDB(configDB[entityName].tableURL, row)
}
// Delete
function deleteRowFromDB(entityName, row){
    return deleteTableRowFromDB(configDB[entityName].tableURL, row)
}

// POST: creates data row in DB
function createTableRowInDB(url, row){
    let fetchOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(row)
    };
    return fetch(url, fetchOptions)
           .then(resp => true,
                 err => console.error(err));
}


// GET: reads data rows from DB
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


// PUT: updates data row in DB
function updateTableRowInDB(url, row){
    let fetchOptions = {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(row)
    };
    return fetch(url+row.id, fetchOptions)
           .then(resp => true,
                 err => console.error(err));
}

// DELETE: removes data row from DB
function deleteTableRowFromDB(url, row){
    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache"
    };
    return fetch(url + row.id, fetchOptions)
           .then(resp => true,
                 err => console.error(err));
}