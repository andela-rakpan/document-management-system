## Environment Variables
There are two environment variables to set in order to run the API locally. 
> * `SECRET` - JWT Secret Key
> * `DATABASE_URL` - The database URL, which you should modify to reflect the environment you want to run (development, test, and production)

Database URL:
The database URL is in the format (for Postgres SQL):   `postgres://postgres:<password>@<host>:<port>/<database-name>`

### Sample `.env` file:
```
SECRET=YourJWTSecretKey
DATABASE_URL=postgres://postgres:'mypassword'@127.0.0.1:2701/dms

```