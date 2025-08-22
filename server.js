const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

//Get data from "public" folder and data.json
app.use(express.static('public'));
app.use(express.json());

//sends JSON data to client
app.get('/api/data', (req, res) => {
    const filePath = path.join(__dirname, 'data.json');
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors du chargement du fichier'});
    }
});

//modification des quantités
app.post('/api/buy', (req, res) => {
    const { itemKey, quantity } = req.body;

    if (!itemKey || typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ message: 'Requête invalide.' });
    }

    fs.readFile('./data.json', 'utf8', (error, data) => {
        if (error) return res.status(500).json({ message: 'Erreur lecture fichier.' });

        const jsonData = JSON.parse(data);

        if (!jsonData[itemKey]) {
            return res.status(404).json({ message: "Objet non trouvé." });
        }

        if (jsonData[itemKey].quantity < quantity) {
            return res.status(400).json({ message: "Stock insuffisant." });
        }

        jsonData[itemKey].quantity -= quantity;

        fs.writeFile('./data.json', JSON.stringify(jsonData, null, 4), (error) => {
            if (error) return res.status(500).json({ message: 'Erreur écriture fichier.' });

            res.json({ message: `Achat de ${quantity} ${itemKey} réussi.` });
        });
    });
});


//Server startup
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("the website has been put online successfully")
})

app.listen(PORT, () => {
    console.log(`serveur en ligne sur http://localhost:${PORT}`);
}); 