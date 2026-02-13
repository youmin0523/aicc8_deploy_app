-- [V2 Evolution] 신규 시스템을 위한 데이터베이스 스키마 정의
-- 기존 tasks 테이블은 유지하며, 확장된 기능을 위해 tasks_v2 및 categories 테이블을 사용합니다.

-- 1. 카테고리 테이블: 사용자가 정의하는 태그 및 컬러 정보
CREATE TABLE categories (
    _id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL, -- Hex 형식 (예: #FF0000)
    userId TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. 확장된 할 일 테이블 (V2): 시간 및 카테고리 연동
CREATE TABLE tasks_v2 (
    _id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    due_date TIMESTAMP NOT NULL, -- 날짜와 시간을 통합 관리
    isCompleted BOOLEAN NOT NULL DEFAULT false,
    isImportant BOOLEAN NOT NULL DEFAULT false,
    categoryId TEXT REFERENCES categories(_id) ON DELETE SET NULL, -- 카테고리 삭제 시 할 일은 유지 (미분류 상태)
    userId TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. 샘플 데이터 (초기 설정용)
-- 먼저 카테고리 생성 (예시 유저: user_test)
INSERT INTO categories (_id, name, color, userId) VALUES 
('cat_1', 'Work', '#4A90E2', 'user_test'),
('cat_2', 'Personal', '#F5A623', 'user_test'),
('cat_3', 'Health', '#7ED321', 'user_test');

-- 마감 시간이 포함된 할 일 생성
INSERT INTO tasks_v2 (_id, title, description, due_date, isCompleted, isImportant, categoryId, userId) VALUES 
('task_v2_1', 'V2 아키텍처 설계 완료하기', '마감 시간 및 카테고리 연동 확인', '2026-02-11 20:00:00', false, true, 'cat_1', 'user_test'),
('task_v2_2', '저녁 운동하기', '헬스장 방문 1시간', '2026-02-11 22:30:00', false, false, 'cat_3', 'user_test');

-- 4. 업데이트 트리거 (기존 로직 유지)
CREATE OR REPLACE FUNCTION update_updated_at_column_v2()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_task_v2_updated_at
BEFORE UPDATE ON tasks_v2
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column_v2();
