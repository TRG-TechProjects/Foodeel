const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer'); 


const upload = multer({
    storage: multer.memoryStorage(),
})


/* POST: /api/food/ [protected] */
router.post('/', 
    authMiddleware.authFoodPartnerMiddleware, 
    upload.single("video"), 
    foodController.createFood
);


/* GET: /api/food/ [protected] */
router.get('/', 
    authMiddleware.authUserMiddleware, 
    foodController.getFoodItems
);


router.post('/like', 
    authMiddleware.authUserMiddleware, 
    foodController.likeFood
);


router.post('/save',
    authMiddleware.authUserMiddleware, 
    foodController.saveFood
);


router.get('/save',
    authMiddleware.authUserMiddleware,
    foodController.getSaveFood
)



module.exports = router;