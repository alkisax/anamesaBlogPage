# Git
```
git init
git remote add origin git@github.com:alkisax/BlogAndDashboard.git
git pull origin main
git add .
git commit -m "Initial commit"
git checkout -b wip
```
- Με `git log --oneline` βλεπω τα commit μου. Πχ
```bash
$ git log --oneline
dc0fb5a (HEAD -> wip, origin/wip) feat: Editorjs component - basic functionality
83739ba minor
84f1853 wip: failing on initial editor.js
86863f2 wip: create basics
fb442c7 (origin/main, main) Initial commit
d4ef566 Initial commit
```
- θελω να κάνω merge στο main μόνο το τελευταιο commit Που έχω κάτι διμηουργημένο
- στο main, μπορείς να πεις στο Git:
```bash
git checkout main
# Αυτό αντιγράφει ΟΛΑ τα αρχεία από το wip στο main χωρίς ιστορικό, σαν να έγραψες το νέο κώδικα τώρα.
git checkout wip -- .
git add .
git commit -m "feat: Add EditorJS blog component with image and layout"
git push origin main
```
- αυτή η λύση δεν μου αρέσει πολύ αλλα θα το δω ξανα στο επόμενο σοβαρο commit γιατί τώρα δούλεψε

# δημιουργία βασικού frontend/backend
### backend
```
npm init
```
### frontend
```
npm create vite@latest frontend -- --template react
npm install
npm i react-router
```
#### frontend\src\App.jsx
εύτιαξα ένα στοιχειόδες App.jsx για να κάνω δοκιμές. αργότερα ισως αλλάξει
```jsx
// import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from "react-router";
import HomePage from './pages/HomePage';

function App() {

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />}/>
          </Routes>
      </BrowserRouter>
    </>
  )
}
export default App
```

# δοκιμή με editor js
```
npm install @editorjs/editorjs react-editor-js
npm install @editorjs/paragraph @editorjs/header @editorjs/list
npm i @editorjs/editorjs --save
```

#### frontend\src\pages\HomePage.jsx
- φτιάχνω ένα απλό HomePage Που καλεί ένα component EditorJs
```jsx
import EditorJs from "../components/EditorJS";

function HomePage() {

  return (
    <>
      <EditorJs />
      <p>!Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi minus illum nisi est? At quisquam id nulla molestias delectus, rerum quas provident illo corrupti dolor minus, sint vero obcaecati incidunt?</p>
    </>
  );
}

export default HomePage;
```

- σημειώσεις για useRef
Το useRef κρατά τιμές μεταξύ των renders χωρίς να προκαλεί νέο render, και συχνά χρησιμοποιείται για αναφορά σε HTML στοιχεία (π.χ. focus σε input).  
📌 Σημείωση: Αν χρησιμοποιήσεις useRef, η αλλαγή δεν θα εμφανιστεί στο DOM ή στο JSX εκτός αν αναγκάσεις re-render (π.χ. με useState).  
```jsx
  const [text, setText] = useState("");
  setText("Hello"); 
  const timeout = setTimeout(() => {
    setText(""); // Την αδειάζει ξανά μετά από λίγο
  }, 2000);

  const textRef = useRef("");
  textRef.current = "Hello"; 
  const timeout = setTimeout(() => {
    textRef.current = ""; // Ξαναμηδενίζει
  }, 2000);
```

### editorJs
- για να χρησιμοποιήσω των editorJs πρέπει αρχικά να κατεβάσω την βιβλιοθήκη και μετά κατευάζω μία μια τις διαφορετικές ιδιώτητές της:
```bash
npm install @editorjs/editorjs
npm install @editorjs/paragraph
npm install @editorjs/header
npm install @editorjs/list
npm install @editorjs/marker
npm install @editorjs/inline-code
npm install @editorjs/image
npm install editorjs-text-alignment-blocktune
npm install editorjs-paragraph-with-alignment@3
npm install editorjs-indent-tune
```
- **IMPORTNAT** χρειάζετε να προσθέσω styling στο css (όπως και χρειάζετε δικό του css κομμάτι κάθε add on του editorJs)
#### frontend\src\App.css
```css
/* editor js css */
.ce-paragraph[data-align="justify"],
.ce-block--aligned-justify {
  text-align: justify;
}
/* Στυλ για ολόκληρο το editor container — εμφανές περίγραμμα, padding και ελάχιστο ύψος */
.codex-editor {
  border: 1px solid #ccc;
  padding: 16px;
  min-height: 300px;
}
/* Ευθυγράμμιση των blocks με βάση την επιλογή του χρήστη από το εργαλείο alignment */
.ce-block--aligned-left {
  text-align: left;
}
.ce-block--aligned-right {
  text-align: right;
}
/* end of editor js css */
```

- **IMPORTNAT** χρειάζετε να προσθέσω     `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest/dist/editor.css">` στο frontend\index.html  

#### frontend\src\components\EditorJs.jsx
```jsx
import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';

// import Paragraph from '@editorjs/paragraph';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import ImageTool from '@editorjs/image';

import AlignmentTuneTool from 'editorjs-text-alignment-blocktune'; // δεν είχε justify alignment αλλά είχε διαφορ καλά για headers και list Οπότε το κρατάω και χρησιμοποιω το Pargraph-with-alignment για το justify
import Paragraph from 'editorjs-paragraph-with-alignment';

const EditorJs = ({ editorJsData, setEditorJsData }) => {
  // χρειάζομαι μια μεταβλητή για να φορτωσω το Instance απο τον κειμενογράφο
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      // κάνω instanciete
      editorRef.current = new EditorJS({
        //IMPORTANT λέω τι id έχει το dom element μου στο οποίο θα εκχωρήσω τις ιδιοτητες του κειμενογράφου
        holder: 'editorjs',
        // μεσα sto tools βαζω ένα ένα τα εργαλέια 
        tools: {
          paragraph: {
            class: Paragraph,
            inlineToolbar: true, // This enables inline tools like bold/italic
            config: {
              placeholder: 'Start writing your text here...',
            },
            // tunes: ['indentTune'],
          },
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder: 'Enter a title',
            },
            tunes: ['alignment'],
          },
          list: {
            class: List,
            inlineToolbar: true,
            tunes: ['alignment'],
          },
          marker: Marker,        // Highlight
          inlineCode: InlineCode, // Inline code block
          alignment: {
            class: AlignmentTuneTool,
            config: {
              default: 'left',
              blocks: {
                header: 'center',
                list: 'left',
              },
            },
          },
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: 'http://localhost:3000/uploadFile', // your backend endpoint
                byUrl: 'http://localhost:3000/fetchUrl',     // optional
              },
            }
          },
        },
        onReady: () => {
          console.log('Editor.js is ready');
        },
      });
    }

    // Cleanup when component unmounts
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    
    <>
      <div 
        id="editorjs" 
        style={{ border: '2px solid blue', padding: '4px', minHeight: '300px' }} 
      />
    </>
  )
}
export default EditorJs
```



## αποθήκευση του editor στο localmemory και προβολή του
για την αποθήκευση στη μνήμη είτε ως useState είτε ως localStorage στο
#### frontend\src\App.jsx
```jsx
const [editorJsData, setEditorJsData] = useState({})
//...
  <Route 
    path="/" 
    element={<HomePage 
      editorJsData={editorJsData} 
      setEditorJsData={setEditorJsData}
    />}
```
#### frontend\src\pages\HomePage.jsx
```jsx
      <EditorJs 
        editorJsData={editorJsData} 
        setEditorJsData={setEditorJsData}
      />
```
#### frontend\src\components\EditorJs.jsx
```jsx
  const handleSubmit = async () => {
    if(editorRef.current) {
      try {
        //  η save() ερχεται απο τον editorjs και επιστρέφει μια υπόσχεση με τα δεδομένα του editor
        const outputData = await editorRef.current.save()
        localStorage.setItem('editorData', JSON.stringify(outputData));
        setEditorJsData(outputData);
        console.log('Data saved:', outputData);
        console.log('editorJsData', editorJsData);
        
      } catch (error) {
        console.error("saving failed", error)
      };
    }
  }
//...
      <div>
        <div 
          id="editorjs" 
          style={{ border: '2px solid blue', padding: '4px', minHeight: '300px' }} 
        />
        <button onClick={handleSubmit}>
          submit
        </button>
      </div>
```

