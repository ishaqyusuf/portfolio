<?php

/**
 * Created by PhpStorm.
 * User: ABOO SOFIYYAT
 * Date: 3/9/2019
 * Time: 5:44 PM
 */

namespace App\Helpers\Common;


abstract class Crypto
{
    public static $input = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    public static function encrypt($data, $salt = null)
    {
        $passphrase = '7478h27h&*&&H8d7h8';
        $salt = $salt ?: openssl_random_pseudo_bytes(8);
        list($key, $iv) = self::evpkdf($passphrase, $salt);
        $ct = openssl_encrypt($data, 'aes-256-cbc', $key, true, $iv);
        return self::encode($ct, $salt);
    }

    public static function evpkdf($passphrase, $salt)
    {
        $salted = '';
        $dx = '';
        while (strlen($salted) < 48) {
            $dx = md5($dx . $passphrase . $salt, true);
            $salted .= $dx;
        }
        $key = substr($salted, 0, 32);
        $iv = substr($salted, 32, 16);
        return [$key, $iv];
    }

    public static function encode($ct, $salt)
    {
        return base64_encode("Salted__" . $salt . $ct);
    }

    /**
     * @param string $base64 encrypted data in base64 OpenSSL format
     * @param string $passphrase
     * @return string
     */
    public static function decrypt($base64)
    {
        $passphrase = '7478h27h&*&&H8d7h8'; //env('CRYPTO_PHRASE');
        list($ct, $salt) = self::decode($base64);
        list($key, $iv) = self::evpkdf($passphrase, $salt);
        $data = openssl_decrypt($ct, 'aes-256-cbc', $key, true, $iv);
        return $data;
    }

    public static function decode($base64)
    {
        $data = base64_decode($base64);
        if (substr($data, 0, 8) !== "Salted__") {
            throw new \InvalidArgumentException();
        }
        $salt = substr($data, 8, 8);
        $ct = substr($data, 16);
        return [$ct, $salt];
    }
    public static function generate_number($strength = 5)
    {
        return self::generate($strength, '0123456789');
    }
    public static function generate($strength, $input)
    {
        $input_length = strlen($input);
        $random_string = '';
        for ($i = 0; $i < $strength; $i++) {
            $random_character = $input[mt_rand(0, $input_length - 1)];
            $random_string .= $random_character;
        }
        return $random_string;
    }
    public static function generate_string($strength = 16)
    {
        return self::generate($strength, self::$input);
    }

    public static function shuffle_an($strength = 20)
    {
        return substr(str_shuffle(self::$input), 0, $strength);
    }
}
