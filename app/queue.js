const RedisSMQ = require("rsmq");
const rsmq = new RedisSMQ({
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379, ns: "rsmq"
})

rsmq.createQueue({ qname: 'webhook-queue'}, (err, resp) => {
  if (resp === 1) console.log('queue created');
});

module.exports = rsmq
