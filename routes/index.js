const users = require('../services/dataBase/users')
const images = require('../services/dataBase/images')
const configApp = require('../configApp/configApp')

const {Router} = require('express');
const router = Router()
const generateToken = require('../public/generateToken')
const auth = require('../middleware/auth')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const multer = require("multer")
const upload = multer({dest: configApp.configApp.dirSaveImages})
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../public/swagger.json')

router.get('/', (req, res, next) => {
    res.render('index', {title: 'BackEnd'});
});

router.post('/register', async (req, res,) => {
    try {
        const {firstName, userEmail, userPassword} = req.body
        const candidate = await users.findUser(userEmail)

        if (candidate) {
            console.log(`Пользователь ${candidate.UserEmail} найден`)
            res.send('Пользователь с таким email уже существует')
        } else {
            const hashPassword = await bcrypt.hash(userPassword, 10)
            let response = await users.createUser(firstName, userEmail, hashPassword)
            if (response) {
                return res.status(200).json({
                    success: true,
                    message: "Ползователь создан"
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: "ошибка при создании пользователя"
                })
            }

        }
    } catch (e) {
        console.error((e.message).bgRed.black)

    }
})

router.post('/login', async (req, res) => {
    try {
        const {userEmail, userPassword} = req.body
        const candidate = await users.findUser(userEmail)
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

        const accessToken = generateToken.generateAccessToken(candidate)
        const refreshToken = generateToken.generateRefreshToken(accessToken)
        res.status(200).json({
            user: {
                userEmail: candidate.UserEmail,
                firstName: candidate.FirstName,
                levelOfAccess: candidate.LevelOfAccess
            },
            tokens: [
                accessToken,
                refreshToken
            ]
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
            const {path, filename} = i
            images.addImage(path, filename)
        })
        return res.status(201).json({
            success: true,
            message: "Файлы успешно добавлены"
        })
    } catch (e) {
        console.log(e)
        return res.status(404).json({
            success: false,
            message: "Ошибка загрузки файлов"
        })
    }
})

router.delete('/deleteImage', auth, async (req, res) => {
    try {
        for (const item of req.body) {
            const image = await images.findImage(item)
            await fs.unlink(image.Path, function (err) {
                if (err) throw err;
            })
            images.deleteImage(image.FileName)        }
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
       let image = await images.findImage(req.body.name)
        return res.status(200)
            .send(image)
    } catch (e) {
        console.log(e)
    }
})


router.get('/api-docs', swaggerUi.setup(swaggerDocument))


module.exports = router;
