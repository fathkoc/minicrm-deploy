const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Not metni zorunludur.'],
    trim: true,
    maxlength: [1000, 'Not en fazla 1000 karakter olabilir.']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { _id: true }) 

const CustomerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Kullanıcı ID zorunludur.']
  },
  name: {
    type: String,
    required: [true, 'İsim zorunludur.'],
    trim: true,
    minlength: [2, 'İsim en az 2 karakter olmalıdır.'],
    maxlength: [100, 'İsim en fazla 100 karakter olabilir.']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Geçerli bir e-posta adresi giriniz.']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Telefon numarası en fazla 20 karakter olabilir.']
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function (arr) {
        return arr.every(tag => typeof tag === 'string')
      },
      message: 'Etiketler yalnızca metin olmalıdır.'
    }
  },
  notes: {
    type: [NoteSchema],
    default: []
  }
}, {
  timestamps: true,
  versionKey: false 
})


CustomerSchema.index({ name: 'text', tags: 1 })

module.exports = mongoose.model('Customer', CustomerSchema)