## δοκιμαστική προβολή του περιεχομένου του editorJs σε div
φτιάχτικε χειροκίνητα (με μπόλικο gpt) ένας renderer
#### frontend\src\components\EditorJs.jsx
```jsx
      <div>
        <h2>EditorJs Data</h2>
        {/* 
         to render ηταν δύσκολο και συμβουλευτικα αρκετα το gpt
        αρχικα ελέγχουμε αν υπάρχει state editorJsData και αν αυτό το state έχει μέσα του blocks
        και μετά με μια map παίρνουμε το κάθε block και το render-αρουμε ανάλογα με τον τύπο του block χρησιμοποιόντας διάφορες συνθήκες if 
        */}
        {editorJsData?.blocks?.map((block, index) => {
          if (block.type === 'paragraph') {
            // με μια console.log είδα  το alignmeent και το παιρνω απο το block.tunes.alignment
            const alignStyle = {
              textAlign: block.data.alignment || 'left',
            };
            return (
              <p 
                key={index}
                style={alignStyle}
              >
                  {block.data.text}
              </p>
            )
          }
          if (block.type === 'header') {
            // επειδή τα h1 h2 κλπ δεν είναι απλά attributes αλλά θα έχουν την μορφή <h1> κλπ φτιάχνω ένα tag για να γίνει <Tag>
            // εδω το alignment είναι tune γιατι το παίρνει απο AlignmentTuneTool
            const Tag = `h${block.data.level || 2}`;
            const alignment = block.tunes?.alignment?.alignment || 'left';
            return (
              <Tag 
                key={index}
                style={{ textAlign: alignment }}
              >
                {block.data.text}
              </Tag>
            )
          }
          // το List ήταν αρκετά πολυπλοκο γιατί χρειαζόταν να ελεξω αν είναι ordered η unorder και αν είναι checkbox, όπου αν είναι αν είναι checked και μετά να κάνω το ανάλογο map για την παραγωγή της λίστας
          if (block.type === 'list') {
            const alignment = block.tunes?.alignment?.alignment || 'left';
            const alignStyle = { textAlign: alignment };

            if (block.data.style === 'checklist') {
              // console.log(block.data.items);
              // το i είναι ένα index (1,2,3...)
              const items = block.data.items.map((item, i) => {
                //Το !! στh JS κάνει μετατροπή οποιασδήποτε τιμής σε boolean.
                const isChecked = !!item.meta?.checked; 

                return (
                  <li 
                    key={i} 
                    style={{ listStyleType: 'none', display: 'flex', alignItems: 'center' }}
                  >
                    <input 
                      type="checkbox" 
                      disabled 
                      checked={isChecked} 
                      style={{ marginRight: 8 }} 
                    />
                    <span>{item.content}</span>
                  </li>
                );
              });
              // έχει δύο return μια μέσα στο map όπου σε κάθε βήμα μου φτιάχνει το κάθε μεμονομένο li  και μετ ατο προσθέτει στην items και ένα τελικό return έξω αππο την map όπου παράγει την ul
              return <ul key={index} style={alignStyle}>{items}</ul>;
            } else {
              // normal ordered/unordered list
              const items = block.data.items.map((item, i) => {
                const text = typeof item === 'string' ? item : item?.content || '[invalid item]';
                return <li key={i}>{text}</li>;
              });

              return block.data.style === 'ordered' ? (
                <ol key={index} style={alignStyle}>{items}</ol>
              ) : (
                <ul key={index} style={alignStyle}>{items}</ul>
              );
            }
          }
          // TODO
          if (block.type === 'image') {
            return (
              <div key={index}>
                <img src={block.data.file.url} alt={block.data.caption || ""} style={{ maxWidth: '100%' }} />
                {block.data.caption && <p>{block.data.caption}</p>}
              </div>
            );
          }
          if (block.type === 'inlineCode') {
            return <code key={index}>{block.data.code}</code>;
          }
          return null;
        })}
      </div>
```

#### .env
```
MONGODB_URI = mongodb+srv://alkisax:{---}@cluster0.8ioq6.mongodb.net/blogAndDashboard?retryWrites=true&w=majority&appName=Cluster0
MONGODB_TEST_URI = mongodb+srv://alkisax:{---}@cluster0.8ioq6.mongodb.net/blogAndDashboard_TEST?retryWrites=true&w=majority&appName=Cluster0

BACK_END_PORT = 3001
APP_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
```
# Back end για upload εικονων σε φακελο και mongo

## dependancies back
```bash
npm install express
npm install body-parser
npm install mongoose
npm install multer
npm install dotenv
npm install cors
npm install swagger-ui-express
npm install mongoose-to-swagger
npm install swagger-jsdoc
npm install --save-dev jest
```


- τα δύο παρακάτω αρχεία τα αντέγραψα απο το angularTodoApp
- χρησιμοποίησα το tutorial `https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/`

#### backend\server.js
```js
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app'); 

const PORT = process.env.BACK_END_PORT || 3001

mongoose.set('strictQuery', false);
// συνδεση με την MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
    console.log('Routes setup complete. Starting server...');
// εδώ είναι το βασικό listen PORT μου
    app.listen(PORT, () => {
      // το εκανα σαν λινκ για να είναι clickable
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message);
  });
```

#### backend\app.js
```js
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');
// θα προστεθούν πολλα τέτοια endpoints οπως προχωρά η εφαρμογη
// const todoRoutes = require('./routes/todo.routes')
const imgRoutes = require('./routes/img.routes'); 

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
app.use('/api/images', imgRoutes)

// swagger test page
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// για να σερβίρει τον φακελο dist του front μετα το npm run build
app.use(express.static('dist'))

//αυτο είναι για να σερβίρει το index.html του front όταν ο χρήστης επισκέπτεται το root path ή οποιοδήποτε άλλο path που δεν είναι api ή api-docs
app.get(/^\/(?!api|api-docs).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

module.exports = app
```
## Upload και Mongo

- θα φτιαξώ μια βασική αρχιτεκτονική. 
1. το backend\services\multer.service.js είναι υπεύθυνο για να κάνει το upload και την αποθήκευση της εικόνας
2. το backend\models\img.model.js εχει το mongoose schema και έχει τις εντολές της mongoose
3. το backend\daos\img.dao.js λυτουργεί ως ενδιάμεσο dao με την βαση δεδομένων για λόγους ασφαλείας (ή αλλαγής βάσης)
4. το backend\controllers\img.controller.js εχει μέσα την λογική μου και ασχολείτε με το upload και render (καλόντας το dao)
5. backend\routes\img.routes.js τα paths μου, η αντιστοίχηση με τις εντολες του controller 
6. backend\utils\swagger.js

1. #### το backend\services\multer.service.js 
```js
const multer = require('multer');
const path = require('path');

// μέθοδος που δημιουργεί έναν τρόπο αποθήκευσης αρχείων στο δίσκο (στον υπολογιστή). Με αυτήν καθορίζουμε πού θα αποθηκευτεί το αρχείο και πώς θα ονομαστεί.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('reached multer service');   
    // null -> το δεχόμαστε, path.join(__dirname, '../uploads') -> ο φάκελος που θα αποθηκευτούν τα αρχεία
    cb(null, path.join(__dirname, '../uploads'));
  },
  // πως θα ονομαστεί το αρχείο όταν αποθηκευτεί
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

// αυτό είναι ένας middleware που θα πιάσει το αρχείο που θα στείλει ο χρήστης και θα το αποθηκεύσει στον φάκελο uploads
const upload = multer({ 
  // καθοριζει που θα αποθηκεύονται τα αρχεία οριζετε στην παραπάνω const
  storage,
  // Το fileFilter είναι μια συνάρτηση που ελέγχει κάθε αρχείο πριν αποθηκευτεί.
  fileFilter: (req, file, cb) => {
    console.log('reached multer upload');
    // παιρνει τοn τύπο του αρχειου πχ png jpg κλπ
    const ext = path.extname(file.originalname);
    console.log('Uploading file:', file.originalname, file.mimetype);
    // callback συνάρτηση που πρέπει να καλέσεις για να πεις αν αποδεχεσαι το αρχείο ή όχι.
    cb(null, true);
  }
});

module.exports = upload;


/*
Παράδειγμα φίλτρου που δέχεται μόνο εικόνες .jpg ή .png
js
Αντιγραφή κώδικα
fileFilter: (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if(ext === '.jpg' || ext === '.jpeg' || ext === '.png'){
    cb(null, true); // αποδεκτό αρχείο
  } else {
    cb(new Error('Only images are allowed'), false); // απορρίπτω
  }
}
*/
```

2. #### backend\models\img.model.js
```js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: String,
  desc: String,
  img: {
    data: Buffer,
    contentType: String
  }
});

module.exports = mongoose.model('Image', imageSchema);
```

3. #### backend\daos\img.dao.js
```js
const Image = require('../models/img.model');

const getAllImages = () => {
 return Image.find({});
}
const createImage = (imageData) => {
  return Image.create(imageData)
};

module.exports = {
  getAllImages,
  createImage
};
```

4. #### backend\controllers\img.controller.js
```js
// fs = files system
const fs = require('fs').promises;  // note: require fs.promises
// Node.js's built-in path module, which helps you safely work with file and folder paths
const path = require('path');
const imgDao = require('../daos/img.dao');

//TODO LATER
const renderImagePage = async (req, res) => {
  try {
    const items = await imgDao.getAllImages();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


const uploadImage = async (req, res) => {
  console.log('enter uploadImage controller' );
  //ελενγχουμε το req απο τον client αν έχει οτι χρειάζεται
  try {
    if (!req.file || !req.body.name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // το filepath και το obj τα παίρνουμε από το req.file που έχει δημιουργηθεί από το multer middleware
    const filePath = req.file.path; 
    console.log('File path:', filePath);
    
    //Όταν το readFile() τελειώσει: Αν όλα πήγαν καλά, αποθηκεύει το περιεχόμενο του αρχείου (σε μορφή Buffer) στη μεταβλητή data. Αυτός ο Buffer είναι το "raw binary" του αρχείου. Αν και το multer έχει ήδη αποθηκεύσει το αρχείο στο φάκελο uploads, εμείς εδώ το διαβάζουμε ξανά: 👉 για να το μετατρέψουμε σε binary δεδομένα,👉 ώστε να το αποθηκεύσουμε μέσα στη MongoDB (σε ένα document, όχι ως αρχείο στο δίσκο).
    // Συμαντικό: για να λειτουργήσει το fs.readFile() πρέπει να χρησιμοποιήσουμε την υπόσχεση (Promise) του fs.promises, όχι το απλό fs: επάνω στις δηλώσεις: const fs = require('fs').promises;
    const data = await fs.readFile(filePath); 
    console.log('data:', data);
    

    const obj = {
      name: req.body.name,
      desc: req.body.desc || '',
      img: {
        data,
        contentType: req.file.mimetype
      }
    };
    console.log('Image object:', obj);
    
    // εδω με το imgDao το στελνουμε στην mongo ή αποθήκευση ως αρχείο έχει γίνει ήδη απο τον multer middleware
    await imgDao.createImage(obj);
    res.status(200).json({ message: 'image uploaded' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).send('Upload failed');
  }
};


module.exports = {
  renderImagePage,
  uploadImage
};
```

