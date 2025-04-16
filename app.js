const cheerio = require('cheerio');
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const url = 'https://yavir.fm/';



app.get('/', (req, res) => {
    res.sendFile(__dirname + 'public/index.html');
})

app.get('/music', (req, res) => {
    axios.get(url).then(response => {
        let data = [];
        const html = response.data;
        const $ = cheerio.load(html);

        $('audio').each((index, element) => {
            const src = $(element).attr('src');
            let title = $(element).attr('title'); 

            
            if (!title && src) {
                const fileName = src.split('/').pop(); 
                title = fileName.replace('.mp3', ''); 
            }

            data.push({
                title: title,
                src: src
            });
        });

        console.log(data);
        data.shift(); 
        res.json(data);
    })
});
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});