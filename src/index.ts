import amqplib from 'amqplib';
import axios from 'axios'; 

const initBroker = async () => {
    try {
        let connection = await amqplib.connect('amqp://3.229.81.220');
        let ch = await connection.createChannel();
    
       
        ch.consume('temperatura', async (msg: any) => {
            try {
                const datos_temperatura = JSON.parse(msg.content.toString());
                console.log('Datos de temperatura:', datos_temperatura);
                
              
                await enviarDatosAlServidor(datos_temperatura);
            } catch (error) {
                console.error('Error al enviar los datos de temperatura:', error);
            }

            ch.ack(msg);
        });

       
        ch.consume('humedad', async (msg: any) => {
            try {
                const datos_humedad = JSON.parse(msg.content.toString());
                console.log('Datos de humedad:', datos_humedad);
                
                
                await enviarDatosAlServidor(datos_humedad);
            } catch (error) {
                console.error('Error al enviar los datos de humedad:', error);
            }

            ch.ack(msg);
        });

       
        ch.consume('luz', async (msg: any) => {
            try {
                const datos_luz = JSON.parse(msg.content.toString());
                console.log('Datos de luz:', datos_luz);
                
                
                await enviarDatosAlServidor(datos_luz);
            } catch (error) {
                console.error('Error al enviar los datos de luz:', error);
            }

            ch.ack(msg);
        });

        console.log('El broker ha iniciado correctamente');
    } catch (error) {
        console.log('Hubo un error al iniciar el broker', error);
    }
}

const enviarDatosAlServidor = async (datos: any) => {
    try {
        const { temperatura, luz, humedad } = datos;
        const data = {
            temperatura,
            luz,
            humedad
        };
        const response = await axios.post('http://localhost:3000/racimos', data);
        console.log('Respuesta de la API:', response.data);
    } catch (error) {
        console.error('Error al enviar los datos a la API:', error);
    }
}

initBroker();
