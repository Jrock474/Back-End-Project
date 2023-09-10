var createError = require('http-errors');
const express = require('express');
var BodyParser = require('body-parser');
// var logger = require('morgan');
var path = require('path');

// var indexRouter = require('./routes/index');
// var userRouter = require('./routes/users');

const app = express();

// app.use(logger('dev'));
const session = require('express-session');

const sqlize = require('sequelize');
const pg = require('pg');
const winston = require('winston');
const { Users, Expense_Transaction, Income_Transaction } = require('./models')
const port = 3000
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const { isNumber } = require('util');
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({ extended: false}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  secret: 'digitalCrafts',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true in production if using HTTPS
    maxAge: 3600000, // Session expiration time in milliseconds (e.g., 1 hour)
  },
}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

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
app.all('*', (req, res, next) => {
  logger.log({
    level: 'info',
    method: req.method,
    body: req.body,
    url: req.url,
    parameters: req.params,
    timestamp: new Date().toLocaleString()
  })
  next()
})

//Displays all Users in Database
app.get('/users', async (req, res) => {
  const allUsers = await Users.findAll()

  res.send(allUsers)
})

//Sign In Page
app.get('/login', (req, res) => {
  res.render('login', { errorMessage: '' })
})

//Home Page 
app.get('/sign-up', (req, res) => {
  res.render('sign-up', { errorMessage: '' })
})

