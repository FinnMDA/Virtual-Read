// const connection = require('./db');
// const fs = require('fs');

// // Fungsi untuk menyimpan gambar ke database sebagai BLOB
// function saveContentWithBlob(title, description, imageFilePath, callback) {
//     const query = 'INSERT INTO content (title, description, image) VALUES (?, ?, ?)';
//     const imageBuffer = fs.readFileSync(imageFilePath);

//     connection.query(query, [title, description, imageBuffer], (error, results) => {
//         if (error) return callback(error, null);
//         callback(null, results);
//     });
// }

// // Fungsi untuk mengambil gambar dari database
// function getContentById(id, callback) {
//     const query = 'SELECT * FROM content WHERE id = ?';
//     connection.query(query, [id], (error, results) => {
//         if (error) return callback(error, null);
//         if (results.length > 0) return callback(null, results[0]);
//         callback('Content not found', null);
//     });
// }

// module.exports = {
//     saveContentWithBlob,
//     getContentById
// };
