const express = require("express");
const app = express();
const path = require('path');
const ADODB = require('node-adodb');
const PORT = 3002;
const connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=./Nwind_converted.accdb');
const query = 'SELECT * FROM Employees';
const queryCustomers = 'SELECT * FROM Customers'
const queryOrders = 'SELECT * FROM Orders'
const queryOrdersDetails = 'SELECT * FROM `Order Details`'

// Middleware per servire i file statici dalla cartella 'build'
app.use(express.static(path.join(__dirname, '../build')));
// Middleware per gestire il corpo della richiesta
app.use(express.urlencoded({ extended: true }));

app.use('/src', express.static(path.join(__dirname, 'public')));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

function GetData() {
  return new Promise((resolve, reject) => {
    connection.query(query)
      .then(data => {
        resolve(data)
      })
      .catch(err => {
        reject(err)
      })
  })
}


app.get('/images-response/:EmployeeID', (req, res) => {
  GetData().then(data => {
    const employee = data.find(emp => emp.EmployeeID == req.params.EmployeeID);
    if (employee) {
      let pathFile = path.join('/images', employee.Photo);
      const htmlContent = `<img src ="${pathFile}" class="Img_Photo_Database" width="400px"/>`;
      res.send(htmlContent);
    } else {
      res.status(404).send('Employee not found');
    }

  })
    .catch(err => {
      console.error('Errore nella query del database:', err);
      res.status(500).send('Errore nella query del database');
    });
});




app.get('/request-data', (req, res) => {
  Promise.all([GetData(), connection.query(queryCustomers), connection.query(queryOrders), connection.query(queryOrdersDetails)])
    .then(data => {
      res.send(data);

    })
    .catch(err => {
      console.error('Errore nella query del database:', err);
      res.status(500).send('Errore nella query del database');
    });
});


// Porta di ascolto del server 3002
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});