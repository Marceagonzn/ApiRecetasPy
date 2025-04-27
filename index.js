const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware para aceptar conexiones de cualquier app
app.use(cors());
app.use(express.json());

// Base de datos simple de recetas paraguayas
const recetas = [
  {
    id: 1,
    nombre: "Sopa Paraguaya",
    pais: "Paraguay",
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
    imagen: "https://www.abc.com.py/resizer/v2/CZDFE2LPZFCMHA2AB7Q33LZ2QE.jpg?auth=0e743a6da013e29b6ec7a364d7ed2a27acba2b8d9c12aa1c3fc715a05f126b26&width=770&smart=true"
  },
  {
    id: 2,
    nombre: "Chipa",
    pais: "Paraguay",
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
    imagen: "https://es.wikipedia.org/wiki/Chipa#/media/Archivo:Chipa_Paraguay.jpg"
  },
  {
    id: 3,
    nombre: "Mbejú",
    pais: "Paraguay",
    ingredientes: [
      "Almidón de mandioca",
      "Queso paraguay",
      "Grasa de cerdo o manteca",
      "Sal"
    ],
    preparacion: "Mezclar el almidón, queso, grasa y sal hasta formar una mezcla arenosa. Cocinar en sartén caliente formando una tortilla.",
    tiempo: "30 minutos",
    dificultad: "Fácil",
    imagen: "https://comidasparaguayas.com/assets/images/mbeju-mestizo_800x534.webp"
  },
  {
    id: 4,
    nombre: "Borí Borí",
    pais: "Paraguay",
    ingredientes: [
      "Harina de maíz",
      "Queso paraguay",
      "Caldo de carne",
      "Pollo",
      "Zanahoria",
      "Cebolla",
      "Apio"
    ],
    preparacion: "Preparar el caldo de pollo con verduras. Aparte, hacer bolitas de harina de maíz y queso. Cocinar las bolitas en el caldo hasta que estén cocidas.",
    tiempo: "1 hora 20 minutos",
    dificultad: "Media",
    imagen: "https://es.wikipedia.org/wiki/Vor%C3%AD_vor%C3%AD#/media/Archivo:Vor%C3%AD_vor%C3%AD_paraguay.jpg"
  },
  {
    id: 5,
    nombre: "Chipa Guazú",
    pais: "Paraguay",
    ingredientes: [
      "Maíz tierno",
      "Queso paraguay",
      "Leche",
      "Huevos",
      "Cebolla",
      "Manteca",
      "Sal"
    ],
    preparacion: "Licuar el maíz tierno, mezclar con queso rallado, leche, huevos batidos, cebolla rehogada y manteca. Hornear hasta dorar.",
    tiempo: "1 hora",
    dificultad: "Fácil",
    imagen: "https://www.recetasparaguay.com/base/stock/Recipe/chipa-guazu/chipa-guazu_web.jpg.webp"
  },
  {
    id: 6,
    nombre: "Pira Caldo",
    pais: "Paraguay",
    ingredientes: [
      "Pescado de río",
      "Cebolla",
      "Tomate",
      "Pimiento",
      "Leche",
      "Aceite",
      "Sal",
      "Pimienta"
    ],
    preparacion: "Rehogar cebolla, tomate y pimiento. Agregar pescado y leche. Cocinar a fuego lento hasta integrar los sabores.",
    tiempo: "1 hora",
    dificultad: "Media",
    imagen: "https://www.lactolanda.com.py/storage/images/recetas/EQUqN2IP2KKGON1jqfkvHKXf0iuI2BjVjRratBfd.png"
  },
  {
    id: 7,
    nombre: "Kivevé",
    pais: "Paraguay",
    ingredientes: [
      "Zapallo",
      "Harina de maíz",
      "Azúcar",
      "Leche",
      "Manteca"
    ],
    preparacion: "Cocinar el zapallo, hacer puré, agregar azúcar, harina de maíz, leche y manteca. Revolver constantemente hasta espesar.",
    tiempo: "45 minutos",
    dificultad: "Fácil",
    imagen: "https://www.196flavors.com/wp-content/uploads/2018/05/kiveve-1.jpg"
  },
  {
    id: 8,
    nombre: "So'o apu'a",
    pais: "Paraguay",
    ingredientes: [
      "Carne molida",
      "Harina de maíz",
      "Cebolla",
      "Huevo",
      "Especias",
      "Sal"
    ],
    preparacion: "Mezclar la carne con harina, cebolla picada, huevo y condimentos. Formar albóndigas y freír en aceite caliente.",
    tiempo: "40 minutos",
    dificultad: "Fácil",
    imagen: "https://img-global.cpcdn.com/recipes/4b3f61f0b6d7aa01/680x964cq70/soo-apua-foto-principal.webp"
  },
  {
    id: 9,
    nombre: "Ryguasu ka'ê",
    pais: "Paraguay",
    ingredientes: [
      "Gallina casera",
      "Cebolla",
      "Pimiento",
      "Tomate",
      "Arroz",
      "Especias"
    ],
    preparacion: "Preparar un guiso con gallina casera, cebolla, pimientos, tomate y arroz, condimentado con hierbas.",
    tiempo: "2 horas",
    dificultad: "Alta",
    imagen: "https://recetas.paraguay.com/wp-content/uploads/2014/04/Ryguasu-Kae2.jpg"
  },
  {
    id: 10,
    nombre: "Soyo",
    pais: "Paraguay",
    ingredientes: [
      "Carne molida",
      "Cebolla",
      "Tomate",
      "Caldo",
      "Especias",
      "Hierbas frescas"
    ],
    preparacion: "Machacar carne molida en el caldo hirviendo, agregar verduras picadas y cocinar hasta formar un guiso espeso.",
    tiempo: "1 hora",
    dificultad: "Media",
    imagen: "https://micorazondearroz.com/wp-content/uploads/2024/01/DSC09747-2024x2048.jpg"
  }
];

// Rutas

// Obtener todas las recetas
app.get('/recetas', (req, res) => {
  res.json(recetas);
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
  console.log(`Servidor de recetas paraguayas corriendo en http://localhost:${PORT}`);
});
