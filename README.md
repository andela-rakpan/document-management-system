[![Coverage Status](https://coveralls.io/repos/github/andela-rakpan/document-management-system/badge.svg?branch=develop)](https://coveralls.io/github/andela-rakpan/document-management-system?branch=develop)
[![Build Status](https://travis-ci.org/andela-rakpan/document-management-system.svg?branch=develop)](https://travis-ci.org/andela-rakpan/document-management-system.svg?branch=develop)

# Document Management System
Document Management System is an API that manages documents with users, document types and user roles. Each document defines access rights; the document defines which roles can access it. Also, each document specifies the date it was published and the date updated. 

- This API is built with _NodeJS_, _Express_ and _Postgres Database_.  

- The source code employs ES6 syntax traspiled down to ES5 using Babel

### **API Features**

The following features make up the Document Management System API:

##### Authentication
- It uses Jason Web Token (JWT) for authentication.  
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
- It allows users to search `public` documents that belong to other users.
- It allows users to search documents they own, be in `public` or `private`
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

##### _To CREATE a user_
* Make a **POST** request to `/api/users` endpoint.  
* Send data with valid `email`, `password`,  `firstname` and  `lastname` attributes.   
* A token is returned along with the created user.  

##### _To LOGIN a user_   
* Make a **POST** request to `/api/users/login` endpoint.   
* Send data with valid `email` and `password` attributes.
* A token is returned along with the authenticated user


##### _To GET all users_  
* Make a **GET** request to `/api/users`  
* Set an admin user's token in the authorization headers.  
* An array of all users is returned.

##### _To GET a user_   
* Make a **GET** request to `/api/users/:id`   
* Pass `id` of the user in the url parameter.
* Set the user's token in the authorization headers.
* The user details is returned, if found.

##### _To UPDATE a user_  
* Make a **PUT** request to `/api/users/:username`   
* Pass `id` of the user in the url parameter.    
* Set the user's token in the authorization headers.
* Send updated data with valid `email`, `password`,  `firstname` and/or  `lastname` attributes.
* The updated user details is returned.

##### _To DELETE a user_  
* Make a **DELETE** request to `/api/users/:id`   
* Pass `id` of the user in the url parameter.    
* Set admin user token in the authorization headers.
* An success message is returned.

#### Roles Endpoint

##### _To CREATE a role_   
- Make a **POST** request to `/api/roles` endpoint.  
- Set admin user token in the authorization headers.   
- Send data with valid `title` attributes.    
- The created user is returned

##### _To GET all roles_  
- Make a **GET** request to `/api/roles`  
- Set an admin user token in the authorization headers.  
- An array of all roles is returned.


##### _To GET a role_   
- Make a **GET** request to `/api/roles/:id`  
- Pass `id` of the role in the url parameter.  
- Set the admin user token in the authorization headers.
- The role is returned.

##### _To UPDATE a role_  
- Make a **PUT** request to `/api/roles/:id`   
- Pass `id` of the role in the url parameter.  
- Set the admin user token in the authorization headers.   
- Send a valid updated `title` data on a PUT request.
- The updated role is returned.

##### _To DELETE a role_  
- Make a **DELETE** request to `/api/roles/:id`   
- Pass `id` of the role in the url parameter.  
- Set the admin user token in the authorization headers.   
- A success message is returned.

#### Documents Endpoint

##### _To CREATE a document_   
- Make a **POST** request to `/api/documents` endpoint.  
- Set a user's token in the authorization headers.   
- Send data with valid `title`, `content`, `access`, `ownerId` and `typeId` attributes.    
- The created document is returned.

##### _To GET all documents_  
- Make a **GET** request to `/api/documents`  
- Set a admin user token in the authorization headers.
- An array of all documents is returned.

##### _To GET a document_   
- Make a **GET** request to `/api/documents/:id`  
- Pass `id` of the document in the url parameters.  
- Set a user token in the authorization headers.
- The document is returned if user is owner.

##### _To UPDATE a document_  
- Make a **PUT** request to `/api/documents/:id`   
- Pass `id` of the document in the url parameters.  
- Set a user token in the authorization headers.   
- Send a valid updated `title`, `content`, `access`, `ownerId` and/or `typeId` data on the PUT request.
- The updated document is returned.

##### _To DELETE a document_  
- Make a **DELETE** request to `/api/documents/:id`   
- Pass `id` of the document in the url parameters.  
- Set a user token in the authorization headers.   
- A success message if returned.

#### Types Endpoint

##### _To CREATE a document type_   
- Make a **POST** request to `/api/types` endpoint.  
- Set a user token in the authorization headers.   
- Send data with valid `title` attributes. 
- The created role is returned.   

##### _To GET all types_  
- Make a **GET** request to `/api/types`  
- Set a user token in the authorization headers.
- An array of types is returned.  

##### _To GET a type_   
- Make a **GET** request to `/api/types/:id`  
- Pass `id` of the type in the url parameters.  
- Set a user token in the authorization headers.
- The type is returned.

##### _To UPDATE a type_  
- Make a **PUT** request to `/api/types/:id`   
- Pass `id` of the type in the url parameters.  
- Set a admin user token in the authorization headers.   
- Send a valid updated `title` data on the PUT request.
- The updated type is returned.

##### _To DELETE a type_  
- Make a **DELETE** request to `/api/types/:id`   
- Pass `id` of the type in the url parameters.  
- Set a admin user token in the authorization headers. 
- A success message is returned.

#### Search Endpoint

##### _To SEARCH public documents_   
- Make a **GET** request to `/api/search/documents/public` endpoint.  
- Set a user token in the authorization headers.   
- Send data with valid `term` query in the `URL`; for example, to search for public documents that contain 'andela', send `/api/search/documents/public?term=andela`. 
- An array of documents matching the search term is returned.   

##### _To SEARCH personal documents (public and private)_  
- Make a **GET** request to `/api/search/documents` endpoint.  
- Set a user token in the authorization headers.   
- Send data with valid `term` query in the `URL`; for example, to search for personal documents that contain 'tia', send `/api/search/documents?term=tia`. 
- An array of documents matching the search term is returned.   



### **Author**
> _**Raphael Ifiok Akpan**_ 
> 
> Copyright (c) 2017 - [ **TIA** ]