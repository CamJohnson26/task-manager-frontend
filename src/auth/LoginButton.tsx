import { useAuth0 } from "@auth0/auth0-react";

export const LoginButton = () => {
    const { loginWithRedirect, user } = useAuth0();
    return user?.nickname ? <>Hello, {user.nickname}!</> : <button onClick={() => loginWithRedirect()}>Log In</button>;
};
