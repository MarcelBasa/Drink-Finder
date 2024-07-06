import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let drinksNames = await getDrinks();
let randomDrinks = await getRandomDrinks(4);

app.get("/", async (req, res) => {
    console.log(randomDrinks);
    res.render("index.ejs", {
        drinks: drinksNames,
        random: randomDrinks
    });
});

app.post("/submit", async (req, res) => {
    try{
        const result = await axios.get(`http://www.thecocktaildb.com/api/json/v1/1/search.php?s=${req.body['drinkName']}`);
        res.render("index.ejs", {
            drinks: drinksNames,
            random: randomDrinks,
            drinkDetails: result.data.drinks[0]
        });
    } catch (error) {
        res.render("index.ejs", {
            drinks: drinksNames,
            random: randomDrinks,
            error: "We don't have this coctail"
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

async function getDrinks(){
    let result = [];
    try{
        result = await axios.get(`http://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic`);
    } catch (error) {
        console.log("Error during generate dinks log: "+error);
    }
    return result == [] ? result : result.data.drinks;
}