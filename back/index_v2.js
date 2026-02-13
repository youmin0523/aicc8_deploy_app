const express = require('express');
const cors = require('cors');

require('dotenv').config(); // .env 변수 설정

const app = express();

app.use(cors()); // 크로스 오리진 설정
app.use(express.json()); // json 데이터 파싱

// 3. root 설정 (V2)
app.get('/', (request, response) => {
  response.send('This is the AICC 8 V2 App for Advanced Features');
});

// //* [New Code] V2 전용 라우트만 등록
app.use(require('./routes/categoryRoutes_v2'));
app.use(require('./routes/taskRoutes_v2'));

// 4. listen 설정
// //* [Important] 기존 v1 서버와 충돌을 피하기 위해 8001 포트 사용 권장 (또는 환경변수 조정)
const PORT_V2 = process.env.PORT_V2 || 8001;
app.listen(PORT_V2, () => {
  console.log(`V2 Server is Running on port. ${PORT_V2}`);
});
