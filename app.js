const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const xss = require("xss");
const cors = require("cors");
const app = express();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require("axios");

//définition des méthodes gérant le endpoint
app.use(express.json());
// app.options('*', cors());
app.use(cors({
  origin: "https://pokedex-front-test.vercel.app",
  methods: ["POST"],
}))

const port = process.env.PORT;

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, comme Gecko) Chrome/109.0.0.0 Safari/537.36',
  'Accept-Language': 'fr-FR,fr;q=0.9',
  'Referer': 'https://www.google.com/'
}

async function getPokePic(name) {
  const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(name)}`;
  const { data } = await axios.get(url, { headers });
  const fdata = await data.match(/https\:\/\/www\.pokepedia\.fr\/images\/[^ ]{1,}\.png|https\:\/\/www\.media\.pokekalos\.fr\/img\/[^ ]{1,}.png/g)
  let sortedData = [];
  for(let i in fdata) {
    if(!fdata[i].includes("Carte")) sortedData.push(fdata[i]);
  }
  // console.log(data);
  return sortedData[0];
}

//Variable de stockage de la liste des pokemons ainsi que la requête associée
let listNames = [];
let result = "";
let image = "";

const giveList = () => {
  app.post("/", (req, res) => {
    console.log(req);
    
    if(req.method === "POST") {
      const cleanReq = xss(req.body.inputText);
      // console.log(cleanReq);
      if(cleanReq == "ALL")
        res.status(200).json({"names": listNames});
      else {
        // console.log(cleanReq);
        async function getUser(name) {
          const user = await prisma.Pokemon.findUnique({
            where: { name }
          });
          image = await getPokePic(cleanReq);
          result = await user;
          
          
          // console.log(image);
          res.status(200).json({"names": result, "image": image});
          
          await prisma.$disconnect();
        };

        getUser(cleanReq);
      }
    }
  });
}

//Point d'entrée du backend
async function main() {
  //Récupérer tous les noms de pokemon et stocker dans une liste pour envoyer au front.
  const pokemonNames = await prisma.Pokemon.findMany({
    select: {
      name: true,  // Sélectionne uniquement la colonne "name"
    },
  });

  console.log(pokemonNames);
  
  await prisma.$disconnect();
    
  for(let i in pokemonNames) listNames.push(pokemonNames[i]["name"]);

  //gérer les 2 requetes du front
  giveList();


  app.listen(port, () => console.log(`The server listen on the port ${port}.`));
}

main();
