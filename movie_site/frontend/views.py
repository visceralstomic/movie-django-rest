from django.shortcuts import render

def index(request, *args, **kwarg):
    return render(request, 'frontend/index.html')
