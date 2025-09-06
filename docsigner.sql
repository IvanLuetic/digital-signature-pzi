-- Create the database
CREATE DATABASE IF NOT EXISTS docsigner_db;
USE docsigner_db;
-- users table
CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       join_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- public_keys table
CREATE TABLE keys (
                             id INT AUTO_INCREMENT PRIMARY KEY,
                             user_id INT NOT NULL,
                             public_key TEXT NOT NULL,
                             encrypted_private_key TEXT NOT NULL,
                             created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                             FOREIGN KEY (user_id) REFERENCES users(id)
);

-- signed_documents table
CREATE TABLE signed_documents (
                                  id INT AUTO_INCREMENT PRIMARY KEY,
                                  unsigned_file_hash VARCHAR(64) NOT NULL, -- SHA256 hash
                                  signed_file_url VARCHAR(255) NOT NULL,
                                  user_id INT NOT NULL,
                                  public_key_id INT NOT NULL,
                                  signed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                  FOREIGN KEY (user_id) REFERENCES users(id),
                                  FOREIGN KEY (public_key_id) REFERENCES keys(id)
);

-- Ensure uniqueness of unsigned file hash per user
CREATE UNIQUE INDEX idx_user_file_hash ON signed_documents(user_id, unsigned_file_hash);