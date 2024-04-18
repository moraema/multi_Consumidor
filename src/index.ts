import amqplib from 'amqplib';
import axios from 'axios'; 

const initBroker = async () => {
    try {
        let connection = await amqplib.connect('amqp://3.229.81.220');
        let ch = await connection.createChannel();
    
        ch.consume('calidad', async (msg: any) => {
            try {
                const datos = JSON.parse(msg.content.toString());
                console.log('Datos recibidos:', datos);

            
                const { temperatura_C, luz, humedad, distancia } = datos;
                const datosParaBD = {
                    temperatura: temperatura_C,
                    luz: luz,
                    humedad: humedad,
                    distancia: distancia
                };

                // Enviar los datos a la API
                const response = await axios.post('http://3.215.18.246:3000/racimos', datosParaBD);
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
