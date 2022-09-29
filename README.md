# Assignment 2: basic to-do list app

Through this assignment, you will take a basic frontend-only to-do list Vue.js app and transform it so that the to-do list data is stored in an Express.js server backend and accessed from the frontend via a RESTful API.

Remember: your app will not run if you do not have two terminals open, one for running the API server (`server/`) and one for the Vue UI (`ui/`).

1. Pull the latest examples repo and make a copy of the `lecture07-todo-list-ui/` directory, calling it `ui/` in your assignment repository. DO NOT COPY OVER THE `.git` DIRECTORY. **(done)**
2. Make a copy of `data.ts` in `ui/src/` and put it into `server/`. **(done)**
3. Add `load` and `save` functions that read from and write to a `todo-list-data.json` file, respectively. These functions should look similar to those in examples we've seen in class, except you also need to load and save `idCount`. Use a `try`/`catch` block in `load` so that it fails gracefully in case the file does not exist or is not parseable. Add `save()` calls to the functions in `server/data.ts` as appropriate.
4. Implement the `GET /api/lists` **(done)**, `GET /api/list/<<list ID>>/items` **(partially done)**, `POST /api/list` **(done)**, and `POST /api/list/<<list ID>>/item` **(partial done)** routes in `server.ts` by making them call the corresponding function in `server/data.ts` and returning the corresponding output of that function. For the paths with a list ID parameter, if the list ID does not exist, your route must return an HTTP 404 **(done)**. For the `POST` methods, you must also return an HTTP 400 if the needed parameters aren't in the JSON payload **(done)**. You can choose the structure of these JSON payloads, so long as they contain the data needed by the corresponding function. You do need to validate that the payloads conform to the expected TypeScript types needed by `data.ts` **(don't know how to do)**; you can check the presence and type of payload fields with expressions like: `typeof req.body?.completed === "boolean"`. **(not yet)**
5. Implement the `PUT /api/list/<<list ID>>/item/<<item ID>>` route in `server.ts` by making it call the corresponding function in `server/data.ts`. Assume that the payload is a complete replacement for the original item (other than the ID, which comes from the path, not the payload -- in other words, you cannot pass an ID in the payload as a way to change the item's ID). If either ID does not exist, your route must return an HTTP 404.
6. Implement the `DELETE /api/list/<<list ID>>` route in `server.ts` by making it call a new function in `server/data.ts` you will need to implement. If the list ID does not exist, your route must return an HTTP 404.
7. Implement the `DELETE /api/list/<<list ID>>/item/<<item ID>>` route in `server.ts` by making it call a new function in `server/data.ts` you will need to implement. If either ID does not exist, your route must return an HTTP 404.
8. Update the exported functions in `ui/src/data.ts` so that they are `async` (NOTE: if the functions are changed to being `async`, does anything need to change in `App.vue`?) and instead use `fetch` to call the backend server API. Use `encodeURIComponent` to prevent injection attacks when constructing your URLs (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent). Do not worry about error handling.
9. Implement a delete button for lists and wire it up to call a new function in `ui/src/data.ts` that calls the API from step 5. There should be one delete button per row on the left hand side. 
10. Implement a delete button for list items and wire it up to call a new function in `ui/src/data.ts` that calls the API from step 6. There should be one delete button per row on the right hand side.
11. Make a short demo video demonstrating that your implementation correctly handles the scenario of deleting a to-do list item on the right hand side by having the badge showing the number of items in the corresponding list on the left hand side go down by one. Use Panopto and share the video with the instructor and the 4 course TAs/grader prior to the due date.
