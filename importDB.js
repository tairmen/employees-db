const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database
const db = new sqlite3.Database('database.db');

// Read and parse the dump file
const dumpFilePath = 'dump.txt';
const dumpFileContent = fs.readFileSync(dumpFilePath, 'utf-8');

// Split the content into lines
const lines = dumpFileContent.split('\n');

// Remove the first empty element caused by the initial "E-List" part
lines.shift();

let currentObject = null;
let currentType = null;
let i = 0;

// Helper function to insert data into the database
function insertData(inserted) {

    const table = inserted.type;
    const data = inserted.data;
    i += 1;

    console.log(table, data)

    return

    const keys = Object.keys(data);
    const values = keys.map(key => data[key]);

    const placeholders = keys.map(() => '?').join(', ');

    const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;

    db.run(query, values, (err) => {
        if (err) {
            console.error(`Error inserting into ${table}: ${err.message}`);
        } else {
            console.log(`Record inserted into ${table}: ${JSON.stringify(data)}`);
        }
    });
}

// Loop through each line
for (const line of lines) {
    
    const indentLevel = Math.floor((line.length - line.trimLeft().length) / 2);

    // Remove indentation and split the line into [key, value]
    let [key, value] = line.trim().split(': ').map(part => part.trim());

    // Create an object with the current key-value pair
    let currentData = null
    if (key && !value && key.length > 0 && key[0] === key[0].toUpperCase()) {
        if (key !== 'Statement') {
            currentType = key
        } else {
            key = currentType
        }
    } else if (key && value) {
        currentData = { [key]: value };
    }
    

    // Check if the current line represents the start of a new object
    if (currentType === key) {
        // If the current object is not null, it means we have completed processing the previous object
        if (currentObject !== null && currentObject.type && currentObject.data && Object.keys(currentObject.data).length) {
            // Insert data into the database based on the object type
            insertData(currentObject);
        }

        // Set the current object to the new data
        currentObject = {
            type: currentType,
            data: currentData,
        };
    } else {
        // If the current object is not null, it means we are inside an object
        if (currentObject !== null) {
            // Add the current data to the current object
            currentObject.data = { ...currentObject.data, ...currentData };
        }
    }
}

// Close the database connection
db.close();
