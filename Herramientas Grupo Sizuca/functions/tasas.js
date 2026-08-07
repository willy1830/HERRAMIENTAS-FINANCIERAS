export async function onRequest() {
    try {
        // El servidor de Cloudflare hace la búsqueda (cero bloqueos de CANTV/Inter o navegadores)
        const [resBCV, resBinance] = await Promise.all([
            fetch('https://ve.dolarapi.com/v1/dolares/oficial'),
            fetch('https://ve.dolarapi.com/v1/dolares/binance')
        ]);

        const dataBCV = await resBCV.json();
        const dataBinance = await resBinance.json();

        // Empaquetamos los datos limpios
        const tasas = {
            bcv: dataBCV.promedio,
            binance: dataBinance.promedio
        };

        // Se los enviamos a tu portal web
        return new Response(JSON.stringify(tasas), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "No se pudieron obtener las tasas" }), { status: 500 });
    }
}