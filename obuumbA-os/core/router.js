const rules=[
["accommodation",/\b(?:hotel|lodge|room|stay|accommodation)\b/i],
["transport",/\b(?:airport|taxi|pickup|ride|transport|driver)\b/i],
["tour_activity",/\b(?:tour|cruise|sunset|activity|excursion)\b/i],
["food",/\b(?:food|restaurant|meal|eat|catering)\b/i],
["shopping",/\b(?:shop|buy|store|shopping)\b/i],
["creative_design",/\b(?:logo|design|brand|poster|music|video|art)\b/i],
["tech_help",/\b(?:phone|computer|tech|ai|software|website)\b/i],
["business",/\b(?:business|client|sales|invoice|money|company)\b/i]
];

const locationPattern=/\b(?:in|at|near|from|to)\s+([A-Za-z][A-Za-z' -]{1,40}?)(?=\s+(?:today|tonight|tomorrow|on|at|for|under|within)\b|[,.;]|$)/i;
const partyPattern=/\b(?:for|party of|group of)\s+(\d{1,3})\s*(?:people|persons|guests|pax)?\b/i;

export function classify(message){
  const m=String(message||"");
  const hits=rules.filter(([,re])=>re.test(m)).map(([x])=>x);
  return hits.length?hits:["other"];
}

export function extractRequirements(message){
  const m=String(message||"");
  const timeHints=m.match(/\b\d{1,2}(?::\d{2})?\s?(?:am|pm)\b/gi)||[];
  const budgetHints=m.match(/\b(?:ZMW|K|USD|US\$)\s?[\d,]+(?:\.\d+)?\b/gi)||[];
  const dateHints=m.match(/\b(?:today|tonight|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi)||[];
  const location= m.match(locationPattern)?.[1]?.trim()||null;
  const partySize=Number(m.match(partyPattern)?.[1]||0)||null;
  return {raw:m,dateHints,timeHints,budgetHints,location,partySize};
}
