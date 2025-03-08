const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { PriorityQueue } = require('@datastructures-js/priority-queue');

const app = express();
const port = 3000;

const db = new sqlite3.Database('./routing.db');

function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Dijkstra's algorithm
function dijkstra(graph, start, end, weightKey) {
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue((a, b) => a.priority - b.priority);

    for (const node of Object.keys(graph)) {
        distances[node] = Infinity;
        previous[node] = null;
    }
    distances[start] = 0;
    pq.enqueue({ node: start, priority: 0 });

    while (!pq.isEmpty()) {
        const { node } = pq.dequeue();

        if (node === end) break;

        for (const neighbor of graph[node]) {
            const newDist = distances[node] + neighbor[weightKey];
            if (newDist < distances[neighbor.to]) {
                distances[neighbor.to] = newDist;
                previous[neighbor.to] = node;
                pq.enqueue({ node: neighbor.to, priority: newDist });
            }
        }
    }

    const path = [];
    let current = end;
    while (current !== null) {
        path.unshift(current);
        current = previous[current];
    }

    return { path, distance: distances[end] };
}

// Build graphs from database
async function buildGraphs() {
    const banks = await runQuery("SELECT * FROM banks");
    const links = await runQuery("SELECT * FROM links");

    const G_cost = {};
    const G_time = {};

    // Initialize nodes
    for (const bank of banks) {
        G_cost[bank.BIC] = [];
        G_time[bank.BIC] = [];
    }

    // Add edges
    for (const link of links) {
        const from = link.FromBIC;
        const to = link.ToBIC;
        const time = link.TimeTakenInMinutes;
        const charge = banks.find(b => b.BIC === from).Charge;

        G_time[from].push({ to, weight: time });
        G_cost[from].push({ to, weight: charge });
    }

    return { G_cost, G_time };
}

// API Endpoints
app.get('/api/fastestroute', async (req, res) => {
    const { fromBank, toBank } = req.query;

    try {
        const { G_time } = await buildGraphs();
        const result = dijkstra(G_time, fromBank, toBank, 'weight');
        res.json({ route: result.path.join(' -> '), time: result.distance });
    } catch (err) {
        res.status(404).json({ error: "No path found" });
    }
});

app.get('/api/cheapestroute', async (req, res) => {
    const { fromBank, toBank } = req.query;

    try {
        const { G_cost } = await buildGraphs();
        const result = dijkstra(G_cost, fromBank, toBank, 'weight');
        res.json({ route: result.path.join(' -> '), cost: result.distance });
    } catch (err) {
        res.status(404).json({ error: "No path found" });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});