5. #### backend\routes\img.routes.js
```js
const express = require('express');
const router = express.Router();
const upload = require('../services/multer.service');
const imgController = require('../controllers/img.controller');

/**
 * @swagger
 * /api/images:
 *   get:
 *     summary: Get all uploaded images
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: A list of uploaded images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Image'
 *       500:
 *         description: Server error
 */
router.get('/', imgController.renderImagePage);

/**
 * @swagger
 * /api/images:
 *   post:
 *     summary: Upload a new image
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *               image:
 *                 type: file
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       500:
 *         description: Upload failed
 */
router.post('/', upload.single('image'), imgController.uploadImage);

module.exports = router;
```

6. #### backend\utils\swagger.js

```js
const m2s = require('mongoose-to-swagger');
const Image = require('../models/img.model')
const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      version: "1.0.0",
      title: "blog and dashboard",
      description: "basic dahshboard",
    },
    components: {
      schemas: {
        Image: m2s(Image)
      },
    },
  },
  // 👇 This is the critical part: tell swagger-jsdoc where to find your route/controller annotations
  apis: ['./routes/*.js', './controllers/*.js'], // adjust paths if needed
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
```

## εμφάνηση του περιεχομένου σε άλλο div και αλλαγές στο upload

#### backend\controllers\img.controller.js
```js
//εδω μικρή αλλαγή
    if (!req?.file?.path) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
// το res πρέπει να γίνει σε άλλη μορφή για να ταιριάζει με τις προυποθέσεις του editroJs
    res.status(200).json({
      success: 1,
      file: {
        url: `http://localhost:3001/uploads/${req.file.filename}`,
      },
    });
```

#### backend\controllers\img.controller.js
```jsx
          if (block.type === 'image') {
            return (
              <div key={index}>
                <img 
                  src={block.data.file.url} 
                  alt={block.data.caption || ""} 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '400px',    // <-- Εδώ το πρόσθεσα
                    objectFit: 'contain'  // <-- Εδώ το πρόσθεσα
                  }} 
                />
                {block.data.caption && <p>{block.data.caption}</p>}
              </div>
            );
          }
```

- για να μην φαίνετε μεγάλο και στον editorJs έκανα μια μικρή προσθήκη στο css
#### frontend\src\App.css
```css
/* προοστέθηκε για έλεγχο μεγέθους εικόνας */
.ce-block__content img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}
```

**επόμενο βήμα αποθήκευση στην mongo κειμένου και εικόνας**
πρότα θα φτιαχτεί ένα backend με url στο app.js και model dao controler και routes και μετά θα μπεί το post σε ένα useState και θα σταλθεί στο back με ένα useEffect

# αποθήκευση στην Mongo και προβολή ποστ 
## backend για αποθήκευση blog post

#### backend\app.js
```js
const postRoutes = require('./routes/post.routes')

app.use('/api/routes', postRoutes)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

#### backend\models\post.model.js
```js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    time: Number,
    blocks: [mongoose.Schema.Types.Mixed],
    version: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
```

#### backend\daos\post.dao.js
```js
const Post = require('../models/post.model');

const getAllPosts = () => {
  return Post.find({});
};

const createPost = (content) => {
  return Post.create({ content });
};

module.exports = {
  getAllPosts,
  createPost,
};
```

#### backend\controllers\post.controller.js
```js
// controllers/post.controller.js
const postDao = require('../daos/post.dao');

const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.blocks) {
      return res.status(400).json({ error: 'Invalid EditorJS content' });
    }

    const savedPost = await postDao.createPost(content);

    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while saving post' });
  }
};

module.exports = {
  createPost,
};
```
#### backend\routes\post.routes.js
```js
const express = require('express');
const router = express.Router();
const postControler = require('../controllers/post.controller')

/**
 * @swagger
 * /api/routes:
 *   post:
 *     summary: Create a new Editor.js post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: object
 *                 description: Editor.js output (time, blocks, version)
 *             example:
 *               content:
 *                 time: 1683123123000
 *                 blocks:
 *                   - type: paragraph
 *                     data:
 *                       text: Hello from Swagger!
 *                 version: "2.27.0"
 *     responses:
 *       201:
 *         description: Post created
 *       400:
 *         description: Invalid EditorJS content
 *       500:
 *         description: Server error
 */
router.post('/', postControler.createPost)

module.exports = router;
```

## frontend για αποθήκευση blog post
- μια αλλαγή μόνο στην handlesubmit με axios.post
#### frontend\src\components\EditorJs.jsx
```jsx
  const handleSubmit = async () => {
    if(editorRef.current) {
      try {
        //  η save() ερχεται απο τον editorjs και επιστρέφει μια υπόσχεση με τα δεδομένα του editor
        const outputData = await editorRef.current.save()
        localStorage.setItem('editorData', JSON.stringify(outputData));
        setEditorJsData(outputData);
        console.log('Data saved:', outputData);
        console.log('editorJsData', editorJsData);

        // για την αποθήκευση στην Mongo
        await axios.post(`${backEndUrl}/api/routes`, {
          content: outputData
        })      
      } catch (error) {
        console.error("saving failed", error)
      };
    }
  }
```
- βλεπω στο compass οτι μου αποθηκεύεται ως http://localhost:3001/uploads/image-1751308923423.jpg. θα προτιμούσα αν μου έσωζε ολόκληρη την φωτογραφία στη mongo

αλλαξε ξανά η handleSubmit για να μετατρέπει τα αρχεια σε blob και να τα αποθηκεύει στην Mongo  
#### frontend\src\components\EditorJs.jsx
```jsx
  const handleSubmit = async () => {
    if(editorRef.current) {
      try {
        //  η save() ερχεται απο τον editorjs και επιστρέφει μια υπόσχεση με τα δεδομένα του editor
        const outputData = await editorRef.current.save()
        localStorage.setItem('editorData', JSON.stringify(outputData));
        setEditorJsData(outputData);
        console.log('Data saved:', outputData);
        console.log('editorJsData', editorJsData);

        // για την αποθήκευση στην Mongo
        await axios.post(`${backEndUrl}/api/routes`, {
          content: outputData
        })
        
        // για επιπλέων αποθήκευση εικόνων στην mongoDB ως base64. Τo axios παραπάνω τα σώζει ως λινκ. πχ http://localhost:3001/uploads/image-1751308923423.jpg
        const imageBlocks = outputData.blocks.filter(block => block.type === 'image')

        for (const block of imageBlocks) {
          const imageUrl = block.data.file.url
          try {
            // 👇 ΠΑΡΕ ΤΗΝ ΕΙΚΟΝΑ ως arraybuffer (BINARY)
            const imageResponse = await axios.get(imageUrl, {
              responseType: 'arraybuffer'
            })

            // 👇 Convert binary to Blob/File
            const mimeType = block.data.file.mime || 'image/jpeg';
            const buffer = imageResponse.data;
            const file = new File([buffer], 'editor-image.jpg', { type: mimeType });

            // 👇 Upload using FormData (required for multer backend)
            const formData = new FormData();
            formData.append('image', file);
            formData.append('name', block.data.caption || 'Image');
            formData.append('desc', block.data.caption || '');

            await axios.post(`${backEndUrl}/api/images`, formData)
            console.log('✅ Image sent as JSON to MongoDB');
          } catch (err) {
            console.error('❌ Failed to upload image:', err);
          }
        }
      } catch (error) {
        console.error("saving failed", error)
      };
    }
  }
```
## μεταφορά μεγάλου κώδικα στο EditorJs σε χωριστα component και hooks
- ο κώδικας όλης της λίστας προβολής με τα πολλά if else θα πρέπει να μεταφερθεί αλλού
- oλος ο κώδικας της αρχικής παραμετροποίησης του editor js μεταφέρθηκε σε custom hook
- προστέθηκε κουμπί handleSubmit όπου κάνει προβολή χωρίς ομως να αποθηκευει στην βάση

