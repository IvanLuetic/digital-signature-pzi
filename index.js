// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const openpgp = require('openpgp');

const api = express();
api.use(cors({ origin: "http://localhost:5173", credentials: true }));
api.use(express.json());

const apiDB = sql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  port: process.env.SQL_PORT,
  connectionLimit: process.env.SQL_CONNECTION_LIMIT
});

const generateToken = (user, callback) => {
  jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' }, callback);
};

const verifyToken = (token, callback) => {
  jwt.verify(token, process.env.JWT_SECRET, callback);
};

const authJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  verifyToken(token, (err, decoded) => {
    if (err) return res.status(400).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// /auth/signup
api.post('/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;
  bcrypt.hash(password, 10, async (err, password_hash) => {
    if (err) return res.status(500).json({ message: 'Error hashing password' });
    apiDB.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, password_hash],
      async (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creating user' });
        const userId = result?.insertId || result[0]?.insertId;
        // Generate PGP keypair and encrypt private key with password
        try {
          const { privateKey, publicKey } = await openpgp.generateKey({
            type: 'rsa',
            rsaBits: 2048,
            userIDs: [{ name: username, email }],
            passphrase: password
          });
          apiDB.query(
            "INSERT INTO pgp (user_id, public_key, encrypted_private_key) VALUES (?, ?, ?)",
            [userId, publicKey, privateKey],
            (err) => {
              if (err) return res.status(500).json({ message: 'Error storing PGP keys' });
              const user = { id: userId, username, email };
              generateToken(user, (err, token) => {
                if (err) return res.status(500).json({ message: 'Error generating token' });
                res.status(201).json({ user, token });
              });
            }
          );
        } catch (e) {
          return res.status(500).json({ message: 'Error generating PGP keypair' });
        }
      }
    );
  });
});

// /auth/login
api.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  apiDB.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ message: 'Invalid credentials' });
    const user = results[0];
    bcrypt.compare(password, user.password_hash, (err, valid) => {
      if (err || !valid) return res.status(400).json({ message: 'Invalid credentials' });
      generateToken(user, (err, token) => {
        if (err) return res.status(500).json({ message: 'Error generating token' });
        res.status(200).json({ user: { id: user.id, username: user.username, email: user.email }, token });
      });
    });
  });
});

// /auth/me
api.get('/auth/me', authJWT, (req, res) => {
  apiDB.query("SELECT id, username, email, join_date FROM users WHERE id=?", [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.status(200).json({ user: result[0] });
  });
});

// /auth/logout
api.post('/auth/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out' });
});

// /auth/change-password
api.post('/auth/change-password', authJWT, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  apiDB.query("SELECT password_hash FROM users WHERE id=?", [req.user.id], async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ message: 'Invalid request' });
    const user = results[0];
    bcrypt.compare(oldPassword, user.password_hash, async (err, valid) => {
      if (err || !valid) return res.status(400).json({ message: 'Old password incorrect' });

      // Get encrypted private key
      apiDB.query("SELECT id, encrypted_private_key FROM pgp WHERE user_id=?", [req.user.id], async (err, pgpRows) => {
        if (err || pgpRows.length === 0) return res.status(500).json({ message: 'PGP key not found' });
        const { id: pgpId, encrypted_private_key } = pgpRows[0];

        try {
          // Decrypt private key with old password
          const privateKeyObj = await openpgp.readPrivateKey({ armoredKey: encrypted_private_key });
          const decryptedKey = await openpgp.decryptKey({
            privateKey: privateKeyObj,
            passphrase: oldPassword
          });

          // Re-encrypt with new password
          const reEncryptedKey = await openpgp.encryptKey({
            privateKey: decryptedKey,
            passphrase: newPassword
          });

          // Update password hash and encrypted private key
          bcrypt.hash(newPassword, 10, (err, newHash) => {
            if (err) return res.status(500).json({ message: 'Error hashing new password' });
            apiDB.query("UPDATE users SET password_hash=? WHERE id=?", [newHash, req.user.id], (err) => {
              if (err) return res.status(500).json({ message: 'Error updating password' });
              apiDB.query("UPDATE pgp SET encrypted_private_key=? WHERE id=?", [reEncryptedKey, pgpId], (err) => {
                if (err) return res.status(500).json({ message: 'Error updating PGP key' });
                res.status(200).json({ message: 'Password and PGP key updated successfully' });
              });
            });
          });
        } catch (e) {
          return res.status(500).json({ message: 'Error updating PGP key' });
        }
      });
    });
  });
});

// /pgp/regenerate
api.post('/pgp/regenerate', authJWT, async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Password required' });

  apiDB.query("SELECT username, email, password_hash FROM users WHERE id=?", [req.user.id], async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ message: 'User not found' });
    const user = results[0];

    bcrypt.compare(password, user.password_hash, async (err, valid) => {
      if (err || !valid) return res.status(400).json({ message: 'Invalid password' });

      try {
        const { privateKey, publicKey } = await openpgp.generateKey({
          type: 'rsa',
          rsaBits: 2048,
          userIDs: [{ name: user.username, email: user.email }],
          passphrase: password
        });

        apiDB.query(
          "INSERT INTO pgp (user_id, public_key, encrypted_private_key) VALUES (?, ?, ?)",
          [req.user.id, publicKey, privateKey],
          (err, result) => {
            if (err) return res.status(500).json({ message: 'Error storing new PGP key' });
            res.status(201).json({ message: 'PGP key regenerated', publicKey, keyId: result.insertId });
          }
        );
      } catch (e) {
        res.status(500).json({ message: 'Error generating PGP key' });
      }
    });
  });
});

// /pgp/:id (DELETE)
api.delete('/pgp/:id', authJWT, (req, res) => {
  const { id } = req.params;
  apiDB.query("DELETE FROM pgp WHERE id=? AND user_id=?", [id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting PGP key' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'PGP key not found or not owned by user' });
    res.status(200).json({ message: 'PGP key deleted' });
  });
});

// /users/profile
api.patch('/users/profile', authJWT, (req, res) => {
  const { username, email } = req.body;
  apiDB.query(
    "UPDATE users SET username=?, email=? WHERE id=?",
    [username, email, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.status(200).json({ message: 'Profile updated' });
    }
  );
});

// /document (GET)
api.get('/document', authJWT, (req, res) => {
  apiDB.query("SELECT * FROM signed_documents WHERE user_id=?", [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.status(200).json({ data: results });
  });
});

// /document/sign (POST)
api.post('/document/sign', authJWT, (req, res) => {
  const { unsigned_file_hash, signed_file_url, public_key_id } = req.body;
  apiDB.query(
    "INSERT INTO signed_documents (unsigned_file_hash, signed_file_url, user_id, public_key_id) VALUES (?, ?, ?, ?)",
    [unsigned_file_hash, signed_file_url, req.user.id, public_key_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.status(201).json({ data: { id: result.insertId, unsigned_file_hash, signed_file_url, public_key_id } });
    }
  );
});

// /document/:id (DELETE)
api.delete('/document/:id', authJWT, (req, res) => {
  const { id } = req.params;
  apiDB.query("DELETE FROM signed_documents WHERE id=? AND user_id=?", [id, req.user.id], (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.status(200).json({ message: 'Document deleted' });
  });
});

api.listen(5001, "localhost", () => {
  console.log('Server running on port 5001');
});
