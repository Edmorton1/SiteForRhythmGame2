-- Если поле не поменяется и оно не конфиденциально, то можно использовать его как первичный ключ, вместо создания ID
-- Можно использовать UUID, чтобы фронт мог генерировать ID без базы, ещё если Foreign Key, можно сразу создавать две записи вместо ожидания Primary Key

CREATE TYPE roles AS ENUM ('user', 'admin');
-- USER BLOCK
CREATE TABLE users (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  role roles NOT NULL DEFAULT 'user',
  email VARCHAR(256) UNIQUE NULL,
  -- МОЖЕТ ПОМЕНЯТЬ В БУДУЩЕМ
  provider_id VARCHAR(21) NULL UNIQUE,
  password VARCHAR(128) NULL,
  banned BOOLEAN NOT NULL DEFAULT FALSE
);

-- В будущем может добавить SLUG поле
ALTER TABLE users
ADD CONSTRAINT auth_method_check
CHECK ((provider_id IS NOT NULL AND password IS NULL)
OR (provider_id IS NULL AND password IS NOT NULL));

-- PROFILES BLOCK
CREATE TABLE profiles (
  id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(32) UNIQUE NOT NULL,
  avatar TEXT,
  about VARCHAR(512) NOT NULL DEFAULT '',
  country_code CHAR(2) NOT NULL CHECK(LENGTH(country_code) = 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ALTER TABLE profiles
-- ADD CONSTRAINT country_code_check
-- CHECK 

-- TODO: Добавить Favorites
-- TRACKS BLOCK
CREATE TYPE difficulties AS ENUM ('easy', 'normal', 'hard');
CREATE TABLE tracks (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	-- Если имя итак английское, то не должно быть дублирования
  name_en VARCHAR(32) NOT NULL,
  name VARCHAR(32) NOT NULL,
	author INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	-- Исполнитель(имя или ссылка)
	performer VARCHAR(128) NOT NULL,
	about VARCHAR(512) NOT NULL DEFAULT '',
	cover_path TEXT,
  file_path TEXT NOT NULL,
  difficulty difficulties NOT NULL,
  bpm INTEGER NOT NULL,
  lang CHAR(2) NOT NULL,
	likes_count INT NOT NULL DEFAULT 0,
	downloads_count INTEGER NOT NULL DEFAULT 0,
	plays_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  -- updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
	is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- СДЕЛАТЬ ЧТОБЫ У ТРЕКОВ МОЖНО БЫЛО СТАВИТЬ ИЗБРАННОЕ

-- CREATE TABLE tracks_genres_names (
--   name VARCHAR(64) PRIMARY KEY
-- );

-- CREATE TABLE tracks_genres (
--   track_id INT NOT NULL,
--   name VARCHAR(64) NOT NULL,
--   PRIMARY KEY (track_id, name),
--   FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE ON UPDATE CASCADE,
--   FOREIGN KEY (name) REFERENCES tracks_genres_names(name) ON DELETE CASCADE ON UPDATE CASCADE
-- );

-- CREATE TABLE likes (
--   id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
--   user_id INT NOT NULL,
--   track_id INT NOT NULL,
--   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
--   FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE ON UPDATE CASCADE
-- );

-- CREATE TABLE comments (
--   id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
--   user_id INT NOT NULL,
--   track_id INT NOT NULL,
--   text VARCHAR(512),
--   date TIMESTAMP DEFAULT NOW(),
--   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
--   FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE ON UPDATE CASCADE
-- );

-- ! : ТЕСТОВАЯ ТАБЛИЦА 
-- CREATE TABLE users(
-- 	id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
-- 	name VARCHAR(32),
-- 	departament VARCHAR(32)
-- )