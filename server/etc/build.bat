@echo off

set /p version= Qual a versao?

set initpath=%CD%
set finalpath=%initpath:\server\etc=%

mkdir c:\opt\UOLI\node\logway

xcopy /s /e /i %finalpath%\* c:\opt\UOLI\node\logway
del /q c:\opt\UOLI\node\logway\log\*.*

rem -xr!log
rem "c:\Program Files\7-Zip"\7z a -ttar -xr!.git -xr!.svn C:\logway.tar C:\opt
rem "c:\Program Files\7-Zip"\7z a -tgzip C:\logway-%version%.tar.gz C:\logway.tar
rem del C:\work\logway.tar

rem "c:\Program Files\7-Zip"\7z a -tzip -xr!.git -xr!.svn C:\Work\Workspace\Git\logway\server\etc\logway-%version%.zip C:\opt
"c:\Program Files\7-Zip"\7z a -ttar -xr!.git -xr!.svn -so C:\Work\Workspace\Git\logway\server\etc\logway-%version%.zip C:\opt | "c:\Program Files\7-Zip"\7z.exe a -si C:\Work\Workspace\Git\logway\server\etc\logway-%version%.tar.gz


rmdir c:\opt /s/q
echo Arquivo gerado  C:\Work\Workspace\Git\logway\server\etc\logway-%version%.tar.gz
pause