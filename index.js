import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let randomDrinks = await getRandomDrinks(4);

app.get("/", async (req, res) => {
    res.render("index.ejs", {
        random: randomDrinks
    });
});

app.post("/submit", async (req, res) => {
    try{
        const result = await axios.get(`http://www.thecocktaildb.com/api/json/v1/1/search.php?s=${req.body['drinkName']}`);
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

app.listen(port, () => {
    console.log(`Server working on port ${port}`);
});

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
