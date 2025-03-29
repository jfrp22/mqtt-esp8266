// Configuración MQTT
const brokerUrl = "wss://test.mosquitto.org:8081/mqtt";
const topic = "casa/led";

// Elementos del DOM
const connectionStatus = document.getElementById("connection-status");
const mqttStatus = document.getElementById("mqtt-status");
const lastMessage = document.getElementById("last-message");
const btnOn = document.getElementById("btn-on");
const btnOff = document.getElementById("btn-off");

// Conexión MQTT
const client = mqtt.connect(brokerUrl, {
    clientId: "web_" + Math.random().toString(16).substr(2, 8),
    clean: true
});

// Eventos de conexión
client.on("connect", () => {
    connectionStatus.textContent = "Conectado";
    connectionStatus.classList.remove("disconnected");
    connectionStatus.classList.add("connected");
    mqttStatus.textContent = `Conectado a ${brokerUrl}`;
    console.log("✅ Conectado al broker MQTT");
});

client.on("error", (err) => {
    connectionStatus.textContent = "Error de conexión";
    mqttStatus.textContent = `Error: ${err.message}`;
    console.error("❌ Error MQTT:", err);
});

// Función para enviar comandos
function sendCommand(message) {
    client.publish(topic, message, { qos: 1 }, (err) => {
        if (!err) {
            lastMessage.textContent = `Último comando: ${message} (${new Date().toLocaleTimeString()})`;
            updateButtonStates(message);
            console.log(`📤 Enviado: ${message}`);
        }
    });
}

// Actualizar estado visual de los botones
function updateButtonStates(activeCommand) {
    if (activeCommand === "on") {
        btnOn.classList.add("active");
        btnOff.classList.remove("active");
    } else {
        btnOn.classList.remove("active");
        btnOff.classList.add("active");
    }
}
