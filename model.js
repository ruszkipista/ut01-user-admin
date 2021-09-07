// Create
function m_createRow(entityName, row){
    return db_createTableRow(entityName, row)
}
// Read
function m_getRows(entityName){
    return db_getTableRows(entityName);
}
// Update
function m_updateRow(entityName, row){
    return db_updateTableRow(entityName, row)
}
// Delete
function m_deleteRow(entityName, row){
    return db_deleteTableRow(entityName, row)
}
