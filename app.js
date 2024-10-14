const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const path = require('path'); // Menambahkan path untuk mengatur direktori views

// Koneksi ke database MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_db'
});

// Cek koneksi database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL Database:', err);
        return;
    }
    console.log('Connected to MySQL Database.');
});

// Set EJS sebagai view engine
app.set('view engine', 'ejs');

// Mengatur folder views
app.set('views', path.join(__dirname, 'views'));

// Middleware untuk bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

// Folder statis untuk CSS, JS, dll.
app.use(express.static('public'));

// Route: Menampilkan semua produk (Read)
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM alatselam';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            return res.status(500).send('Error fetching data');
        }
        res.render('index', { data: results });
    });
});

// Route: Form tambah produk (Create - Form)
app.get('/add', (req, res) => {
    res.render('add');
});

// Route: Tambah produk baru ke database (Create - Aksi)
app.post('/add', (req, res) => {
    const { nama, harga } = req.body;
    const sql = 'INSERT INTO alatselam (nama, harga) VALUES (?, ?)';
    connection.query(sql, [nama, harga], (err) => {
        if (err) {
            console.error('Error adding new product:', err);
            return res.status(500).send('Error adding new product');
        }
        res.redirect('/');
    });
});

// Route: Form edit produk (Update - Form)
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM alatselam WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching product for edit:', err);
            return res.status(500).send('Error fetching product for edit');
        }
        res.render('edit', { item: result[0] });
    });
});

// Route: Simpan perubahan produk (Update - Aksi)
app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { nama, harga } = req.body;
    const sql = 'UPDATE alatselam SET nama = ?, harga = ? WHERE id = ?';
    connection.query(sql, [nama, harga, id], (err) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).send('Error updating product');
        }
        res.redirect('/');
    });
});

// Route: Hapus produk (Delete)
app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM alatselam WHERE id = ?';
    connection.query(sql, [id], (err) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).send('Error deleting product');
        }
        res.redirect('/');
    });
});

// Server berjalan di port 4000
app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});
