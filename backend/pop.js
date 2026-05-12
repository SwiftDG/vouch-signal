// Get the raw request body
const requestBody = pm.request.body.raw;
// Get your Squad Secret from the Postman Environment
const secretKey = pm.environment.get("squad_secret");

// Generate the HMAC SHA-512 hash
const hash = CryptoJS.HmacSHA512(requestBody, secretKey).toString(CryptoJS.enc.Hex);

// Inject the hash into the headers before the request is sent
pm.request.headers.add({
    key: 'x-squad-signature',
    value: hash.toUpperCase()
});