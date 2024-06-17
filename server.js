const express = require("express");
const path = require("path");
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const app = express();
const port = 3000;

// Set up your Azure OpenAI credentials
const endpoint = "https://chat-gpt-a1.openai.azure.com/";
const azureApiKey = "c09f91126e51468d88f57cb83a63ee36";

const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
const deploymentName = "Dalle3";

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post("/generate", async (req, res) => {
    const { prompt, size, style, quality } = req.body;

    // Assuming 'style' and 'quality' can be incorporated in the prompt for image generation
    const modifiedPrompt = `${prompt}, style: ${style}, quality: ${quality}`;

    try {
        const results = await client.getImages(deploymentName, modifiedPrompt, { n: 1, size });
        res.json({ imageUrls: results.data.map(image => image.url) });
    } catch (err) {
        console.error("Error generating image:", err);
        res.status(500).json({ error: "Failed to generate image" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
