export interface Transaction {
  from: string;
  to: string;
  amount: number;
  type: 'transfer' | 'payment' | 'loan' | 'deposit';
  timestamp: number;
}

export interface RiskAssessment {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  recommended: boolean;
}

export class RiskEngine {
  private blacklistedAddresses: Set<string> = new Set();
  private transactionHistory: Map<string, Transaction[]> = new Map();
  private userCreditScores: Map<string, number> = new Map();

  constructor() {
    this.userCreditScores.set('default', 70);
  }

  assessTransactionRisk(transaction: Transaction): RiskAssessment {
    const reasons: string[] = [];
    let riskScore = 0;

    if (this.blacklistedAddresses.has(transaction.from)) {
      reasons.push('发送方地址在黑名单中');
      riskScore += 80;
    }

    if (this.blacklistedAddresses.has(transaction.to)) {
      reasons.push('接收方地址在黑名单中');
      riskScore += 80;
    }

    if (transaction.amount > 100000) {
      reasons.push('交易金额超过大额阈值');
      riskScore += 30;
    }

    const fromHistory = this.transactionHistory.get(transaction.from) || [];
    const recentTransactions = fromHistory.filter(t => Date.now() - t.timestamp < 3600000);
    if (recentTransactions.length > 10) {
      reasons.push('短时间内交易频繁');
      riskScore += 20;
    }

    const creditScore = this.userCreditScores.get(transaction.from) || 50;
    if (creditScore < 60) {
      reasons.push('用户信用评分较低');
      riskScore += 25;
    }

    riskScore = Math.min(riskScore, 100);

    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (riskScore < 30) riskLevel = 'low';
    else if (riskScore < 60) riskLevel = 'medium';
    else if (riskScore < 80) riskLevel = 'high';
    else riskLevel = 'critical';

    this.recordTransaction(transaction);

    return {
      riskScore,
      riskLevel,
      reasons,
      recommended: riskScore < 50
    };
  }

  assessCreditRisk(userId: string, loanAmount: number): RiskAssessment {
    const reasons: string[] = [];
    let riskScore = 0;

    const creditScore = this.userCreditScores.get(userId) || 50;
    if (creditScore < 60) {
      reasons.push('信用评分不足');
      riskScore += 40;
    }

    if (loanAmount > creditScore * 1000) {
      reasons.push('贷款额度过高');
      riskScore += 30;
    }

    riskScore = Math.min(riskScore, 100);

    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (riskScore < 30) riskLevel = 'low';
    else if (riskScore < 60) riskLevel = 'medium';
    else if (riskScore < 80) riskLevel = 'high';
    else riskLevel = 'critical';

    return {
      riskScore,
      riskLevel,
      reasons,
      recommended: riskScore < 40
    };
  }

  addToBlacklist(address: string): void {
    this.blacklistedAddresses.add(address);
  }

  removeFromBlacklist(address: string): void {
    this.blacklistedAddresses.delete(address);
  }

  updateCreditScore(userId: string, score: number): void {
    this.userCreditScores.set(userId, Math.min(Math.max(score, 0), 100));
  }

  private recordTransaction(transaction: Transaction): void {
    const history = this.transactionHistory.get(transaction.from) || [];
    history.push(transaction);
    this.transactionHistory.set(transaction.from, history);
  }
}
