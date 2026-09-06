from enum import StrEnum


class Permission(StrEnum):
    ALL = "*"

    USERS_READ = "UsersRead"
    USERS_CREATE = "UsersCreate"
    USERS_EDIT = "UsersEdit"
    USERS_DELETE = "UsersDelete"

    ROLES_READ = "RolesRead"
    ROLES_CREATE = "RolesCreate"
    ROLES_EDIT = "RolesEdit"
    ROLES_DELETE = "RolesDelete"

    SETTINGS_READ = "SettingsRead"
    SETTINGS_CREATE = "SettingsCreate"
    SETTINGS_EDIT = "SettingsEdit"
    SETTINGS_DELETE = "SettingsDelete"


ALL_PERMISSIONS = frozenset(Permission)
