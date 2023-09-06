const express = require("express");
const sqlize = require('sequelize');
const app = express();
const pg = require('pg');
const winston = require('winston');
const {user} = require('./models')
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

app.post('/user', async (req, res) => {
const userBudget = await user.create({
      
          Name: req.body.name,
          Email: req.body.email,
          Password: req.body.password,
          ReEnterpassword: req.body.reEnterpassword,
          Income: req.body.income,
          Expenses: req.body.expenses,
          Net: req.body.net,
          Budget: req.body.budget
      
  })
  res.send('')
  console.log(userBudget)
  
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