from django.db import models

class Company(models.Model):
  STATUS_CHOICES = [
    ('draft','Draft'),
    ('complete','Complete')
  ]
  
  company_name = models.CharField(max_length=255)
  number_shareholders = models.PositiveIntegerField()
  total_capital_invested = models.DecimalField(max_digits=15, decimal_places=2)
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  def __str__(self):
    return self.company_name

class Shareholder(models.Model):
  company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='shareholders')
  first_name = models.CharField(max_length=100)
  last_name = models.CharField(max_length=100)
  nationality = models.CharField(max_length=100)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.first_name