import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string || 'token-images';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Prepare image for Sightengine (Direct Upload Method)
    const sightengineData = new FormData();
    sightengineData.append('media', file);
    // This model string includes nudity, gore, offensive symbols, and drugs
    sightengineData.append('models', 'nudity-2.1,weapon,recreational_drug,medical,offensive-2.0,text-content,face-age,qr-content,self-harm,gore-2.0');
    sightengineData.append('api_user', process.env.SIGHTENGINE_USER!);
    sightengineData.append('api_secret', process.env.SIGHTENGINE_SECRET!);

    // 2. Send to Moderation API
    const moderationRes = await fetch('https://api.sightengine.com/1.0/check.json', {
      method: 'POST',
      body: sightengineData,
    });

    const moderationData = await moderationRes.json();

    if (moderationData.status !== 'success') {
      throw new Error('Moderation service failed');
    }

    // 3. Check the results (Block if probability is over 50%)
    const { nudity, gore, offensive, weapon } = moderationData;
    
    const isExplicit = 
      (nudity?.sexual_activity > 0.5) || 
      (nudity?.sexual_display > 0.5) || 
      (nudity?.erotica > 0.5);

    const isViolent = 
      (gore?.prob > 0.5) || 
      (offensive?.prob > 0.5) ||
      (weapon?.classes?.firearm > 0.5) ||
      (weapon?.classes?.knife > 0.5);

    if (isExplicit || isViolent) {
      return NextResponse.json({ 
        error: 'Image rejected: Contains explicit, violent, or offensive content.' 
      }, { status: 403 });
    }

    // 4. If safe, upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return NextResponse.json({ success: true, url: data.publicUrl });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
