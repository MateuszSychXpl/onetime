const express = require('express');
const crypto = require('crypto');
const helmet = require('helmet');
const escapeHtml = require('escape-html');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(helmet());
app.set('view engine', 'ejs');

const messages = new Map();
const MAX_MESSAGE_LENGTH = 10000;

function hashPin(pin) {
  return crypto.createHash('sha256').update(pin).digest('hex');
}

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/share', (req, res) => {
  const { text, pin } = req.body;
  if (!text || text.trim() === '') {
    return res.status(400).render('error', { error: 'Text is required' });
  }
  if (text.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).render('error', { error: `Message too long. Maximum length is ${MAX_MESSAGE_LENGTH} characters.` });
  }
  
  const id = crypto.randomBytes(8).toString('hex');
  const sanitizedText = escapeHtml(text);
  messages.set(id, { text: sanitizedText, pin: pin ? hashPin(pin) : null });
  
  const link = `${req.protocol}://${req.get('host')}/view/${id}`;
  res.render('index', { link });
});

app.get('/view/:id', (req, res) => {
  const { id } = req.params;
  const message = messages.get(id);
  
  if (!message) {
    return res.status(404).render('error', { error: 'Message not found or already viewed' });
  }
  
  if (message.pin) {
    res.render('view', { id, pinProtected: true });
  } else {
    messages.delete(id);
    res.render('view', { message: message.text, pinProtected: false, sanitized: true });
  }
});

app.post('/view/:id', (req, res) => {
  const { id } = req.params;
  const { pin } = req.body;
  const message = messages.get(id);

  if (!message) {
    return res.status(404).render('error', { error: 'Message not found or already viewed' });
  }

  if (message.pin !== hashPin(pin)) {
    return res.status(400).render('view', { id, pinProtected: true, error: 'Incorrect PIN' });
  }

  const responseMessage = message.text;
  messages.delete(id);
  res.render('view', { message: responseMessage, pinProtected: false, sanitized: true });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}

module.exports = app;