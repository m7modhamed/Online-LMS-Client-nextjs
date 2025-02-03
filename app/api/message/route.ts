export async function GET() {
    return new Response(JSON.stringify({ message: 'Hello, Mahmoud' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
    });
}