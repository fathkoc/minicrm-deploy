const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const validateEmail = (email) =>
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const validatePassword = (password) =>
  typeof password === 'string' && password.length >= 6

exports.register = async (req, res) => {
  const { email, password } = req.body

  if (!validateEmail(email)) {
    return res.status(400).json({ msg: 'Geçerli bir e-posta girin.' })
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ msg: 'Şifre en az 6 karakter olmalı.' })
  }

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ msg: 'Bu e-posta zaten kayıtlı.' })
    }

    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS) || 10)
    const user = new User({ email, password: hashedPassword })
    await user.save()

    return res.status(201).json({ msg: 'Kayıt başarılı.' })
  } catch (error) {
    console.error('[Register Error]', error)
    return res.status(500).json({ msg: 'Sunucu hatası.' })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  if (!validateEmail(email) || !validatePassword(password)) {
    return res.status(400).json({ msg: 'Geçersiz giriş bilgileri.' })
  }

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ msg: 'Kullanıcı bulunamadı.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ msg: 'Şifre hatalı.' })
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2d' }
    )

    return res.json({ token })
  } catch (error) {
    console.error('[Login Error]', error)
    return res.status(500).json({ msg: 'Sunucu hatası.' })
  }
}