#### frontend\src\components\RenderedEditorJsContent.jsx
```jsx
import React from "react";

const RenderedEditorJsContent = ({ editorJsData }) => {

  return (
    <>
      <div>
        <h2>EditorJs Data</h2>
        {/* 
         to render ηταν δύσκολο και συμβουλευτικα αρκετα το gpt
        αρχικα ελέγχουμε αν υπάρχει state editorJsData και αν αυτό το state έχει μέσα του blocks
        και μετά με μια map παίρνουμε το κάθε block και το render-αρουμε ανάλογα με τον τύπο του block χρησιμοποιόντας διάφορες συνθήκες if 
        */}
        {editorJsData?.blocks?.map((block, index) => {
          if (block.type === 'paragraph') {
            // με μια console.log είδα  το alignmeent και το παιρνω απο το block.tunes.alignment
            const alignStyle = {
              textAlign: block.data.alignment || 'left',
            };
            return (
              <p 
                key={index}
                style={alignStyle}
              >
                  {block.data.text}
              </p>
            )
          }
          if (block.type === 'header') {
            // επειδή τα h1 h2 κλπ δεν είναι απλά attributes αλλά θα έχουν την μορφή <h1> κλπ φτιάχνω ένα tag για να γίνει <Tag>
            // εδω το alignment είναι tune γιατι το παίρνει απο AlignmentTuneTool
            const Tag = `h${block.data.level || 2}`;
            const alignment = block.tunes?.alignment?.alignment || 'left';
            return (
              <Tag 
                key={index}
                style={{ textAlign: alignment }}
              >
                {block.data.text}
              </Tag>
            )
          }
          // το List ήταν αρκετά πολυπλοκο γιατί χρειαζόταν να ελεξω αν είναι ordered η unorder και αν είναι checkbox, όπου αν είναι αν είναι checked και μετά να κάνω το ανάλογο map για την παραγωγή της λίστας
          if (block.type === 'list') {
            const alignment = block.tunes?.alignment?.alignment || 'left';
            const alignStyle = { textAlign: alignment };

            if (block.data.style === 'checklist') {
              // console.log(block.data.items);
              // το i είναι ένα index (1,2,3...)
              const items = block.data.items.map((item, i) => {
                //Το !! στh JS κάνει μετατροπή οποιασδήποτε τιμής σε boolean.
                const isChecked = !!item.meta?.checked; 

                return (
                  <li 
                    key={i} 
                    style={{ listStyleType: 'none', display: 'flex', alignItems: 'center' }}
                  >
                    <input 
                      type="checkbox" 
                      disabled 
                      checked={isChecked} 
                      style={{ marginRight: 8 }} 
                    />
                    <span>{item.content}</span>
                  </li>
                );
              });
              // έχει δύο return μια μέσα στο map όπου σε κάθε βήμα μου φτιάχνει το κάθε μεμονομένο li  και μετ ατο προσθέτει στην items και ένα τελικό return έξω αππο την map όπου παράγει την ul
              return <ul key={index} style={alignStyle}>{items}</ul>;
            } else {
              // normal ordered/unordered list
              const items = block.data.items.map((item, i) => {
                const text = typeof item === 'string' ? item : item?.content || '[invalid item]';
                return <li key={i}>{text}</li>;
              });

              return block.data.style === 'ordered' ? (
                <ol key={index} style={alignStyle}>{items}</ol>
              ) : (
                <ul key={index} style={alignStyle}>{items}</ul>
              );
            }
          }
          if (block.type === 'image') {
            return (
              <div key={index}>
                <img 
                  src={block.data.file.url} 
                  alt={block.data.caption || ""} 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '400px',    // <-- Εδώ το πρόσθεσα
                    objectFit: 'contain'  // <-- Εδώ το πρόσθεσα
                  }} 
                />
                {block.data.caption && <p>{block.data.caption}</p>}
              </div>
            );
          }
          if (block.type === 'inlineCode') {
            return <code key={index}>{block.data.code}</code>;
          }
          return null;
        })}
      </div>
    </>
  )
}
export default RenderedEditorJsContent
```
#### frontend\src\hooks\useInitEditor.js
```js
import React, { useRef } from 'react';
import axios from 'axios';
import RenderedEditorJsContent from './RenderedEditorJsContent'
import { useInitEditor } from '../hooks/useInitEditor';

import EditorJS from '@editorjs/editorjs';

const EditorJs = ({ editorJsData, setEditorJsData, backEndUrl }) => {
  // χρειάζομαι μια μεταβλητή για να φορτωσω το Instance απο τον κειμενογράφο
  const editorRef = useRef(null);

  // ✅ σε χωριστό custom hook μεταφέρθηκε όλη η παραμετροποίηση του editorJs
  useInitEditor(editorRef, backEndUrl);

  const handlePreview = async () => {
    const outputData = await editorRef.current.save()
    localStorage.setItem('editorData', JSON.stringify(outputData));
    setEditorJsData(outputData);
  }

  const handleSubmit = async () => {
    if(editorRef.current) {
      try {
        //  η save() ερχεται απο τον editorjs και επιστρέφει μια υπόσχεση με τα δεδομένα του editor
        const outputData = await editorRef.current.save()
        localStorage.setItem('editorData', JSON.stringify(outputData));
        setEditorJsData(outputData);
        console.log('Data saved:', outputData);

        // για την αποθήκευση στην Mongo
        await axios.post(`${backEndUrl}/api/routes`, {
          content: outputData
        })
        
        // για επιπλέων αποθήκευση εικόνων στην mongoDB ως base64. Τo axios παραπάνω τα σώζει ως λινκ. πχ http://localhost:3001/uploads/image-1751308923423.jpg
        const imageBlocks = outputData.blocks.filter(block => block.type === 'image')

        for (const block of imageBlocks) {
          const imageUrl = block.data.file.url
          try {
            // 👇 ΠΑΡΕ ΤΗΝ ΕΙΚΟΝΑ ως arraybuffer (BINARY)
            const imageResponse = await axios.get(imageUrl, {
              responseType: 'arraybuffer'
            })

            // 👇 Convert binary to Blob/File
            const mimeType = block.data.file.mime || 'image/jpeg';
            const buffer = imageResponse.data;
            const file = new File([buffer], 'editor-image.jpg', { type: mimeType });

            // 👇 Upload using FormData (required for multer backend)
            const formData = new FormData();
            formData.append('image', file);
            formData.append('name', block.data.caption || 'Image');
            formData.append('desc', block.data.caption || '');

            await axios.post(`${backEndUrl}/api/images`, formData)
            console.log('✅ Image sent as JSON to MongoDB');
          } catch (err) {
            console.error('❌ Failed to upload image:', err);
          }
        }
      } catch (error) {
        console.error("saving failed", error)
      };
    }
  }

  return (
    <>
      <div>
        <div 
          id="editorjs" 
          style={{ border: '2px solid blue', padding: '4px', minHeight: '300px' }} 
        />
        <div className='btnDiv flex gap-3 mx-3 justify-center'>
          <button onClick={handlePreview}>
            preview
          </button>
          <button onClick={handleSubmit}>
            submit
          </button>
        </div>
      </div>

      <div>
        <RenderedEditorJsContent editorJsData={editorJsData} />
      </div>
    </>
  )
}
export default EditorJs
```

#### frontend\src\components\EditorJs.jsx
```jsx
import React, { useRef } from 'react';
import axios from 'axios';
import RenderedEditorJsContent from './RenderedEditorJsContent'
import { useInitEditor } from '../hooks/useInitEditor';

import EditorJS from '@editorjs/editorjs';

const EditorJs = ({ editorJsData, setEditorJsData, backEndUrl }) => {
  // χρειάζομαι μια μεταβλητή για να φορτωσω το Instance απο τον κειμενογράφο
  const editorRef = useRef(null);

  // ✅ σε χωριστό custom hook μεταφέρθηκε όλη η παραμετροποίηση του editorJs
  useInitEditor(editorRef, backEndUrl);

  const handlePreview = async () => {
    const outputData = await editorRef.current.save()
    localStorage.setItem('editorData', JSON.stringify(outputData));
    setEditorJsData(outputData);
  }

  const handleSubmit = async () => {
    if(editorRef.current) {
      try {
        //  η save() ερχεται απο τον editorjs και επιστρέφει μια υπόσχεση με τα δεδομένα του editor
        const outputData = await editorRef.current.save()
        localStorage.setItem('editorData', JSON.stringify(outputData));
        setEditorJsData(outputData);
        console.log('Data saved:', outputData);

        // για την αποθήκευση στην Mongo
        await axios.post(`${backEndUrl}/api/routes`, {
          content: outputData
        })
        
        // για επιπλέων αποθήκευση εικόνων στην mongoDB ως base64. Τo axios παραπάνω τα σώζει ως λινκ. πχ http://localhost:3001/uploads/image-1751308923423.jpg
        const imageBlocks = outputData.blocks.filter(block => block.type === 'image')

        for (const block of imageBlocks) {
          const imageUrl = block.data.file.url
          try {
            // 👇 ΠΑΡΕ ΤΗΝ ΕΙΚΟΝΑ ως arraybuffer (BINARY)
            const imageResponse = await axios.get(imageUrl, {
              responseType: 'arraybuffer'
            })

            // 👇 Convert binary to Blob/File
            const mimeType = block.data.file.mime || 'image/jpeg';
            const buffer = imageResponse.data;
            const file = new File([buffer], 'editor-image.jpg', { type: mimeType });

            // 👇 Upload using FormData (required for multer backend)
            const formData = new FormData();
            formData.append('image', file);
            formData.append('name', block.data.caption || 'Image');
            formData.append('desc', block.data.caption || '');

            await axios.post(`${backEndUrl}/api/images`, formData)
            console.log('✅ Image sent as JSON to MongoDB');
          } catch (err) {
            console.error('❌ Failed to upload image:', err);
          }
        }
      } catch (error) {
        console.error("saving failed", error)
      };
    }
  }

  return (
    <>
      <div>
        <div 
          id="editorjs" 
          style={{ border: '2px solid blue', padding: '4px', minHeight: '300px' }} 
        />
        <div className='btnDiv flex gap-3 mx-3 justify-center'>
          <button onClick={handlePreview}>
            preview
          </button>
          <button onClick={handleSubmit}>
            submit
          </button>
        </div>
      </div>

      <div>
        <RenderedEditorJsContent editorJsData={editorJsData} />
      </div>
    </>
  )
}
export default EditorJs
```

