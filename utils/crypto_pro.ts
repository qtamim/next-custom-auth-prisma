import crypto from 'crypto';

const algorithm = 'aes-256-gcm';

// توليد مفتاح عشوائي
function generateKey(): Buffer {
  return crypto.randomBytes(32); // مفتاح 256 بت
}

// تشفير النص
export function encryptPro(text: string): string {
  const key = generateKey();
  const iv = crypto.randomBytes(12); // يستخدم عادةً 12 بايت للـ IV في aes-256-gcm
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${key.toString('hex')}:${authTag}:${encrypted}`;
}

// فك تشفير النص
export function decryptPro(encryptedText: string): string {
  const [ivHex, keyHex, authTagHex, encrypted] = encryptedText.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const key = Buffer.from(keyHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
