## UFT-8编码记录

utf-8使用1~4个字节为每个字符编码：[可以查看字符UTF-8编码值的网页](http://www.mytju.com/classcode/tools/encode_utf8.asp)

###### 一个字节

US-ASCII字符都采用1个字节编码 (常见的字母数字英语标点都是) 。只接受0x00~0x7F范围的编码，即 *0XXXXXXX* 。共127个可用值，其中真正被使用的是 **0x21~0x7E** 这几个位置，其余处于 control 状态。[[#UTF-8中1字节编码对照表]]

###### 两个字节

带有变音符号的拉丁文、希腊文、西里尔字母、亚美尼亚语、希伯来文、阿拉伯文、叙利亚文等字母则需要2字节编码。第一个字节以为 *110XXXXX* 开始，第二字节为 *10XXXXXX*。所有开头为10的字节都是与前面字节一起组成字符的。

###### 三个字节

其他语言的字符（包括中日韩文字、东南亚文字、中东文字等）包含了大部分常用字，使用3字节编码。第一个字节*1110*开头，后面的字节以*10*开头

###### 四个字节

其他极少使用的语言字符使用4字节编码。

###### 总结

| 1st Byte | 2nd Byte | 3rd Byte | 4th Byte | Number of Free Bits | Maximum Expressible Unicode Value |
| :------- | :------- | :------- | :------- | :------------------ | :-------------------------------- |
| 0xxxxxxx |          |          |          | 7                   | 007F hex (127)                    |
| 110xxxxx | 10xxxxxx |          |          | (5+6)=11            | 07FF hex (2047)                   |
| 1110xxxx | 10xxxxxx | 10xxxxxx |          | (4+6+6)=16          | FFFF hex (65535)                  |
| 11110xxx | 10xxxxxx | 10xxxxxx | 10xxxxxx | (3+6+6+6)=21        | 10FFFF hex (1,114,111)            |


###### UTF-8中1字节编码对照表

| 1字节utf-8码 | char |      |                        |
| ------------ | ---- | ---- | ---------------------- |
| U+0021       | !    | 33   | EXCLAMATION MARK       |
| U+0022       | "    | 34   | QUOTATION MARK         |
| U+0023       | #    | 35   | NUMBER SIGN            |
| U+0024       | $    | 36   | DOLLAR SIGN            |
| U+0025       | %    | 37   | PERCENT SIGN           |
| U+0026       | &    | 38   | AMPERSAND              |
| U+0027       | '    | 39   | APOSTROPHE             |
| U+0028       | (    | 40   | LEFT PARENTHESIS       |
| U+0029       | )    | 41   | RIGHT PARENTHESIS      |
| U+002A       | *    | 42   | ASTERISK               |
| U+002B       | +    | 43   | PLUS SIGN              |
| U+002C       | ,    | 44   | COMMA                  |
| U+002D       | -    | 45   | HYPHEN-MINUS           |
| U+002E       | .    | 46   | FULL STOP              |
| U+002F       | /    | 47   | SOLIDUS                |
| U+0030       | 0    | 48   | DIGIT ZERO             |
| U+0031       | 1    | 49   | DIGIT ONE              |
| U+0032       | 2    | 50   | DIGIT TWO              |
| U+0033       | 3    | 51   | DIGIT THREE            |
| U+0034       | 4    | 52   | DIGIT FOUR             |
| U+0035       | 5    | 53   | DIGIT FIVE             |
| U+0036       | 6    | 54   | DIGIT SIX              |
| U+0037       | 7    | 55   | DIGIT SEVEN            |
| U+0038       | 8    | 56   | DIGIT EIGHT            |
| U+0039       | 9    | 57   | DIGIT NINE             |
| U+003A       | :    | 58   | COLON                  |
| U+003B       | ;    | 59   | SEMICOLON              |
| U+003C       | <    | 60   | LESS-THAN SIGN         |
| U+003D       | =    | 61   | EQUALS SIGN            |
| U+003E       | >    | 62   | GREATER-THAN SIGN      |
| U+003F       | ?    | 63   | QUESTION MARK          |
| U+0040       | @    | 64   | COMMERCIAL AT          |
| U+0041       | A    | 65   | LATIN CAPITAL LETTER A |
| U+0042       | B    | 66   | LATIN CAPITAL LETTER B |
| U+0043       | C    | 67   | LATIN CAPITAL LETTER C |
| U+0044       | D    | 68   | LATIN CAPITAL LETTER D |
| U+0045       | E    | 69   | LATIN CAPITAL LETTER E |
| U+0046       | F    | 70   | LATIN CAPITAL LETTER F |
| U+0047       | G    | 71   | LATIN CAPITAL LETTER G |
| U+0048       | H    | 72   | LATIN CAPITAL LETTER H |
| U+0049       | I    | 73   | LATIN CAPITAL LETTER I |
| U+004A       | J    | 74   | LATIN CAPITAL LETTER J |
| U+004B       | K    | 75   | LATIN CAPITAL LETTER K |
| U+004C       | L    | 76   | LATIN CAPITAL LETTER L |
| U+004D       | M    | 77   | LATIN CAPITAL LETTER M |
| U+004E       | N    | 78   | LATIN CAPITAL LETTER N |
| U+004F       | O    | 79   | LATIN CAPITAL LETTER O |
| U+0050       | P    | 80   | LATIN CAPITAL LETTER P |
| U+0051       | Q    | 81   | LATIN CAPITAL LETTER Q |
| U+0052       | R    | 82   | LATIN CAPITAL LETTER R |
| U+0053       | S    | 83   | LATIN CAPITAL LETTER S |
| U+0054       | T    | 84   | LATIN CAPITAL LETTER T |
| U+0055       | U    | 85   | LATIN CAPITAL LETTER U |
| U+0056       | V    | 86   | LATIN CAPITAL LETTER V |
| U+0057       | W    | 87   | LATIN CAPITAL LETTER W |
| U+0058       | X    | 88   | LATIN CAPITAL LETTER X |
| U+0059       | Y    | 89   | LATIN CAPITAL LETTER Y |
| U+005A       | Z    | 90   | LATIN CAPITAL LETTER Z |
| U+005B       | [    | 91   | LEFT SQUARE BRACKET    |
| U+005C       | \    | 92   | REVERSE SOLIDUS        |
| U+005D       | ]    | 93   | RIGHT SQUARE BRACKET   |
| U+005E       | ^    | 94   | CIRCUMFLEX ACCENT      |
| U+005F       | _    | 95   | LOW LINE               |
| U+0060       | `    | 96   | GRAVE ACCENT           |
| U+0061       | a    | 97   | LATIN SMALL LETTER A   |
| U+0062       | b    | 98   | LATIN SMALL LETTER B   |
| U+0063       | c    | 99   | LATIN SMALL LETTER C   |
| U+0064       | d    | 100  | LATIN SMALL LETTER D   |
| U+0065       | e    | 101  | LATIN SMALL LETTER E   |
| U+0066       | f    | 102  | LATIN SMALL LETTER F   |
| U+0067       | g    | 103  | LATIN SMALL LETTER G   |
| U+0068       | h    | 104  | LATIN SMALL LETTER H   |
| U+0069       | i    | 105  | LATIN SMALL LETTER I   |
| U+006A       | j    | 106  | LATIN SMALL LETTER J   |
| U+006B       | k    | 107  | LATIN SMALL LETTER K   |
| U+006C       | l    | 108  | LATIN SMALL LETTER L   |
| U+006D       | m    | 109  | LATIN SMALL LETTER M   |
| U+006E       | n    | 110  | LATIN SMALL LETTER N   |
| U+006F       | o    | 111  | LATIN SMALL LETTER O   |
| U+0070       | p    | 112  | LATIN SMALL LETTER P   |
| U+0071       | q    | 113  | LATIN SMALL LETTER Q   |
| U+0072       | r    | 114  | LATIN SMALL LETTER R   |
| U+0073       | s    | 115  | LATIN SMALL LETTER S   |
| U+0074       | t    | 116  | LATIN SMALL LETTER T   |
| U+0075       | u    | 117  | LATIN SMALL LETTER U   |
| U+0076       | v    | 118  | LATIN SMALL LETTER V   |
| U+0077       | w    | 119  | LATIN SMALL LETTER W   |
| U+0078       | x    | 120  | LATIN SMALL LETTER X   |
| U+0079       | y    | 121  | LATIN SMALL LETTER Y   |
| U+007A       | z    | 122  | LATIN SMALL LETTER Z   |
| U+007B       | {    | 123  | LEFT CURLY BRACKET     |
| U+007C       | \|   | 124  | VERTICAL LINE          |
| U+007D       | }    | 125  | RIGHT CURLY BRACKET    |
| U+007E       | ~    | 126  | TILDE                  |





字节数 : 2;编码：GB2312

  

字节数 : 2;编码：GBK  

字节数 : 2;编码：GB18030

  

字节数 : 1;编码：ISO-8859-1

  

字节数 : 3;编码：UTF-8

  

字节数 : 4;编码：UTF-16

  

字节数 : 2;编码：UTF-16BE

  

字节数 : 2;编码：UTF-16LE
