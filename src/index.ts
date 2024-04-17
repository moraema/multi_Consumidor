import amqplib from 'amqplib';
import axios from 'axios'; 

const initBroker = async () => {
    try {
        let connection = await amqplib.connect('amqp://3.229.81.220');
        let ch = await connection.createChannel();
    
        ch.consume('calidad', async (msg: any) => {
            try {
                // Deserializar el mensaje JSON recibido del broker
                const datos = JSON.parse(msg.content.toString());
                console.log('Datos recibidos:', datos);

                // Extraer los valores de temperatura, luz y humedad
                const { temperatura, luz, humedad } = datos;

                // Enviar los datos a la API REST como un objeto con los atributos separados
                const response = await axios.post('http://localhost:3000/racimos', { 
                    temperatura,
                    luz,
                    humedad
                });

                console.log('Respuesta de la API:', response.data);
            } catch (error) {
                console.error('Error al enviar los datos a la API:', error);
            }

            ch.ack(msg);
        });

        console.log('El broker ha iniciado correctamente');
    } catch (error) {
        console.log('Hubo un error al iniciar el broker', error);
    }
}

initBroker();
