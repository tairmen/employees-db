const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

// models/Employee.js
const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// models/Department.js
const Department = sequelize.define('Department', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// models/Salary.js
const Salary = sequelize.define('Salary', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

// models/Donation.js
const Donation = sequelize.define('Donation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    amount: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// models/Rate.js
const Rate = sequelize.define('Rate', {
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    sign: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

// Define associations
Employee.hasOne(Department);
Department.belongsTo(Employee);

Employee.hasMany(Salary);
Salary.belongsTo(Employee);

Employee.hasMany(Donation);
Donation.belongsTo(Employee);

// Sync the models with the database
sequelize.sync();

module.exports = { Employee, Department, Salary, Donation, Rate };
