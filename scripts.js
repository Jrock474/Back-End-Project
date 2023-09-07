const express = require("express");
const sqlize = require('sequelize');
const app = express();
const pg = require('pg');
const winston = require('winston');
const {Users} = require('./models')
const port = 3000

app.use(express.json())




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


app.get('/Finances',(req,res)=>{
  res.send('index')
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

app.post('/new-user', async (req, res) => {
  const plaintextPassword = 'mypassword';
const saltRounds = 10;

bcrypt.hash(plaintextPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Hashed password:', hash);
});
  const newUser = await Users.create({
      
          Name: req.body.Name,
          Email: req.body.Email,
          Password: req.body.Password,
          ReEnterpassword: req.body.ReEnterpassword,
      
  })
  res.send(newUser)
  console.log(newUser)
  
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

// app.delete('/Finances/:id',async(req,res)=>{
//   await finance.destroy({
//       where: {
//           id: req.params.id
//       }
//     });
//     res.send('Expense was been deleted')
//     console.log(finance)

// })
app.listen(port, () => {
  console.log(`Server is running on port 3000`);
})