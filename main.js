var express = require('express');
var app = express();
var isDebug = true;

app.use(function (req, res, next) {
    var source = req.headers['user-agent'];
    if (source.indexOf("ELB-HealthChecker") >= 0) {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end(JSON.stringify("AiRHub is up!"));
    } else if (!isDebug && (!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
        res.redirect('https://' + req.get('Host') + req.url);
    } else {
        if (isDebug) {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
        }
        res.header('X-Atheer-Debug', isDebug);
        next();
    }
});

app.use(express.static('.', {
    maxAge: 1209600 //2 weeks, pretty aggressive currently, will relax once the app stabilize
}));

app.listen(8080, function () {
    console.log('JITSI listening on port 8787! ');
});
