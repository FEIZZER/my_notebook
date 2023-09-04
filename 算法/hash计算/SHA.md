##### SHA.h  头文件

```c
#include <stdbool.h>

bool SHA1(void* pBuf, unsigned long long bufLen, char pOut[20]);

bool SHA256(void* pBuf, unsigned long long bufLen, char pOut[32]);
```

##### SHA.c 存放计算sha值的公用代码

```c
#include "SHA.h"
#include <string.h>

#define ROTATE_LEFT(x, n) (((x) << (n)) | ((x) >> (32-(n))))

__inline static int padding_chunk(void* pBuf, unsigned long long bufLen, char tailChunk[128]) {

    int r = (int)(bufLen % 64);

    int appendLen = (r < 56) ? (56 - r) : (56 + 64 - r);

    int copyLen = 64 - (appendLen + 8) % 64;

    copyLen = copyLen == 64 ? 0 : copyLen;

    memcpy(tailChunk, (char*)pBuf + bufLen - copyLen, copyLen);

    memset(tailChunk + copyLen, 0, appendLen);

    tailChunk[copyLen] = 0x80;

    for (int i = 0; i < 8; i++) {
        tailChunk[copyLen + appendLen + i] = ((bufLen * 8) >> ((7 - i) * 8)) & 0xff;
    }

    return appendLen > 56 ? 2 : 1;
}
```



##### SHA1.c 

```c
#include "SHA.h"

#define F0(B, C, D) ((B & C) | (~B & D))
#define F1(B, C, D) (B ^ C ^ D)
#define F2(B, C, D) ((B & C) | (B & D) | (C & D))
#define F3(B, C, D) (B ^ C ^ D)

// 初始化链式变量
static const unsigned int H[5] = {
        0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0
};

static const unsigned int K[4] = {
        0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6
};



__inline static void create_word(const unsigned char chunk[64], unsigned int w[80]) {
    int tmpIdx;
    for (int i = 0; i < 16; i++)
    {
        tmpIdx = 4 * i;
        w[i] = ((unsigned int)chunk[tmpIdx]) << 24 |
               ((unsigned int)chunk[1 + tmpIdx]) << 16 |
               ((unsigned int)chunk[2 + tmpIdx]) << 8 |
               ((unsigned int)chunk[3 + tmpIdx]) << 0;
    }

    for (int i = 16; i < 80; i++)
    {
        w[i] = ROTATE_LEFT(w[i - 16] ^ w[i - 14] ^ w[i - 8] ^ w[i - 3], 1);
    }
}

__inline static void calculate(void* pBuf, unsigned long long originChunk, unsigned int HH[5]) {

    unsigned char inBuf[64];
    memcpy(inBuf, pBuf, 64);
    unsigned int w[80]  = { 0 };
    unsigned int A, B, C, D, E;
    unsigned int f, tmp;
    for (unsigned long long idx = 0; idx < originChunk; idx++)
    {
        create_word((char *) pBuf + idx * 64, w);

        A = HH[0], B = HH[1], C = HH[2], D = HH[3], E = HH[4];
        for (int i = 0; i < 80; i++) {
            switch (i / 20)
            {
                case 0:
                    f = F0(B, C, D);
                    break;
                case 1:
                    f = F1(B, C, D);
                    break;
                case 2:
                    f = F2(B, C, D);
                    break;
                case 3:
                    f = F3(B, C, D);
                    break;
            }
            tmp = E;
            E = D;
            D = C;
            C = (B << 30) | (B >> 2);
            B = A;
            A = ((A << 5) | (A >> 27)) + f + tmp + w[i] + K[i / 20];
        }
        HH[0] = HH[0] + A;
        HH[1] = HH[1] + B;
        HH[2] = HH[2] + C;
        HH[3] = HH[3] + D;
        HH[4] = HH[4] + E;
    }
}

__inline static int padding_chunk(void* pBuf, unsigned long long bufLen, char tailChunk[128]) {

    int r = (int)(bufLen % 64);

    int appendLen = (r < 56) ? (56 - r) : (56 + 64 - r);

    int copyLen = 64 - (appendLen + 8) % 64;
    // copyLen = copyLen == 64 ? 0 : copyLen;
    memcpy(tailChunk, (char*)pBuf + bufLen - copyLen, copyLen);
    memset(tailChunk + copyLen, 0, appendLen);
    tailChunk[copyLen] = 0x80;
    for (int i = 0; i < 8; i++) {
        tailChunk[copyLen + appendLen + i] = ((bufLen * 8) >> ((7 - i) * 8)) & 0xff;
    }

    return appendLen > 56 ? 2 : 1;
}

bool SHA1(void* pBuf, unsigned long long bufLen, char pOut[20]) {

    bool bRet = false;
    unsigned int HH[5];

    do {
        if (bufLen >= (unsigned long long)1 << 61)
        {
            break;
        }
        if (bufLen == 0 && 0 != pBuf)
        {
            break;
        }

        char tailChunk[128] = { 0 };
        memcpy(HH, H, 20);
        calculate(pBuf, bufLen / 64, HH);
        calculate(tailChunk,  padding_chunk(pBuf, bufLen, tailChunk), HH);

        bRet = true;
    } while (0);

    if (bRet) {
        memcpy(pOut, HH, 20);
    }
    else {
        memset(pOut, 0, 20);
    }

    return bRet;

}
```



