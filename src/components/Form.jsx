import React from 'react';
import styled from 'styled-components';

// Form container and basic elements
export const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #4B5563;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  background: #F9FAFB;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4263EB;
    box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.1);
    background: #FFFFFF;
  }
  
  &::placeholder {
    color: #9CA3AF;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  background: #F9FAFB;
  resize: vertical;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4263EB;
    box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.1);
    background: #FFFFFF;
  }
  
  &::placeholder {
    color: #9CA3AF;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  background: #F9FAFB;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4263EB;
    box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.1);
    background-color: #FFFFFF;
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  margin-right: 10px;
  accent-color: #4263EB;
  cursor: pointer;
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

export const RadioOption = styled.div`
  display: flex;
  align-items: center;
`;

export const Radio = styled.input.attrs({ type: 'radio' })`
  width: 18px;
  height: 18px;
  margin-right: 10px;
  accent-color: #4263EB;
  cursor: pointer;
`;

export const FieldError = styled.div`
  color: #EF4444;
  font-size: 13px;
  margin-top: 6px;
`;

export const FormDivider = styled.div`
  margin: 32px 0;
  border-top: 1px solid #E5E7EB;
  position: relative;
  
  &:after {
    content: "OR";
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: #FFFFFF;
    padding: 0 12px;
    color: #9CA3AF;
    font-size: 13px;
    font-weight: 500;
  }
`;

// Card layout for form sections
export const FormCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #F3F4F6;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  }
`;

export const FormHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
`;

export const FormTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
`;

export const FormSubtitle = styled.p`
  font-size: 15px;
  color: #6B7280;
  max-width: 420px;
  margin: 0 auto;
`;