// Dashboard
app.get('/dashboard/:userID', async(req, res) => {
  if (req.session.isAuthenticated) {
    const foundUser = await Users.findOne({where:{id: req.params.userID}})
    let userName = foundUser.dataValues.Name
    // User is authenticated, proceed to the dashboard
    res.render('dashboard', {userName});
  } else {
    // User is not authenticated, redirect to the login page
    res.redirect('/login');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  // Destroy the session and redirect to the login page
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

//Registration 
app.post('/sign-up', async (req, res) => {
  const { Name, Email, Password, ReEnterPassword } = req.body;
  const specialCharacters = /[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/;
  const letters = /^[a-zA-Z]/;
  const numbers = /^[0-9]/;


  if (Name === null || Email === null || Password === null || ReEnterPassword === null) {
    return res.render('sign-up', { errorMessage: 'Fields can not be null' });
  }

  if (Name.length > 15) {
    return res.render('sign-up', { errorMessage: 'Name can not be greater than 15 characters' });
  }

  if (Password !== ReEnterPassword) {
    return res.render('sign-up', { errorMessage: 'Passwords must match' });
  }

  if (Password.length < 8) {
    return res.render('sign-up', { errorMessage: 'Passwords must be at least 8 characters' });
  }
  
  // if (Password != /[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/ || Password != /^[a-zA-Z]/ || Password != /^[0-9]/){
  //   console.log("Special Characters: ", specialCharacters)
  //   console.log("Numbers: ", numbers)
  //   console.log("Letters: ", letters)
  //   return res.render('sign-up', { errorMessage: 'Password must contain a letter, number, and a special character' });
  // }

  const existingEmail = await Users.findOne({
    where: {
      Email: Email,
    }
  })

  if (existingEmail) {
    return res.render('sign-up', { errorMessage: 'Email is already in use' });
  }


  //Encrypts Password
  const saltRounds = 10;
  bcrypt.hash(Password, saltRounds, async (err, hash) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Hashed password:', hash);

    // If successful, inserts Data into Database as a new User
    try {
      await Users.create({
        Name: Name,
        Email: Email,
        Password: hash,
        ReEnterPassword: hash
      });
      
      // If successful registration, set session data
      req.session.isAuthenticated = true;
      req.session.userID = newUser.id; // Store the user's ID in the session
  
      // Redirect to the dashboard or another protected route
      res.redirect(`/dashboard/${newUser.id}`);
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
  logger.log({
    level: 'info',
    message: `Password: ${Password}`,
    timestamp: new Date().toLocaleString()
});
})

// Sign in for Returning Users
app.post('/login', async (req, res) => {
  const { Email, Password } = req.body;
  const userEnteredPassword = Password;

  const returningUser = await Users.findOne({
    where: {
      Email: Email,
    }
  })
  const userName = returningUser.Name;
  const userID = returningUser.id;
  const storedHashedPassword = returningUser.Password; // this is the password that is stored in the database
  bcrypt.compare(userEnteredPassword, storedHashedPassword, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    if (result) {
      // res.render('dashboard', {userName});
      res.redirect(`/dashboard/${userID}`);
    } else {
      res.render('login', { errorMessage: 'Invalid Login' });
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
app.delete('/deleteaccount', async (req, res) => {
  const { Email, Password } = req.body;
  const userEnteredPassword = Password;
  const existingUser = await Users.findOne({
    where: {
      Email: Email,
    }
  })
  console.log(existingUser)
  const storedHashedPassword = existingUser.Password; // this is the password that is stored in the database
  bcrypt.compare(userEnteredPassword, storedHashedPassword, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    if (result) {
       existingUser.destroy()
      return res.redirect('sign-up')

    } else {
      return res.render('deleteaccount', { errorMessage: 'Account not found' });
    }
  });
})

app.post('/addExpense/:UserID', async (req, res) => {
  try {
    const { Description, Amount } = req.body;
    const UserID = req.params.UserID;

    // Validate the request data
    if (!Description || !Amount) {
      res.status(400).json({ error: "Both 'Description' and 'Amount' are required" });
      logger.error({
        timestamp: new Date().toLocaleString(),
        message: "Both 'Description' and 'Amount' are required"
      });
    } else if (!/^[a-zA-Z0-9\s]+$/.test(Description)) {
      res.status(400).json({ error: "Description should only contain letters, numbers, and spaces" });
      logger.error({
        timestamp: new Date().toLocaleString(),
        message: "Description should only contain letters, numbers, and spaces"
      });
    } else if (Description.length > 50) {
      res.status(400).json({ error: "Description should be under 50 characters" });
      logger.error({
        timestamp: new Date().toLocaleString(),
        message: "Description should be under 50 characters"
      });
    } else if (typeof Amount !== "number") {
      res.status(400).json({ error: "'Amount' must be a number" });
      logger.error({
        timestamp: new Date().toLocaleString(),
        message: "'Amount' must be a number"
      });
    }

    // Create a new expense transaction record in the database
    const newExpense = await Expense_Transaction.create({
      Description,
      Amount,
      UserID,
    });

    // Calculate the total expense for the user
    const totalExpense = await Expense_Transaction.sum('Amount', {
      where: { UserID },
    });

    // Update the 'Expenses' column in the 'Users' table
    await Users.update({ Expenses: totalExpense }, { where: { id: UserID } });

    // Calculate the total income for the user (if needed)
    // Replace 'totalIncome' with the actual calculation logic

    // Update the 'Net' column in the 'Users' table
    const totalIncome = await Users.sum('Income', { where: { id: UserID } });
    await Users.update({ Net: (totalIncome - totalExpense) }, { where: { id: UserID } });

    // Retrieve all expense transactions after adding the new one
    const allExpense = await Expense_Transaction.findAll();

    // Return a success response with all Expense transactions
    res.status(201).json({
      message: 'Expense added successfully',
      data: newExpense,
      allExpense, // Include all Expense transactions in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
    logger.error({
      timestamp: new Date().toLocaleString(),
      message: "Internal server error"
    });
  }
});


app.post('/addIncome/:UserID', async (req, res) => {
  try {
    const { Description, Amount } = req.body;
    const UserID = req.params.UserID;

    // Validate the request dat else if (!Description || !Amount) {
    if (!Description || !Amount) {
      res.status(400).json({ error: "Both 'Description' and 'Amount' are required" });
      logger.error({
        timestamp: new Date().toLocaleString(),
        message: "Both 'Description' and 'Amount' are required"
      });
    } else if (!/^[a-zA-Z0-9\s]+$/.test(Description)) {
      res.status(400).json({ error: "Description should only contain letters, numbers, and spaces" });
      logger.error({
        timestamp: new Date().toLocaleString(),
        message: "Description should only contain letters, numbers, and spaces"
      });
    } else if (Description.length > 50) {
      res.status(400).json({ error: "Description should be under 50 characters" });
      logger.error({
        timestamp: new Date().toLocaleString(),
        message: "Description should be under 50 characters"
      });
    } else if (typeof Amount !== "number") {
      res.status(400).json({ error: "'Amount' must be a number" });
      logger.error({
        timestamp: new Date().toLocaleString(),
        message: "'Amount' must be a number"
      });
    }

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

    // Calculate the total expense for the user
    const totalExpense = await Expense_Transaction.sum('Amount', {
      where: { UserID },
    });

    // Update the 'Income' column in the 'Users' table
    await Users.update({ Income: totalIncome }, { where: { id: UserID } });

    // Update the 'Net' column in the 'Users' table
    await Users.update({ Net: (totalIncome - totalExpense) }, { where: { id: UserID } })

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

app.get('/userIncome/:UserID', async (req, res) => {
  const userIncome = await Income_Transaction.findAll({ where: { UserID: req.params.UserID } });
  res.send(userIncome)
})

app.get('/userExpense/:UserID', async (req, res) => {
  const userExpense = await Expense_Transaction.findAll({ where: { UserID: req.params.UserID } });
  res.send(userExpense)
})
app.listen(port, () => {
  console.log(`Server is running on port 3000`);
})