const express = require('express')
const { createListing, upload_files, deleteListing, updateListing, getListing, getListings} = require('../controllers/listingControllers')
const router = express.Router()
const multer  = require('multer')
const upload = multer({ storage: multer.diskStorage({}) });


router.post('/create', createListing)
router.post('/upload-files', upload.array('files'), upload_files)
router.delete('/delete/:id', deleteListing)
router.post('/update/:id', updateListing)
router.get('/get/:id', getListing)
router.get('/get', getListings)


module.exports = router