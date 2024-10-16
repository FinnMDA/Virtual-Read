const mysql = require('mysql2');

const connect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'visual_read'
  });

  connect.connect((error) => {
    if(error){
        console.log("error");
    }else{
        console.log("koneksi sukses");
    }
  });

  module.exports = connect;