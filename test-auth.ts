import { supabase } from './lib/supabase-service';

async function test() {
  const email = 'info.shashankrajput@gmail.com';
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: 'asdfghjkl' });
  console.log('SignIn:', { data, error });
}
test();
