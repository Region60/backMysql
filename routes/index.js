const dataBase = require('../public/dataBase')

const {Router} = require('express');
const router = Router()
const generateToken = require('../public/generateToken')
const auth = require('../middleware/auth')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const multer = require("multer")
const upload = multer({dest: 'uploads/'})
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../public/swagger.json')
/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {title: 'BackEnd'});
});

router.post('/register', async (req, res,) => {
    try {
        const {firstName, userEmail, userPassword} = req.body
        const candidate = await dataBase.findUser(userEmail)

        if (candidate) {
            console.log(`Пользователь ${candidate.UserEmail} найден` )
            res.send('Пользователь с таким email уже существует')
        } else {
            const hashPassword = await bcrypt.hash(userPassword, 10)
            dataBase.createUser(firstName, userEmail, hashPassword)
            return res.status(200).json({
                success: true,
                message: "Ползователь создан"
            })
        }
    } catch (e) {
        console.log(e)
    }
})

router.post('/login', async (req, res) => {
    try {
        const {userEmail, userPassword} = req.body
        const candidate = await dataBase.findUser(userEmail)
        //console.log(candidate)
        if (!candidate) {
            return res.status(404).json({
                error: true,
                message: "пользователь с таким электронным адресом не найден"
            })
        }
        bcrypt.compare(userPassword, candidate.UserPassword, function (err, valid) {
            if (!valid) {
                return res.status(404).json({
                    error: true,
                    message: "Неправильный email или пароль"
                })
            }
        })
        const token = generateToken.generateAccessToken(candidate)
        res.status(200).json({
            user:{
                userEmail:candidate.UserEmail,
                firstName:candidate.FirstName,
                levelOfAccess:candidate.LevelOfAccess
            },
            token
        })

    } catch (e) {
        console.log(e)
    }
})

router.get('/testJwt', auth, async function (req, res) {
    try {
        return res.status(201).json({
            success: true,
            message: "Its work"
        })
    } catch (e) {
        console.log(e.blue)
        return res.status(404).json({
            success: true,
            message: "Dont work".bgMagenta
        })
    }
})

router.post('/loadImage', auth, upload.array('image_save', 30), async function (req, res) {
    try {
        await req.files.forEach((i) => {
            console.log(i)
            const {originalname, path, filename,} = i
            //const newImage = new Image({originalname, path, filename})
            newImage.save()
        })
        return res.status(201).json({
            success: true,
            message: "Файлы успешно добавлены"
        })
    } catch (e) {
        console.log(e)
        return res.status(404).json({
            success: true,
            message: "Ошибка загрузки файлов"
        })
    }
})

router.delete('/deleteImage', auth, async (req, res) => {
    try {
        for (const item of req.body) {
            //const image = await Image.findOne({filename: item})
            await fs.unlink(image.path, function (err) {
                if (err) throw err;
            })
            //await Image.deleteOne({filename: item})
        }
        console.log('file deleted');
        return res.status(202).json({
            success: true,
            message: "Файлы успешно удалены"
        })

    } catch (e) {
        console.log(e)
        return res.status(404).json({
            success: true,
            message: "Ошибка удаления файла(ов)"
        })
    }

})

router.get('/getImage', async (req, res) => {

    try {
        console.log(req.body)
        const options = {
            page: req.body.page,
            limit: req.body.quanity,
            collation: {
                locale: 'en',
            },
        };
        /*Image.paginate({}, options, (err, result) => {
            if (err) {
                console.log(err)
            }
            return res.status(200)
                .send(result)
        })*/
    } catch (e) {
        console.log(e)
    }
})


router.get('/api-docs', swaggerUi.setup(swaggerDocument))


module.exports = router;
