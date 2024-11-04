import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let randomDrinks = await getRandomDrinks(4);

async function getRandomDrinks(count){
    const drinkArr = [];
    for(let i=0; i<count; i++)
    {
        try{
            const result = await axios.get(`http://www.thecocktaildb.com/api/json/v1/1/random.php`);
            drinkArr.push(result.data.drinks[0]);
        } catch (error) {
            console.log("Error during generate randmo dinks log: "+error);
            return drinkArr;
        }
    }
    return drinkArr;
}

app.get("/", async (req, res) => {
    res.render("index.ejs", {
        random: randomDrinks
    });
});

app.post("/submit", async (req, res) => {
    try{
        const drinkName = req.body['drinkName'];
        const result = await axios.get(`http://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkName}`);
        res.render("index.ejs", {
            random: randomDrinks,
            drinkDetails: result.data.drinks[0]
        });
    } catch (error) {
        res.render("index.ejs", {
            random: randomDrinks,
            error: "We don't have this cocktail"
        });
    }
});

app.post("/select", async (req, res) => {
    try{
        const drinkName = req.body['drinkId'];
        const result = await axios.get(`http://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinkName}`);
        res.render("index.ejs", {
            random: randomDrinks,
            drinkDetails: result.data.drinks[0]
        });
    } catch (error) {
        res.render("index.ejs", {
            random: randomDrinks,
            error: "We don't have this cocktail"
        });
    }
});

app.get('/drinks/:letter', async (req, res) => {
    const letter = req.params.letter;
    try {
        const response = await axios.get(`http://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`);
        const drinksLetter = response.data.drinks || [];
        
        res.render('drinksByLetter.ejs', { 
                drinks: drinksLetter, 
                letter: letter
            });
    } catch (error) {
        console.error("Błąd przy pobieraniu drinków:", error);
        res.render('drinksByLetter', { drinks: [], error: "Nie znaleziono drinków dla wybranej litery." });
    }
});

app.get('/categories/:category', async (req, res) => {
    const category = req.params.category;
    try {
        const response = await axios.get(`http://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`);
        const drinksCategory = response.data.drinks || [];
        
        res.render('drinksByLetter.ejs', { 
                drinks: drinksCategory,
                category: category
            });
    } catch (error) {
        console.error("Błąd przy pobieraniu drinków:", error);
        res.render('drinksByLetter', { drinks: [], error: "Nie znaleziono drinków dla wybranej litery." });
    }
});

app.listen(port, () => {
    console.log(`Server working on port ${port}`);
});