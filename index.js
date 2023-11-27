const amqplib = require('amqplib');
const { RABBITMQ_URL } = require('./config');

(async () => {
  const queue = 'tasks';
  const queue1 = "new-task";
  const conn = await amqplib.connect(RABBITMQ_URL);
  conn.on('error', (e) => {
    console.log('---CLOSING---', e)
  })

  const ch1 = await conn.createChannel();
  const ch11 = await conn.createChannel();
  await ch1.assertQueue(queue);
  await ch1.assertQueue(queue1);

  // Listener
  ch1.consume(queue, (msg) => {
    if (msg !== null) {
      console.log('Recieved:', msg.content.toString());
      ch1.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });

  ch1.consume(queue1, (msg) => {
    if (msg !== null) {
      console.log('Recieved1:', msg.content.toString());
      ch1.ack(msg);
      // ch11.ack(msg);
    } else {
      console.log('Consumer1 cancelled by server');
    }
  });

  // Sender
  const ch2 = await conn.createChannel();

  setInterval(() => {
    ch2.sendToQueue(queue, Buffer.from('something to do'));
  }, 1000);
  setInterval(() => {
    ch2.sendToQueue(queue1, Buffer.from('something to do1'));
  }, 1000);
})();

// (async () => {
//   const connection = await amqplib.connect(RABBITMQ_URL);
//   connection.on('error', (err) => {
//     console.log('Connection Error', err);
//   })
//   connection.on('close', (err) => {
//     console.log('Connection Closed', err);
//   })

//   const channel = await connection.createChannel();
//   channel.consume('TestQueue', (message) => {
//     console.log({ message });
//   })

//   channel.on('error', (err) => {
//     console.log('Channel Error', err);
//   })
//   channel.on('close', (err) => {
//     console.log('Channel Closed', err);
//   })
// });
// class Connect {
//   constructor() {

//   }
// }