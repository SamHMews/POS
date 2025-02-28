const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Customer Search Endpoint
app.post('/search-customer', async (req, res) => {
    try {
        const response = await fetch('https://api.mews-demo.com/api/connector/v1/customers/search', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ClientToken: "E0D439EE522F44368DC78E1BFB03710C-D24FB11DBE31D4621C4817E028D9E1D",
                AccessToken: "381F1DD27E44487699BAB27400AAF224-3FC59278EBB61547F7A4A5DB4587E16",
                Client: "Sample Client 1.0.0",
                Name: req.body.name,
                ResourceId: null,
                Extent: { Customers: true, Documents: false, Addresses: false }
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error in proxy:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// Root Endpoint (for testing)
app.get('/', (req, res) => {
    res.send('POS Proxy Server is Running');
});

// Start server
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
