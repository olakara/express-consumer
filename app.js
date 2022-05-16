const express = require('express');
const amqplib = require('amqplib');
const chalk = require('chalk');
const debug = require('debug')('app:express-consumer');
const morgan = require('morgan');

const PORT = process.env.PORT || 9000;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();

app.use(morgan('short'));

app.use(express.json());

let channel = null;
let connection = null;
const queue = 'hello';

connect()

async function connect() {
  try {
    const amqpServer = 'amqp://localhost:5672'
    connection = await amqplib.connect(amqpServer)
    channel = await connection.createChannel()

    await channel.assertQueue(queue, {
        durable: false
    });
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    
    await channel.consume('hello', function (msg) {
        let message = JSON.parse(msg.content);
        const finalMessage = JSON.stringify(message);
        console.log( chalk.green("[x]") + " Received : ", require('util').inspect(finalMessage, {colors:true, depth:2}));
    }, {
        noAck: true,
    });

  } catch (error) {
    console.log(error)
  }
}


// App status
app.get('/', (req, res) => {
    res.send('ok')
});

app.listen(PORT, HOST, () => {
    console.log('Listening on port: ' + chalk.green(PORT));
});