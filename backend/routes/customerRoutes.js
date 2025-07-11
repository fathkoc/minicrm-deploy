const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const Customer = require('../models/Customer')
const authMiddleware = require('../middleware/authMiddleware')


const validateCustomer = [
  body('name').notEmpty().withMessage('İsim gerekli'),
  body('email').optional().isEmail().withMessage('Geçerli e-posta giriniz'),
  body('tags').optional().isArray().withMessage('Etiketler dizi olmalı')
]

// Müşteri Listele
router.get('/', authMiddleware, async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(customers)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Sunucu hatası' })
  }
})

// Müşteri Ekle
router.post('/', authMiddleware, validateCustomer, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  try {
    const newCustomer = new Customer({ ...req.body, userId: req.user.id })
    await newCustomer.save()
    res.status(201).json(newCustomer)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Sunucu hatası' })
  }
})

// Müşteri Güncelle
router.put('/:id', authMiddleware, validateCustomer, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  try {
    const updated = await Customer.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    )
    if (!updated) return res.status(404).json({ msg: 'Müşteri bulunamadı' })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Sunucu hatası' })
  }
})

// Müşteri Sil
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Customer.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!deleted) return res.status(404).json({ msg: 'Müşteri bulunamadı' })
    res.json({ msg: 'Silindi' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Sunucu hatası' })
  }
})

// Not Ekle
router.post('/:id/notes', authMiddleware, body('text').notEmpty().withMessage('Not açıklaması gerekli'), async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  try {
    const customer = await Customer.findOne({ _id: req.params.id, userId: req.user.id })
    if (!customer) return res.status(404).json({ msg: 'Müşteri bulunamadı' })

    customer.notes.push({ text: req.body.text, date: req.body.date || new Date() })
    await customer.save()
    res.status(201).json(customer.notes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Sunucu hatası' })
  }
})

// Not Güncelle
router.put('/:customerId/notes/:noteId', authMiddleware, body('text').notEmpty().withMessage('Not açıklaması gerekli'), async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  try {
    const customer = await Customer.findOne({ _id: req.params.customerId, userId: req.user.id })
    if (!customer) return res.status(404).json({ msg: 'Müşteri bulunamadı' })

    const note = customer.notes.id(req.params.noteId)
    if (!note) return res.status(404).json({ msg: 'Not bulunamadı' })

    note.text = req.body.text
    note.date = req.body.date || note.date

    await customer.save()
    res.json(note)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Sunucu hatası' })
  }
})

// Not Sil
router.delete('/:customerId/notes/:noteId', authMiddleware, async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.customerId, userId: req.user.id })
    if (!customer) return res.status(404).json({ msg: 'Müşteri bulunamadı' })

    const note = customer.notes.id(req.params.noteId)
    if (!note) return res.status(404).json({ msg: 'Not bulunamadı' })

    customer.notes.pull(note._id)
    await customer.save()
    res.json({ msg: 'Not silindi' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Sunucu hatası' })
  }
})

// Müşteri Detay Getir
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, userId: req.user.id })
    if (!customer) return res.status(404).json({ msg: 'Müşteri bulunamadı' })
    res.json(customer)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Sunucu hatası' })
  }
})

module.exports = router
