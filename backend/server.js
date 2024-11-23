const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const sanitizedName = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, sanitizedName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === '.docx') {
      cb(null, true);
    } else {
      cb(new Error('Only .docx files are allowed'));
    }
  },
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

async function encryptPDF(inputPath, outputPath, password) {
  return new Promise((resolve, reject) => {
    const command = `qpdf --encrypt "${password}" "${password}" 256 -- "${inputPath}" "${outputPath}"`;
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error('qpdf encryption error:', stderr);
        reject(new Error('PDF encryption failed'));
      } else {
        resolve(true);
      }
    });
  });
}

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const inputFilePath = path.join(__dirname, 'uploads', req.file.filename);
  const outputDir = path.join(__dirname, 'uploads');
  const inputFileName = path.basename(req.file.filename, path.extname(req.file.filename));

  const usePassword = req.body.usePassword === 'true';
  const password = req.body.password;

  if (usePassword && (!password || password.length < 4)) {
    return res.status(400).json({ error: 'Password must be at least 4 characters long' });
  }

  try {
    const libreCommand = `libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${inputFilePath}"`;
    await new Promise((resolve, reject) => {
      exec(libreCommand, (err, stdout, stderr) => {
        if (err) reject(err);
        else resolve({ stdout, stderr });
      });
    });

    const pdfFileName = inputFileName + '.pdf';
    const pdfPath = path.join(outputDir, pdfFileName);

    try {
      await fs.access(pdfPath);
    } catch (error) {
      throw new Error('PDF conversion failed - output file not found');
    }

    let finalPdfPath = pdfPath;

    if (usePassword && password) {
      const protectedFileName = `protected_${pdfFileName}`;
      finalPdfPath = path.join(outputDir, protectedFileName);

      try {
        await encryptPDF(pdfPath, finalPdfPath, password);
        await fs.unlink(pdfPath);
      } catch (encryptError) {
        console.error('Encryption error:', encryptError);
        throw new Error('Failed to encrypt PDF');
      }
    }

    await fs.unlink(inputFilePath);

    res.json({
      metadata: {
        originalName: req.file.originalname,
        convertedName: path.basename(finalPdfPath),
        downloadLink: `/download/${path.basename(finalPdfPath)}`,
        isProtected: usePassword,
      },
    });
  } catch (error) {
    console.error('Conversion error:', error);
    try {
      await fs.unlink(inputFilePath);
    } catch (e) {
      console.error('Cleanup error:', e);
    }
    res.status(500).json({
      error: 'Conversion process failed',
      details: error.message,
    });
  }
});

// New route to handle file download
app.get('/download/:filename', async (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', fileName);

  try {
    await fs.access(filePath);
    res.download(filePath, fileName, (err) => {
      if (err) {
        res.status(500).send('Failed to download file');
      }
    });
  } catch (err) {
    res.status(404).send('File not found');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
