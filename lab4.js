const {program} = require('commander');
const http = require('http');
const fs=require('fs');

program

.requiredOption('-i, --input <path>', 'Введіть шлях до файлу')
.requiredOption('-h, --host <host>', 'Адреса сервера')
.requiredOption('-p, --port <port>', 'Порт сервера');

program.configureOutput({
outputError: (str, write) => {
 }
});

try{
program.parse();
}
catch(err){
if (err.code ==='commander.optionMissingArgument') {
    console.error("Please write required argument")
  }
  else if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
 }
}
const options= program.opts();

const host = options.host;
const port = options.port;

const requestListener= function(req,res){
    res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});
    res.end("Сервер працює")
};

const server = http.createServer(requestListener);

server.listen(port,host, ()=>{
    console.log(`Server is runnig on http://${host}:${port}`);
});
