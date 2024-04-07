const scriptProp = PropertiesService.getScriptProperties()

// PLEASE RUNNING THIS FIRST BEFORE DEPLOYMENT TO WEB !
function SetupInital() {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty("spreadsheet", activeSpreadsheet.getId())
  console.log("Success Connect Active Of Spreadsheets ID:", activeSpreadsheet.getId())
}

function GET_Listsheets() {
  const ss = SpreadsheetApp.openById(scriptProp.getProperty("spreadsheet"))
  const sheets = ss.getSheets()
  let toList = []
  for(let sheet of sheets) {
    toList.push(sheet.getName())
  }
  return toList
}

function GET_AllDataCollections() {
  const ss = SpreadsheetApp.openById(scriptProp.getProperty("spreadsheet"))
  const sheets = ss.getSheets()
  let getAlldata = []
  for(let sheet of sheets) {
    const getValue = sheet.getDataRange().getValues()
    let headers = getValue[0]
    let dataCell = []
    if(headers.length > 1) {
      for(let cell of getValue.slice(1)) {
        let dataObj = {}
        for(let i in cell) {
          dataObj[headers[i]] = cell[i]
        }
        dataCell.push(dataObj)
      }
    }
    getAlldata.push({
      collection: sheet.getName(),
      headers: headers,
      data: dataCell.map((a, i) => ({key: i, ...a}))
    })
  }
  return getAlldata
}

// GET DATA FROM COLLECT LIST
function GET_DataCollection({ collection }) {
  if(!collection || typeof collection != 'string') {
    return {
      error: "Require Collection Type Of String"
    }
  }
  const ss = SpreadsheetApp.openById(scriptProp.getProperty("spreadsheet"))
  const sheet = ss.getSheetByName(collection)
  if(!sheet) {
    return {
      error: "Sheet not found, create to view the data !"
    }
  }
  const getValue = sheet.getDataRange().getValues()
  let headers = getValue[0]
  let dataCell = []
  if(headers.length > 1) {
    for(let cell of getValue.slice(1)) {
      let dataObj = {}
      for(let i in cell) {
        dataObj[headers[i]] = cell[i]
      }
      dataCell.push(dataObj)
    }
  }
  return {
    collection: collection,
    headers: headers,
    data: dataCell.map((a, i) => ({key: i, ...a}))
  }
}

// INSERT DATA FROM COLLECTION
function PUT_DataToCollection({ collection, data } = []) {
  if(!collection || typeof collection != 'string' || !data || typeof data != 'object' ||Array.isArray(data)) {
    return {
      error: "Require Collection Type Of String And Data Type Of Object (Not Array)!"
    }
  }
  const ss = SpreadsheetApp.openById(scriptProp.getProperty("spreadsheet"))
  const sheet = ss.getSheetByName(collection)
  if(!sheet) {
    return {
      error: "Sheet not found !"
    }
  }
  const getValue = sheet.getDataRange().getValues()
  let headers = getValue[0]
  for(let key of headers) {
    if(Object.keys(data).indexOf(key) === -1) {
      return {
        error: "Please input the key data according to your header!"
      }
    }
  }
  let dataObjPost = []
  for(let key of headers) {
    dataObjPost.push(data[key])
  }
  sheet.appendRow(dataObjPost)
  return {
    success: true
  }
}

// EDIT DATA FROM COLLECTION
function PUT_ChangeDataToCollection({ collection, data, index } = {}) {
  if(!collection || typeof collection != 'string' || !data || typeof data != 'object' ||Array.isArray(data) || !index || typeof index != 'number') {
    return {
      error: "Require Collection Type Of String, Data Type Of Object (Not Array) And Index Type Of Number Cell !"
    }
  }
  const ss = SpreadsheetApp.openById(scriptProp.getProperty("spreadsheet"))
  const sheet = ss.getSheetByName(collection)
  if(!sheet) {
    return {
      error: "Sheet not found !"
    }
  }
  const getValue = sheet.getDataRange().getValues()
  let headers = getValue[0]
  for(let key of headers) {
    if(Object.keys(data).indexOf(key) === -1) {
      return {
        error: "Please input the key data according to your header!"
      }
    }
  }
  let dataObjPost = []
  for(let key of headers) {
    dataObjPost.push(data[key])
  }
  sheet.getRange(index, 1, 1, sheet.getLastColumn()).setValues([dataObjPost])
  return {
    success: true
  }
}

// REMOVE DATA FROM COLLECTION
function DELETE_DataFromCollection({ collection, index } = {}) {
  if(!collection || typeof collection != 'string' || !index || typeof index != 'number') {
    return {
      error: "Require Collection Type Of String And Index Type Of Number Cell !"
    }
  }
  const ss = SpreadsheetApp.openById(scriptProp.getProperty("spreadsheet"))
  const sheet = ss.getSheetByName(collection)
  if(!sheet) {
    return {
      error: "Sheet not found !"
    }
  }
  sheet.deleteRow(index)
  return {
    success: true
  }
}

function doPost(e) {
  const variableforHeadBody = {
    type: 'string',
    data: 'object'
  }
  const typeFunction = {
    GET_Listsheets,
    GET_DataCollection,
    GET_AllDataCollections,
    PUT_ChangeDataToCollection,
    PUT_DataToCollection,
    DELETE_DataFromCollection
  }
  const bodyPost = JSON.parse(e.postData.contents)
  if(Array.isArray(bodyPost)) {
    return ContentService.createTextOutput(JSON.stringify({
      error: "Array is not valid for request database"
    }))
    .setMimeType(ContentService.MimeType.JSON)
  }
  for(let key of Object.keys(variableforHeadBody)) {
    if(typeof bodyPost[key] != variableforHeadBody[key]) {
      return ContentService.createTextOutput(JSON.stringify({
        error: `Key of ${key} not ready for request database`
      }))
      .setMimeType(ContentService.MimeType.JSON)
    }
  }
  if(!typeFunction[bodyPost.type]) {
    return ContentService.createTextOutput(JSON.stringify({
      error: `Database requests are only available on the list ${Object.keys(typeFunction)}`
    }))
    .setMimeType(ContentService.MimeType.JSON)
  }
  console.log("System info request:", {
    bodyPost,
    typeRequest: typeFunction[bodyPost.type],
    data: bodyPost.data
  })
  const assignFunction = typeFunction[bodyPost.type](bodyPost.data)
  return ContentService.createTextOutput(JSON.stringify(assignFunction))
  .setMimeType(ContentService.MimeType.JSON)
}

