// // next-auth.d.ts

// import  { DefaultSession, DefaultUser } from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       role: string;
//       username?: string;
//     } & DefaultSession["user"];

//     //nhớ cái user là cái mình định nghĩa pử bên nextauth
//   }

//   interface User extends DefaultUser {
//     id: string;
//     role: string;
//     username?: string;
//   }

//   interface JWT {
//     id: string;
//     role: string;
//     username?: string;
//   }
// }
