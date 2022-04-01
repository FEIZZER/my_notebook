@echo off

set "$=%temp%\Spring"

>%$% Echo WScript.Echo((new Date()).getTime())

for /f %%a in ('cscript -nologo -e:jscript %$%') do set timestamp=%%a

del /f /q %$%

echo %timestamp%