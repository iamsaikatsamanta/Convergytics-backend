const express = require('express'),
      router = express.Router(),
      multer = require('multer');
const expensesController = require('../Controller/expensesController');
const authController = require('../Controller/auth');
const adminController = require('../Controller/admin');
const userAuth = require('../middleware/check-user-auth');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
    destination: (req,file,cb)=> {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid Mime Type");
        if (isValid) {
            error = null;
        }
        cb(error,'images/');
    },
    filename: (require, file,cb) =>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name+'-'+Date.now()+'.'+ext);
    }
});
 

router.get('/get-expenses-name', userAuth,expensesController.getAllExpanceName);
router.post('/save-expenses', userAuth,expensesController.saveExpances);
router.get('/get-all-expance/:groupId', userAuth,expensesController.getAllExpance);
router.post('/file-upload',  userAuth,multer({storage: storage}).single('image'),expensesController.fileUpload);
router.post('/approve', userAuth,expensesController.approve);
router.post('/paid', userAuth,expensesController.paid);
router.post('/register-user',authController.newUser);
router.post('/user-login',authController.loginUser);
router.post('/admin-login',authController.adminLogin);
router.get('/get-all-user', adminController.getAllUser);
router.get('/get-all-group', adminController.getAllGroupName);
router.get('/get-group-data/:id', adminController.getGroupDataById);
router.post('/create-group', adminController.createGroup);
router.post('/add-member', adminController.AddMember);
router.get('/get-all-payment', userAuth,expensesController.getAllPayment);
module.exports = router;
