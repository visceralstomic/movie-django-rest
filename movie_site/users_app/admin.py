from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from rest_framework_simplejwt.token_blacklist import admin as token_admin, models as token_models

class OutstandingTokenAdmin(token_admin.OutstandingTokenAdmin):

    def has_delete_permission(self, *args, **kwargs):
        return True 

admin.site.unregister(token_models.OutstandingToken)
admin.site.register(token_models.OutstandingToken, OutstandingTokenAdmin)

class CustUserAdmn(UserAdmin):
    model = User

    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('photo',)}),
    )

admin.site.register(User, CustUserAdmn)
