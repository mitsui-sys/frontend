@echo off

rem ## ================================
rem ■設定情報入力 
rem ## ================================

rem バックアップディレクトリ 例) BACKUP_DIR=F:\DBbackup
set BACKUP_DIR=C:\kanko\backup

rem ====================================
rem ====================================


rem ==日付情報取得 ---------------------------------------

rem 日付取得
set datestr=%DATE:~0,4%%DATE:~5,2%%DATE:~8,2%

rem 時間取得
set tmptime1=%time: =0%
set tmptime2=%tmptime1:.=%
set nowtime=%tmptime2::=%

set NOW=%datestr%_%nowtime%
rem ==日付情報取得ここまで ------------------------------



rem タイムスタンプのあるフォルダの作成
mkdir %BACKUP_DIR%\%NOW%
echo on

rem パスワード設定
set PGPASSWORD=localhost:5432:postgres:postgres:postgres

rem バックアップ対象DB名_1 例)DB_NAME_1=postgres
set DB_NAME_0=postgres
rem DB1バックアップ実行
pg_dump -h localhost -U postgres -c %DB_NAME% > %BACKUP_DIR%\%NOW%\%DB_NAME_0%.dump

rem パスワード設定
set PGPASSWORD=localhost:5432:kc28382_bunkazai:postgres:postgres

rem バックアップ対象DB名_1 例)DB_NAME_1=postgres
set DB_NAME_1=kc28382_bunkazai
rem DB1バックアップ実行
pg_dump -h localhost -U postgres -c %DB_NAME% > %BACKUP_DIR%\%NOW%\%DB_NAME_1%.dump

rem パスワード設定
set PGPASSWORD=localhost:5432:kc28382_cityisdb:postgres:postgres

rem バックアップ対象DB名_2
set DB_NAME_2=kc28382_cityisdb
rem DB2バックアップ実行
pg_dump -h localhost -U postgres -c %DB_NAME% > %BACKUP_DIR%\%NOW%\%DB_NAME_2%.dump