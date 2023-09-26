export interface IUser {
    fullName: string;
    login: string;
    userId: number;
    role: string;
    iat: number;
    exp: number;
    inviteCode?: string;
    isTeacher: boolean,

}

export interface IUserData {
    login: string,
    password: string,
    firstName: string,
    secondName: string,
    middleName: string,
    mobilePhone: string,
    eMail: string,
    dateOfBirthday: string,
    inviteCode: string
}