const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const API_BASE_URL = "https://api.mews-demo.com/api/connector/v1";

const API_CONFIG = {
    clientToken: "E0D439EE522F44368DC78E1BFB03710C-D24FB11DBE31D4621C4817E028D9E1D",
    accessToken: "381F1DD27E44487699BAB27400AAF224-3FC59278EBB61547F7A4A5DB4587E16",
    client: "Sample Client 1.0.0",
    enterpriseId: "a5e73d2e-5313-4393-a5f4-b26d00d2c904",
    serviceId: "20319f2a-fd89-458e-b254-b28f00b0fedf"
};

let customerId = null;
if (typeof order === "undefined") {
    var order = {}; // Ensure 'order' is only declared once
}

const productIds = {
    "English Breakfast Tea": "735463cc-f81c-4e55-911e-b28f00d86ef8",
    "Fresh Orange Juice": "484c50ae-877b-4088-ad3d-b28f00d81595",
    "Latte": "9b752105-049b-49b0-999e-b28f00d83498",
    "Avocado Toast": "4f49d2b0-55e8-4569-ab8c-b28f00d7c55e",
    "Full English Breakfast": "d9e74e34-d79e-4950-881d-b28f00d7a9cf",
    "Pancakes & Berries": "edc72f78-a872-4f82-a1fa-b28f00d7e1fb",
    "Smoked Salmon Bagel": "00d2e941-658b-4a51-abcb-b28f00d7fdcb",
    "Berry Smoothie": "7eb4d8d8-44af-4c86-b80e-b28f00d63a37",
    "Classic Mojito": "f4c5827b-ad73-4332-9bb7-b28f00d5fd9e",
    "Elderflower Spritz": "c52d9e02-da4b-41dc-ae51-b28f00d6a1dc",
    "Espresso Martini": "a95df0f3-f22a-4d08-a90f-b28f00d65e25",
    "BBQ Chicken Burger": "7f85bc06-2284-4b90-b789-b28f00d74858",
    "Caesar Salad": "3b0ff545-e565-4458-8c3e-b28f00d78247",
    "Grilled Ribeye Steak": "2e6edb9e-9ba9-4c20-b10e-b28f00d6f509",
    "Mushroom Tagliatelle": "806c9ec2-7968-4541-9caa-b28f00d76244",
    "Pan-Seared Salmon": "db005797-3128-44c8-a9a9-b28f00d711fa"
};

console.log("pos-api.js is loaded!");

// Customer Search
async function searchCustomer() {
    console.log("searchCustomer() function called!");
    
    const name = document.getElementById('accountID').value;
    if (!name) {
        alert("Please enter a customer name.");
        return;
    }

    console.log("Fetching customer details for:", name);

    try {
        const response = await fetch(proxyUrl + API_BASE_URL + "/customers/search", {
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
        console.log("Customer search response:", data);

        if (data.Customers && data.Customers.length > 0) {
            customerId = data.Customers[0].Id;
            document.getElementById('customerInfo').innerText = `Customer Found: ${data.Customers[0].FirstName} ${data.Customers[0].LastName} (ID: ${customerId})`;
        } else {
            customerId = null;
            document.getElementById('customerInfo').innerText = "No customer found";
        }
    } catch (error) {
        console.error("Error in searchCustomer():", error);
    }
}

// Update item quantities
function updateQuantity(item, delta) {
    order[item] = (order[item] || 0) + delta;
    if (order[item] < 0) order[item] = 0;
    document.getElementById(`qty-${item}`).innerText = order[item];
    console.log("Updated order:", order);
}

// Submit Order
async function submitOrder() {
    console.log("submitOrder() function called!");

    if (!customerId) {
        alert("Please search for a customer before placing an order.");
        return;
    }

    console.log("Preparing order for Customer ID:", customerId);

    const productOrders = Object.entries(order)
        .filter(([_, count]) => count > 0)
        .map(([itemName, count]) => {
            return { ProductId: productIds[itemName], Count: count };
        })
        .filter(order => order !== null);

    if (productOrders.length === 0) {
        alert("No items selected.");
        return;
    }

    console.log("Sending order:", productOrders);

    try {
        const response = await fetch(proxyUrl + API_BASE_URL + "/orders/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ClientToken: API_CONFIG.clientToken,
                AccessToken: API_CONFIG.accessToken,
                Client: API_CONFIG.client,
                EnterpriseId: API_CONFIG.enterpriseId,
                AccountId: customerId,
                ServiceId: API_CONFIG.serviceId,
                ConsumptionUtc: new Date().toISOString().split('T')[0] + "T00:00:00Z",
                ProductOrders: productOrders
            })
        });

        const result = await response.json();
        console.log("Order response:", result);
        alert("Order placed successfully!");

    } catch (error) {
        console.error("Error in submitOrder():", error);
    }
}
