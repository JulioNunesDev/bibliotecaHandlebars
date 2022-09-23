//EXPRESS CALL
const express = require("express");

// HANDLEBARS CALL
const handlebars = require("express-handlebars");

// CALL OF MODELS & PACKS
const bosyParser = require("body-parser");
const admin = require("./routes/admin");
const Port = process.env.PORT || 8081;
const usuarios = require("./routes/usuario");
const path = require("path");
const Postagem = require("./models/Postagem");
const Categoria = require("./models/Categoria");
const passport = require("passport");


//CONFIG OF SESSION & FLASH
require("./config/auth")(passport);
require("./config/db");
const session = require("express-session");
const flash = require("connect-flash");


//CALL EXPRESS
const app = express();

//CONFIG MIDDLES
app.use(
  session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// HANDLEBARS CONFIG
app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoMethodsByDefault: true,
      allowProtoPropertiesByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");

// BODY PARSER
app.use(bosyParser.urlencoded({ extended: false }));
app.use(bosyParser.json());

// PUBLIC
app.use(express.static(path.join(__dirname, "public")));



//ROUTES OF APPLICATION
app.use("/admin", admin);
app.use("/usuarios", usuarios);
//outros





app.get("/", async (req, res) => {
  await Postagem.find()
    .populate("categoria")
    .sort({ data: "desc" })
    .then((postagens) => {
      Categoria.find().then((cat) => {
        res.render("index", {
          postagens: postagens,
          cat: cat,
          styles: "index.css",
          scripts: "select.js",
        });
      });
    })
    .catch((err) => {
      req.flash("error_msg", "Não foi possivel carregar os livros. Tente novamente.");
      res.redirect("/404");
    });
});

// FUNTION REGEX
function escapeRegExp (string){
    if(string){
        return string.replace(".*[^ \d]", '')
    }
}

// ROUTE BOOK SEARCH
app.get("/books", async (req, res) => {
  let payload = req.query.payload;
  console.log(payload);
    
  if (!req.query.payload || req.query.payload === undefined || req.query.payload === null){
    req.flash("error_msg", "Insira algum livro no campo!");
    res.redirect("/");
    return
  }

  
    let posts = await Postagem.find({NOME: {$regex: new RegExp(escapeRegExp(payload), 'i')}}).populate("categoria")
      
    let cat = await Categoria.find({Slug: posts.NOME})
    res.render("Books", { proPlayer: posts, cat: cat, styles: "index.css" });

    });





app.get("/categorias", (req, res) => {
  Categoria.find()
    .then((cat) => {
      res.render("categorias/index", { cat: cat, styles: "index.css" });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro interno ao listar as categorias");
      res.redirect("/");
    });
});

app.get("/categorias/:slug", (req, res) => {
  Categoria.findOne({ slug: req.params.slug })
    .then((cat) => {
      if (cat) {
        Postagem.find({ categoria: cat._id })
          .then((postagens) => {
            res.render("categorias/postagens", {
              postagens: postagens,
              cat: cat,
              styles: "index.css",
            });
          })
          .catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar os posts!");
            console.log(err);
            res.redirect("/");
          });
      } else {
        req.flash("error_msg", "Esta categoria nao existe");
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash(
        "error_msg",
        "Houve um erro interno ao carregar a página desta categoria"
      );
      res.redirect("/");
    });
});

app.get("/404", (req, res) => {
  res.send("404");
});

app.listen(Port, () => {
  console.log("Rodando na Porta: ", Port);
});


app.get("/postagem/:autor", (req, res) => {
  Postagem.findOne({ autor: req.params.autor })
    .then((postagem) => {
      if (postagem) {
        res.render("postagem/index", {
          postagem: postagem,
          styles: "index.css",
        });
      } else {
        req.flash("error_msg", "Esta postagem nao existe");
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro interno");
      res.redirect("/");
    });
});