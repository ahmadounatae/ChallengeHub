const express = require('express');
const authRoutes = require('./routes/authRoutes'); // Importe authRoutes

const app = express();

app.use(express.json());


app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
if(require.main=== module){
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports=app;