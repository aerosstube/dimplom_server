export interface IUserOptions {
    userOptions: {
        role:
            {
                name: string
            }[],
        groups:
            {
                id: number,
                name: string
            }[],
    }
}

export interface GetUser {
    id: number,
    firstName: string,
    secondName: string
    middleName: string
    dateOfBirthday: string
    mobilePhone: string,
    eMail: string,
    role: string,
    login: string,
    isTeacher: boolean,
    group: any[];
    classes?: { id: number, two_our_class_id_fk: number, teacher_id_fk: number }[];
    is_expelled?: boolean

}