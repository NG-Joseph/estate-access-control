/*import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common";
import { UsersService } from "../../users/users.service";
import { SecurityAdminsService} from "../security-admins.service";
import { Observable } from "rxjs";
import { User } from "../../users/entities/user.entity";
import { switchMap, map } from "rxjs/operators";
import { SecurityAdmin } from "../entities/security-admin.entity";

@Injectable()
export class  UserIsSecurityAdminGuard implements CanActivate {

    constructor(private userService: UsersService, private visitorService: visitorService) {}

    canActivate(context: ExecutionContext): Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const params = request.params;
        const SecurityAdminId: number = Number(params.id);
        const user: User = request.user;

        return this.userService.findOne(user.id).pipe(
            switchMap((user: User) => this.visitorService.findOne(SecurityAdminId).pipe(
                map((SecurityAdmin: SecurityAdmin) => {
                    let hasPermission = false;

                    if(user.id === SecurityAdmin.id) {
                        hasPermission = true;
                    }

                    return user && hasPermission;
                })
            ))
        )       
    }
}*/