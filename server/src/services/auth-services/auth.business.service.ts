import { Transaction } from "sequelize";
import { ApiError } from "../../errors/api.error";
import { TeacherService } from "../teacher-service/teacher.service";
import { UserDatabaseService } from "../user-services/user.database.service";
import { UserService } from "../user-services/user.service";
import { AuthDatabaseService } from "./auth.database.service";
import { AuthService, AuthUser, JwtTokens } from "./auth.service";

export interface RegistrationUserOptions extends Omit<AuthUser, "isTeacher"> {
  password: string;
  mobile_phone: string;
  "e-mail": string;
  dateOfBirthday: string;
  isTeacher?: boolean;
  groupId: number;
  is_expelled?: boolean;
}

export interface AuthOptions {
  login: string;
  password: string;
  userAgent: string;
  deviceIp: string;
  role: string;
  dateExpired?: Date;
}

export interface SaveTokens {
  dateExpired: Date;
  userId: number;
  refreshToken: string;
  userAgent: string;
  deviceIp: string;
}

export interface TokenOptions {
  userId: number;
  login: string;
  role: string;
  fullName: string;
  isTeacher: boolean;
  iat?: number;
  exp?: number;
}

export class AuthBusinessService {
  static async userLogin(
    authOptions: AuthOptions,
    transaction: Transaction
  ): Promise<JwtTokens> {
    const userDatabase = await AuthService.checkUser(
      authOptions.login,
      authOptions.password
    );

    const user: AuthUser = {
      fullName: `${userDatabase.second_name} ${userDatabase.first_name} ${userDatabase.middle_name} `,
      login: userDatabase.login,
      userId: userDatabase.id,
      role: userDatabase.role,
      isTeacher: await TeacherService.isUserTeacher(userDatabase.id),
    };
    const tokens: JwtTokens = await AuthService.generateToken(user);

    await AuthService.saveTokenToDatabase(
      authOptions,
      userDatabase,
      tokens,
      transaction
    );

    return {
      ...tokens,
    };
  }

  static async userLogout(
    refreshToken: string,
    transaction: Transaction
  ): Promise<void> {
    if (!refreshToken) throw ApiError.UnauthorizedError();
    const tokenData = await AuthService.deleteToken(refreshToken, transaction);
    await AuthService.deleteUserDevice(tokenData, transaction);
  }

  static async userRefreshToken(refreshToken: string): Promise<JwtTokens> {
    const token = await AuthDatabaseService.findToken(refreshToken);
    if (!token) throw ApiError.UnauthorizedError();

    const user = AuthService.validateRefreshToken(refreshToken);
    if (!user) ApiError.ValidationError();

    return AuthService.generateToken(
      {
        fullName: user.fullName,
        login: user.login,
        userId: user.userId,
        role: user.role,
        isTeacher: await TeacherService.isUserTeacher(user.userId),
      },
      refreshToken
    );
  }

  static async userRegistration(
    groupId: number[],
    classIds: number[],
    registrationOptions: RegistrationUserOptions,
    transaction: Transaction
  ): Promise<void> {
    if (await UserDatabaseService.findUserByLogin(registrationOptions.login))
      throw ApiError.BadRequest("Пользователь с таким логином уже существует!");
    const user = await UserService.createUser(registrationOptions, transaction);
    await UserService.userDistribution(
      {
        groupId: groupId,
        isTeacher: registrationOptions.isTeacher,
        classIds: classIds,
      },
      user.id,
      transaction
    );
  }
}