# νεο κομπονεντ που να κάνει map και να προβαλει τα ποστ
### αλλαγή στο back
#### backend\controllers\post.controller.js
```js
const getAllPosts = async (req, res) => {
  try {
    const posts = await postDao.getAllPosts()
    res.status(201).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching posts' })
  }
}
```

#### backend\routes\post.routes.js
```js
router.get('/', postControler.getAllPosts)
```

### προσθήκες στο front
#### frontend\src\App.jsx
```jsx
import Posts from './pages/Posts'
function App() {
  const [editorJsData, setEditorJsData] = useState({})
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route
              path="/posts"
              element={<Posts 
                backEndUrl={backEndUrl}
              />}
            />
          </Routes>
      </BrowserRouter>
    </>
  )
}
```

#### frontend\src\pages\HomePage.jsx
```jsx
  const navigate = useNavigate()
  const navigateToPosts = () => {
    navigate("/posts")
  }
  return (
    <>
      <div>
        <h3>View all posts</h3>
        <div className='btnDiv flex gap-3 mx-3 justify-center'>
          <button onClick={navigateToPosts}>
            Posts
          </button>
        </div>
      </div>
    </>
  );
```
#### frontend\src\pages\Posts.jsx
```jsx
import { useState, useEffect } from "react"
import axios from 'axios';

const Posts = ({ backEndUrl }) => {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${backEndUrl}/api/posts`);
        setPosts(response.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false); 
      }
    };
    
    fetchPosts();
  }, [backEndUrl]);

  return (
    <>
      {loading && <p>Loading...</p>}
      {!loading && posts.length === 0 && <p>No posts found</p>}
      <ul>
        {!loading && posts.length !== 0 &&
          posts.map((post) => (
            <li key={post._id}>
                {/* JSON.stringify(post.content, null, 2) → turns the post.content object into a string. Wrapping it in <pre>...</pre> → preserves the whitespace and line breaks in HTML*/}
              <pre>{JSON.stringify(post.content, null, 2)}</pre>
              <p>{new Date(post.createdAt).toLocaleString()}</p>
            </li>
          ))
        }
      </ul>
    </>
  )
}
export default Posts
```

- το προβλημα εδώ είναι οτι η προβολή δεν είναι οπως θα έπρεπε 
```jsx
        {!loading && posts.length !== 0 &&
          posts.map((post) => (
            <li key={post._id}>
                {/* JSON.stringify(post.content, null, 2) → turns the post.content object into a string. Wrapping it in <pre>...</pre> → preserves the whitespace and line breaks in HTML*/}
              {/* <pre>{JSON.stringify(post.content, null, 2)}</pre> */}
              <RenderedEditorJsContent editorJsData={post.content} />
              <p>{new Date(post.createdAt).toLocaleString()}</p>
            </li>
          ))
        }
```

### tailwind και αλλάγές ωστε να προβάλει μέχρι 70 λεξεις και την πρώτη μόνο εικόνα
#### frontend\src\pages\Posts.jsx
```jsx
import { useState, useEffect } from "react"
import axios from 'axios';
import RenderedEditorJsContent from "../components/RenderedEditorJsContent";

const Posts = ({ backEndUrl }) => {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${backEndUrl}/api/posts`);
        setPosts(response.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false); 
      }
    };
    
    fetchPosts();
  }, [backEndUrl]);

  // αυτή η συνάρτηση κρατάει μόνο την πρώτη εικόνα και τις πρώτες 70 λέξεις. Σε μεγάλο βαθμό απο GPT
  const getPreviewContent = (content, maxWords = 70) => {
    const previewBlocks = [];
    let wordCount = 0;
    let imageIncluded = false;

    for (const block of content.blocks) {
      if (block.type === 'image' && !imageIncluded) {
        previewBlocks.push(block);
        imageIncluded = true;
      }

      if (block.type === 'paragraph') {
        const words = block.data.text.split(/\s+/);
        const remaining = maxWords - wordCount;

        if (remaining <= 0) break;

        const trimmedWords = words.slice(0, remaining);
        previewBlocks.push({
          ...block,
          data: {
            ...block.data,
            text: trimmedWords.join(' ') + (words.length > remaining ? '...' : '')
          }
        });

        wordCount += trimmedWords.length;
      }

      if (wordCount >= maxWords && imageIncluded) break;
    }

    return {
      ...content,
      blocks: previewBlocks
    };
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-center">All Posts</h1>
      <div className="p-4 max-w-4xl mx-auto">
        {loading && <p>Loading...</p>}
        {!loading && posts.length === 0 && <p>No posts found</p>}

        <div className="grid gap-6">
            {!loading && posts.length !== 0 &&
              posts.map((post) => (
                <div 
                  key={post._id}
                  className="bg-slate-100 text-black shadow-md rounded-2xl p-6 border border-gray-300 hover:shadow-lg transition-shadow"
                >
                  <RenderedEditorJsContent editorJsData={getPreviewContent(post.content)} />
                  <p className="text-sm text-gray-500 mt-4">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            }        
        </div>    
      </div>
    </>
  )
}
export default Posts
```

# Προβολή ενώς μόνο blog post
## back αλλαγες για get με id ένα Post
#### backend\app.js
- δεν άλλαξε κατι εδώ
```js
app.use('/api/posts', postRoutes)
```
#### backend\daos\post.dao.js
```js
const getPostById = async (postId) => {
  return await Post.findById(postId);
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
};
```

#### backend\controllers\post.controller.js
```js
const getPostById = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await postDao.getPostById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Get Post Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  getPostById,
  getAllPosts,
};
```

#### backend\routes\post.routes.js
```js
/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post data
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get('/:postId', postControler.getPostById);
```

## front αλλαγές με Link για προβολή ενώς ποστ με Id
#### frontend\src\App.jsx
```jsx
  <Route path="/posts/:id" element={<BlogPost backEndUrl={backEndUrl} />} />
```

#### frontend\src\pages\Posts.jsx
```jsx
        <div className="grid gap-6">
            {!loading && posts.length !== 0 &&
              posts.map((post) => (
                <Link to={`/posts/${post._id}`}>
                  <div 
                    key={post._id}
                    className="bg-slate-100 text-black shadow-md rounded-2xl p-6 border border-gray-300 hover:shadow-lg transition-shadow"
                  >
                      <RenderedEditorJsContent editorJsData={getPreviewContent(post.content)} />

                    <p className="text-sm text-gray-500 mt-4">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))
            }        
        </div>   
```

#### frontend\src\pages\BlogPost.jsx
```jsx
import axios from 'axios';
import { useState, useEffect } from "react"
import { useParams, useNavigate  } from 'react-router-dom';
import RenderedEditorJsContent from "../components/RenderedEditorJsContent";

const BlogPost = ({ backEndUrl }) => {
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState(null)

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${backEndUrl}/api/posts/${id}`);
        setPost(response.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false); 
      }
    };
    
    if (id) {
      fetchPost();
    }
  }, [backEndUrl, id]);

  const navigateToHome = () => {
    navigate('/');
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-center">All Posts</h1>
      <div className="p-4 max-w-4xl mx-auto">
        {loading && <p>Loading...</p>}
        {!loading && !post && <p>Blog post was not found</p>}

        <div className="grid gap-6">
            {!loading && post &&

                <div 
                  key={post._id}
                  className="bg-slate-100 text-black shadow-md rounded-2xl p-6 border border-gray-300 hover:shadow-lg transition-shadow"
                >
                  <RenderedEditorJsContent editorJsData={post.content} />
                  <p className="text-sm text-gray-500 mt-4">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                  <div className='btnDiv flex gap-3 mx-3 justify-center'>
                    <button 
                      onClick={navigateToHome}
                      className='bg-blue-500 text-white px-4 py-2 rounded'
                    >
                      Home
                    </button>
                  </div>
                </div>

            }        
        </div>    
      </div>
    </>
  )
}

export default BlogPost
```

# Εdit post
## backend for edit
#### backend\daos\post.dao.js
```js
const editPost = async (postId, content) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error('post not found');
  }
  post.content = content;
  return await post.save();
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  editPost,
};
```

#### backend\controllers\post.controller.js
```js
const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || !content.blocks) {
      return res.status(400).json({ error: 'Invalid EditorJS content for edit post' });
    }

    const savedPost = await postDao.editPost(postId, content);

    res.status(200).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while editing post' });
  }
};
```

#### backend\routes\img.routes.js
```js
/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: Edit a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: object
 *                 properties:
 *                   time:
 *                     type: integer
 *                   blocks:
 *                     type: array
 *                     items:
 *                       type: object
 *                   version:
 *                     type: string
 *     responses:
 *       200:
 *         description: Post successfully updated
 *       400:
 *         description: Invalid EditorJS content
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.put('/:postId', postController.editPost);
```

## front end for edit
#### frontend\src\App.jsx
```jsx
  <Route 
    path="/edit/:id" 
    element={<EditBlogPost
      editorJsData={editorJsData}
      setEditorJsData={setEditorJsData}
      backEndUrl={backEndUrl}
      isEditMode={true}
    />}
  />
