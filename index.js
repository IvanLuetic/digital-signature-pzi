// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const openpgp = require('openpgp');
const multer = require('multer');
const crypto = require('crypto');
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');

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
  jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30m' }, callback);
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

const requireAdmin = (req, res, next) => {
  apiDB.query("SELECT role FROM users WHERE id=?", [req.user.id], (err, results) => {
    if (err || results.length === 0) return res.status(403).json({ message: 'Access denied' });
    if (results[0].role !== 'admin') return res.status(403).json({ message: 'Admins only' });
    next();
  });
};

// Ensure chkdir exists
const chkdir = path.join(__dirname, 'chkdir');
if (!fs.existsSync(chkdir)) fs.mkdirSync(chkdir);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config for checker uploads
const checkerUpload = multer({ dest: chkdir });

// Add multer config for document uploads
const documentUpload = multer({ dest: uploadDir });


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
api.post('/auth/logout', authJWT, (req, res) => {
  res.status(200).json({ message: 'Logged out' });
});

// /auth/change-password
api.post('/auth/change-password', authJWT, async (req, res) => {
  const { newPassword } = req.body;
  apiDB.query("SELECT id FROM users WHERE id=?", [req.user.id], async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ message: 'Invalid request' });

    // Get encrypted private key
    apiDB.query("SELECT id, encrypted_private_key FROM pgp WHERE user_id=?", [req.user.id], async (err, pgpRows) => {
      if (err || pgpRows.length === 0) return res.status(500).json({ message: 'PGP key not found' });
      const { id: pgpId, encrypted_private_key } = pgpRows[0];

      try {
        // Decrypt private key with current password (assume user is authenticated and has access)
        const privateKeyObj = await openpgp.readPrivateKey({ armoredKey: encrypted_private_key });
        // Re-encrypt with new password
        const reEncryptedKey = await openpgp.encryptKey({
          privateKey: privateKeyObj,
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

// /pgp/regenerate
/*api.post('/pgp/regenerate', authJWT, async (req, res) => {
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
*/
// /pgp/:id (DELETE)
/*api.delete('/pgp/:id', authJWT, (req, res) => {
  const { id } = req.params;
  apiDB.query("DELETE FROM pgp WHERE id=? AND user_id=?", [id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting PGP key' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'PGP key not found or not owned by user' });
    res.status(200).json({ message: 'PGP key deleted' });
  });
});*/
// index.js
api.get('/pgp', authJWT, (req, res) => {
  apiDB.query(
    "SELECT id, public_key FROM pgp WHERE user_id=?",
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.status(200).json({ keys: results });
    }
  );
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
api.post('/document/sign', authJWT, documentUpload.single('file'), async (req, res) => {
  const { public_key_id, password } = req.body;
  if (!req.file || !public_key_id || !password) {
    return res.status(400).json({ message: 'File, public_key_id, and password required' });
  }

  // Get encrypted private key
  apiDB.query("SELECT encrypted_private_key FROM pgp WHERE id=? AND user_id=?", [public_key_id, req.user.id], async (err, rows) => {
    if (err || rows.length === 0) return res.status(400).json({ message: 'PGP key not found' });
    try {
      const privateKeyObj = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: rows[0].encrypted_private_key }),
        passphrase: password
      });

      const fileBuffer = fs.readFileSync(req.file.path);
      const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      const message = await openpgp.createMessage({ binary: fileBuffer });
      const signature = await openpgp.sign({
        message,
        signingKeys: privateKeyObj,
        detached: true
      });

      // Save signature to file
      const sigPath = req.file.path + '.sig';
      fs.writeFileSync(sigPath, signature);

      // Store metadata in DB
      apiDB.query(
        "INSERT INTO signed_documents (unsigned_file_hash, signed_file_url, user_id, public_key_id) VALUES (?, ?, ?, ?)",
        [fileHash, req.file.path, req.user.id, public_key_id],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Server error' });
          res.status(201).json({ id: result.insertId, signed_file_url: req.file.path, signature_url: sigPath });
        }
      );
    } catch (e) {
      fs.unlink(req.file.path, () => {});
      fs.unlink(req.file.path + '.sig', () => {});
      return res.status(500).json({ message: 'Signing failed' });
    }
  });
});

// /document/download/:id (GET)
api.get('/document/download/:id', authJWT, (req, res) => {
  const { id } = req.params;
  apiDB.query(
    "SELECT signed_file_url FROM signed_documents WHERE id=? AND user_id=?",
    [id, req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (results.length === 0) return res.status(404).json({ message: 'File not found or not owned by user' });

      const filePath = path.join(__dirname, results[0].signed_file_url);
      const sigPath = filePath + '.sig';
      if (!fs.existsSync(filePath) || !fs.existsSync(sigPath))
        return res.status(404).json({ message: 'File or signature not found on server' });

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename=document.zip');
      const archive = archiver('zip');
      archive.pipe(res);
      archive.file(filePath, { name: path.basename(filePath) });
      archive.file(sigPath, { name: path.basename(sigPath) });
      archive.finalize();
    }
  );
});

// /document/:id (DELETE)
api.delete('/document/:id', authJWT, (req, res) => {
  const { id } = req.params;
  apiDB.query(
    "SELECT signed_file_url FROM signed_documents WHERE id=? AND user_id=?",
    [id, req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (results.length === 0) return res.status(404).json({ message: 'Document not found' });

      const filePath = results[0].signed_file_url;
      const sigPath = filePath + '.sig';

      // Delete files
      fs.unlink(filePath, () => {});
      fs.unlink(sigPath, () => {});

      // Delete DB record
      apiDB.query(
        "DELETE FROM signed_documents WHERE id=? AND user_id=?",
        [id, req.user.id],
        (err) => {
          if (err) return res.status(500).json({ message: 'Server error' });
          res.status(200).json({ message: 'Document deleted' });
        }
      );
    }
  );
});

// /document/checker (POST)
api.post('/document/checker', checkerUpload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'signature', maxCount: 1 }]
), async (req, res) => {
  if (!req.files?.file || !req.files?.signature) {
    return res.status(400).json({ message: 'File and signature required' });
  }

  const filePath = req.files.file[0].path;
  const sigPath = req.files.signature[0].path;
  let responseSent = false;

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const signatureArmored = fs.readFileSync(sigPath, 'utf8');

    apiDB.query(
      "SELECT users.username, pgp.public_key FROM pgp JOIN users ON pgp.user_id = users.id",
      async (err, rows) => {
        if (err) {
          if (!responseSent) res.status(500).json({ message: 'Database error' });
          responseSent = true;
          return;
        }

        for (const row of rows) {
          try {
            const verified = await openpgp.verify({
              message: await openpgp.createMessage({ binary: fileBuffer }),
              signature: await openpgp.readSignature({ armoredSignature: signatureArmored }),
              verificationKeys: await openpgp.readKey({ armoredKey: row.public_key })
            });
            const validity = await verified.signatures[0].verified;
            if (validity) {
              if (!responseSent) res.status(200).json({ signer_username: row.username, message: 'Signature matches this user' });
              responseSent = true;
              return;
            }
          } catch (e) {
            // Ignore failed verifications
          }
        }
        if (!responseSent) res.status(404).json({ message: 'No matching signer found' });
        responseSent = true;
      });
  } finally {
    // Clean up checker files
    fs.unlink(filePath, () => {});
    fs.unlink(sigPath, () => {});
  }
});
// Admin routes
// List all users (for admin dashboard)
api.get('/admin/users', authJWT, requireAdmin, (req, res) => {
  apiDB.query(
    "SELECT id, username, email, join_date FROM users ORDER BY join_date DESC",
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.status(200).json({ users: results });
    }
  );
});

