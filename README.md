[![Build Status](https://travis-ci.org/andela-rakpan/document-management-system.svg?branch=develop)](https://travis-ci.org/andela-rakpan/document-management-system)
[![Coverage Status](https://coveralls.io/repos/github/andela-rakpan/document-management-system/badge.svg?branch=develop)](https://coveralls.io/github/andela-rakpan/document-management-system?branch=develop)
[![Code Climate](https://codeclimate.com/github/andela-rakpan/document-management-system/badges/gpa.svg)](https://codeclimate.com/github/andela-rakpan/document-management-system)

# Document Management System
Document Management System is an API that manages documents with users, document types and user roles. Each document defines access rights; the document defines which roles can access it. Also, each document specifies the date it was published and the date updated. 

- This API is built with _NodeJS_, _Express_ and _Postgres Database_.  

- The source code employs ES6 syntax traspiled down to ES5 using Babel


#### _POSTMAN Collection_
[DMS-API](https://www.getpostman.com/collections/77dab144dabb35e1fa7b)

#### _HOSTED at Heroku_
[https://document-mgt-system.herokuapp.com/](https://document-mgt-system.herokuapp.com)

### **API Features**

The following features make up the Document Management System API:

##### Authentication
- It uses JSON Web Token (JWT) for authentication.  
- It generates a token upon successul login / account creation and returns it to the client.   
- It verifies the token to ensures a user is authenticated to access some endpoints.

##### Users
- It allows users to be created.  
- It allows users to login and obtain a token  
- It allows authenticated users to retrieve and edit their information only.   
- All users can be retrieved, modified and deleted by the admin user.

##### Roles
- It ensures that users have roles.   
- It ensures user roles could be `admin` or `regular`, or as created by the admin .   
- It ensures roles can be created, retrieved, updated and deleted by an admin user. 
- A non-admin user cannot create, retrieve, modify, or delete roles.  

##### Documents
- It allows new documents to be created by authenticated users.  
- It ensures all documents have access roles defined as `public` or `private`.  
- It allows admin users to create, retrieve, modify, and delete documents.
- It allows the admin user to retrieve all documents.   
- It allows `private` and `public` access documents to be retrieved by its owners.    
- It ensures users can delete, edit and update documents that they own.   
- It allows users to retrieve all documents they own.
- It allows users to set a type for any document they create.   

##### Types
- It allows documents to be defined based on types. Eg. Note, Report etc.   
- It allows users to add types to any document they create.   
- It allows users to create and retrieve types.
- It allows only admin user to modify and delete types   

##### Search
- It allows users to search `public` documents that belong to other users (as well as documents that belong to the user).
- It allows admin to retrieve all documents that matches search term, be it `public` or `private`.

### **Installation Steps**
* Clone the project repository: `git clone https://github.com/andela-rakpan/document-management-system.git`
* Change directory into the `document-management-system` directory.
* Run `npm install` to install the dependencies in the `package.json` file.
* Run `npm run start:server` to start the project.
* Run `npm test` to run the tests.
* Use *Postman* or any API testing tool of your choice to access the endpoints.

### **Endpoints**
**N/B:** For all endpoints that require authentication, use \
`'x-access-token': <token>` or `authorization: <token>`

#### Users Endpoint

##### <i class="icon-user"></i> _To CREATE a user_
* Make a **POST** request to `/api/users` endpoint.  
* Send data with valid `email`, `password`,  `firstname` and  `lastname` attributes.   
* A token is returned along with the created user.  

##### <i class="icon-lock"></i> _To LOGIN a user_   
* Make a **POST** request to `/api/users/login` endpoint.   
* Send data with valid `email` and `password` attributes.
* A token is returned along with the authenticated user


##### <i class="icon-users"></i>_To GET all users_  
* Make a **GET** request to `/api/users`  
* Set an admin user's token in the authorization headers.  
* An array of all users is returned.

##### <i class="icon-user"></i> _To GET a user_   
* Make a **GET** request to `/api/users/:id`   
* Pass `id` of the user in the url parameter.
* Set the user's token in the authorization headers.
* The user details is returned, if found.

##### <i class="icon-pencil"></i> _To UPDATE a user_  
* Make a **PUT** request to `/api/users/:username`   
* Pass `id` of the user in the url parameter.    
* Set the user's token in the authorization headers.
* Send updated data with valid `email`, `password`,  `firstname` and/or  `lastname` attributes.
* The updated user details is returned.

#####<i class="icon-trash"></i> _To DELETE a user_  
* Make a **DELETE** request to `/api/users/:id`   
* Pass `id` of the user in the url parameter.    
* Set admin user token in the authorization headers.
* An success message is returned.

#### Roles Endpoint

##### <i class="icon-file"></i>_To CREATE a role_   
- Make a **POST** request to `/api/roles` endpoint.  
- Set admin user token in the authorization headers.   
- Send data with valid `title` attributes.    
- The created user is returned

##### <i class="icon-folder"></i> _To GET all roles_  
- Make a **GET** request to `/api/roles`  
- Set an admin user token in the authorization headers.  
- An array of all roles is returned.


##### <i class="icon-file"></i> _To GET a role_   
- Make a **GET** request to `/api/roles/:id`  
- Pass `id` of the role in the url parameter.  
- Set the admin user token in the authorization headers.
- The role is returned.

##### <i class="icon-pencil"></i> _To UPDATE a role_  
- Make a **PUT** request to `/api/roles/:id`   
- Pass `id` of the role in the url parameter.  
- Set the admin user token in the authorization headers.   
- Send a valid updated `title` data on a PUT request.
- The updated role is returned.

##### <i class="icon-trash"></i> _To DELETE a role_  
- Make a **DELETE** request to `/api/roles/:id`   
- Pass `id` of the role in the url parameter.  
- Set the admin user token in the authorization headers.   
- A success message is returned.

#### Documents Endpoint

##### <i class="icon-file"></i> _To CREATE a document_   
- Make a **POST** request to `/api/documents` endpoint.  
- Set a user's token in the authorization headers.   
- Send data with valid `title`, `content`, `access`, `ownerId` and `typeId` attributes.    
- The created document is returned.

##### <i class="icon-folder"></i> _To GET all documents_  
- Make a **GET** request to `/api/documents`  
- Set a admin user token in the authorization headers.
- An array of all documents is returned.

##### <i class="icon-file"></i> _To GET a document_   
- Make a **GET** request to `/api/documents/:id`  
- Pass `id` of the document in the url parameters.  
- Set a user token in the authorization headers.
- The document is returned if user is owner.

##### <i class="icon-pencil"></i> _To UPDATE a document_  
- Make a **PUT** request to `/api/documents/:id`   
- Pass `id` of the document in the url parameters.  
- Set a user token in the authorization headers.   
- Send a valid updated `title`, `content`, `access`, `ownerId` and/or `typeId` data on the PUT request.
- The updated document is returned.

##### <i class="icon-trash"></i> _To DELETE a document_  
- Make a **DELETE** request to `/api/documents/:id`   
- Pass `id` of the document in the url parameters.  
- Set a user token in the authorization headers.   
- A success message if returned.

#### Types Endpoint

##### <i class="icon-file"></i> _To CREATE a document type_   
- Make a **POST** request to `/api/types` endpoint.  
- Set a user token in the authorization headers.   
- Send data with valid `title` attributes. 
- The created role is returned.   

##### <i class="icon-folder"></i> _To GET all types_  
- Make a **GET** request to `/api/types`  
- Set a user token in the authorization headers.
- An array of types is returned.  

##### <i class="icon-file"></i> _To GET a type_   
- Make a **GET** request to `/api/types/:id`  
- Pass `id` of the type in the url parameters.  
- Set a user token in the authorization headers.
- The type is returned.

##### <i class="icon-pencil"></i> _To UPDATE a type_  
- Make a **PUT** request to `/api/types/:id`   
- Pass `id` of the type in the url parameters.  
- Set a admin user token in the authorization headers.   
- Send a valid updated `title` data on the PUT request.
- The updated type is returned.

##### <i class="icon-trash"></i> _To DELETE a type_  
- Make a **DELETE** request to `/api/types/:id`   
- Pass `id` of the type in the url parameters.  
- Set a admin user token in the authorization headers. 
- A success message is returned.

#### Search Endpoint   

##### <i class="icon-search"></i> _To SEARCH documents (public and private)_  
- Make a **GET** request to `/api/search/documents` endpoint.  
- Set a user token in the authorization headers.   
- Send data with valid `term` query in the `URL`; for example, to search for documents that contain 'tia', send `/api/search/documents?term=tia`. 
- An array of `public` as well as personal documents matching the search term is returned.   

#### Limitations:
The limitations to the Document Management System API are as follows:

* Users can only create plain textual documents and retrieve same when needed. 
* Users cannot share documents with people, but can make document `public` to make it available to other users.
* Users cannot delete their accounts unless via the action of an admin of the system.

#### _**Contributing**_
Contributors are welcome to further enhance the features of this API by contributing to its development. The following guidelines should guide you in contributing to this project:

1. Fork the repository.
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request describing the feature(s) you have added.
6. Include a `feature.md` readme file with a detailed description of the feature(s) you have added, along with clear instructions of how to use the features(s) you have added. This readme file will be reviewed and included in the original readme if feature is approved.

Ensure your codes follow the [AirBandB Javascript Styles Guide](https://github.com/airbnb/javascript)

### **Author**
> _**Raphael Ifiok Akpan**_ 
> 
> Copyright (c) 2017 - [ **TIA** ]
