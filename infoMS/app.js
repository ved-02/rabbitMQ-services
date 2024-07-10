const amqp = require("amqplib");

const config = require("./config");

const bindingKey = "Info";

async function consumeMessages() {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();

    await channel.assertExchange(config.rabbitMQ.exchangeName, 'direct');

    const q = await channel.assertQueue("InfoQueue");
    await channel.bindQueue(q.queue, config.rabbitMQ.exchangeName, bindingKey);

    await channel.consume(q.queue, (message)=>{
        const data = JSON.parse(message.content);
        console.log(data);

        channel.ack(message);
    })
}

consumeMessages();