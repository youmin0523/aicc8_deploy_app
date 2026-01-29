// 1. express
// 2. cors
const express = require('express');
const cors = require('cors');

require('dotenv').config(); // .env 변수 설정

const app = express();

app.use(cors()); // 크로스 오리진 설정
app.use(express.json()); // json 데이터 파싱

// 3. root 설정
app.get('/', (request, response) => {
  response.send('This is the Main App for Deployment');
});

app.use(require('./routes/getRoutes'));

// 4. listen 설정
app.listen(process.env.PORT, () => {
  console.log(`Server is Running on port. ${process.env.PORT}`);
});
