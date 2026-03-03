from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.db import transaction
from .models import Company, Shareholder
from .serializers import CompanySerializer, ShareholderSerializer, CompanyDetailSerializer

class CompanyListCreateView(APIView):
  def get(self, request):
    companies = Company.objects.prefetch_related('shareholders').all()
    serializer = CompanyDetailSerializer(companies, many = True)
    return Response(serializer.data)
  
  def post(self, request):
    serializer = CompanySerializer(data = request.data)
    if serializer.is_valid():
      serializer.save(status = 'draft')
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CompanyDetailView(APIView):
  def get(self, request, pk):
    try:
      company = Company.objects.prefetch_related('shareholders').get(pk = pk)
    except Company.DoesNotExist:
      return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = CompanyDetailSerializer(company)
    return Response(serializer.data)

  def patch(self, request, pk):
    try:
      company = Company.objects.get(pk=pk)
    except Company.DoesNotExist:
      return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)

    if company.status != 'draft':
      return Response(
        {'error': 'Only draft companies can be updated'},
        status=status.HTTP_400_BAD_REQUEST,
      )

    serializer = CompanySerializer(company, data=request.data, partial=True)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ShareholderCreateView(APIView):
  def post(self, request, pk):
    try:
      company = Company.objects.get(pk = pk)
    except Company.DoesNotExist:
      return Response({'error':'Company not Found'}, status= status.HTTP_404_NOT_FOUND)

    if company.status != 'draft':
      return Response(
        {'error': 'Shareholders can only be added to draft companies'},
        status=status.HTTP_400_BAD_REQUEST,
      )

    Shareholders_data = request.data

    if not isinstance(Shareholders_data, list):
      return Response(
        {'error': 'Expected a list of shareholders'},
        status=status.HTTP_400_BAD_REQUEST,
      )

    if len(Shareholders_data) != company.number_shareholders:
      return Response(
        {'error': f'Expected {company.number_shareholders} shareholders, got {len(Shareholders_data)}'},
        status = status.HTTP_400_BAD_REQUEST
      )
    serializer = ShareholderSerializer(data = Shareholders_data, many = True)
    if serializer.is_valid():
      with transaction.atomic():
        serializer.save(company=company)
        company.status = 'complete'
        company.save(update_fields=['status', 'updated_at'])
      return Response(
        CompanyDetailSerializer(company).data,
        status = status.HTTP_201_CREATED
      )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)