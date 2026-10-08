interface TierData {
  min: number;
  max: number;
  target_vol: number;
  max_vol_pts: number;
  credit_limit: number;
}

export interface UserData {
  months_active: number;
  unique_tx_this_month: number;
  daily_consistency_points: number;
  repeat_senders_this_month: number;
  new_senders_this_month: number;
  actual_30_day_volume: number;
  outstanding_balance: number;
  previous_tier: number;
  months_in_default?: number;
}

export class VouchEngine {
  private TIERS: Record<number, TierData> = {
    1: { min: 0, max: 399, target_vol: 0, max_vol_pts: 0, credit_limit: 0 },
    2: { min: 400, max: 599, target_vol: 50000, max_vol_pts: 100, credit_limit: 50000 },
    3: { min: 600, max: 799, target_vol: 150000, max_vol_pts: 200, credit_limit: 150000 },
    4: { min: 800, max: 1000, target_vol: 500000, max_vol_pts: 300, credit_limit: 500000 }
  };

  private calculateVariableA(monthsActive: number, uniqueTx: number): number {
    const maxAgePoints = 150;
    if (uniqueTx >= 10) {
      return Math.min(monthsActive * 12, maxAgePoints);
    }
    return 0;
  }

  private calculateVariableB(dailyConsistency: number): number {
    return Math.min(dailyConsistency, 300);
  }

  private calculateVariableC(repeatSenders: number, newSenders: number): number {
    const points = (repeatSenders * 13) + (newSenders * 7);
    return Math.min(points, 250);
  }

  private determineTier(score: number): { tierLevel: number; data: TierData } {
    for (const [tier, data] of Object.entries(this.TIERS)) {
      if (score >= data.min && score <= data.max) {
        return { tierLevel: parseInt(tier), data };
      }
    }
    if (score > 1000) return { tierLevel: 4, data: this.TIERS[4] };
    return { tierLevel: 1, data: this.TIERS[1] };
  }

  private calculateVariableD(baseScore: number, actualVolume: number): number {
    const { tierLevel, data } = this.determineTier(baseScore);
    
    if (tierLevel === 1) return 0;

    const volumeRatio = actualVolume / data.target_vol;
    const points = volumeRatio * data.max_vol_pts;
    
    return Math.min(points, data.max_vol_pts);
  }

  private processSafetyBrakes(totalScore: number, outstandingBalance: number, previousTier: number, monthsInDefault: number = 0) {
    const { tierLevel: currentTier, data: tierData } = this.determineTier(totalScore);
    const newCreditLimit = tierData.credit_limit;
    
    let penalty = 0;
    let state = "Active";

    if (currentTier < previousTier && outstandingBalance > newCreditLimit) {
      state = "Repayment-Only";
    } 
    else if (newCreditLimit > 0) {
      const utilization = outstandingBalance / newCreditLimit;
      if (utilization > 0.80) {
        penalty = -50 * (1 + monthsInDefault);
        state = `Over-Limit (Penalty Active: ${penalty} pts)`;
      }
    }

    const finalScore = totalScore + penalty;
    const { tierLevel: finalTier, data: finalTierData } = this.determineTier(finalScore);

    return {
      finalScore,
      finalTier,
      finalLimit: finalTierData.credit_limit,
      accountState: state
    };
  }

  public evaluateB2bFastTrack(targetTier: number, claimedVolume: number, squadVolume: number, passedBehaviorCheck: boolean) {
    if (targetTier > 3) targetTier = 3;

    if (!passedBehaviorCheck) {
      return { passed: false, message: "Failed behavioral probation. Reverting to organic score.", tier: null, limit: 0 };
    }

    const matchPercentage = squadVolume / claimedVolume;
    if (matchPercentage >= 0.70) {
      return { 
        passed: true, 
        message: `70% Match Cleared. Unlocked Tier ${targetTier}.`, 
        tier: targetTier, 
        limit: this.TIERS[targetTier].credit_limit 
      };
    }

    return { 
      passed: false, 
      message: `Failed 70% Match. Actual: ${(matchPercentage * 100).toFixed(1)}%. Reverting to organic score.`, 
      tier: null, 
      limit: 0 
    };
  }

  public calculateFinalProfile(userData: UserData) {
    const varA = this.calculateVariableA(userData.months_active, userData.unique_tx_this_month);
    const varB = this.calculateVariableB(userData.daily_consistency_points);
    const varC = this.calculateVariableC(userData.repeat_senders_this_month, userData.new_senders_this_month);
    
    const baseScore = varA + varB + varC;
    const varD = this.calculateVariableD(baseScore, userData.actual_30_day_volume);
    
    const totalScore = baseScore + varD;
    const monthsInDefault = userData.months_in_default || 0;

    const { finalScore, finalTier, finalLimit, accountState } = this.processSafetyBrakes(
      totalScore, 
      userData.outstanding_balance, 
      userData.previous_tier, 
      monthsInDefault
    );

    return {
      Final_Score: Math.round(finalScore),
      Current_Tier: finalTier,
      Credit_Limit: finalLimit,
      Account_State: accountState,
      Metrics_Breakdown: {
        Var_A_Age: Math.round(varA),
        Var_B_Consistency: Math.round(varB),
        Var_C_Network: Math.round(varC),
        Var_D_Volume: Math.round(varD)
      }
    };
  }
}
