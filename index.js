const express = require("express");
const sqlize = require('sequelize');
const app = express();
const pg = require('pg');
const winston = require('winston');
// const {finance} = require('./models')
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
// app.get('/Finance/:id',async(req,res)=>{
//   const budgetMoney = await finance.findAll(
//       {where: {
//           id: req.params.id}}
//   );
//   console.log(budgetMoney)
//   res.send(budgetMoney);
// })

// app.get('/finance',async(req,res)=>{
//   const Financebudget = await finance.findAll();
//   console.log(Financebudget)
//   res.send(Financebudget) ;
// })

// app.post('/Finances', async (req, res) => {
//   const FinanceBudget = await Finances.create({
      
//           income: req.body.income,
//           expenses: req.body.expenses,
//           savings: req.body.savings,
//           surplus_deficit: req.body.surplus_deficit
      
//   })
//   res.send('')
//   console.log(FinanceBudget)
  
// })

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