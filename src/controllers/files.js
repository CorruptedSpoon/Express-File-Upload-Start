const e = require('express');
const File = require('../models/filestore.js');

const uploadPage = (req, res) => {
  res.render('upload');
};

const uploadFile = async (req, res) => {
  if(!req.files || Object.keys(req.files).length === 0){
    return res.status(400).json({error: 'No files were uploaded.'});
  }

  const { sampleFile } = req.files;

  try {
    const newFile = new File(sampleFile);
    const doc = await newFile.save();
    return res.status(201).json({
      messsage: 'File stored successfully',
      fileId: doc._id,
    });
  } catch(err) {
    console.log(err);
    return res.status(400).json({error: 'Error uploading file'});
  }
};

const retrieveFile = async (req, res) => {
  if(!req.query._id) {
    return res.status(400).json({error: 'Missing file ID'});
  }

  let doc;
  try {
    doc = await File.findById(req.query._id).exec();
  } catch(err) {
    console.log(err);
    return res.status(400).json({error: 'Error retrieving file'});
  }

  if(!doc) {
    return res.status(404).json({error: 'No file found'});
  }

  res.set({
    'Content-Type': doc.mimetype,
    'Content-Length': doc.size,
    'Content-Disposition': `attachment; filenam="${doc.name}"`,
  });

  return res.send(doc.data);
};

module.exports = {
  uploadPage,
  uploadFile,
  retrieveFile
}