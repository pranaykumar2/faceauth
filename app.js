const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Appends extension
    }
});
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Support for form data and large payloads

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', upload.single('image'), (req, res) => {
    const imageData = req.body.image;
    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
    const imageName = Date.now() + '.png'; // Get the filename
    const imagePath = path.join(__dirname, 'uploads', imageName); // Construct the image path
    fs.writeFile(imagePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        } else {
            res.status(200).json({ message: 'Image uploaded successfully' });
        }
    });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
