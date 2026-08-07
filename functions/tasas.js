export async function onRequest() {
    try {
        // Usamos PyDolarVenezuela, que no bloquea las IPs de los servidores de Cloudflare
        const respuesta = await fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar');
        
        if (!respuesta.ok) {
            throw new Error('Error de conexión con la API externa');
        }

        const datos = await respuesta.json();

        // Empaquetamos los datos limpios
        const tasas = {
            bcv: datos.monitors.bcv.price,
            binance: datos.monitors.binance.price
        };

        // Se los enviamos a tu portal web
        return new Response(JSON.stringify(tasas), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        // Devolvemos el error detallado para que el frontend lo procese
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
