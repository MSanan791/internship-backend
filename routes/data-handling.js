var express = require("express");
const os = require('os');
var router = express.Router();
var fs = require('fs');
const multer = require('multer');
const path = require('path');
const { Sequelize, DataTypes, Model } = require('sequelize');
var user;
// import { PostgresDialect } from '@sequelize/postgres';
const jwt = require('jsonwebtoken');




const sequelize = new Sequelize('postgres', 'postgres', 'msX-143-uN', {
  host: 'internship-database.cvi4m8wcqbo1.us-east-1.rds.amazonaws.com',
  dialect: 'postgres',
  // dialect: 'postgres',
  dialectOptions: {
    ssl: {
      // CAUTION: there are better ways to load the certificate, see comments below
      ca: fs.readFileSync(path.join(__dirname, '../us-east-1-bundle.pem')).toString()
    }
  }
});


class Employee extends Model { }

Employee.init(
  {
    // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'employee', // We need to choose the model name
  },
);

(async () => {
  try {
    await Employee.sync({ alter: true });
  } catch (err) {
    console.error(err);
  }
})();


// the defined model is the class itself
console.log(Employee === sequelize.models.User); // true

router.post('/adduser/', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).send('Missing required fields');
    }
    const user = await Employee.create(req.body);
    res.send('User created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});

router.post('/uploadfile', async (req, res) => {

  const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 12000000 } // 12MB file size limit
  }).single('file');


  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Please send file' });
    }
    console.log(req.file);
    res.send('File uploaded!');
  });
})



router.post(`/`, async (req, res) => {



  const { email, password } = req.body
  console.log(req.body);
  try {
    fs.readFile("./data.json", 'utf8', (error, data) => {
      user = JSON.parse(data)
      person = user.find((person) => person.email === email)

      if (person !== undefined) {
        if (person.password === password) {

          res.send(true)
        } else {
          res.send(false)
        }
      }
    })
  } catch (err) {
    console.error(err)
  }






})

router.post("/", (req, res) => {

  // fs.readFile('./data.json', 'utf8',(error, data) => {
  //     if(error){
  //         console.error(error)
  //         throw error;
  //     }

  //     user = JSON.parse(data)
  // })

  // if(!user){
  //     return res.status(404).send(user)
  // }
  //     return res.status(200).send(user)

  const { email, password } = req.body
  const user = { name: email }
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN__SECRET)
  res.send({ accessToken: accessToken })


})

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Employee.findOne({ where: { email } });
    if (!user || user.password !== password) {
      return res.send(false);
    }
    res.send(true);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error authenticating user');
  }
});

module.exports = router;