```

#### frontend\src\pages\EditBlogPost.jsx
```jsx
import EditorJs from '../components/EditorJs';

const EditBlogPost = ({ editorJsData, setEditorJsData, backEndUrl}) => {

  return (
    <>
      <EditorJs 
        editorJsData={editorJsData} 
        setEditorJsData={setEditorJsData}
        backEndUrl={backEndUrl}
        isEditMode={true}
      />   
    </>
  )
}

export default EditBlogPost
```

#### σημαντικές αλλαγές στο frontend\src\components\EditorJs.jsx
```jsx
import { useParams } from 'react-router-dom';

const { id } = useParams();

  // 🟧 If in edit mode, fetch post and populate editor
  useEffect(() => {
    const fetchPost = async () => {
      if (isEditMode && id && editorRef.current) {
        console.log("enter edit mode")        
        try {
          const response = await axios.get(`${backEndUrl}/api/posts/${id}`);
          const savedData = response.data.content;
          const editor = editorRef.current;

          // Clear and render with existing data
          await editor.isReady;
          editor.render(savedData);
        } catch (error) {
          console.error("Failed to load post for editing:", error);
        }
      }
    };

    fetchPost();
  }, [id, isEditMode, backEndUrl]);

    const handleSubmit = async () => {
    if(editorRef.current) {
      try {
        //  η save() ερχεται απο τον editorjs και επιστρέφει μια υπόσχεση με τα δεδομένα του editor
        const outputData = await editorRef.current.save()
        localStorage.setItem('editorData', JSON.stringify(outputData));
        setEditorJsData(outputData);
        console.log('Data saved:', outputData);

        // για την αποθήκευση στην Mongo
        if (isEditMode && id) {
          await axios.put(`${backEndUrl}/api/posts/${id}`, {
            content: outputData
          })
          console.log("✅ Post updated");
        } else {
          await axios.post(`${backEndUrl}/api/posts`, {
            content: outputData
          })
          console.log("✅ Post created");
        }

        
        // για επιπλέων αποθήκευση εικόνων στην mongoDB ως base64. Τo axios παραπάνω τα σώζει ως λινκ. πχ http://localhost:3001/uploads/image-1751308923423.jpg
        const imageBlocks = outputData.blocks.filter(block => block.type === 'image')

        for (const block of imageBlocks) {
          const imageUrl = block.data.file.url
          try {
            // 👇 ΠΑΡΕ ΤΗΝ ΕΙΚΟΝΑ ως arraybuffer (BINARY)
            const imageResponse = await axios.get(imageUrl, {
              responseType: 'arraybuffer'
            })

            // 👇 Convert binary to Blob/File
            const mimeType = block.data.file.mime || 'image/jpeg';
            const buffer = imageResponse.data;
            const file = new File([buffer], 'editor-image.jpg', { type: mimeType });

            // 👇 Upload using FormData (required for multer backend)
            const formData = new FormData();
            formData.append('image', file);
            formData.append('name', block.data.caption || 'Image');
            formData.append('desc', block.data.caption || '');

            await axios.post(`${backEndUrl}/api/images`, formData)
            console.log('✅ Image sent as JSON to MongoDB');
          } catch (err) {
            console.error('❌ Failed to upload image:', err);
          }
        }
      } catch (error) {
        console.error("saving failed", error)
      };
    }
  }
```
```jsx
import { useRef, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import RenderedEditorJsContent from './RenderedEditorJsContent'
import { useInitEditor } from '../hooks/useInitEditor';

import EditorJS from '@editorjs/editorjs';

const EditorJs = ({ editorJsData, setEditorJsData, backEndUrl, isEditMode=false }) => {
  // χρειάζομαι μια μεταβλητή για να φορτωσω το Instance απο τον κειμενογράφο
  const editorRef = useRef(null);

  // ✅ σε χωριστό custom hook μεταφέρθηκε όλη η παραμετροποίηση του editorJs
  useInitEditor(editorRef, backEndUrl);

  const { id } = useParams();

  // 🟧 If in edit mode, fetch post and populate editor
  useEffect(() => {
    const fetchPost = async () => {
      if (isEditMode && id && editorRef.current) {
        console.log("enter edit mode")        
        try {
          const response = await axios.get(`${backEndUrl}/api/posts/${id}`);
          const savedData = response.data.content;
          const editor = editorRef.current;

          // Clear and render with existing data
          await editor.isReady;
          editor.render(savedData);
        } catch (error) {
          console.error("Failed to load post for editing:", error);
        }
      }
    };

    fetchPost();
  }, [id, isEditMode, backEndUrl]);


  const handlePreview = async () => {
    const outputData = await editorRef.current.save()
    localStorage.setItem('editorData', JSON.stringify(outputData));
    setEditorJsData(outputData);
  }

  const handleSubmit = async () => {
    if(editorRef.current) {
      try {
        //  η save() ερχεται απο τον editorjs και επιστρέφει μια υπόσχεση με τα δεδομένα του editor
        const outputData = await editorRef.current.save()
        localStorage.setItem('editorData', JSON.stringify(outputData));
        setEditorJsData(outputData);
        console.log('Data saved:', outputData);

        // για την αποθήκευση στην Mongo
        if (isEditMode && id) {
          await axios.put(`${backEndUrl}/api/posts/${id}`, {
            content: outputData
          })
          console.log("✅ Post updated");
        } else {
          await axios.post(`${backEndUrl}/api/posts`, {
            content: outputData
          })
          console.log("✅ Post created");
        }

        
        // για επιπλέων αποθήκευση εικόνων στην mongoDB ως base64. Τo axios παραπάνω τα σώζει ως λινκ. πχ http://localhost:3001/uploads/image-1751308923423.jpg
        const imageBlocks = outputData.blocks.filter(block => block.type === 'image')

        for (const block of imageBlocks) {
          const imageUrl = block.data.file.url
          try {
            // 👇 ΠΑΡΕ ΤΗΝ ΕΙΚΟΝΑ ως arraybuffer (BINARY)
            const imageResponse = await axios.get(imageUrl, {
              responseType: 'arraybuffer'
            })

            // 👇 Convert binary to Blob/File
            const mimeType = block.data.file.mime || 'image/jpeg';
            const buffer = imageResponse.data;
            const file = new File([buffer], 'editor-image.jpg', { type: mimeType });

            // 👇 Upload using FormData (required for multer backend)
            const formData = new FormData();
            formData.append('image', file);
            formData.append('name', block.data.caption || 'Image');
            formData.append('desc', block.data.caption || '');

            await axios.post(`${backEndUrl}/api/images`, formData)
            console.log('✅ Image sent as JSON to MongoDB');
          } catch (err) {
            console.error('❌ Failed to upload image:', err);
          }
        }
      } catch (error) {
        console.error("saving failed", error)
      };
    }
  }

  return (
    <>
      <div>
        <div 
          id="editorjs" 
          style={{ border: '2px solid blue', padding: '4px', minHeight: '300px' }} 
        />
        <div className='btnDiv flex gap-3 mx-3 justify-center'>
          <button onClick={handlePreview}>
            preview
          </button>
          <button onClick={handleSubmit}>
            submit
          </button>
        </div>
      </div>

      <div>
        <RenderedEditorJsContent editorJsData={editorJsData} />
      </div>
    </>
  )
}
export default EditorJs
```
- Paginatinon
- TODO να αντιστιχίσω τα post σε σελίδες
- upload pdf

- problem. μπορεί να σωζει πολλαπλες φορές μια εικόνα
- problem in rendering `<b> <br> gr`

# δημιουργία custom σελίδας απο τον χρίστη και αντιστοιχηση post σε σελίδα
## Backend αλλαγές για διαχείρηση subPage
- θα πρέει να γινουν δύο πράγματα δημιουργία backend για subPage με model dao controller routes, και αλλαγές στο model dao controller routes του post για να τα ενσωματώσει

### δημιουργεία back για subPage
#### backend\app.js
```js
const subPageRoutes = require('./routes/subPage.routes')
app.use('/api/subPages', subPageRoutes)
```

#### backend\models\subPage.model.js
```js
const mongoose = require('mongoose');

const subPageSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    default: 'main'
  }
}, { timestamps: true });

module.exports = mongoose.model('SubPage', subPageSchema);
```

#### backend\daos\subPage.dao.js
```js
const SubPage = require('../models/subPage.model');

const getAllSubPages = () => {
 return SubPage.find({});
}
const createSubPage = (name) => {
  return SubPage.create({ name })
};

module.exports = {
  getAllSubPages,
  createSubPage
};
```

#### backend\controllers\subPage.controller.js
```js
const subPageDao = require('../daos/subPage.dao');

const createSubPage = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Page name required' });
    }

    const subPage = await subPageDao.createSubPage(name);

    res.status(200).json(subPage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create page' });
  }
};

