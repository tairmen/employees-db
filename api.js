const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./models');

const models = sequelize.models;

const MIN_DONAT = 100;
const REVARD_PULL = 10000;


const app = express();
const port = 3000;

app.use(bodyParser.json());

// API endpoint for calculating rewards
app.get('/calculate', async (req, res) => {
    try {
        const totalAmount = await models.Donation.findAll({
            attributes: [
                [sequelize.fn('sum', sequelize.col('amount')), 'total']
            ],
            raw: true
        });
        if (totalAmount.length > 0) {
            const total_donation = totalAmount[0].total
            const results = await sequelize.query(`
                SELECT employee AS employee_id, donations, CASE
                WHEN donations > ${MIN_DONAT} THEN
                donations * ${REVARD_PULL} / SUM(donations) OVER ()
                ELSE
                0
                END AS reward 
                    FROM (SELECT employee, SUM(usdAmount) AS donations 
                    FROM (SELECT donation, employee, amount * rate AS usdAmount 
                    FROM (SELECT Donation.id AS donation, Donation.amount AS amount, Donation.EmployeeId AS employee, Donation.sign, CASE
                        WHEN Donation.sign<>'USD' THEN
                        max(Rate.date)
                        ELSE
                        null
                    END AS rateDate, Donation.date AS donationDate, CASE
                        WHEN Donation.sign<>'USD' THEN
                        Rate.value
                        ELSE
                        1
                        END AS rate
                    FROM Donations AS Donation LEFT JOIN Rates AS Rate ON 
                    Donation.sign='USD' OR (Donation.sign=Rate.sign AND Donation.date >= Rate.date)
                GROUP BY donation)) GROUP BY employee)
            `, { type: Sequelize.QueryTypes.SELECT });

            res.json({
                rewards: results,
                total_donations: total_donation,
                revard_pull: REVARD_PULL,
                min_donat: MIN_DONAT
            });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});