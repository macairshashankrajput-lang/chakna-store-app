import { supabase } from './lib/supabase-service';

async function test() {
  const { data, error } = await supabase.auth.signInWithPassword({ email: 'info.shashankrajput@gmail.com', password: 'asdfghjkl' });
  console.log('SignIn:', { data, error });
}
test();
