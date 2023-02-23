export default () => ({
    protocol: process.env.MQTT_PROTOCOL ?? 'tcp',
    host: process.env.MQTT_HOST ?? 'localhost',
    port: process.env.MQTT_PORT ?? 1883,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
});
