const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// ✅ Root Route (for testing)
app.get('/', (req, res) => {
    res.send('✅ POS Proxy Server is Running');
});

// ✅ Customer Search API Proxy
app.post('/search-customer', async (req, res) => {
    console.log("🔍 Received request to /search-customer");

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
        console.log("✅ Customer search response:", data);
        res.json(data);
    } catch (error) {
        console.error("❌ Error in /search-customer:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// ✅ Start the server
app.listen(PORT, () => console.log(`🚀 Proxy server running on port ${PORT}`));
app.listen(PORT, () => console.log(`🚀 Proxy server running on port ${PORT}. Listening for requests...`));

