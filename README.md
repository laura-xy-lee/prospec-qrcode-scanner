# QR code scanner

(Born out of #techforall 2019)

Everytime an employee flashes his QR code to this QR code scanner, a record of his name and scan timing is sent to our database. 

Each QR code should contain a json file with the following information: `password` and `name`.

To run locally:
1. Set up a MySQL database
2. Create a `.env` file with the following variables: `RDS_HOSTNAME`, `RDS_USERNAME`, `RDS_PASSWORD`, `RDS_PORT`, `RDS_DB`
3. On command line, run ```npm start```
