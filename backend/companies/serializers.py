from decimal import Decimal, InvalidOperation

from rest_framework import serializers
from .models import Company, Shareholder


def _normalize_text(value: str) -> str:
  return " ".join(value.strip().split())


def _validate_alpha_text(value: str, field_label: str, *, min_len: int = 1) -> str:
  if value is None:
    raise serializers.ValidationError(f"{field_label} is required")

  normalized = _normalize_text(str(value))
  if not normalized:
    raise serializers.ValidationError(f"{field_label} is required")

  if len(normalized) < min_len:
    raise serializers.ValidationError(
      f"{field_label} must be at least {min_len} characters"
    )

  allowed = {" ", "-", "'"}
  if not any(ch.isalpha() for ch in normalized):
    raise serializers.ValidationError(
      f"{field_label} must contain at least one letter"
    )

  if not all(ch.isalpha() or ch in allowed for ch in normalized):
    raise serializers.ValidationError(
      f"{field_label} can only contain letters, spaces, hyphens, and apostrophes"
    )
  return normalized

class ShareholderSerializer(serializers.ModelSerializer):
  class Meta:
    model = Shareholder
    fields = ['id','first_name','last_name','nationality','created_at']
    read_only_fields = ['id', 'created_at']

  def validate_first_name(self, value):
    return _validate_alpha_text(value, 'First name', min_len=2)

  def validate_last_name(self, value):
    return _validate_alpha_text(value, 'Last name', min_len=2)

  def validate_nationality(self, value):
    return _validate_alpha_text(value, 'Nationality', min_len=2)

class CompanySerializer(serializers.ModelSerializer):
  class Meta:
    model = Company
    fields = ['id','company_name','number_shareholders','total_capital_invested','status','created_at']
    read_only_fields = ['id', 'status', 'created_at']

  def validate_company_name(self, value):
    return _validate_alpha_text(value, 'Company name', min_len=2)

  def validate_number_shareholders(self, value):
    if value is None:
      raise serializers.ValidationError('Number of shareholders is required')
    if value < 1:
      raise serializers.ValidationError('Must have at least 1 shareholder')
    if value > 100:
      raise serializers.ValidationError('Number of shareholders is too large')
    return value

  def validate_total_capital_invested(self, value):
    if value is None:
      raise serializers.ValidationError('Total capital invested is required')
    try:
      decimal_value = Decimal(value)
    except (InvalidOperation, TypeError):
      raise serializers.ValidationError('Total capital invested must be a valid number')
    if decimal_value <= 0:
      raise serializers.ValidationError('Capital must be greater than 0')
    return value
  
class CompanyDetailSerializer(serializers.ModelSerializer):
  shareholders = ShareholderSerializer(many = True, read_only = True)
  class Meta:
    model = Company
    fields = [
      'id','company_name','number_shareholders',
      'total_capital_invested','status','created_at','shareholders'
    ]