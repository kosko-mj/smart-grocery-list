const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 5000;

// Connect to database
const db = new sqlite3.Database('./grocery.db');

// Middleware to parse JSON from frontend
app.use(express.json());

// GET /api/lists - read all lists from database
app.get('/api/lists', (req, res) => {
    db.all('SELECT * FROM lists ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// POST /api/lists - create a new list
app.post('/api/lists', (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: 'List name is required' });
        return;
    }
    
    db.run('INSERT INTO lists (name) VALUES (?)', [name], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, name });
    });
});

// Homepage route
app.get('/', (req, res) => {
    res.send('Hello from your grocery list server');
});

// GET /api/lists/:listId/items - get all items for a specific list
app.get('/api/lists/:listId/items', (req, res) => {
    const { listId } = req.params;
    db.all('SELECT * FROM list_items WHERE list_id = ? ORDER BY id', [listId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// POST /api/lists/:listId/items - add an item to a list
app.post('/api/lists/:listId/items', (req, res) => {
    const { listId } = req.params;
    const { item_name, quantity } = req.body;
    
    if (!item_name) {
        res.status(400).json({ error: 'Item name is required' });
        return;
    }
    
    db.run(
        'INSERT INTO list_items (list_id, item_name, quantity) VALUES (?, ?, ?)',
        [listId, item_name, quantity || 1],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, list_id: listId, item_name, quantity: quantity || 1 });
        }
    );
});

// GET all items for a specific list
app.get('/api/lists/:listId/items', (req, res) => {
    const { listId } = req.params;
    db.all('SELECT * FROM list_items WHERE list_id = ?', [listId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// POST a new item to a specific list
app.post('/api/lists/:listId/items', (req, res) => {
    const { listId } = req.params;
    const { item_name, quantity } = req.body;
    
    if (!item_name) {
        res.status(400).json({ error: 'Item name is required' });
        return;
    }
    
    db.run(
        'INSERT INTO list_items (list_id, item_name, quantity) VALUES (?, ?, ?)',
        [listId, item_name, quantity || 1],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, list_id: listId, item_name, quantity: quantity || 1 });
        }
    );
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});