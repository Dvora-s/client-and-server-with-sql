CREATE DATABASE IF NOT EXISTS project_db;
USE project_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address VARCHAR(255)
);
//hhk
CREATE TABLE IF NOT EXISTS passwords (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, username, email, phone, address) VALUES
('Leanne Graham', 'Bret', 'sincere@april.biz', '1-770-736-8031', 'Kulas Light, Gwenborough'),
('Ervin Howell', 'Antonette', 'shanna@melissa.tv', '010-692-6593', 'Victor Plains, Wisokyburgh'),
('Clementine Bauch', 'Samantha', 'nathan@yesenia.net', '1-463-123-4447', 'Douglas Extension, McKenziehaven');

INSERT INTO passwords (user_id, password) VALUES
(1, '1234'),
(2, 'abcd'),
(3, 'pass');

INSERT INTO todos (user_id, title, completed) VALUES
(1, 'delectus aut autem', FALSE),
(1, 'quis ut nam facilis et officia qui', FALSE),
(2, 'fugiat veniam minus', FALSE),
(2, 'et porro tempora', TRUE),
(3, 'laboriosam mollitia et enim quasi', FALSE);

INSERT INTO posts (user_id, title, body) VALUES
(1, 'sunt aut facere repellat', 'quia et suscipit suscipit recusandae'),
(1, 'qui est esse', 'est rerum tempore vitae sequi sint'),
(2, 'ea molestias quasi exercitationem', 'et iusto sed quo iure'),
(3, 'eum et est occaecati', 'ullam et saepe reiciendis voluptatem');

INSERT INTO comments (post_id, user_id, name, body) VALUES
(1, 2, 'id labore ex et quam laborum', 'laudantium enim quasi est quidem magnam'),
(1, 3, 'quo vero reiciendis velit similique earum', 'est natus enim nihil est dolore omnis'),
(2, 1, 'odio adipisci rerum aut animi', 'quia molestiae reprehenderit quasi aspernatur'),
(3, 1, 'alias odio sit', 'non et atque occaecati deserunt quas');
