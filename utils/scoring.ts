import { StockData, ScoreResult } from "../types";

export const calculateScore = (data: StockData): ScoreResult => {
  const { criteria } = data;
  const reasons: string[] = [];

  // 1. Assess FA (Fundamental Analysis) - Max 4 points
  let faScore = 0;
  
  if (criteria.rev_growth_pos.value) faScore += 1;
  else reasons.push("FA: Tăng trưởng doanh thu/lợi nhuận âm hoặc đi ngang");

  if (criteria.val_attractive.value) faScore += 1;
  else reasons.push("FA: Định giá (P/E, P/B) cao hơn trung bình ngành");

  if (criteria.health_safe.value) faScore += 1;
  else reasons.push("FA: Nợ vay cao hoặc dòng tiền yếu");

  if (criteria.story_clear.value) faScore += 1;
  
  faScore = Math.min(faScore, 4);

  // 2. Assess TA (Technical Analysis) - Max 4 points
  let taScore = 0;

  if (criteria.trend_up.value) taScore += 1.5;
  else reasons.push("TA: Xu hướng chính chưa phải là Tăng");

  if (criteria.price_abv_ma.value) taScore += 1.0;
  else reasons.push("TA: Giá nằm dưới các đường MA quan trọng");

  if (criteria.vol_support.value) taScore += 1.0;
  else reasons.push("TA: Dòng tiền (Volume) không ủng hộ xu hướng");

  if (criteria.indicators_good.value) taScore += 0.5;

  taScore = Math.min(taScore, 4);

  // 3. Assess Momentum - Max 2 points
  let momScore = 0;

  if (criteria.news_support.value) momScore += 1.0;
  
  if (criteria.foreign_buy.value) momScore += 1.0;
  else reasons.push("MOM: Thiếu sự đồng thuận từ Khối ngoại/Tự doanh");

  momScore = Math.min(momScore, 2);

  // Final Calculations
  const totalScore = faScore + taScore + momScore;

  let rating = "";
  let action = "";

  if (totalScore < 5.0) {
    rating = "🔴 KÉM (Rủi ro cao)";
    action = "Canh bán / Tránh xa";
  } else if (totalScore <= 7.0) {
    rating = "🟡 TRUNG TÍNH (Theo dõi)";
    action = "Nắm giữ / Quan sát thêm";
  } else {
    rating = "🟢 MẠNH (Cơ hội Mua)";
    action = "Gia tăng tỷ trọng / Mua mới";
  }

  return {
    faScore,
    taScore,
    momScore,
    totalScore,
    rating,
    action,
    reasons
  };
};
