import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", async (req, res) => {
    try{
        const result = await axios.get(`http://www.thecocktaildb.com/api/json/v1/1/random.php`);
        res.render("index.ejs", {
            img_src: result.data.drinks[0].strDrinkThumb,
            cocktail_name: result.data.drinks[0].strDrink
        });
    } catch (error) {
        console.log(error);
        res.status(400);
    }
});

app.listen(port, () => {
    console.log(`Server working on port ${port}`);
});