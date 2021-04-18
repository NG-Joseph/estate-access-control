import { IBaseAbstract } from "../global/app.interfaces";

/**
 * CustomTheme type
 */


export enum TenantStatus {
    A = "active",
    S = "suspended",
    O = "owing"
}

export enum Gender {
    M = "male",
    F = "female"
}

export enum TenantTeamRole {
    A = "admin",
    M = "marketing",
    C = "content-manager"
}

export interface ICreateTenantTeamRolesDto{

     roles: TenantTeamRole[];
}

export enum TenantAccountOfficerRole {
    M = "manager",
    T = "tech-support"
}

export interface IUser extends IBaseAbstract {
    landlord?: boolean;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    commonName?: string;
    homeAddress?: string;
    gender?: Gender;
    dateOfBirth?: Date;
    nationality?: string;
    stateOfOrigin?: string;
    zip?: string;
    photo?: string;
    photoMimeType?: string;
    isActive?: boolean;
    emailAddress?: string;
    backupEmailAddress?: string;
    phone?: { mobile?: string[], office?: string[], home?: string[] }
    isPrimaryEmailAddressVerified?: boolean;
    isBackupEmailAddressVerified?: boolean;
    passwordSalt?: string;
    passwordHash?: string;
    isPasswordChangeRequired?: boolean;
    resetPasswordToken?: string;
    resetPasswordExpiration?: Date;
    primaryEmailVerificationToken?: string;
    backupEmailVerificationToken?: string;
    emailVerificationTokenExpiration?: Date;
    otpEnabled?: boolean
    otpSecret?: string;
    roles?: IRole[];
    primaryContactForWhichTenants?: ITenant[];
    tenantTeamMemberships?: ITenantTeam[];
    accountOfficerForWhichTenants?: ITenantAccountOfficer[];
    [key: string]: any

}



export interface IRole extends IBaseAbstract {
    name?: string;
    description?: string;
    users?: IUser[];

}

export interface ITenantTeam extends IBaseAbstract {
    tenant?: ITenant
    user?: IUser
    roles?: TenantTeamRole[]
    tenantUniqueName?: string
    tenantUniqueId?: number
}

export interface ITenantAccountOfficer extends IBaseAbstract {
    tenant?: ITenant
    user?: IUser
    roles?: TenantAccountOfficerRole[]
}

export interface ITheme extends IBaseAbstract {
    name?: string;
    description?: string;
    properties?: string;
    tenants?: ITenant[];
}







/**
 * State variable type. This is for the general crud as used in UserApp.tsx
 */
export interface IState {
    users?: IUser[];
    usersCount?: number; //for total number that corresponds to present find, in case of pagination
    user?: IUser | null; //This can be used for user to edit or user to view, depending on the function being carried out
    onAddUser: boolean;
    onViewUser: boolean;
    onEditUser: boolean;
    alert: {
        show: boolean,
        message: string,
        type: 'info' | 'success' | 'link' | 'danger' | '' | any,
    },
    actionButtonState: 'is-info' | 'is-success' | 'is-loading' | 'is-danger' | 'is-primary' | any //used for deciding whether to show loading button state or not. Change to is-loading 
}


//for EditUser
export interface IEditUserState {
    user: IUser,
    relations: {
        assignableRoles?: IRole[], //this is for roles to be listed in the dropbox
       
        photo: {
            fileToUpload: Blob | string,
            uploadButtonState: string,
            alert: {
                show: boolean,
                type: "info" | "success" | "link" | "primary" | "warning" | "danger" | "light" | "dark" | "white" | "black" | undefined,
                onClickHandler?: () => void
                message: string
            },
            src: string
        },
        userRoles: { //for user roles to be added to and removed from
            rolesToAdd?: number[], //this is for adding one or more roles to user
            submitButtonState: string,
            deleteButtonState: string,
        },
        userVisitor:{
            uniqueNameOfVisitor?: string | undefined, //doing one by one. This is the unique name of tenant to add
            submitButtonState: string,
            deleteButtonState: string,
        },
        userResident:{
            uniqueNameOfTenantToAdd?: string | undefined, //doing one by one. This is the unique name of tenant to add
            rolesToAdd?: TenantTeamRole[] //roles as a tenant team member to add
            submitButtonState: string,
            deleteButtonState: string,
            
        }

    }
}

/**
 * Action type for Reducer
 */
export interface IAction {
    //Indicate possible reducer action types here as you identify them in your codes
    type: 'FetchDataSuccess' | 'FetchDataFailure' | 'HandleOnAddUser'
    | 'HandleCancelCreate' | 'BeforeCreateUser' | 'CreateUserSuccess'
    | 'CreateUserFailure' | 'BeforeDeleteUser' | 'DeleteUserSuccess'
    | 'DeleteUserFailure' | 'HandleEditUser' | 'HandleCancelUpdate'
    | 'BeforeUpdateUser' | 'UpdateUserSuccess' | 'UpdateUserFailure'
    | 'HandleCloseAlert' | 'HandleViewUser' | 'HandleCloseViewUser'
    //for relations
    | 'BeforeAddRoleToUser' | 'AddRoleToUserSuccess' | 'AddRoleToUserFailure';

    payload?: {
        users?: IUser[], usersCount?: number, user?: IUser, error?: Error,
        id?: number | string,
        actionButtonState?: 'is-info' | 'is-success' | 'is-loading' | 'is-danger' | 'is-primary' //used for deciding whether to show loading button state or not. Change to is-loading 
    }

}

