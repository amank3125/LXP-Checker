exports.handler = async function(event, context) {
const addr = event.queryStringParameters && event.queryStringParameters.addr;
const secret = process.env.lineaKey;
    try {
        const { default: fetch } = await import('node-fetch');
        const response = await fetch(`https://api.lineascan.build/api?module=account&action=tokentx&contractaddress=0xd83af4fbD77f3AB65C3B1Dc4B38D7e67AEcf599A&address=${encodeURIComponent(addr)}&page=1&offset=1000&startblock=0&endblock=270257800&sort=desc&apikey=${secret}`);
        const data = await response.json();
    return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
        }}
    catch (err) {
        console.error('Error fetching data:', err);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to fetch data' }),
        }}
}