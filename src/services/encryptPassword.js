import JSEncrypt from 'jsencrypt';

export const encryptPassword = async (password) => {
  try {
    const keyUrl = `${process.env.PUBLIC_URL}/public.pem`; // ✅ correct relative path

    const res = await fetch(keyUrl);
    if (!res.ok) throw new Error(`Failed to load public key from ${keyUrl}`);

    const publicKey = await res.text();

    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey.trim());

    const encrypted = encryptor.encrypt(password);
    if (!encrypted) throw new Error('Encryption failed');

    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};
