// database
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  // your Sequelize configuration
  dialect: 'sqlite',
  storage: 'database.db',
});

module.exports = { sequelize };

/*
1. How to change the code to support different file versions?
To support different file versions, you can implement a versioning system in your code. Use conditional statements based on the file version specified in the file or any other indicator. Create functions or modules specific to each version, and dynamically select the appropriate version-specific code based on the file version detected.

2. How will the import system change if data on exchange rates disappears from the file, and it needs to be received asynchronously (via API)?
Modify the import system to handle exchange rates asynchronously by incorporating an API call to fetch exchange rates. You can create a separate function or module responsible for fetching and updating exchange rates. This function can be called before processing donations, allowing the system to retrieve the latest exchange rates from an external API.

3. In the future, the client may want to import files via the web interface, how can the system be modified to allow this?
To allow file imports via the web interface, you can create a file upload feature. Modify your web application to include a file upload form that accepts the dump file. Upon receiving the file via the web interface, use the same parsing and database insertion logic as in the original import code. Ensure that the file is securely processed, and consider adding authentication and authorization mechanisms to control access to this functionality.

*/