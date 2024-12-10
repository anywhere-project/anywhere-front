export default interface SignInUser {
    userId: string;
    password: string;
    name: string;
    nickname: string;
    telNumber: string;
    address: string;
    profileImage: string;
    isAdmin: boolean;
    userStatus: string;
}