/**
 * This is a Sample Application that when deployed will distract Kyle and get him off my back.
 * One night when I was, let's just say "on a higher plane", I built the Rental Return Processor Code in Python
 * I used this application as a blog platform to take notes on what I was doing so that I can deploy the Python Code later.
 * Once this application is deployed, I can follow my own instructions by accessing the web page served by this app.
 * I remember making it easy for myself. The automatic code pipeline has already been set up, I just need to make us of it.
 */
const express = require('express');
const app = express();
const http = require('http');
const paperAddress = require('faker');

app.set('views', './html');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/strapdown'));


app.get('/', function (req, res) {

    http.get('http://169.254.169.254/latest/meta-data/iam/info/', (resp) => {
        const { statusCode } = resp;
        const aes256 = require('aes256');
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            let paperboy = JSON.parse(data).InstanceProfileArn.match(/:([0-9]{5,}):/)[1];
            console.info(`Paperboy will be delivering messages at address: ${paperboy}`);
            paperAddress.seed(parseInt(paperboy));
            let paperRoute = `${paperAddress.name.jobTitle()} ${paperAddress.name.firstName()} ${paperAddress.name.lastName()}`;
            console.info(`The paperRoute is: ${paperRoute}`);
            let encrypted = Buffer.from(process.env['fortytwo'], 'base64');
            res.render('index', {paperRoute: paperRoute, fortytwo: aes256.decrypt(`${statusCode}`, `${encrypted}`) });
        });

    }).on('error', (err) => {
        console.error('Error: ' + err.message);
    });
});

app.get('/status', function (req, res) {
    res.send('200 OK');
});

app.get('/ping', function (req, res) {
    res.send('pong');
});

app.listen(8088, function () {
    console.error('Example app listening on port 8088!');
});
