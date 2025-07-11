const mongoose = require('mongoose')
const app = require('./app')

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB bağlantısı başarılı')
    app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`))
  })
  .catch((err) => console.error('MongoDB bağlantı hatası:', err))
