
import { LoanDetails, CalculationResult, AmortizationPeriod } from '../types';

export const calculateLoan = (details: LoanDetails): CalculationResult => {
  const { principal, interestRate, termYears } = details;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = termYears * 12;

  // Monthly Payment Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const schedule: AmortizationPeriod[] = [];
  let balance = principal;
  let totalInterest = 0;

  for (let i = 1; i <= numberOfPayments; i++) {
    const interest = balance * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    balance -= principalPaid;
    totalInterest += interest;

    // Only store quarterly or significant points if the loan is long to avoid massive arrays in state
    // But for a calculator, a full schedule is usually fine for < 30 years
    schedule.push({
      month: i,
      payment: monthlyPayment,
      principal: principalPaid,
      interest: interest,
      balance: Math.max(0, balance),
      totalInterest: totalInterest
    });
  }

  return {
    monthlyPayment,
    totalPayment: monthlyPayment * numberOfPayments,
    totalInterest,
    schedule
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
  }).format(value / 100);
};
