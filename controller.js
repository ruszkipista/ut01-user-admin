const configControl = {
    entityName: "users"
};

function c_createTableElementFromTableRows() {
    entityName = configControl.entityName
    m_getRows(entityName)
    .then(rows => v_fillTableElement(entityName, rows));
}


// create new row in DB from input
function c_createRow(row, entityName) {
    delete row.id;
    m_createRow(entityName, row)
    .then(_ => c_createTableElementFromTableRows(entityName))
}


// update row in DB from input
function c_updateRow(row, entityName) {
    m_updateRow(entityName, row)
    .then(_ => c_createTableElementFromTableRows(entityName));
}


// delete row in DB from input
function c_deleteRow(row, entityName) {
    m_deleteRow(entityName, row)
    .then(_ => c_createTableElementFromTableRows(entityName));
}