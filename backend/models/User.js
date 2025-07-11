const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'E-posta adresi zorunludur.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Geçerli bir e-posta adresi giriniz.']
  },
  password: {
    type: String,
    required: [true, 'Şifre zorunludur.'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır.'],
    select: false // kullanıcı bilgisi sorgulanırken default olarak password dönmez
  }
}, {
  timestamps: true,
  versionKey: false
})

module.exports = mongoose.model('User', UserSchema)
