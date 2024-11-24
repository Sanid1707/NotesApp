using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace Notes.Common.Utils
{
    public class CryptoHelper
    {
        private static string EncryptionKey;

        // Initialize the CryptoHelper with the encryption key from the configuration
        public static void Initialize(IConfiguration configuration)
        {
            EncryptionKey = configuration["Encryption:Key"];
            if (string.IsNullOrWhiteSpace(EncryptionKey) || EncryptionKey.Length < 32)
            {
                throw new Exception("Invalid or missing encryption key in configuration. Ensure the key is at least 32 characters.");
            }
        }

        // Convert the provided encryption key into a valid 256-bit AES key
        private static byte[] GetEncryptionKey()
        {
            using var sha256 = SHA256.Create();
            return sha256.ComputeHash(Encoding.UTF8.GetBytes(EncryptionKey));
        }

        private static byte[] GenerateSalt()
        {
            var salt = new byte[16];
            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(salt);
            }
            return salt;
        }

        private static byte[] GenerateKeyFromSalt(byte[] salt)
        {
            using var rfc2898Db = new Rfc2898DeriveBytes(GetEncryptionKey(), salt, 10000);
            return rfc2898Db.GetBytes(32);
        }

        public static string Encrypt(string input)
        {
            try
            {
                if (string.IsNullOrEmpty(input))
                    return null;

                byte[] encrypted;
                var salt = GenerateSalt();

                using (var ms = new MemoryStream())
                {
                    using (var aes = Aes.Create())
                    {
                        aes.KeySize = 256;
                        aes.BlockSize = 128;
                        aes.GenerateIV(); // Generate a random IV
                        aes.Padding = PaddingMode.PKCS7;
                        aes.Mode = CipherMode.CBC;
                        aes.Key = GenerateKeyFromSalt(salt);

                        using var cs = new CryptoStream(ms, aes.CreateEncryptor(), CryptoStreamMode.Write);
                        ms.Write(aes.IV, 0, aes.IV.Length); // Write IV to output
                        ms.Write(salt, 0, salt.Length); // Write salt to output
                        cs.Write(Encoding.UTF8.GetBytes(input), 0, Encoding.UTF8.GetBytes(input).Length);
                    }

                    encrypted = ms.ToArray();
                }

                return Convert.ToBase64String(encrypted);
            }
            catch
            {
                return input;
            }
        }

        public static string Decrypt(string input)
        {
            try
            {
                if (string.IsNullOrEmpty(input))
                    return null;

                byte[] decrypted;
                var data = Convert.FromBase64String(input);

                using (var ms = new MemoryStream(data))
                {
                    using var aes = Aes.Create();
                    var iv = new byte[16];
                    var salt = new byte[16];
                    ms.Read(iv, 0, iv.Length); // Read the IV from the input
                    ms.Read(salt, 0, salt.Length); // Read the salt from the input

                    aes.KeySize = 256;
                    aes.BlockSize = 128;
                    aes.IV = iv;
                    aes.Padding = PaddingMode.PKCS7;
                    aes.Mode = CipherMode.CBC;
                    aes.Key = GenerateKeyFromSalt(salt);

                    using var cs = new CryptoStream(ms, aes.CreateDecryptor(), CryptoStreamMode.Read);
                    var temp = new byte[ms.Length - iv.Length - salt.Length];
                    var bytesRead = cs.Read(temp, 0, temp.Length);
                    decrypted = new byte[bytesRead];
                    Buffer.BlockCopy(temp, 0, decrypted, 0, bytesRead);
                }

                return Encoding.UTF8.GetString(decrypted);
            }
            catch (Exception e)
            {
                Console.WriteLine($"Decryption error: {e.Message}");
                return input;
            }
        }
    }
}