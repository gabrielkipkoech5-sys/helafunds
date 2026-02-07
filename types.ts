
export interface LoanDetails {
  principal: number;
  interestRate: number;
  termYears: number;
  monthlyIncome?: number;
  monthlyExpenses?: number;
}

export interface AmortizationPeriod {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
}

export interface AIAdvice {
  riskScore: number;
  verdict: string;
  pros: string[];
  cons: string[];
  recommendation: string;
}

export interface CalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: AmortizationPeriod[];
}
