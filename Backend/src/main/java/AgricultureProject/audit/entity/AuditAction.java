package AgricultureProject.audit.entity;

public enum AuditAction {
    CREATE,
    UPDATE,
    DELETE,
    STATUS_CHANGE,
    ROLE_ASSIGNED,
    ROLE_REMOVED,
    PASSWORD_CHANGED,
    PASSWORD_RESET,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    LOGOUT
}
