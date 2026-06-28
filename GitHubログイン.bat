@echo off
chcp 65001 > nul
title GitHub ログイン
echo GitHub CLI のログインを始めます。
echo.
"%~dp0..\work\tools\bin\gh.exe" auth login --hostname github.com --git-protocol https --web
echo.
echo ログイン処理が終わりました。この画面の内容を確認してください。
pause
