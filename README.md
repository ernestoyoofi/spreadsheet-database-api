# Spreadsheet Database API

> Remember, that this fire also has a data limit which is not meant to limit but it is already inbuilt from Google limiting or limiting the quota of Google spreadsheetapp. [Read for Quota Limitation](https://developers.google.com/apps-script/guides/services/quotas?hl=id)

## How does this work?

We know that Google Sheets can add Apps Script directly, where you can create applications that are connected to Google Sheets, from there this system is used which makes like a request to read and write like a database in general in the form of a table.

## How to use the script

1. Firstly create your Google Spreadsheet file, enter the heading and one data first.
2. Click on the Extension menu, then select Apps Script
3. Copy the code [code.gs](./code.gs) into Apps Script
4. Click on "Apply" on the top right, then select "New Deployment"
5. Select the type to "Web App" and select access to "Everyone" to be accessible, then click "Apply"
6. Wait and then the marcos exec url will appear that you can use to do the database

## How the system works

Put your endpoint into a request application such as Postman or Reqbin to do so, in the request only the POST method is available to execute the command.

```txt
Endpoint: https://script.google.com/macros/s/[id-marcos]/exec
Method: POST
Body: {
  "type": "",
  "data": {
    "collection": "",
    "data": {},
    "index": 4
  }
}
```

## Parameter Type

| Key Type | Params | Description |
|----|----|----|
| GET_Listsheets | _None_ | Get all the sheets in the spreadsheet |
| GET_AllDataCollections | _None_ | Get all data from all sheets in the spreadsheet |
| GET_DataCollection | collection | Obtain data from one sheet that was selected |
| PUT_ChangeDataToCollection | collection, data | Add data on one sheet |
| PUT_DataToCollection |  collection, data, index | Change data according to index sheet |
| DELETE_DataFromCollection | collection, index | Delete the corresponding data on index sheets |

**Example Request/Change Or Edit Data:**

```bash
curl https://script.google.com/macros/s/[id-marcos]/exec -H "content-type: application/json" -d '{
  "type": "PUT_DataToCollection",
  "data": {
    "collection": "mahasiswa",
    "data": {
      "id": "a7e18c5019954c8f27a2da161c35c419f0bb3abc",
      "name": "Ejanaco Soekardi",
      "class": "COMPUTE-MATH-X",
      "major": "Computer Science",
      "status": "students"
    },
    "index": 4
  }
}'
```
