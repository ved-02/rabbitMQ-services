const amqplib = require("amqplib");
const config = require("./config");

class Producer {
    channel;
    async createChannel() {
        try {
            const connection = await amqplib.connect(config.rabbitMQ.url);
            this.channel = await connection.createChannel();
        }
        catch (error) {
            console.log("error in createChannel Function");
            console.log(error);
            throw error;
        }
    }
    async publishMessage(routingKey, message) {
        try {
            const exchangeName = config.rabbitMQ.exchangeName;
            const logDetails = {
                logType: routingKey,
                message: message,
                dateTime: new Date()
            };

            if (!this.channel) {
                await this.createChannel();
            }
            await this.channel.assertExchange(exchangeName, "direct");
            await this.channel.publish(exchangeName,
                routingKey,
                Buffer.from(JSON.stringify(logDetails))
            );
            console.log(`The Message "${message}" of log type ${routingKey} is sent to exchange "${exchangeName}"`);
        } catch (error) {
            console.log("error in publishMessage function");
            console.log(error);
            throw error;
        }
    }
};

module.exports = Producer;