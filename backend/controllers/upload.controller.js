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
