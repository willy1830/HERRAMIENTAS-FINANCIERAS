export async function onRequest() {
    // Le ponemos una máscara al servidor para que las APIs no lo bloqueen
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
    };
    const cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

    let bcv = null;
    let binance = null;

    // OPCIÓN A: DolarApi (Búsqueda veloz)
    try {
        const [resBCV, resBin] = await Promise.all([
            fetch('https://ve.dolarapi.com/v1/dolares/oficial', { headers }),
            fetch('https://ve.dolarapi.com/v1/dolares/binance', { headers })
        ]);
        if (resBCV.ok && resBin.ok) {
            bcv = (await resBCV.json()).promedio;
            binance = (await resBin.json()).promedio;
        }
    } catch(e) { console.log("Fallo DolarApi local"); }

    // OPCIÓN B: PyDolarVenezuela (Si la Opción A falla, salta a esta)
    if (!bcv) {
        try {
            const resPy = await fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar', { headers });
            if (resPy.ok) {
                const data = await resPy.json();
                bcv = data.monitors.bcv.price;
                binance = data.monitors.binance.price;
            }
        } catch(e) { console.log("Fallo PyDolar local"); }
    }

    // Si logró conseguir los datos con cualquiera de las dos, los envía al portal
    if (bcv && binance) {
        return new Response(JSON.stringify({ bcv, binance }), { status: 200, headers: cors });
    }

    // Si ambas fallan, emite un error para que el frontend tome el control
    return new Response(JSON.stringify({ error: "Bloqueo total en el backend" }), { status: 500, headers: cors });
}
