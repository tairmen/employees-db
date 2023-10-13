const fs = require('fs');
const sequelize  = require('./models');

const models = sequelize.models;

// Read and parse the dump file
const dumpFilePath = 'dump.txt';
const dumpFileContent = fs.readFileSync(dumpFilePath, 'utf-8');

// Split the content into lines
const lines = dumpFileContent.split('\n');

// Remove the first empty element caused by the initial "E-List" part
lines.shift();

let currentObject = null;
let currentEmployeeId = null;
let currentDepartmentId = null;
let currentType = null;

// Helper function to insert data into the database
async function insertData(inserted) {

    const table = inserted.type;
    const data = inserted.data;

    if (table == 'Employee' && currentDepartmentId) {
        data.DepartmentId = currentDepartmentId
    }

    if (table == 'Salary' || table == 'Donation' && currentEmployeeId) {
        data.EmployeeId = currentEmployeeId
    }

    try {
        await models[table].create(data)
    } catch (e) {}

    return
}

async function fillData() {
    // Loop through each line
    for (let i = 0; i < lines.length; i++) {

        const line = lines[i]

        const indentLevel = Math.floor((line.length - line.trimStart().length) / 2);

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
            if (currentType == 'Department') {
                let [key, value] = lines[i + 1].trim().split(': ').map(part => part.trim());
                if (key == 'id' && value) {
                    currentDepartmentId = value
                } else {
                    currentDepartmentId = null
                }
            }
        } else if (key && value) {
            currentData = { [key]: value };
            if (currentType == 'Employee' && key == 'id') {
                currentEmployeeId = value
            }
            if (currentType == 'Donation' && key == 'amount') {
                let [amount, sign] = value.split(' ')
                currentData = { amount, sign };
            }
        }


        // Check if the current line represents the start of a new object
        if (currentType === key) {
            // If the current object is not null, it means we have completed processing the previous object
            if (currentObject !== null && currentObject.type && currentObject.data && Object.keys(currentObject.data).length) {
                // Insert data into the database based on the object type
                await insertData(currentObject);
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
}

fillData()

