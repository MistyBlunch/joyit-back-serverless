# Joyit Technical Test

### Requirements
- NodeJs
- Yarn
- Redis

### Steps to execute and test the software
1. It is necessary to have the dependencies installed to be able to start. The first thing to do is to enter the project and execute `yarn` to install all the modules required by the project.
2. To run the project for a local test you can run the command `yarn run start`, this will deploy a server on port 3000 to perform the respective tests of the project.
3. To run the project tests, run the following command `yarn run test`.

### Endpoints

#### [POST] /dev/tokens
##### Input
```JSON
{
	"email": "gian.corzo@gmail.com", 
	"card_number": "4111111111111111",
	"cvv": "123",
	"expiration_year": "2028", 
	"expiration_month": "09"
}
```
##### Output
```
{
	"token": "ND486o4U9k3wH4O7"
}
```

#### [GET] /dev/tokens/{token}
##### Output
```
{
	"email": "gian.corzo@gmail.com",
	"card_number": "4111111111111111",
	"cvv": null,
	"expiration_year": "2028",
	"expiration_month": "09"
}
```
![Screenshot 2023-12-31 041625](https://github.com/MistyBlunch/joyit-back-serverless/assets/29315728/7c8bdf7a-3fd9-4487-81ed-e400b4587889)
![Screenshot 2023-12-31 041700](https://github.com/MistyBlunch/joyit-back-serverless/assets/29315728/4d353d02-6396-4f57-b10c-63e7a9c53260)



