const RedisSMQ = require("rsmq");
const rsmq = new RedisSMQ({
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379, ns: "rsmq"
})

setInterval( () => rsmq.receiveMessage({
    qname: 'webhook-queue',
  }, (err, resp) => {
    if (!resp || !resp.id) return;
    console.log('Message received.', resp);

 
  // Do long logic here

  rsmq.deleteMessage({qname: 'webhook-queue', id: resp.id}, function (err, resp) {
    if (resp===1) {
      console.log("Message deleted.")	
    }
    else {
      console.log("Message not found.")
    }})
}), 200);
