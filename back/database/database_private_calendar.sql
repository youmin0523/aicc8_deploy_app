-- [Private Calendar] 다이어리 및 습관 관리를 위한 스키마 정의

-- 1. Private 다이어리 테이블
CREATE TABLE IF NOT EXISTS private_diaries (
    _id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    entry_date DATE NOT NULL,
    content TEXT NOT NULL,
    images JSONB DEFAULT '[]', -- 이미지 URL 배열
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. 습관 마스터 테이블
CREATE TABLE IF NOT EXISTS private_habits (
    _id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    habit_name TEXT NOT NULL,
    start_time TIME,
    end_time TIME,
    repeat_type TEXT NOT NULL, -- 'everyday', 'weekdays', 'weekends', 'custom'
    repeat_days INT[], -- [0, 1, 2, 3, 4, 5, 6] (Sunday=0)
    goal_start_date DATE,
    goal_end_date DATE,
    reminder_time TIME,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. 습관 이행 로그 테이블
CREATE TABLE IF NOT EXISTS private_habit_logs (
    _id TEXT PRIMARY KEY,
    habitId TEXT REFERENCES private_habits(_id) ON DELETE CASCADE,
    check_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. 일정(Schedule) 테이블
CREATE TABLE IF NOT EXISTS private_schedules (
    _id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    title TEXT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_anniversary BOOLEAN DEFAULT false,
    repeat_type TEXT DEFAULT 'none', -- 'none', 'daily', 'weekly', 'monthly', 'yearly'
    place TEXT,
    description TEXT,
    attachments JSONB DEFAULT '[]', -- {url: string, type: 'image' | 'pdf'} 배열
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. 인덱스 설정 (조회 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_diary_user_date ON private_diaries(userId, entry_date);
CREATE INDEX IF NOT EXISTS idx_habit_user ON private_habits(userId);
CREATE INDEX IF NOT EXISTS idx_habit_log_date ON private_habit_logs(habitId, check_date);
CREATE INDEX IF NOT EXISTS idx_schedule_user_date ON private_schedules(userId, start_date);
