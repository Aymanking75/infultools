import React from 'react';

export enum ToolType {
  OPTIMIZER = 'optimizer',
  HASHTAGS = 'hashtags',
  SCRIPT = 'script',
  IDEAS = 'ideas',
  IMAGE = 'image'
}

export interface ToolDef {
  id: ToolType;
  title: string;
  description: string;
  icon: React.ReactNode;
  promptTemplate: (input: string) => string;
  inputLabel: string;
  inputPlaceholder: string;
  color: string;
}

export interface PricingPlan {
  title: string;
  price: string;
  period: string;
  features: string[];
  isPro: boolean;
  buttonText: string;
  buttonColor: string;
}