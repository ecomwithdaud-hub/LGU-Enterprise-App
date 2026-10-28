import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RoleType } from '../enums/role.enum';

@Injectable()
export class IdorStudentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const targetUserId = request.params.userId;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // If no userId in route params, allow (e.g. /students/dashboard/me)
    if (!targetUserId) {
      return true;
    }

    const userRole = user.role?.type;

    // Administrative roles authorized to view any student's record
    const authorizedAdminRoles = [
      RoleType.SUPER_ADMIN,
      RoleType.VC,
      RoleType.REGISTRAR,
      RoleType.HOD,
      RoleType.ACCOUNTS,
    ];

    if (authorizedAdminRoles.includes(userRole)) {
      return true;
    }

    // Student role can ONLY access their own records
    if (userRole === RoleType.STUDENT) {
      if (user.id !== targetUserId) {
        throw new ForbiddenException(
          'Access Denied (IDOR Protection): You do not have permission to access another student’s portal.',
        );
      }
      return true;
    }

    // Faculty members may only view if authorized, otherwise denied
    throw new ForbiddenException(
      `Access Denied: Role '${userRole}' is not permitted to access student academic portal data.`,
    );
  }
}
