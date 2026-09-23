const SUPABASE_URL = "https://jxffhhfunyiwhihhinjd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_G3dkWwqy-9UJMehUoAq4Mw_3FGXsiXa";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const DASHBOARD_URL = "./dashboard.html";
const LOGIN_URL = "./login.html";
