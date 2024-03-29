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


class IsRaterOrRead(permissions.BasePermission):

	def has_object_permission(self, request, view, obj):
		if request.user == obj.user :
			return True
		else:
			return request.method in permissions.SAFE_METHODS


class IsReviewerOrRead(permissions.BasePermission):

	def has_object_permission(self, request, view, obj):
		return True if request.user == obj.author else request.method in permissions.SAFE_METHODS
