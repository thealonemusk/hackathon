const fs = require('fs');
const csv = require('csv-parser');
const sqlite3 = require('sqlite3').verbose();

// Create SQLite database
const db = new sqlite3.Database('./routing.db');

// Create tables
db.serialize(() => {
    db.run("DROP TABLE IF EXISTS banks");
    db.run("DROP TABLE IF EXISTS links");

    db.run(`
        CREATE TABLE banks (
            BIC TEXT PRIMARY KEY,
            Charge INTEGER
        )
    `);

    db.run(`
        CREATE TABLE links (
            FromBIC TEXT,
            ToBIC TEXT,
            TimeTakenInMinutes INTEGER
        )
    `);

    // Insert data from CSV files
    const insertBank = db.prepare("INSERT INTO banks (BIC, Charge) VALUES (?, ?)");
    fs.createReadStream('banks.csv')
        .pipe(csv())
        .on('data', (row) => {
            insertBank.run(row.BIC, parseInt(row.Charge));
        })
        .on('end', () => {
            insertBank.finalize();
        });

    const insertLink = db.prepare("INSERT INTO links (FromBIC, ToBIC, TimeTakenInMinutes) VALUES (?, ?, ?)");
    fs.createReadStream('links.csv')
        .pipe(csv())
        .on('data', (row) => {
            insertLink.run(row.FromBIC, row.ToBIC, parseInt(row.TimeTakenInMinutes));
        })
        .on('end', () => {
            insertLink.finalize();
        });
});

console.log("Database setup complete.");