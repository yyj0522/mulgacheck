import { supabaseAdmin } from "@/lib/supabase-admin"; 

export async function checkRateLimit(ip: string, endpoint: 'generate' | 'regenerate') {
  const LIMITS = {
    generate: 3,
    regenerate: 20
  };

  const limit = LIMITS[endpoint];
  
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  const { count, error } = await supabaseAdmin
    .from('api_logs')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .eq('endpoint', endpoint)
    .gte('created_at', oneDayAgo.toISOString());

  if (error) {
    console.error("Rate Limit Check Error:", error);
    return { allowed: true, limit, usage: 0 }; 
  }

  const currentUsage = count || 0;

  if (currentUsage >= limit) {
    return { allowed: false, limit, usage: currentUsage };
  }

  return { allowed: true, limit, usage: currentUsage };
}

export async function saveLog(ip: string, endpoint: 'generate' | 'regenerate') {
  const { error } = await supabaseAdmin.from('api_logs').insert({
    ip_address: ip,
    endpoint: endpoint
  });
  
  if (error) console.error("Failed to save api log:", error);
}