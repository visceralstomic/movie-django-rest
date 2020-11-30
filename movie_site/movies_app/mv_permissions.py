from rest_framework import permissions



class IsAdminOrReadOnly(permissions.BasePermission):

	def has_permission(self, request, view):
		return True if request.method in permissions.SAFE_METHODS else request.user.is_staff



class IsNotAdmin(permissions.BasePermission):

	def has_permission(self, request, view):
		if request.user.is_staff:
			return True if request.method in permissions.SAFE_METHODS else False
		else:
			return True
