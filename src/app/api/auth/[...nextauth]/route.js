import axios from "axios";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from 'next/headers';

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        // async signIn({user, account}){
        //     console.log("user", user);
        //     //console.log("account", account);
        //     if (account.provider === 'google') {
        //         //const {name, email} = user;
        //         try {
        //             // const res = await axios.post('http://localhost:3001/auth/signin/google', {token: account.id_token});
        //             // console.log("res",res.data);
        //             const userdb = {name: user.name.split(' ')[0], lastname: user.name.split(' ')[1],password: user.id, email: user.email}
        //             const resLogin = axios.post('http://localhost:3001/auth/signin', userdb)
        //             .then(
        //                 (login) => {
        //                     cookies().set('tg', login.data.token);
        //                     return login.data.token;
        //                 },
        //                 (error) => {
        //                     console.log("error axios", error.response);
        //                     if (error.response.data.error === "User not found") {
        //                         console.log('crear usuario');
        //                         axios.post('http://localhost:3001/api/users', userdb)
        //                         .then(
        //                             (response) => {
        //                                 console.log('crear',response.data);
        //                                 axios.post('http://localhost:3001/auth/signin', userdb)
        //                                 .then(
        //                                     (signin) =>{
        //                                         console.log(signin.data);
        //                                         cookies().set('tg', signin.data.token);
        //                                         return signin.data;
        //                                     },
        //                                     (error) => false
        //                                 );
        //                             },
        //                             (error)=> {
        //                                 console.log('error usuario', error);
        //                                 return error.response;
        //                             }
        //                         )
        //                     }
        //                     else return false;
        //                 }
        //             );
        //             // console.log("res", res);
        //             // if (res) {
        //             //     cookies().set('tg', res.token); 
        //             //     return res;
        //             // }
        //             return resLogin;
        //         } catch (error) {
        //             console.log("error signin:", error);
        //             return error.data;
        //         }
        //         //return user;
        //     }
        // },
        async jwt({ token, account, profile }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            //console.log(account);
            //console.log(profile);
            if (profile) {
                const userdb = {
                    name: profile.given_name,
                    lastname: profile.family_name,
                    password: profile.sub,
                    email: profile.email
                }
                const resLogin = await axios.post('https://pf-15a.up.railway.app/auth/signin', userdb)
                    .then(
                        (login) => {
                            cookies().set('tg', login.data.token);
                            return login.data;
                        },
                        async (error) => {
                            console.log("error axios", error.response.data);
                            if (error.response.data.error === "User not found") {
                                //console.log('crear usuario');
                                return await axios.post('https://pf-15a.up.railway.app/api/users', userdb)
                                    .then(
                                        async (response) => {
                                            //console.log('crear',response.data);
                                            return await axios.post('https://pf-15a.up.railway.app/auth/signin', userdb)
                                                .then(
                                                    (signin) => {
                                                        //console.log(signin.data);
                                                        cookies().set('tg', signin.data.token);
                                                        return signin.data;
                                                    },
                                                    (error) => { throw new Error("No es posible iniciar sesion con esta cuenta") }
                                                );
                                        },
                                        (error) => {
                                            //console.log('error usuario', error);
                                            return error.response;
                                        }
                                    )
                            }
                            else { throw new Error("No es posible iniciar sesion con esta cuenta") };
                        }
                    );
                console.log("resLogin", resLogin);
                if (resLogin) {
                    token.accessToken = resLogin.token;
                    token.user = resLogin.user;
                }
                else throw new Error("No es posible iniciar sesion con esta cuenta");
            }
            return token
        },
        async session({ session, token }) {
            // Send properties to the client, like an access_token and user id from a provider.
            session.token = token.accessToken;
            session.user = {
                ...token.user,
                image: session.user.image,
            }
            //session.user = token.user;
            return session
        }
    },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };