const {Router} = require('express');
const crypto = require('crypto')
const router = Router()
const generateToken = require('../public/generateToken')
const auth = require('../middleware/auth')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const User = require('../models/users')
const Image = require('../models/image')
const multer = require("multer")
const upload = multer({dest: 'uploads/'})
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../public/swagger.json')

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {title: 'BackEnd'});
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if (!candidate) {
            return res.status(404).json({
                error: true,
                message: "Неправильный email или пароль"
            })
        }
        bcrypt.compare(password, candidate.password, function (err, valid) {
            if (!valid) {
                return res.status(404).json({
                    error: true,
                    message: "Неправильный email или пароль"
                })
            }
        })
        const token = generateToken(candidate)
        res.status(200).json({
            user: candidate,
            token
        })

    } catch (e) {
        console.log(e)
    }
})

router.post('/loadImage', auth, upload.array('image_save', 30), async function (req, res, next) {
    try {
        await req.files.forEach((i) => {
            console.log(i)
            const {originalname, path, filename,} = i
            const newImage = new Image({originalname, path, filename})
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
            const image = await Image.findOne({filename: item})
            await fs.unlink(image.path, function (err) {
                if (err) throw err;
            })
            await Image.deleteOne({filename: item})
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
        Image.paginate({}, options, (err, result) => {
            if (err) {
                console.log(err)
            }
            return res.status(200)
                .send(result)
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/register', async (req, res,) => {
    try {
        const {name, email, password} = req.body
        const candidate = await User.findOne({email})
        if (candidate) {
            console.log('Пользователь найден:' + candidate)
            res.send('Пользователь с таким email уже существует')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({name, email, password: hashPassword})

            await user.save()
            console.log('Пользователь создан:')
            res.send('Пользователь создан')
        }
    } catch (e) {
        console.log(e)
    }
})

router.get('/api-docs', swaggerUi.setup(swaggerDocument))



module.exports = router;
