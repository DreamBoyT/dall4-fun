const express = require("express");
const path = require("path");
const axios = require("axios"); // Using axios for HTTP requests

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const azureFunctionUrl = "https://dall-e-prototype.azurewebsites.net/api/HttpTrigger";
const azureFunctionKey = "5_4di6wlI5XoDuOltBIfcd6QlGOGybHX_iEa2jZtptUNAzFuvyagCw==";

app.post("/generate", async (req, res) => {
    const { prompt, size, style, quality } = req.body;

    try {
        const response = await axios.post(
            azureFunctionUrl,
            { prompt, size, style, quality },
            { headers: { 'x-functions-key': azureFunctionKey, 'Content-Type': 'application/json' } }
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error calling Azure Function:", error);
        res.status(500).json({ error: "Failed to generate image" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
