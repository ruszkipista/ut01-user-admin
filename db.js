const configDB = {
    tableURLusers: "http://localhost:3000/users/",
    columnNamesUsers: ["id", "name", "email"],
};

// Create
function createUserInDB(row){
    return createTableRowInDB(configDB.tableURLusers, row)
}
// Read
function getUsersFromDB(){
    return getTableRowsFromDB(configDB.tableURLusers);
}
// Update
function updateUserInDB(row){
    return updateTableRowInDB(configDB.tableURLusers, row)
}
// Delete
function deleteUserFromDB(row){
    return deleteTableRowFromDB(configDB.tableURLusers, row)
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