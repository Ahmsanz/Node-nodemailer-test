const express = require('express');

const bodyParser = require('body-parser');

const exphbs = require('express-handlebars');

const nodemailer = require('nodemailer');

const app = express(); 

const port = 3000;

const path = require('path');

// set view engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// set up public folder as static
app.use('/public', express.static(path.join(__dirname, 'public')))


app.get('/', (req, res) => {
    res.render('contact', {layout: false});
});

app.post('/send', (req, res) => {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact details:</h3>
    <ul>
        <li> Name: ${req.body.name}</li>
        <li> Company: ${req.body.company}</li>
        <li> Email: ${req.body.email}</li>
        <li> Phone number: ${req.body.phone}</li>
    </ul>
    <h3>Message:</h3>
    <p>${req.body.message}</p>
    `

    // SETTING NODEMAILER UP:
    let main = async () => {
      // test email account
        let testAccount = await
        nodemailer.createTestAccount();
        

        let transporter = 
        nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587, 
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });

        let info = await transporter.sendMail({
            from: "'Amparo Pozi' <sender@example.com>", 
            to: "adrian.h.m.sanz@gmail.com",
            subject: 'Hey there!',
            text: 'Hey there',
            html: output
        })  

        console.log('message sent!', info.messageId)

        res.render('contact', {layout: false, msg: 'Email has been sent correctly!'})

    }

    main().catch( err => console.log(err));    
    
})

app.listen(port, () => console.log('Server started'))