// Get a user's document signing history
api.get('/admin/user/:id/documents', authJWT, requireAdmin, (req, res) => {
  const userId = req.params.id;
  apiDB.query(
    `SELECT signed_documents.id AS document_id,
            signed_documents.signed_file_url,
            signed_documents.signed_at
     FROM signed_documents
     WHERE signed_documents.user_id = ?
     ORDER BY signed_documents.signed_at DESC`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.status(200).json({ documents: results });
    }
  );
});

// Delete a user (admin only)
api.delete('/admin/user/:id', authJWT, requireAdmin, (req, res) => {
  const userId = req.params.id;
  // Delete user's documents first
  apiDB.query("SELECT signed_file_url FROM signed_documents WHERE user_id=?", [userId], (err, docs) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    docs.forEach(doc => {
      fs.unlink(doc.signed_file_url, () => {});
      fs.unlink(doc.signed_file_url + '.sig', () => {});
    });
    apiDB.query("DELETE FROM signed_documents WHERE user_id=?", [userId], (err) => {
      if (err) return res.status(500).json({ message: 'Error deleting documents' });
      // Delete user
      apiDB.query("DELETE FROM users WHERE id=?", [userId], (err) => {
        if (err) return res.status(500).json({ message: 'Error deleting user' });
        res.status(200).json({ message: 'User deleted' });
      });
    });
  });
});
api.listen(5001, "localhost", () => {
  console.log('Server running on port 5001');
});
