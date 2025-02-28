const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(cors()); // Allows frontend requests

const API_CONFIG = {
    clientToken: "E0D439EE522F44368DC78E1BFB03710C-D24FB11DBE31D4621C4817E028D9E1D",
    accessToken: "381F1DD27E44487699BAB27400AAF224-3FC59278EBB61547F7A4A5DB4587E16",
    client: "Sample Client 1.0.0"
};

// Proxy for searching customers
app.post("/search-customer", async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    try {
        const response = await fetch("https://api.mews-demo.com/api/connector/v1/customers/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ClientToken: API_CONFIG.clientToken,
                AccessToken: API_CONFIG.accessToken,
                Client: API_CONFIG.client,
                Name: name,
                ResourceId: null,
                Extent: { Customers: true }
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error contacting Mews API" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
