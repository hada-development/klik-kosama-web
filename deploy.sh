#!/bin/sh

SSH_HOST=kosama
BASE_PATH="/home/klikkosa"
APP_DIR="new.kosamaip.com"
BACKUP_DIR="new.kosamaip.com-bak"

npm run build
ssh $SSH_HOST "rm -rf $BASE_PATH/$BACKUP_DIR"
ssh $SSH_HOST "mv $BASE_PATH/$APP_DIR $BASE_PATH/$BACKUP_DIR"
ssh $SSH_HOST "mkdir $BASE_PATH/$APP_DIR"
scp -rp ./dist/* ./dist/.htaccess $SSH_HOST:$BASE_PATH/$APP_DIR
ssh $SSH_HOST "rm -rf $BASE_PATH/$BACKUP_DIR"

