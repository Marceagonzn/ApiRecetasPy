const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware para aceptar conexiones de cualquier app
app.use(cors());
app.use(express.json());

// Base de datos simple de recetas (Paraguayas e internacionales)
const recetas = [
  // Recetas paraguayas
  {
    id: 1,
    nombre: "Sopa Paraguaya",
    ingredientes: [
      "Harina de maíz",
      "Queso paraguay",
      "Leche",
      "Huevos",
      "Cebolla",
      "Manteca",
      "Sal"
    ],
    preparacion: "Batir los huevos, agregar la harina de maíz, queso rallado, leche, cebolla rehogada en manteca y sal. Mezclar todo y hornear a temperatura media hasta dorar.",
    tiempo: "1 hora",
    dificultad: "Fácil",
    imagen: "https://cdn0.recetasparaguayas.com/wp-content/uploads/2020/04/Sopa-paraguaya-receta.jpg",
    pais: "Paraguay"
  },
  {
    id: 2,
    nombre: "Chipa",
    ingredientes: [
      "Almidón de mandioca",
      "Queso paraguay",
      "Huevos",
      "Leche",
      "Manteca",
      "Sal"
    ],
    preparacion: "Mezclar todos los ingredientes hasta formar una masa suave. Formar roscas y hornear hasta que estén doradas.",
    tiempo: "45 minutos",
    dificultad: "Fácil",
    imagen: "https://www.turismo.gov.py/wp-content/uploads/2020/03/chipa.png",
    pais: "Paraguay"
  },
  // Recetas internacionales
  {
    id: 3,
    nombre: "Pizza Margherita",
    ingredientes: [
      "Masa de pizza",
      "Salsa de tomate",
      "Queso mozzarella",
      "Hojas de albahaca",
      "Aceite de oliva"
    ],
    preparacion: "Estirar la masa de pizza, cubrir con salsa de tomate, agregar queso mozzarella y albahaca. Hornear hasta que el queso se derrita.",
    tiempo: "30 minutos",
    dificultad: "Media",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Pizza_Margherita_1.jpg/500px-Pizza_Margherita_1.jpg",
    pais: "Italia"
  },
  {
    id: 4,
    nombre: "Sushi",
    ingredientes: [
      "Arroz para sushi",
      "Algas nori",
      "Pescado crudo",
      "Verduras",
      "Vinagre de arroz"
    ],
    preparacion: "Cocinar el arroz de sushi, extenderlo sobre las algas nori, agregar pescado y verduras, y enrollar.",
    tiempo: "45 minutos",
    dificultad: "Alta",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/7/75/Sushi_platter.jpg",
    pais: "Japón"
  },
  {
    id: 5,
    nombre: "Tacos",
    ingredientes: [
      "Tortillas de maíz",
      "Carne molida",
      "Cebolla",
      "Tomate",
      "Lechuga",
      "Salsa"
    ],
    preparacion: "Cocinar la carne molida con cebolla y especias. Colocar la carne sobre las tortillas y agregar lechuga, tomate y salsa.",
    tiempo: "30 minutos",
    dificultad: "Fácil",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Tacos_Al_Pastor.JPG",
    pais: "México"
  },
  {
    id: 6,
    nombre: "Croissant",
    ingredientes: [
      "Harina",
      "Mantequilla",
      "Leche",
      "Levadura",
      "Azúcar"
    ],
    preparacion: "Amasar la masa, enrollarla y dejar reposar. Formar los croissants y hornear.",
    tiempo: "2 horas",
    dificultad: "Alta",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Croissants.jpg",
    pais: "Francia"
  }
];

// Rutas

// Obtener todas las recetas
app.get('/recetas', (req, res) => {
  res.json(recetas);
});

// Obtener recetas filtradas por país
app.get('/recetas/pais', (req, res) => {
  const paisQuery = req.query.pais;

  if (!paisQuery) {
    return res.status(400).json({ error: "Debes proporcionar un país para filtrar." });
  }

  const resultados = recetas.filter(receta =>
    receta.pais.toLowerCase().includes(paisQuery.toLowerCase())
  );

  res.json(resultados);
});

// Buscar receta por nombre
app.get('/recetas/buscar', (req, res) => {
  const nombreQuery = req.query.nombre;

  if (!nombreQuery) {
    return res.status(400).json({ error: "Debes proporcionar un nombre de receta." });
  }

  const resultados = recetas.filter(receta =>
    receta.nombre.toLowerCase().includes(nombreQuery.toLowerCase())
  );

  res.json(resultados);
});

// Obtener receta por ID
app.get('/recetas/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const receta = recetas.find(r => r.id === id);

  if (!receta) {
    return res.status(404).json({ error: "Receta no encontrada." });
  }

  res.json(receta);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor de recetas corriendo en http://localhost:${PORT}`);
});
