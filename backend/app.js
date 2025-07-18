const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');
// θα προστεθούν πολλα τέτοια endpoints οπως προχωρά η εφαρμογη
const uploadRoutes = require('./routes/upload.routes'); 
const postRoutes = require('./routes/post.routes')
const subPageRoutes = require('./routes/subPage.routes')
const adminRoutes = require('./routes/admin.routes')
const loginRoutes = require('./routes/auth.routes')

// αυτό ειναι κάτι που ίσως μου χρειαστεί στο deploy και δεν το καταλαβαίνω καλα. (και παρακάτω μαζί με αυτό)
const path = require('path'); // requires explanation. added for rendering front page subpages

const app = express()
app.use(cors())
app.use(express.json());

// ενας logger για να καταγράφει το backend τις κλήσεις
app.use((req, res, next) => {
  console.log("Request reached Express!");
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// θα προστεθούν πολλα τέτοια endpoints οπως προχωρά η εφαρμογη
// app.use('/api/todo', todoRoutes)
app.use('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
})

app.use('/api/uploads', uploadRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/subPages', subPageRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/login', loginRoutes)

// swagger test page
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// ✅ SERVE UPLOADS BEFORE DIST
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// για να σερβίρει τον φακελο dist του front μετα το npm run build
app.use(express.static('dist'))

//αυτο είναι για να σερβίρει το index.html του front όταν ο χρήστης επισκέπτεται το root path ή οποιοδήποτε άλλο path που δεν είναι api ή api-docs
app.get(/^\/(?!api|api-docs).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

module.exports = app