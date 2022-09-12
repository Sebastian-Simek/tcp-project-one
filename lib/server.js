import net from 'net';
import chalk from 'chalk'

const serverLog = (...args) => console.log(chalk.cyan('[server]'), ...args);

export const serve = (host, port) => {

    const server = net.createServer((socket) => {
        serverLog('A peer connected!')
        socket.on('data', (data) => {
            const dataStr = data.toString();
            serverLog('Data received:', dataStr)

            const lines = dataStr.split('\n');
            const startLine = lines[0];
            const [ method, path, ] = startLine.split(' ');
            if(method == 'GET' && path == '/') {
                const body = `<html>
                <main>
                <h1>I hope this works blog</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                </main>
                </html>`;
                socket.write(`HTTP/1.1 200 Ok 
Content-Length: ${body.length}

${body}`
                        )
            } else if (method == 'GET' && path == '/jsonData') {
                const jsonObject = { name: 'Gala', state: 'Washington', tastingNotes: ['Sweet', 'Mealy'] }
                socket.write(`HTTP/1.1 200 Ok
Content-Length: ${JSON.stringify(jsonObject.length)}
Content-Type: application/json

${JSON.stringify(jsonObject)}`
                
                )
            } 
            else {
                socket.write(dataStr.toUpperCase())
            }
        });
        socket.on('end', () => {
            serverLog('this message on line 34');
        });
        socket.on('error', (err) => {
            serverLog('error', err);
        });
    });
    server.listen(port, host, () => {
        serverLog('My server is up');
    });
    serverLog('Attempting to start a server');
    return server;
}