const app = require('express')();
// app.all('*', (req, res, next) => {
//     res.send('test');
// });
app.get('/handshake', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'healthy',
  });
});
app.listen(process.env.PORT ?? 8000);
console.log("it's me!");
