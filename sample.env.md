## Environment Variables
There are three environment variables to set in order to run the API locally. 
> * `SECRET` - JWT Secret Key
> * `DB_DEV_URL` - The development database URL
> * `DB_TEST_URL` - The test database URL

Database URL:
The database URL is in the format (for Postgres SQL):   `postgres://postgres:<password>@<host>:<port>/<database-name>`

### Sample `.env` file:
```
SECRET=YourJWTSecretKey
DB_DEV_URL=postgres://postgres:'mypassword'@127.0.0.1:2701/dms

```