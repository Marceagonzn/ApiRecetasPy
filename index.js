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
    imagen: "https://cdn0.recetasparaguayas.com/wp-content/uploads/2020/04/Sopa-paraguaya-receta.jpg"
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
    imagen: "https://www.turismo.gov.py/wp-content/uploads/2020/03/chipa.png"
  },
  {
    id: 3,
    nombre: "Mbejú",
    ingredientes: [
      "Almidón de mandioca",
      "Queso paraguay",
      "Grasa de cerdo o manteca",
      "Sal"
    ],
    preparacion: "Mezclar el almidón, queso, grasa y sal hasta formar una mezcla arenosa. Cocinar en sartén caliente formando una tortilla.",
    tiempo: "30 minutos",
    dificultad: "Fácil",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Mbeju.png"
  },
  {
    id: 4,
    nombre: "Borí Borí",
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
    imagen: "https://cdn0.recetasparaguayas.com/wp-content/uploads/2020/05/Bori-Bori-receta.jpg"
  },
  {
    id: 5,
    nombre: "Chipa Guazú",
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
    imagen: "https://media-cdn.tripadvisor.com/media/photo-s/1b/52/dc/36/chipa-guazu.jpg"
  },
  {
    id: 6,
    nombre: "Pira Caldo",
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
    imagen: "https://www.recetasparaguayas.com/wp-content/uploads/2021/01/Pira-caldo-1024x768.jpg"
  },
  {
    id: 7,
    nombre: "Kivevé",
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
    imagen: "https://media.diariouno.com.ar/p/7cf406e2e09464b77b0fdd5ac6dcb202/adjuntos/298/imagenes/009/415/0009415862/1200x0/smart/kivevejpg.jpg"
  },
  {
    id: 8,
    nombre: "So'o apu'a",
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
    imagen: "https://upload.wikimedia.org/wikipedia/commons/4/49/Soo_apua.jpg"
  },
  {
    id: 9,
    nombre: "Ryguasu ka'ê",
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
    imagen: "https://www.recetasparaguayas.com/wp-content/uploads/2020/05/ryguasu-kae.jpg"
  },
  {
    id: 10,
    nombre: "Soyo",
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
    imagen: "https://www.recetasparaguayas.com/wp-content/uploads/2020/09/Soyo-sopa-paraguaya.jpg"
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
