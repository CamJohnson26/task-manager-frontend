/**
 * User type definition based on the array structure used in the application.
 * 
 * The user data is structured as an array with the following indices:
 * - [0]: User ID (string)
 * - [1]: Email (string)
 * - [2]: Name (string)
 * - [3]: Admin status (boolean)
 * - [4]: Approval status (boolean)
 */
export type User = [
  string,  // id
  string,  // email
  string,  // name
  boolean, // is_admin
  boolean  // approved
];