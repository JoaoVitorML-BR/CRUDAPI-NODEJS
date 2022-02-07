const express = require("express");
const {randomUUID} = require("crypto");
const { response } = require("express");
const res = require("express/lib/response"); 
const fs = require("fs"); // fs = file system

const app = express();

app.use(express.json());

let products = [];

fs.readFile("products.json", "utf-8", (err, data) => {
    if(err){
        console.log(err);
    }else{
        products = JSON.parse(data);
    }
});

// cadastrando os produtos 
app.post("/products", (req, res) => {

    const {name, price}  = req.body; // that name and price in this way is destructuring the json

    const product = {
        name,
        price,
        id: randomUUID(),
    };

    products.push(product);

    productFile(); // escrevendo o arquivo json \/

    return res.json(product);
});


// rota para listar todos os produtos
app.get("/products", (req, res) => {
    return res.json(products)
});

app.get("/products/:id", (req, res) => {
    const { id } = req.params; // desestrutura o req para pegar o id
    const product = products.find(product => product.id === id); // percorre o array e quando achar um produto dentro do array que seja igual ao id da rota ele ira pegar ele.
    return res.json(product);
})


// aqui ele altera o produto
app.put("/products/:id", (req, res) => {
    const { id } = req.params;
    const {name, price} = req.body;

    const productIndex = products.findIndex(product => product.id === id);
    products[productIndex] = {
        ...products[productIndex],
        name,
        price
    };

    productFile();

    return res.json({message: "Produto alterado com sucesso!"})
});

// deleta produto
app.delete("/products/:id", (req, res) => {
    const { id } = req.params;
    const {name, price} = req.body

    const productIndex = products.findIndex(product => product.id === id);

    products.splice(productIndex, 1) // removendo o produto

    productFile();

    return res.json({message: "Produto removido com sucesso."});
});


// func cria a pasta products.json, converte a products em um json e adiciona os "products" na pasta, se der algum erro ele ira cair no if, se não no else.
function productFile(){
    fs.writeFile("products.json", JSON.stringify(products, null, 2), (err) => {
        if (err){
            console.log(err);
        }else{
            console.log("Produto inserido!")
        }
    });
}

app.listen(4002, () => console.log("servidor está rodando na porta 4002"))