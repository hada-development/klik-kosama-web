#!/bin/sh

SSH_HOST=kosama
BASE_PATH="/home/klikkosa"
APP_DIR="dev.kosamaipku.com"
BACKUP_DIR="dev.kosamaipku.com-bak"

npm run build
ssh $SSH_HOST "rm -rf $BASE_PATH/$BACKUP_DIR"
ssh $SSH_HOST "mv $BASE_PATH/$APP_DIR $BASE_PATH/$BACKUP_DIR"
ssh $SSH_HOST "mkdir $BASE_PATH/$APP_DIR"
scp -rp ./dist/* $SSH_HOST:$BASE_PATH/$APP_DIR
scp ./dist/.htaccess-dev $SSH_HOST:$BASE_PATH/$APP_DIR/.htaccess
ssh $SSH_HOST "rm -rf $BASE_PATH/$BACKUP_DIR"

