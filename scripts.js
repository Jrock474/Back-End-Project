const express = require("express");
const sqlize = require('sequelize');
const app = express();
const pg = require('pg');
const winston = require('winston');
const {Users} = require('./models')
const port = 3000
const bodyParser = require('body-parser')

app.set('view engine', 'ejs');
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))


// parse application/json
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


app.get('/',(req,res)=>{
    res.render('login')
})
// app.get('/user/:id',async(req,res)=>{
//   const budgetMoney = await user.findAll(
//       {where: {
//           id: req.params.id}}
//   );
//   console.log(budgetMoney)
//   res.send(budgetMoney);
// })

// app.get('/user',async(req,res)=>{
//   const userbudget = await user.findAll();
//   console.log(userbudget)
//   res.send(userbudget) ;
// })

app.post('/sign-up', async (req, res) => {
  const { Name, Email, Password, ReEnterPassword } = req.body;
  try {
   const newUser = await Users.create({
      Name: Name,
      Email: Email,
      Password: Password,
      ReEnterPassword: ReEnterPassword
    });
    res.send(newUser)
  } catch (error) {
    console.error(error);
    return res.render('sign-up', { error: 'An error occurred during registration' });
  }

  // Logging and rendering 'register' view after successful registration or error handling
  console.log({
    Name: Name,
    Email: Email,
    Password: Password,
    ReEnterPassword: ReEnterPassword,
  });

  const plaintextPassword = 'mypassword';
  const saltRounds = 10;

  bcrypt.hash(plaintextPassword, saltRounds, (err, hash) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Hashed password:', hash);
  });

  
})

app.post('/sign-in', (req, res) => {
    const Email = req.body.Email;
    // const password = req.body.Password;
    const returningUser = Users.findOne({
        where:{
            Email:Email, 
    }})
    if(!returningUser){
        return res.status(400).send('invalid login');
    }
    res.render('dashbord')
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

app.delete('/user/email',async(req,res)=>{
  await user.destroy({
      where: {
          id: req.params.id
      }
    });
    res.send('User has been deleted')
    console.log(user)

})

app.post('/addExpense', (req,res) => {
  const description = req.body.Description;
  const amount = req.body.Amount;
  const userID = req.body.UserID
})


app.listen(port, () => {
  console.log(`Server is running on port 3000`);
})