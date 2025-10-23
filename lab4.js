const {program} = require('commander');
const http = require('http');
const fs=require('fs');
const fsp=fs.promises
const xml= require('fast-xml-parser');
const url=require('url');
program

.requiredOption('-i, --input <path>', 'Введіть шлях до файлу')
.requiredOption('-h, --host <host>', 'Адреса сервера')
.requiredOption('-p, --port <port>', 'Порт сервера');

program.configureOutput({
outputError: (str, write) => {
 }
});

program.exitOverride();
const options= program.opts();

try{
program.parse();

}
catch(err){
if (err.code === 'commander.missingMandatoryOptionValue') {
    console.error("Please write required argument")
  }
  else if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
 }
 else console.error(err.message)
}

const host = options.host;
const port = options.port;
const builder=new xml.XMLBuilder();

const requestListener=async function(req,res){
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;

    const furnished = query.furnished === "true";
    const maxPrice = query.max_price ? parseFloat(query.max_price) : null;

    const content = await fsp.readFile(options.input, 'utf-8');
    const data = JSON.parse(content);

    let filteredData = data;
    if (furnished) {
        filteredData = filteredData.filter(house => house.furnishingstatus === 'furnished');
    }
    if (maxPrice != null) {
        filteredData = filteredData.filter(house => house.price <= maxPrice);
    }

    const outputData = filteredData.map(house => ({
        price: house.price,
        area: house.area,
        furnishingstatus: house.furnishingstatus
    }));

    const xmlObject = { houses: { house: outputData } };
    const xmlData = builder.build(xmlObject); 

    res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
    res.end(xmlData);
};

const server = http.createServer(requestListener);

server.listen(port,host, ()=>{
    console.log(`Server is runnig on http://${host}:${port}`);
});


