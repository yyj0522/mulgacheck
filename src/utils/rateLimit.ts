import { supabase } from "@/lib/supabase";

export async function checkRateLimit(ip: string, endpoint: 'generate' | 'regenerate') {
  const LIMITS = {
    generate: 3,
    regenerate: 10
  };

  const limit = LIMITS[endpoint];
  
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  const { count, error } = await supabase
    .from('api_logs')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .eq('endpoint', endpoint)
    .gte('created_at', oneDayAgo.toISOString());

  if (error) {
    return { allowed: true, limit };
  }

  if (count !== null && count >= limit) {
    return { allowed: false, limit };
  }

  return { allowed: true, limit };
}

export async function saveLog(ip: string, endpoint: 'generate' | 'regenerate') {
  await supabase.from('api_logs').insert({
    ip_address: ip,
    endpoint: endpoint
  });
}