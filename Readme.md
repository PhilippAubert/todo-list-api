An API for managing your tasks 

based on https://roadmap.sh/projects/todo-list-api

Attention: 
When using postman, users will have to set Authoriaztion manually in the Header! 

Use environment variables for better handling. 

Remove "Authorization" from Headers after logout with a Postman-script like : 

const jsonData = pm.response.json();

if (jsonData.token) {
    pm.collectionVariables.set("jwt_token", jsonData.token);
}
