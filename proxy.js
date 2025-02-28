const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Root Route for Testing
app.get('/', (req, res) => {
    res.send('✅ POS Proxy Server is Running');
});

// ✅ Customer Search Route
app.post('/search-customer', async (req, res) => {
    console.log("🔍 Received request to /search-customer", req.body);

    try {
        const response = await fetch('https://api.mews-demo.com/api/connector/v1/customers/search', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        console.log("✅ Customer search response:", data);
        res.json(data);
    } catch (error) {
        console.error("❌ Error in /search-customer:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// ✅ Order Placement Route
app.post('/place-order', async (req, res) => {
    console.log("🛒 Received request to /place-order", req.body);

    try {
        const response = await fetch('https://api.mews-demo.com/api/connector/v1/orders/add', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        console.log("✅ Order placed successfully:", data);
        res.json(data);
    } catch (error) {
        console.error("❌ Error in /place-order:", error);
        res.status(500).json({ error: "Failed to place order" });
    }
});

// ✅ Start the server
app.listen(PORT, () => console.log(`🚀 Proxy server running on port ${PORT}`));