const getAllSubpages = async (req, res) => {
  try {
    const subPages = await subPageDao.getAllSubPages()
    res.status(200).json(subPages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pages' })
  }
}

module.exports = {
  createSubPage,
  getAllSubpages,
};
```

#### backend\routes\subPage.routes.js
```js
const express = require('express');
const router = express.Router();
const subPageController = require('../controllers/subPage.controller')

/**
 * @swagger
 * /api/subPages:
 *   post:
 *     summary: Create a new Editor.js post
 *     tags: [subPages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *     responses:
 *       200:
 *         description: subPage created
 *       500:
 *         description: Server error
 */
router.post('/', subPageController.createSubPage)

/**
 * @swagger
 * /api/subPages:
 *   get:
 *     summary: Get all subPages
 *     tags: [subPages]
 *     responses:
 *       200:
 *         description: Array of subPages
 *       500:
 *         description: Server error
 */
router.get('/', subPageController.getAllSubpages)

module.exports = router;
```

#### αλλαγές σε backend\utils\swagger.js
```js
const SubPage = require('../models/subPage.model')

    components: {
      schemas: {
        Image: m2s(Image),
        Post: m2s(Post),
        SubPage: m2s(SubPage)
      },
    },
```

### αλλαγές σε back posts
#### backend\models\post.model.js
```js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    time: Number,
    blocks: [mongoose.Schema.Types.Mixed],
    version: String
  },
  subPage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubPage',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
```

#### backend\daos\post.dao.js
- πρεπει να μπούν τα populate Και οι αλλαγές στο subpage
```js
const Post = require('../models/post.model');

const getAllPosts = () => {
  return Post.find({}).populate('subPage');
};

const getPostById = async (postId) => {
  return await Post.findById(postId).populate('subPage');
};

const createPost = (content, subPage) => {
  return Post.create({ content, subPage });
};

const editPost = async (postId, content, subPage) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error('post not found');
  }
  post.content = content;

    if (subPage !== undefined) {
    post.subPage = subPage;
  }
  
  return await post.save();
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  editPost,
};
```

#### backend\controllers\post.controller.js
```js
// controllers/post.controller.js
const postDao = require('../daos/post.dao');

const createPost = async (req, res) => {
  try {
    const { content, subPage } = req.body;

    if (!content || !content.blocks) {
      return res.status(400).json({ error: 'Invalid EditorJS content' });
    }

    const savedPost = await postDao.createPost(content, subPage);

    res.status(200).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while saving post' });
  }
};

const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, subPage } = req.body;

    if (!content || !content.blocks) {
      return res.status(400).json({ error: 'Invalid EditorJS content for edit post' });
    }

    const savedPost = await postDao.editPost(postId, content, subPage);

    res.status(200).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while editing post' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postDao.getAllPosts()
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching posts' })
  }
}

const getPostById = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await postDao.getPostById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Get Post Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  editPost,
  getPostById,
  getAllPosts,
};
```

### αλλαγές σε front
#### frontend\src\components\EditorJs.jsx
```jsx
  // Προσθήκη λογικής για custom pages
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [newPage, setNewPage] = useState('');

  const handlePageSelect = (e) => {
    const value = e.target.value
    if (value === '__new__') {
      setSelectedPage('')
    } else {
      setSelectedPage(value)
    }
  }

  const handleNewPageSubmit = async () => {
    if (!newPage) return;
    try {
      const res = await axios.post(`${backEndUrl}/api/subPages`, { name: newPage });
      setPages([...pages, res.data]);
      setSelectedPage(res.data._id);
      setNewPage('');
    } catch (err) {
      console.error('Error creating page', err);
    }
  };

    const handleSubmit = async () => {
    if(editorRef.current) {
      try {
        //  η save() ερχεται απο τον editorjs και επιστρέφει μια υπόσχεση με τα δεδομένα του editor
        const outputData = await editorRef.current.save()
        localStorage.setItem('editorData', JSON.stringify(outputData));
        setEditorJsData(outputData);
        console.log('Data saved:', outputData);

        // για την αποθήκευση στην Mongo
        if (isEditMode && id) {
          await axios.put(`${backEndUrl}/api/posts/${id}`, {
            content: outputData,
            subPage: selectedPage
          })
          console.log("✅ Post updated");
        } else {
          await axios.post(`${backEndUrl}/api/posts`, {
            content: outputData,
            subPage: selectedPage
          })
          console.log("✅ Post created");
        }
      } catch (error) {
        console.error("saving failed", error)
      };
    }
  }

  const selectedPageName = pages.find(p => p._id === selectedPage)?.name || ''

  return (
              {/* Προσθήκη λογικής για custom pages */}
          <div className="w-full max-w-md mx-auto">
            <select 
              onChange={handlePageSelect} 
              value={selectedPage}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a page</option>
              {pages.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
              <option value="__new__">+ Create new page</option>
            </select>

            {selectedPage === '' && (
              <div>
                <input
                  type="text"
                  value={newPage}
                  onChange={e => setNewPage(e.target.value)}
                  placeholder="New page name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                  onClick={handleNewPageSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create page
                </button>
              </div>
            )}
          </div>
  )
```

#### frontend\src\pages\Posts.jsx
```jsx
  <RenderedEditorJsContent
    editorJsData={getPreviewContent(post.content)}
    subPageName={post.subPage?.name}
  />
```

#### frontend\src\components\RenderedEditorJsContent.jsx
```jsx
        {subPageName &&
          <p style={{ color: 'gray', fontStyle: 'italic' }}>
            📄 Page: {subPageName}
          </p>          
        }
```

# bug: add empty line
#### frontend\src\hooks\useInitEditor.js
```js
          paragraph: {
            class: Paragraph,
            inlineToolbar: true, // This enables inline tools like bold/italic
            config: {
              placeholder: 'Start writing your text here...',
              preserveBlank: true,
            },
          },
```

#### frontend\src\components\RenderedEditorJsContent.jsx
```jsx
          if (block.type === 'paragraph') {
            // με μια console.log είδα  το alignmeent και το παιρνω απο το block.tunes.alignment
            const alignStyle = {
              textAlign: block.data.alignment || 'left',
            };

             // Καθαρίζει το HTML περιεχόμενο για να αποφευχθεί XSS (κακόβουλο script injection)
            const sanitized = DOMPurify.sanitize(block.data.text);
             // Ελέγχει αν το κείμενο είναι κενό ή περιέχει μόνο κενά ώστε να αποδοθεί ένα κενό μπλοκ
            const isEmpty = sanitized.trim() === '';
  
            // Αν είναι κενό, δώσε non-breaking space ώστε να αποδοθεί το <p>, αλλιώς δώσε το καθαρισμένο κείμενο
            return (
              <p 
                key={index}
                style={alignStyle}
                dangerouslySetInnerHTML={{ 
                  __html: isEmpty ? '&nbsp;' : sanitized 
                }}
              >
              </p>
            )
          }
```

# upload pdf
εκανα rename όλο το back απο Image σε upload. αυτό μου δημιουργησε προβλήματα γιατι διαφορα στο front ηταν ως image. επειδή έγινε πολύ μπλέξιμο το έχω αφήσει έτσι να είναι κάπου image και κάπου upload

## back
#### backend\app.js
```js
const uploadRoutes = require('./routes/upload.routes'); 
const postRoutes = require('./routes/post.routes')
const subPageRoutes = require('./routes/subPage.routes')
app.use('/api/uploads', uploadRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/subPages', subPageRoutes)
// ✅ SERVE UPLOADS BEFORE DIST
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

#### backend\services\multer.service.js
```js
const multer = require('multer');
const path = require('path');

// μέθοδος που δημιουργεί έναν τρόπο αποθήκευσης αρχείων στο δίσκο (στον υπολογιστή). Με αυτήν καθορίζουμε πού θα αποθηκευτεί το αρχείο και πώς θα ονομαστεί.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('reached multer service');   
    // null -> το δεχόμαστε, path.join(__dirname, '../uploads') -> ο φάκελος που θα αποθηκευτούν τα αρχεία
    cb(null, path.join(__dirname, '../uploads'));
  },
  // πως θα ονομαστεί το αρχείο όταν αποθηκευτεί
  filename: (req, file, cb) => {
    // const ext = path.extname(file.originalname);
    // cb(null, file.fieldname + '-' + Date.now() + ext);
    cb(null, file.originalname);
  }
});

// αυτό είναι ένας middleware που θα πιάσει το αρχείο που θα στείλει ο χρήστης και θα το αποθηκεύσει στον φάκελο uploads
const upload = multer({ 
  // καθοριζει που θα αποθηκεύονται τα αρχεία οριζετε στην παραπάνω const
  storage,
  // Το fileFilter είναι μια συνάρτηση που ελέγχει κάθε αρχείο πριν αποθηκευτεί.
  fileFilter: (req, file, cb) => {
    console.log('reached multer upload');
    
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt', '.doc', '.docx'];
    
    // παιρνει τοn τύπο του αρχειου πχ png jpg κλπ
    const ext = path.extname(file.originalname).toLowerCase();
    console.log('Uploading file:', file.originalname, file.mimetype);
    
    // callback συνάρτηση που πρέπει να καλέσεις για να πεις αν αποδεχεσαι το αρχείο ή όχι.
    if (allowedExtensions.includes(ext)){
      cb(null, true);
    } else {
      cb(new Error('Only images, PDF, txt, and Word documents are allowed'), false);
    }
  }
});

module.exports = upload;
```

#### backend\models\upload.model.js
```js
const mongoose = require('mongoose');

const uploadSchema  = new mongoose.Schema({
  name: String,
  desc: String,
  file: {
    data: Buffer,
    contentType: String,
    originalName: String
  }
});

module.exports = mongoose.model('Upload', uploadSchema );
```

#### backend\daos\upload.dao.js
```js
const Upload = require('../models/upload.model');

const getAllUploads = () => {
 return Upload.find({});
}
const createUpload = (imageData) => {
  return Upload.create(imageData)
};

module.exports = {
  getAllUploads,
  createUpload
};
```

#### backend\controllers\upload.controller.js
```js
// fs = files system
const fs = require('fs').promises;  // note: require fs.promises
// Node.js's built-in path module, which helps you safely work with file and folder paths
const path = require('path');
const uploadDao = require('../daos/upload.dao');

const renderUploadPage = async (req, res) => {
  try {
    const items = await uploadDao.getAllUploads();
    console.log("Mongo items count:", items.length);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


const uploadFile = async (req, res) => {
  console.log('enter uploadFile controller' );
  //ελενγχουμε το req απο τον client αν έχει οτι χρειάζεται
  try {
    if (!req?.file?.path) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // το filepath και το obj τα παίρνουμε από το req.file που έχει δημιουργηθεί από το multer middleware
    const filePath = req.file.path; 
    console.log('File path:', filePath);
    
    //Όταν το readFile() τελειώσει: Αν όλα πήγαν καλά, αποθηκεύει το περιεχόμενο του αρχείου (σε μορφή Buffer) στη μεταβλητή data. Αυτός ο Buffer είναι το "raw binary" του αρχείου. Αν και το multer έχει ήδη αποθηκεύσει το αρχείο στο φάκελο uploads, εμείς εδώ το διαβάζουμε ξανά: 👉 για να το μετατρέψουμε σε binary δεδομένα,👉 ώστε να το αποθηκεύσουμε μέσα στη MongoDB (σε ένα document, όχι ως αρχείο στο δίσκο).
    // Συμαντικό: για να λειτουργήσει το fs.readFile() πρέπει να χρησιμοποιήσουμε την υπόσχεση (Promise) του fs.promises, όχι το απλό fs: επάνω στις δηλώσεις: const fs = require('fs').promises;
    const data = await fs.readFile(filePath); 
    console.log('data:', data);
    

    const obj = {
      name: req.body.name,
      desc: req.body.desc || '',
      file: {
        data,
        contentType: req.file.mimetype,
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        extension: path.extname(req.file.originalname).slice(1)        
      }
    };
    console.log('Upload object:', obj);
    
    // εδω με το uploadDao το στελνουμε στην mongo ή αποθήκευση ως αρχείο έχει γίνει ήδη απο τον multer middleware
    const saved = await uploadDao.createUpload(obj);

    // το res πρέπει να γίνει σε άλλη μορφή για να ταιριάζει με τις προυποθέσεις του editroJs
    res.status(200).json({
      success: 1,
      file: {
        url: `http://localhost:3001/uploads/${req.file.filename}`,
        name: saved.name,
        size: saved.file.size,
        type: saved.file.contentType,
        extension: saved.file.extension,
        filename: saved.file.filename
      },
    });
    // res.status(200).json({ message: 'image uploaded' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).send('Upload failed');
  }
};

