var express = require('express');
var router = express.Router();
var fs = require('fs');
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:msX-143-uN@localhost:5432/postgres');
 
class Employee extends Model {}

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
        allowNull:false,
      },
    password:{
        type: DataTypes.STRING,
        allowNull:false
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'employee', // We need to choose the model name
  },
);

(async()=>{
    Employee.sync({ alter: true })
})();
 



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// router.get('/employees', async (req,res)=>{
//   try{  fs.readFile("./data.json", 'utf-8', (error,data) =>{
//         user = JSON.parse(data)
//         res.send(user)
//     })}catch(err){
//         console.error(err)
//     }
// })

router.get('/employees', async (req,res)=>{
  try{
    const data = await Employee.findAll()
    console.log(JSON.stringify(data, null, 2))
    res.send(data)
    }catch(err){
        console.error(err)
    }
})

router.post('/adduser', async(req,res)=>{
  try{
   console.log(req.body);
   
   const user = await Employee.create(req.body);
   console.log(user)
   res.send("user created successfully")
  }catch(err){
   console.error("warrgya program")
  }
})



module.exports = router;
