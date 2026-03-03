from django.urls import path
from .views import (CompanyListCreateView,
                    CompanyDetailView,
                    ShareholderCreateView)

urlpatterns = [
  path('companies/', CompanyListCreateView.as_view()),
  path('companies/<int:pk>/', CompanyDetailView.as_view()),
  path('companies/<int:pk>/shareholders/', ShareholderCreateView.as_view()),
]