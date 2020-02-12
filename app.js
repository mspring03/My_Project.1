const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./swagger.yaml');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(morgan('dev'));

app.set('jwt-secret', config.secretkey);

app.get('/', (req, res) => {
    res.send('Server open');
});

app.use((err, req, res, next) => {
  res.status(404).json({
    message: err.message,
  });
})

app.use('/api', require('./routes/api'));
app.use('/uploads', express.static('uploads/'));

app.listen(port, () => {
    console.log('server is running');
});

mongoose.connect(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', () => {
  console.error("err");
  connect();
});

db.once('open', () => {
  console.log('DB connected');
});