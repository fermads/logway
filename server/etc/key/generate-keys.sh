openssl genrsa -out logway-key.pem 1024
openssl req -new -key logway-key.pem -out certrequest.csr
openssl x509 -req -in certrequest.csr -signkey logway-key.pem -out logway-cert.pem