##### SHA256.c

```c
#include "SHA.c"

typedef unsigned long long EIGHT;

static const unsigned int k[64] = {
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
};
static const unsigned int sha256_hash[8] = {
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
};


__inline static void create_word(unsigned char chunk[64], unsigned int w[64]) {
    int tmpIdx;
    unsigned int tmpwi, tmpwj;
    for (int i = 0; i < 16; i++)
    {
        tmpIdx = 4 * i;
        w[i] = ((unsigned int)chunk[tmpIdx]) << 24 |
               ((unsigned int)chunk[1 + tmpIdx]) << 16 |
               ((unsigned int)chunk[2 + tmpIdx]) << 8 |
               ((unsigned int)chunk[3 + tmpIdx]) << 0;
    }

    for (int i = 16; i < 64; i++)
    {
        tmpwi = ROTATE_LEFT(w[i - 15], 25) ^ ROTATE_LEFT(w[i - 15], 14) ^ (w[i - 15] >> 3);
        tmpwj = ROTATE_LEFT(w[i - 2], 15) ^ ROTATE_LEFT(w[i - 2], 13) ^ (w[i - 2] >> 10);
        w[i] = w[i - 16] + tmpwi + w[i - 7] + tmpwj;
    }
}


__inline static void calculate(void* pBuf, unsigned long long chunkLen, unsigned int HH[8])
{
    unsigned int w[64] = { 0 };
    unsigned int a, b, c, d, e, f, g, h;
    for (int idx = 0; idx < chunkLen; idx++) {

        create_word((char*)pBuf + idx * 64, w);

        // 计算SHA256值
        a = HH[0], b = HH[1], c = HH[2], d = HH[3], e = HH[4], f = HH[5], g = HH[6], h = HH[7];
        for (int i = 0; i < 64; i++) {
            unsigned int s_1 = ROTATE_LEFT(e, 26) ^ ROTATE_LEFT(e, 21) ^ ROTATE_LEFT(e, 7);
            unsigned int ch = (e & f) ^ (~e & g);
            unsigned int temp1 = h + s_1 + ch + k[i] + w[i];
            unsigned int s_0 = ROTATE_LEFT(a, 30) ^ ROTATE_LEFT(a, 19) ^ ROTATE_LEFT(a, 10);
            unsigned int maj = (a & b) ^ (a & c) ^ (b & c);
            unsigned int temp2 = s_0 + maj;
            h = g;
            g = f;
            f = e;
            e = d + temp1;
            d = c;
            c = b;
            b = a;
            a = temp1 + temp2;
        }
        HH[0] += a, HH[1] += b, HH[2] += c, HH[3] += d, HH[4] += e, HH[5] += f, HH[6] += g, HH[7] += h;
    }
}

/**************************************************************/
// 计算SHA256值
// 参数:
//		pBuf-[IN]数据
//		nLen-[IN]pBuf中数据的长度，单位：字节
//		pOut-[IN/OUT]保存结果。
// 返回值: TRUE-成功，FALSE-失败
/**************************************************************/
bool SHA256(void* pBuf, unsigned long long bufLen, char pOut[32]) {

    int bRet = 0;
    unsigned int HH[8];

    do {

        if (bufLen >= (unsigned long long)1 << 61)
        {
            break;
        }
        if (0 != bufLen && NULL == pBuf)
        {
            break;
        }

        char tailChunk[128] = { 0 };
        memcpy(HH, sha256_hash, 32);
        calculate(pBuf, bufLen / 64, HH);
        calculate(tailChunk, padding_chunk(pBuf, bufLen, tailChunk), HH);

        bRet = 1;

    } while (0);

    if (bRet) {
        memcpy(pOut, HH, 32);
    }
    else {
        memset(pOut, 0, 32);
    }

    return bRet;

}
```

