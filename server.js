const express = require("express")
const app = express()
const bcrypt = require("bcrypt");
app.use(express.json())
const port = 8080

app.get('/Finance', (req, res)=>{
    res.send("Finance")
})


let pw = ""

app.post('/authray', (req, res)=>{
const userEnteredPassword = 'mypassword';
const storedHashedPassword = '...';

bcrypt.compare(userEnteredPassword, storedHashedPassword, (err, result) => {
  if (err) {
    console.error(err);
    return;
  }
  if (result) {
    console.log('Passwords match!');
  } else {
    console.log('Passwords do not match.');
  }
});
})
app.listen(port, ()=>{
console.log(`Server is running on port ${port}`)
})
