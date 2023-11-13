const express = require('express');
const app = express();



// SDK de Mercado Pago
import { MercadoPagoConfig } from 'mercadopago';

// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-4533720036264515-111222-b702074e49dbcf1dba439cf4255c90de-1545811473' });

//routes


app.get('/checkout', (req, res) => {  
    const preference = new Preference(client);

    preference.create({
     'items': [
     {
	 'title': 'Mi produto',
	 'quantity': 1,
	 'currency_id': 'BRL',
	 'unit_price': 100
     }
    ]
    }).then((result) => console.log(result))
	.catch((error) => console.log(error));

    //res.send('<h1>Checkouts W</h1>');
});





//server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

