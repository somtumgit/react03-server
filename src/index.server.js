const express = require('express');
const env = require('dotenv');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// enviroment variable
env.config();

// Access-Control-Allow-Origin จาก react port 4000 ไปยัง route express port 2000
app.use(cors());
// เมื่อมีการส่ง post ข้อมูล
// app.use(bodyParser());
app.use(express.json());
// กำหนด custom path
app.use('/public',express.static(path.join(__dirname, `uploads`)));

// connect mongodb
// mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@127.0.0.1:27017/${process.env.MONGO_DB_DATABASE}?readPreference=primary&appname=MongoDB%20Compass&ssl=false
// mongodb+srv://root:ukIOqtu6pVfnfsV7@react03.xevdynk.mongodb.net/?retryWrites=true&w=majority
// mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority
// mongodb+srv://root:ukIOqtu6pVfnfsV7@react03.xevdynk.mongodb.net/react03?retryWrites=true&w=majority
// mongodb://127.0.0.1:27017/${process.env.MONGO_DB_DATABASE}?readPreference=primary&appname=MongoDB%20Compass&ssl=false

mongoose.connect(`mongodb+srv://root:ukIOqtu6pVfnfsV7@react03.xevdynk.mongodb.net/react03?retryWrites=true&w=majority`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  // useCreateIndex: true, //make this true
  autoIndex: true, //make this also true
}).then(function() {
    console.log(`Database connected to ${process.env.MONGODB_URL}`);
});

// route
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const initialDataRoutes = require('./routes/admin/initialData');
const pageRoutes = require('./routes/admin/page');
const userAddressRoutes = require('./routes/address');
const orderRoutes = require('./routes/order');
const orderAdminRoutes = require('./routes/admin/order');

app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', initialDataRoutes);
app.use('/api', pageRoutes);
app.use('/api', userAddressRoutes);
app.use('/api', orderRoutes);
app.use('/api', orderAdminRoutes);

// app.get('/', function(req, res, next) {
//     res.status(200).json({
//         message: 'Hello form Server',
//     });
// });

// app.post('/data', function(req, res, next) {
//     res.status(200).json({
//         message: req.body,
//     });
// });

app.listen(process.env.PORT, function() {
    console.log(`Server is running on port ${process.env.PORT}`);
});