module.exports = {
  renderUploadPage,
  uploadFile
};
```

#### backend\routes\upload.routes.js
```js
const express = require('express');
const router = express.Router();
const upload = require('../services/multer.service');
const uploadController = require('../controllers/upload.controller');

/**
 * @swagger
 * /api/uploads:
 *   get:
 *     summary: Get all uploaded files
 *     tags: [Uploads]
 *     responses:
 *       200:
 *         description: A list of uploaded files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Upload'
 *       500:
 *         description: Server error
 */
router.get('/', uploadController.renderUploadPage);

/**
 * @swagger
 * /api/uploads:
 *   post:
 *     summary: Upload a new file
 *     tags: [Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *               image:
 *                 type: file
 *                 format: binary
 *     responses:
 *       200:
 *         description: file uploaded successfully
 *       500:
 *         description: Upload failed
 */
router.post('/', upload.single('image'), uploadController.uploadFile);

module.exports = router;
```

## front
#### frontend\src\App.jsx
```jsx
            <Route 
              path="/uploads" 
              element={<UploadedFiles 
                backEndUrl={backEndUrl}
              />} 
            />
```

- προστέθηκε ένα ακόμα εργαλείο στο editor js
```bash
npm install @editorjs/attaches
```
#### frontend\src\hooks\useInitEditor.js
```js
import AttachesTool from '@editorjs/attaches';

          attaches: {
            class: AttachesTool,
            config: {
              endpoint: `${backEndUrl}/api/uploads`, 
              field: 'image', // ← keep same as multer config - that’s just the field name — it can still handle any file types as long as your multer config accepts them
              types: '.pdf,.doc,.docx,.txt,.zip',
              buttonText: 'Upload File',
              errorMessage: 'Upload failed'
            }
          },
```
- το οποίο θα πρέπει να γίνει και ρεντερ με ένα ακόμα if
#### frontend\src\components\RenderedEditorJsContent.jsx
```jsx
          if (block.type === 'attaches') {
            const { file, title } = block.data;
            const fileName = title || file?.name || file?.url?.split('/').pop(); // fallback to filename from URL

            return (
              <div key={index} className="my-2">
                file: <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {fileName}
                </a>
              </div>
            );
          }
```

#### frontend\src\pages\UploadedFiles.jsx
```jsx
import { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate  } from 'react-router-dom';

const UploadedFiles = ({ backEndUrl }) => {
  const [files, setFiles] = useState([])

  useEffect(() => {
    const getUploads = async () => {
      try {
        const res = await axios.get (`${backEndUrl}/api/uploads`)
        console.log(res)
        setFiles(res.data)
      } catch (err) {
        console.error('Error fetching uploads', err);
      }
    }
    getUploads()
  },[backEndUrl])
 
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/');
  }

  const getFileIconOrPreview = (file) => {
    const type = file.file?.contentType;

    if (type?.startsWith("image/")) {
      // ✅ Thumbnail preview for images
      return (
        <img
          src={`${backEndUrl}/uploads/${file.file.filename}`}
          alt={file.name || "image"}
          className="w-16 h-16 object-cover rounded border"
        />
      );
    } else if (type === "application/pdf") {
      return <span className="text-red-500 font-bold text-xl">📄 PDF</span>;
    } else if (type?.includes("word")) {
      return <span className="text-blue-500 font-bold text-xl">📝 Word</span>;
    } else if (type === "text/plain") {
      return <span className="text-gray-700 font-bold text-xl">📃 TXT</span>;
    }
    return <span className="text-gray-500">📎 File</span>;
  };


  return (
    <>
      <button
        onClick={navigateToHome}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Home
      </button>

      <div className="p-4">
        <h1 className="text-xl mb-4">Uploaded Files</h1>

        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Preview</th>
              <th className="border border-gray-300 px-4 py-2">Filename</th>
              <th className="border border-gray-300 px-4 py-2">Link</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => {
              const fileUrl = `${backEndUrl}/uploads/${file.file?.filename}`;
              return (
                <tr key={file._id}>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {getFileIconOrPreview(file)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {file.name || file.file?.originalName || "Untitled"}
                    <br />
                    <small className="text-gray-600">
                      {file.file?.contentType}
                    </small>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 break-all">
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {fileUrl}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UploadedFiles
```
# delete post / delete file
### upload delete
#### backend\daos\upload.dao.js
```js
const deleteUpload = (uploadId) => {
  return Upload.findByIdAndDelete(uploadId);
};
```
#### backend\controllers\upload.controller.js
```js
const deleteUpload = async (req, res) => {
  try {
    const { id } = req.params;

    const upload = await uploadDao.deleteUpload(id);
    if (!upload) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Remove the file from disk (uploads folder)
    const filePath = path.join(__dirname, '..', 'uploads', upload.file.filename);
    await fs.unlink(filePath).catch(() => console.warn('File already deleted or missing'));

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};
```
#### backend\routes\upload.routes.js
```js
/**
 * @swagger
 * /api/uploads/{id}:
 *   delete:
 *     summary: Delete an uploaded file by ID
 *     tags: [Uploads]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The upload ID
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Failed to delete file
 */
router.delete('/:id', uploadController.deleteUpload);
```
#### frontend\src\pages\UploadedFiles.jsx
```jsx
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await axios.delete(`${backEndUrl}/api/uploads/${id}`);
      setFiles((prev) => prev.filter((file) => file._id !== id));
    } catch (err) {
      console.error("Error deleting file", err);
      alert("Failed to delete file.");
    }
  };

return (
  <td className="border border-gray-300 px-4 py-2 text-center">
    <button
      onClick={() => handleDelete(file._id)}
      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
    >
      Delete
    </button>
  </td>
)
```

### post delete
#### backend\daos\post.dao.js
```js
const deletePost = (postId) => {
  return Post.findByIdAndDelete(postId);
};
```
#### backend\controllers\post.controller.js
```js
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const deletedPost = await postDao.deletePost(postId);

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully', deletedPost });
  } catch (err) {
    console.error('Delete Post Error:', err);
    res.status(500).json({ error: 'Server error while deleting post' });
  }
};
```
#### backend\routes\post.routes.js
```js
/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.delete('/:postId', postController.deletePost);
```

#### frontend\src\pages\BlogPost.jsx
```jsx
  const deletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`${backEndUrl}/api/posts/${id}`);
        alert("Post deleted successfully.");
        navigate('/');
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete the post.");
      }
    }
  };

  return (
    <button
      onClick={deletePost}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Delete
    </button>
)
```

- homepage with subpages as btns
- subpage view
- protected page admin login

 


