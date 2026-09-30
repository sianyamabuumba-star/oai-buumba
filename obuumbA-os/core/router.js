const rules=[
["accommodation",/hotel|lodge|room|stay|accommodation/i],
["transport",/airport|taxi|pickup|ride|transport|driver/i],
["tour_activity",/tour|cruise|sunset|activity|excursion/i],
["food",/food|restaurant|meal|eat|catering/i],
["shopping",/shop|buy|store|shopping/i],
["creative_design",/logo|design|brand|poster|music|video|art/i],
["tech_help",/phone|computer|tech|\bai\b|software|website/i],
["business",/business|client|sales|invoice|money|company/i]
];
export function classify(message){
  const m=String(message||"");
  const hits=rules.filter(([,re])=>re.test(m)).map(([x])=>x);
  return hits.length?hits:["other"];
}
export function extractRequirements(message){
  const m=String(message||"");
  return {
    raw:m,
    dateHints:(m.match(/\b(?:today|tonight|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi)||[]),
    timeHints:(m.match(/\b\d{1,2}(?::\d{2})?\s?(?:am|pm)\b/gi)||[]),
    budgetHints:(m.match(/\b(?:ZMW|K|USD|US\$)\s?[\d,]+(?:\.\d+)?\b/gi)||[])
  };
}
