const express = require("express");
const sqlize = require('sequelize');
const app = express();
const pg = require('pg');
const winston = require('winston');
const {Users, Expense_Transaction} = require('./models')
const port = 3000
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
app.set('view engine', 'ejs');
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'finance-budget' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//Winston logger
app.all('*',(req,res, next)=>{
  logger.info({
      level: 'info',
      method:req.method,
      body:req.body,
      url:req.url,
      parameters:req.params,
      timestamp:new Date().toLocaleString()
  })
  next()
})

//Displays all Users in Database
app.get('/users-all',async(req,res)=>{
  const allUsers = await Users.findAll()
  res.send(allUsers)
})

//Sign In Page
app.get('/login',(req,res)=>{
  res.render('login', { errorMessage: '' })
})

//Home Page 
app.get('/sign-up',(req,res)=>{
    res.render('sign-up', { errorMessage: '' })
})

//Dashboard
app.get('/dashboard',(req,res)=>{
  res.render('dashboard')
})



//Registration 
app.post('/sign-up', async (req, res) => {
  const { Name, Email, Password, ReEnterPassword } = req.body;
  const specialCharacters = ["!","@","#","$","%","^","&","*","_"]
  const letters = /^[a-zA-Z]/;
  const numbers = /^[0-9]/;

  
  if(Name === null || Email === null || Password === null || ReEnterPassword === null){
    return res.render('sign-up', { errorMessage: 'Fields can not be empty' });
  }

  if (Name.length > 30){
    return res.render('sign-up', { errorMessage: 'Name can not be greater than 30 characters' });
  }

  if (Name === specialCharacters){
    return res.render('sign-up', { errorMessage: 'Name can not contain special characters' });
  }

  if (Password !== ReEnterPassword){
    return res.render('sign-up', { errorMessage: 'Passwords must match' });
  }

  if (Password.length < 8){
    return res.render('sign-up', { errorMessage: 'Passwords must be at least 8 characters' });
  }
console.log(Password)
  // if (Password != specialCharacters || Password != letters || Password != numbers){
  //   console.log("Special Characters: ", specialCharacters)
  //   console.log("Numbers: ", numbers)
  //   console.log("Letters: ", letters)
  //   return res.render('sign-up', { errorMessage: 'Password must contain a letter,number, and a special character' });
  // }

  const existingEmail = await Users.findOne({
    where:{
        Email:Email,
    }})

    if (existingEmail){
      return res.render('sign-up', { errorMessage: 'Email is already in use' });
    }

    




 //Encrypts Password
const saltRounds = 10;
bcrypt.hash(Password, saltRounds, async(err, hash) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Hashed password:', hash);

  // If successful, inserts Data into Database as a new User
  try {
    const newUser = await Users.create({
       Name: Name,
       Email: Email,
       Password: hash,
       ReEnterPassword: hash
     });
     res.send(newUser)
   } catch (error) {
       console.error(error);
       return res.render('sign-up', { error: 'An error occurred during registration' });
   }
});

// Logging and rendering 'register' view after successful registration or error handling
  console.log({
    Name: Name,
    Email: Email,
    Password: Password,
    ReEnterPassword: ReEnterPassword,
  });
})

// Sign in for Returning Users
app.post('/login', async(req, res) => {
  const { Email, Password } = req.body;
  const userEnteredPassword = Password;
  
  const returningUser = await Users.findOne({
      where:{
          Email:Email,
  }})
  const storedHashedPassword = returningUser.Password; // this is the password that is stored in the database
  bcrypt.compare(userEnteredPassword, storedHashedPassword, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    if (result) {
      return res.redirect('/dashboard');
    } else {
      return res.render('login', { errorMessage: 'Invalid Login' });
    }
  });
})

// app.put('/finances/:id',async(req,res)=>{
//   const updateFinance = await finance.update({ income: req.body.income, expenses: req.body.expenses, savings: req.body.savings, surplus_deficit: req.body.surplus_deficit  },
//       {
//        where: {
//          id: req.params.id
//        }
//        });
//   const updatedFinance = await finance.findByPk(req.params.id)
//   res.send(updatedFinance)
// })

//Deletes User based off of provided Email
app.delete('/user/email',async(req,res)=>{
  await Users.destroy({
      where: {
          id: req.params.id
      }
    });
    res.send('User has been deleted')
    console.log(Users)

})

app.put('/addExpense', async (req, res) => {
  try {
    const { Description, Amount, UserID } = req.body;

    // Validate the request data (e.g., check for required fields)

    // Create a new expense transaction record in the database
    const newExpense = await Expense_Transaction.create({
      Description,
      Amount,
      UserID,
    });

    // Return a success response
    res.status(201).json({ message: 'Expense added successfully', data: newExpense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/addIncome', async (req, res) => {
  try {
    const { Description, Amount } = req.body;
    const UserID = req.params.UserID;

    // Validate the request data (e.g., check for required fields)

    // Create a new Income transaction record in the database
    const newIncome = await Income_Transaction.create({
      Description,
      Amount,
      UserID,
    });

    // Calculate the total income for the user
    const totalIncome = await Income_Transaction.sum('Amount', {
      where: { UserID },
    });

    // Update the 'Income' column in the 'Users' table
    await Users.update({ Income: totalIncome }, { where: { id: UserID } });

    // Retrieve all income transactions after adding the new one
    const allIncome = await Income_Transaction.findAll();

    // Return a success response with all income transactions
    res.status(201).json({
      message: 'Income added successfully',
      data: newIncome,
      allIncome, // Include all income transactions in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




app.get('/userIncome/:UserID', async(req, res) => {
  
  const userIncome = await Income_Transaction.findAll({where: {UserID: req.params.UserID }});
    res.send(userIncome)

})

app.get('/userExpense/:UserID', async(req, res) => {
  
  const userExpense = await Expense_Transaction.findAll({where: {UserID: req.params.UserID }});
    res.send(userExpense)

})


app.listen(port, () => {
  console.log(`Server is running on port 3000`);
})